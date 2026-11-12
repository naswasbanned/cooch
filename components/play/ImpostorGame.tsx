"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { GAMES } from "@/lib/games";
import { useHistory } from "@/lib/history";
import { loadSetup, useSettings } from "@/lib/settings";
import { useToast } from "@/lib/toast";
import { clearSession, loadSession, saveSession } from "@/lib/storage";
import type { ImpostorConfig } from "@/lib/types";
import { avatarTone, uid } from "@/lib/utils";
import { WORD_CATEGORIES } from "@/lib/words";
import {
  advanceDeal,
  createImpostorState,
  finishImpostorGame,
  impostorRoleLabel,
  impostorWinnerNames,
  nextClue,
  nextImpostorRound,
  openTally,
  resolveImpostorElimination,
  startClueRound,
  startVoting,
  submitImpostorGuess,
  submitImpostorVote,
  type ImpostorPlayer,
  type ImpostorState,
} from "@/lib/game/impostor";
import { Avatar, Badge, Chip, LabelTag } from "@/components/Badge";
import { Button, LinkButton } from "@/components/Button";
import { ArtImage } from "@/components/ArtImage";
import { ExitDialog, PauseDialog, RulesDialog } from "@/components/Dialogs";
import { GameBar } from "@/components/GameBar";
import { Handoff } from "@/components/Handoff";
import { Icon } from "@/components/Icon";
import { MOTION_EASE } from "@/components/motion/Reveal";
import { PickList, RankList } from "@/components/PickList";
import { ProgressDots } from "@/components/Stepper";
import { RevealCard } from "@/components/RevealCard";
import { Timer } from "@/components/Timer";
import { m } from "motion/react";

const game = GAMES.find((entry) => entry.slug === "impostor")!;

function defaultConfig(): ImpostorConfig {
  return {
    players: ["Dina", "Raka", "Sari", "Bima", "Yanti", "Eko"],
    impostors: 1,
    chameleon: false,
    categoryIds: WORD_CATEGORIES.map((category) => category.id),
    timerMinutes: 3,
    allowGuess: true,
    wordLang: "app",
  };
}

function playerOf(state: ImpostorState, id: string): ImpostorPlayer | undefined {
  return state.players.find((player) => player.id === id);
}

export function ImpostorGame() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { settings, hydrated, lang, t, pickText } = useSettings();
  const { addEntry } = useHistory();
  const { showToast } = useToast();

  const [state, setState] = useState<ImpostorState | null>(null);
  const [resumeGate, setResumeGate] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [dealStage, setDealStage] = useState<"handover" | "reveal">("handover");
  const [revealDone, setRevealDone] = useState(false);
  const [voteStage, setVoteStage] = useState<"handover" | "pick">("handover");
  const [votePick, setVotePick] = useState<string | null>(null);
  const [guess, setGuess] = useState("");
  const [survey, setSurvey] = useState<"yes" | "no" | null>(null);

  const initialized = useRef(false);
  const recorded = useRef(false);
  const hidden = useRef(false);
  const stateRef = useRef<ImpostorState | null>(null);
  const isNew = searchParams.get("new") === "1";

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const startFresh = useCallback(
    (config: ImpostorConfig) => {
      const next = createImpostorState(config, lang, settings.customCategories);
      recorded.current = false;
      setState(next);
      setResumeGate(false);
      setDealStage("handover");
      setRevealDone(false);
      setVoteStage("handover");
      setVotePick(null);
      setGuess("");
      setSurvey(null);
      saveSession({ game: "impostor", updatedAt: Date.now(), state: next });
    },
    [lang, settings.customCategories],
  );

  useEffect(() => {
    if (!hydrated || initialized.current) return;
    initialized.current = true;
    const stored = isNew ? null : loadSession();
    if (stored?.game === "impostor") {
      setState(stored.state as ImpostorState);
      setResumeGate(true);
      return;
    }
    startFresh(loadSetup<ImpostorConfig>("impostor", defaultConfig()));
  }, [hydrated, isNew, startFresh]);

  useEffect(() => {
    if (!state) return;
    if (state.phase === "result") {
      if (!recorded.current) {
        recorded.current = true;
        const endedAt = state.endedAt ?? Date.now();
        addEntry({
          id: uid("h"),
          game: "impostor",
          gameName: game.name,
          playedAt: endedAt,
          durationSec: Math.max(1, Math.round((endedAt - state.startedAt) / 1000)),
          players: state.players.map((player) => player.name),
          winner: state.winner ?? "none",
          winnerNames: impostorWinnerNames(state),
          rounds: state.round,
          detail: state.word,
        });
        clearSession();
      }
      return;
    }
    saveSession({ game: "impostor", updatedAt: Date.now(), state });
  }, [state, addEntry]);

  useEffect(() => {
    setDealStage("handover");
    setRevealDone(false);
  }, [state?.dealIndex, state?.phase]);

  useEffect(() => {
    setVoteStage("handover");
    setVotePick(null);
  }, [state?.voteIndex, state?.phase]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        hidden.current = true;
      } else if (hidden.current) {
        hidden.current = false;
        if (stateRef.current && stateRef.current.phase !== "result") setResumeGate(true);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const phaseLabel = useMemo(() => {
    if (!state) return "";
    switch (state.phase) {
      case "deal":
        return `${t("phaseDeal")} · ${Math.min(state.dealIndex + 1, state.players.length)}/${state.players.length}`;
      case "order":
        return t("phaseClues", { n: state.round });
      case "clue":
        return `${t("phaseClues", { n: state.round })} · ${state.clueIndex + 1}/${state.clueOrder.length}`;
      case "discussion":
        return t("phaseDiscussion", { n: state.round });
      case "vote":
        return t("phaseVoting", { n: state.round });
      case "votesDone":
        return t("phaseVoting", { n: state.round });
      case "tally":
        return t("phaseVoteResult", { n: state.round });
      case "elimination":
      case "noElimination":
        return t("phaseElimination", { n: state.round });
      case "guess":
      case "guessWrong":
        return t("phaseGuess", { n: state.round });
      case "result":
        return t("phaseResult");
      default:
        return "";
    }
  }, [state, t]);

  const endGame = () => {
    clearSession();
    router.push("/");
  };

  if (!state) {
    return (
      <div className="container play">
        <div className="screen__center" style={{ minHeight: "60vh" }}>
          <p className="screen__text">{t("activeSession")}…</p>
        </div>
      </div>
    );
  }

  const alive = state.players.filter((player) => player.alive);
  const currentDealPlayer = state.players[state.dealIndex];
  const currentVoter = alive[state.voteIndex];
  const top = state.tally[0];
  const topPlayer = top ? playerOf(state, top.id) : undefined;
  const eliminatedPlayer = state.eliminatedId ? playerOf(state, state.eliminatedId) : undefined;
  const durationMinutes = Math.max(
    1,
    Math.round(((state.endedAt ?? state.startedAt) - state.startedAt) / 60000),
  );

  const shell = (content: ReactNode) => (
    <div className="container play">
      <GameBar
        gameName={pickText(game.name)}
        phase={phaseLabel}
        onPause={() => setPaused(true)}
        onRules={() => setRulesOpen(true)}
      />
      <main id="main">
        <m.div
          key={`${state.phase}:${state.dealIndex}:${state.voteIndex}:${dealStage}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: MOTION_EASE }}
        >
          {content}
        </m.div>
      </main>
      <PauseDialog
        open={paused}
        onResume={() => setPaused(false)}
        onRules={() => {
          setPaused(false);
          setRulesOpen(true);
        }}
        onRestart={() => {
          setPaused(false);
          startFresh(state.config);
        }}
        onExit={() => {
          setPaused(false);
          setExitOpen(true);
        }}
      />
      <RulesDialog open={rulesOpen} onClose={() => setRulesOpen(false)} game={game} />
      <ExitDialog open={exitOpen} onCancel={() => setExitOpen(false)} onExit={endGame} />
    </div>
  );

  if (resumeGate) {
    return shell(
      <Handoff
        eyebrow={t("resumed")}
        name={t("continueAsHost")}
        hint={t("resumeSafe")}
        buttonLabel={t("imHost")}
        onContinue={() => setResumeGate(false)}
        icon="i-hand"
      />,
    );
  }

  if (state.phase === "deal" && currentDealPlayer) {
    const isImpostor = currentDealPlayer.role === "impostor";
    const isChameleon = currentDealPlayer.role === "chameleon";
    const secret = isImpostor ? t("youAreImpostor") : isChameleon ? state.chameleonWord ?? "" : state.word;
    const roleLabel = isImpostor ? t("roleYours") : t("secretWord");
    const note = isImpostor
      ? t("impostorNote")
      : t("categoryLabel", { name: pickText(state.category) });

    return shell(
      dealStage === "handover" ? (
        <Handoff
          name={currentDealPlayer.name}
          hint={t("onlyCanSee", { name: currentDealPlayer.name })}
          buttonLabel={t("imReady", { name: currentDealPlayer.name })}
          onContinue={() => setDealStage("reveal")}
        />
      ) : (
        <section className="screen">
          <ProgressDots total={state.players.length} done={state.dealIndex} />
          <RevealCard
            key={`${currentDealPlayer.id}-${paused}-${rulesOpen}`}
            playerName={currentDealPlayer.name}
            roleLabel={roleLabel}
            secret={secret}
            note={note}
            variant={isImpostor ? "impostor" : "default"}
            hint={t("holdToSee")}
            onRevealed={() => {
              setRevealDone(true);
              if (settings.vibration && "vibrate" in navigator) navigator.vibrate(30);
            }}
          />
          <div className="screen__foot">
            <Button
              size="lg"
              block
              disabled={!revealDone}
              onClick={() => {
                setState((current) => (current ? advanceDeal(current) : current));
                setRevealDone(false);
                setDealStage("handover");
              }}
            >
              {t("closeCard")}
            </Button>
          </div>
        </section>
      ),
    );
  }

  if (state.phase === "order") {
    const first = playerOf(state, state.clueOrder[0]);
    return shell(
      <section className="screen">
        <div className="screen__head">
          <LabelTag>{t("roundN", { n: state.round })}</LabelTag>
          <h2 className="screen__title">{t("clueOrder")}</h2>
          <p className="screen__text">
            {t("clueOrderText", { name: first?.name ?? "—" })}
          </p>
        </div>
        <RankList
          rows={state.clueOrder.map((id, index) => {
            const player = playerOf(state, id);
            return {
              id,
              name: player?.name ?? "—",
              position: index + 1,
            };
          })}
        />
        <div className="screen__foot">
          <Button size="lg" block onClick={() => setState((current) => (current ? startClueRound(current) : current))}>
            {t("startClueRound")}
          </Button>
        </div>
      </section>,
    );
  }

  if (state.phase === "clue") {
    const current = playerOf(state, state.clueOrder[state.clueIndex]);
    return shell(
      <section className="screen">
        <div className="screen__head">
          <LabelTag>{t("clue")}</LabelTag>
          <h2 className="screen__title screen__title--big">
            {t("turnOf", { name: current?.name ?? "—" })}
          </h2>
          <p className="screen__text">{t("clueInstruction")}</p>
        </div>
        <RankList
          rows={state.clueOrder.map((id, index) => {
            const player = playerOf(state, id);
            const done = index < state.clueIndex;
            const now = index === state.clueIndex;
            return {
              id,
              name: player?.name ?? "—",
              position: index + 1,
              me: now,
              badge: done ? t("already") : now ? t("now") : undefined,
              badgeTone: done ? ("success" as const) : now ? ("accent" as const) : undefined,
            };
          })}
        />
        <div className="screen__foot">
          <Button
            size="lg"
            block
            onClick={() => setState((currentState) => (currentState ? nextClue(currentState) : currentState))}
          >
            {t("clueDone", { name: current?.name ?? "—" })}
          </Button>
          <Button
            variant="ghost"
            block
            onClick={() =>
              setState((currentState) =>
                currentState
                  ? { ...currentState, phase: "discussion", roundStartedAt: Date.now() }
                  : currentState,
              )
            }
          >
            {t("skipToDiscussion")}
          </Button>
        </div>
      </section>,
    );
  }

  if (state.phase === "discussion") {
    return shell(
      <section className="screen">
        <div className="screen__head">
          <h2 className="screen__title">{t("discussion")}</h2>
          <p className="screen__text">{t("discussionQuestion")}</p>
        </div>
        <div className="screen__center">
          <Timer seconds={state.config.timerMinutes * 60} />
        </div>
        <div className="stat-row">
          <div className="stat">
            <span className="stat__label">{t("roundLabel")}</span>
            <span className="stat__value">{state.round}</span>
          </div>
          <div className="stat">
            <span className="stat__label">{t("alive")}</span>
            <span className="stat__value">{alive.length}</span>
          </div>
          <div className="stat">
            <span className="stat__label">{t("evilTeam")}</span>
            <span className="stat__value">?</span>
          </div>
        </div>
        <div className="screen__foot">
          <Button size="lg" block onClick={() => setState((current) => (current ? startVoting(current) : current))}>
            {t("startVoting")}
          </Button>
        </div>
      </section>,
    );
  }

  if (state.phase === "vote" && currentVoter) {
    return shell(
      voteStage === "handover" ? (
        <Handoff
          eyebrow={t("votingPass")}
          name={currentVoter.name}
          hint={t("onlyCanSeeVote", { name: currentVoter.name })}
          buttonLabel={t("imReady", { name: currentVoter.name })}
          onContinue={() => setVoteStage("pick")}
        />
      ) : (
        <section className="screen">
          <div className="screen__head">
            <h2 className="screen__title">{t("voteQuestion", { name: currentVoter.name })}</h2>
            <p className="screen__text">{t("votePrivate")}</p>
          </div>
          <PickList
            name={`vote-${state.round}-${state.voteIndex}`}
            legend={t("chooseSuspect")}
            players={alive.map((player) => ({ id: player.id, name: player.name }))}
            selectedId={votePick}
            onSelect={setVotePick}
            disabledIds={[currentVoter.id]}
            noteFor={(player) => (player.id === currentVoter.id ? t("you") : undefined)}
          />
          <div className="screen__foot">
            <Button
              size="lg"
              block
              disabled={!votePick}
              onClick={() => {
                if (!votePick) return;
                setState((current) =>
                  current ? submitImpostorVote(current, currentVoter.id, votePick) : current,
                );
                setVotePick(null);
              }}
            >
              {votePick
                ? t("chooseName", { name: playerOf(state, votePick)?.name ?? "—" })
                : t("choosePlayer")}
            </Button>
          </div>
        </section>
      ),
    );
  }

  if (state.phase === "votesDone") {
    return shell(
      <section className="screen">
        <div className="screen__head">
          <LabelTag>{`${alive.length}/${alive.length}`}</LabelTag>
          <h2 className="screen__title">{t("allVoted")}</h2>
          <p className="screen__text">{t("allVotedText")}</p>
        </div>
        <div className="screen__foot">
          <Button size="lg" block onClick={() => setState((current) => (current ? openTally(current) : current))}>
            {t("openVotes")}
          </Button>
        </div>
      </section>,
    );
  }

  if (state.phase === "tally") {
    return shell(
      <section className="screen">
        <div className="screen__head">
          <h2 className="screen__title">{t("voteResults")}</h2>
        </div>
        <RankList
          rows={state.tally.map((row, index) => {
            const player = playerOf(state, row.id);
            return {
              id: row.id,
              name: player?.name ?? "—",
              position: index + 1,
              me: index === 0,
              badge: t("votesCount", { n: row.votes }),
              badgeTone: "accent" as const,
            };
          })}
        />
        <div className="screen__foot">
          <Button
            size="lg"
            block
            disabled={!topPlayer}
            onClick={() =>
              setState((current) => (current ? resolveImpostorElimination(current) : current))
            }
          >
            {topPlayer
              ? t("revealRoleOf", { name: topPlayer.name })
              : t("noElimination")}
          </Button>
        </div>
      </section>,
    );
  }

  if (state.phase === "elimination" && eliminatedPlayer) {
    const canGuess = eliminatedPlayer.role === "impostor" && state.config.allowGuess;
    return shell(
      <section className="screen">
        <div className="verdict">
          <span className="verdict__icon">
            <Icon name={eliminatedPlayer.role === "impostor" ? "i-mask" : "i-eye"} />
          </span>
          <LabelTag>{t("eliminated")}</LabelTag>
          <h2 className="screen__title">
            {t("isRole", {
              name: eliminatedPlayer.name,
              role: impostorRoleLabel(eliminatedPlayer.role, lang),
            })}
          </h2>
          <p className="verdict__text">
            {canGuess ? t("guessHint") : t("gameContinuesText")}
          </p>
        </div>
        <div className="screen__foot">
          <Button
            size="lg"
            block
            onClick={() =>
              setState((current) =>
                current
                  ? canGuess
                    ? { ...current, phase: "guess" }
                    : nextImpostorRound(current)
                  : current,
              )
            }
          >
            {canGuess ? t("guessPrompt", { name: eliminatedPlayer.name }) : t("startRoundN", { n: state.round + 1 })}
          </Button>
        </div>
      </section>,
    );
  }

  if (state.phase === "noElimination") {
    return shell(
      <section className="screen">
        <div className="verdict">
          <span className="verdict__icon">
            <Icon name="i-info" />
          </span>
          <LabelTag>{t("noElimination")}</LabelTag>
          <h2 className="screen__title">{t("noElimination")}</h2>
          <p className="verdict__text">{t("noEliminationText")}</p>
        </div>
        <div className="screen__foot">
          <Button
            size="lg"
            block
            onClick={() => setState((current) => (current ? nextImpostorRound(current) : current))}
          >
            {t("startRoundN", { n: state.round + 1 })}
          </Button>
        </div>
      </section>,
    );
  }

  if (state.phase === "guess" && eliminatedPlayer) {
    return shell(
      <section className="screen">
        <div className="screen__head">
          <h2 className="screen__title">{t("guessPrompt", { name: eliminatedPlayer.name })}</h2>
          <p className="screen__text">{t("guessHint")}</p>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="guess-word">
            {t("yourGuess", { name: eliminatedPlayer.name })}
          </label>
          <input
            className="input input--xl"
            id="guess-word"
            type="text"
            maxLength={24}
            autoComplete="off"
            placeholder={t("guessPlaceholder")}
            value={guess}
            onChange={(event) => setGuess(event.target.value)}
          />
        </div>
        <div className="screen__foot">
          <Button
            size="lg"
            block
            disabled={!guess.trim()}
            onClick={() => setState((current) => (current ? submitImpostorGuess(current, guess) : current))}
          >
            {t("lockGuess")}
          </Button>
        </div>
      </section>,
    );
  }

  if (state.phase === "guessWrong") {
    return shell(
      <section className="screen">
        <div className="verdict">
          <span className="verdict__icon">
            <Icon name="i-x-circle" />
          </span>
          <LabelTag>{t("guessWrong")}</LabelTag>
          <h2 className="screen__title">{t("gameContinues")}</h2>
          <p className="verdict__text">{t("gameContinuesText")}</p>
        </div>
        <div className="screen__foot">
          <Button
            size="lg"
            block
            onClick={() => setState((current) => (current ? nextImpostorRound(current) : current))}
          >
            {t("startRoundN", { n: state.round + 1 })}
          </Button>
        </div>
      </section>,
    );
  }

  if (state.phase === "result") {
    const citizens = state.winner === "citizens";
    const resultText = [
      t("resultWord", { word: state.word }),
      state.chameleonWord ? t("resultChameleonWord", { word: state.chameleonWord }) : "",
      state.guessCorrect
        ? t("resultGuess", { name: eliminatedPlayer?.name ?? "", word: state.word })
        : "",
    ]
      .filter(Boolean)
      .join(" ");
    return shell(
      <section className="screen">
        <div className={citizens ? "verdict" : "verdict verdict--grape"}>
          <m.div
            className="verdict__confetti"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.55, scale: 1 }}
            transition={{ duration: 0.9, ease: MOTION_EASE }}
          >
            <ArtImage src="/art/confetti.svg" alt="" aria-hidden="true" />
          </m.div>
          <m.span
            className="verdict__icon"
            initial={{ scale: 0.4, rotate: -14, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 17, delay: 0.08 }}
          >
            <Icon name={citizens ? "i-trophy" : "i-mask"} />
          </m.span>
          <LabelTag>{t("resultRounds", { n: state.round, minutes: durationMinutes })}</LabelTag>
          <h2 className="screen__title">{citizens ? t("citizensWin") : t("evilWin")}</h2>
          <p className="verdict__text">{resultText}</p>
        </div>
        <section className="panel" aria-labelledby="all-roles-title">
          <h3 className="panel__title" id="all-roles-title">
            {t("allRoles")}
          </h3>
          <ol className="rank-list">
            {state.players.map((player) => (
              <li key={player.id} className={player.alive ? "rank-row" : "rank-row rank-row--out"}>
                <span className="rank-row__pos" />
                <Avatar name={player.name} tone={avatarTone(player.name)} />
                <span className="rank-row__name">{player.name}</span>
                <Badge tone={player.role === "citizen" ? "info" : player.role === "impostor" ? "error" : "accent"}>
                  {impostorRoleLabel(player.role, lang)}
                </Badge>
              </li>
            ))}
          </ol>
        </section>
        <section className="panel" aria-labelledby="survey-title">
          <h3 className="panel__title" id="survey-title">
            {t("survey")}
          </h3>
          <div className="cluster" role="group" aria-labelledby="survey-title">
            <Chip
              pressed={survey === "yes"}
              icon="i-thumb-up"
              onClick={() => {
                setSurvey("yes");
                showToast(t("surveyYes"), "success");
              }}
            >
              {t("surveyYes")}
            </Chip>
            <Chip
              pressed={survey === "no"}
              icon="i-thumb-down"
              onClick={() => {
                setSurvey("no");
                showToast(t("surveyNo"));
              }}
            >
              {t("surveyNo")}
            </Chip>
          </div>
          <p className="field__hint">{t("surveyHint")}</p>
        </section>
        <div className="cluster screen__links">
          <LinkButton href="/play/impostor/setup" variant="ghost">
            {t("changeSetup")}
          </LinkButton>
          <LinkButton href="/" variant="ghost">
            {t("goHome")}
          </LinkButton>
        </div>
        <div className="screen__foot">
          <Button size="lg" block icon="i-play" onClick={() => startFresh(state.config)}>
            {t("playAgain")}
          </Button>
        </div>
      </section>,
    );
  }

  return shell(
    <section className="screen">
      <div className="screen__center">
        <Button onClick={() => setState((current) => (current ? finishImpostorGame(current) : current))}>
          {t("phaseResult")}
        </Button>
      </div>
    </section>,
  );
}

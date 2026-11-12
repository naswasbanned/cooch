"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { GAMES } from "@/lib/games";
import { useHistory } from "@/lib/history";
import { loadSetup, useSettings } from "@/lib/settings";
import { useToast } from "@/lib/toast";
import { clearSession, loadSession, saveSession } from "@/lib/storage";
import type { Lang, WerewolfConfig, WerewolfRole } from "@/lib/types";
import { avatarTone, formatClock, uid } from "@/lib/utils";
import {
  advanceWerewolfReveal,
  aliveWerewolfPlayers,
  chooseWolfVictim,
  createWerewolfState,
  doctorProtect,
  finishHunterResult,
  finishWerewolfExecution,
  finishWerewolfMorning,
  hunterShoot,
  openWerewolfTally,
  resolveWerewolfNight,
  resolveWerewolfVote,
  rolePlayer,
  seerCheckPlayer,
  startWerewolfNight,
  startWerewolfVote,
  submitHandCounts,
  submitWerewolfVote,
  werewolfRoleLabel,
  werewolfWinnerNames,
  wolfAlive,
  type WerewolfPlayer,
  type WerewolfState,
} from "@/lib/game/werewolf";
import { Avatar, Badge, Chip, LabelTag } from "@/components/Badge";
import { Button, LinkButton } from "@/components/Button";
import { ArtImage } from "@/components/ArtImage";
import { ExitDialog, HostRolesDialog, PauseDialog, RulesDialog } from "@/components/Dialogs";
import { GameBar } from "@/components/GameBar";
import { Handoff } from "@/components/Handoff";
import { Icon } from "@/components/Icon";
import { Modal } from "@/components/Modal";
import { MOTION_EASE } from "@/components/motion/Reveal";
import { PickList, RankList } from "@/components/PickList";
import { ProgressDots } from "@/components/Stepper";
import { RevealCard } from "@/components/RevealCard";
import { Timer } from "@/components/Timer";
import { m } from "motion/react";

const game = GAMES.find((entry) => entry.slug === "werewolf")!;

type T = ReturnType<typeof useSettings>["t"];

const DEFAULT_CONFIG: WerewolfConfig = {
  players: ["Bima", "Rani", "Dimas", "Mira", "Andi", "Eko", "Susi", "Yanti"],
  wolves: 2,
  seer: 1,
  doctor: 1,
  hunter: false,
  dayMinutes: 4,
  voteMode: "secret",
  openRolesOnDeath: true,
  tieRule: "none",
  doctorSelfProtect: true,
  moderatorMode: false,
};

function playerOf(state: WerewolfState, id: string | null | undefined) {
  if (!id) return undefined;
  return state.players.find((player) => player.id === id);
}

function roleNote(state: WerewolfState, player: WerewolfPlayer, t: T): string {
  switch (player.role) {
    case "wolf": {
      const pack = state.players
        .filter((mate) => mate.role === "wolf" && mate.id !== player.id)
        .map((mate) => mate.name);
      return pack.length ? t("roleWolfNote", { names: pack.join(", ") }) : t("roleWolfAlone");
    }
    case "seer":
      return t("roleSeerNote");
    case "doctor":
      return t("roleDoctorNote");
    case "hunter":
      return t("roleHunterNote");
    default:
      return t("roleVillagerNote");
  }
}

function WaitScreen({
  role,
  t,
  onDone,
}: {
  role: string;
  t: T;
  onDone: () => void;
}) {
  const [total] = useState(() => 3 + Math.floor(Math.random() * 6));
  const [left, setLeft] = useState(total);

  useEffect(() => {
    if (left <= 0) return;
    const id = window.setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [left]);

  return (
    <section className="screen">
      <div className="screen__head">
        <LabelTag tone="grape">{role}</LabelTag>
        <h2 className="screen__title">{t("waitRole")}</h2>
        <p className="screen__text">{t("waitRoleText", { seconds: total })}</p>
      </div>
      <div className="screen__center">
        <div className="timer" role="status" aria-live="polite">
          <span className="timer__label">{t("timeLeft")}</span>
          <span className="timer__value">{formatClock(left)}</span>
        </div>
      </div>
      <div className="screen__foot">
        <Button size="lg" block disabled={left > 0} onClick={onDone}>
          {t("waitContinue")}
        </Button>
      </div>
    </section>
  );
}

function AliveDialog({
  open,
  onClose,
  players,
  t,
}: {
  open: boolean;
  onClose: () => void;
  players: WerewolfPlayer[];
  t: T;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("aliveTitle")}
      labelledBy="alive-modal-title"
      actions={<Button onClick={onClose}>{t("close")}</Button>}
    >
      <p className="field__hint">{t("aliveHint")}</p>
      <RankList
        rows={players.map((player) => ({
          id: player.id,
          name: player.name,
          badge: player.alive ? t("aliveStatus") : t("deadStatus"),
          badgeTone: player.alive ? ("success" as const) : ("error" as const),
          out: !player.alive,
        }))}
      />
    </Modal>
  );
}

function PeekDialog({
  open,
  onClose,
  state,
  t,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  state: WerewolfState;
  t: T;
  lang: Lang;
}) {
  const [pick, setPick] = useState<string | null>(null);
  const [stage, setStage] = useState<"pick" | "reveal">("pick");

  useEffect(() => {
    if (!open) return;
    setPick(null);
    setStage("pick");
  }, [open]);

  const selected = playerOf(state, pick);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("peekRole")}
      labelledBy="peek-modal-title"
      actions={
        stage === "reveal" ? (
          <Button onClick={onClose}>{t("close")}</Button>
        ) : (
          <Button disabled={!selected} onClick={() => setStage("reveal")}>
            {selected ? t("peekConfirm", { name: selected.name }) : t("peekChoose")}
          </Button>
        )
      }
    >
      {stage === "reveal" && selected ? (
        <RevealCard
          playerName={selected.name}
          roleLabel={t("roleYours")}
          secret={werewolfRoleLabel(selected.role, lang)}
          note={roleNote(state, selected, t)}
          variant={selected.role === "wolf" ? "impostor" : "default"}
          hint={t("holdToSee")}
        />
      ) : (
        <>
          <p className="field__hint">{t("peekHint")}</p>
          <PickList
            name="peek-role"
            legend={t("peekChoose")}
            players={state.players.map((player) => ({ id: player.id, name: player.name }))}
            selectedId={pick}
            onSelect={setPick}
            disabledIds={state.players.filter((player) => !player.alive).map((player) => player.id)}
            noteFor={(player) =>
              state.players.find((entry) => entry.id === player.id)?.alive ? undefined : t("dead")
            }
          />
        </>
      )}
    </Modal>
  );
}

export function WerewolfGame() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { settings, hydrated, lang, t, pickText, setNightOverride } = useSettings();
  const { addEntry } = useHistory();
  const { showToast } = useToast();

  const [state, setState] = useState<WerewolfState | null>(null);
  const [resumeGate, setResumeGate] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [aliveOpen, setAliveOpen] = useState(false);
  const [peekOpen, setPeekOpen] = useState(false);
  const [hostRolesOpen, setHostRolesOpen] = useState(false);

  const [dealStage, setDealStage] = useState<"handover" | "reveal">("handover");
  const [revealDone, setRevealDone] = useState(false);
  const [allRead, setAllRead] = useState(false);

  const [wolfStage, setWolfStage] = useState<"handover" | "pick">("handover");
  const [victimPick, setVictimPick] = useState<string | null>(null);

  const [doctorStage, setDoctorStage] = useState<"handover" | "pick" | "wait">("handover");
  const [protectPick, setProtectPick] = useState<string | null>(null);

  const [seerStage, setSeerStage] = useState<"handover" | "pick" | "wait" | "result">("handover");
  const [checkPick, setCheckPick] = useState<string | null>(null);
  const [seerRevealed, setSeerRevealed] = useState(false);

  const [shootPick, setShootPick] = useState<string | null>(null);

  const [voteStage, setVoteStage] = useState<"handover" | "pick">("handover");
  const [votePick, setVotePick] = useState<string | null>(null);
  const [handCounts, setHandCounts] = useState<Record<string, number>>({});

  const [survey, setSurvey] = useState<"yes" | "no" | null>(null);

  const initialized = useRef(false);
  const recorded = useRef(false);
  const hidden = useRef(false);
  const stateRef = useRef<WerewolfState | null>(null);
  const isNew = searchParams.get("new") === "1";

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const resetFlow = useCallback(() => {
    setDealStage("handover");
    setRevealDone(false);
    setAllRead(false);
    setWolfStage("handover");
    setVictimPick(null);
    setDoctorStage("handover");
    setProtectPick(null);
    setSeerStage("handover");
    setCheckPick(null);
    setSeerRevealed(false);
    setShootPick(null);
    setVoteStage("handover");
    setVotePick(null);
    setHandCounts({});
    setSurvey(null);
  }, []);

  const startFresh = useCallback(
    (config: WerewolfConfig) => {
      const next = createWerewolfState(config, lang);
      recorded.current = false;
      setState(next);
      setResumeGate(false);
      resetFlow();
      saveSession({ game: "werewolf", updatedAt: Date.now(), state: next });
    },
    [lang, resetFlow],
  );

  useEffect(() => {
    if (!hydrated || initialized.current) return;
    initialized.current = true;
    const stored = isNew ? null : loadSession();
    if (stored?.game === "werewolf") {
      setState(stored.state as WerewolfState);
      setResumeGate(true);
      return;
    }
    startFresh(loadSetup<WerewolfConfig>("werewolf", DEFAULT_CONFIG));
  }, [hydrated, isNew, startFresh]);

  useEffect(() => {
    if (!state) return;
    if (state.phase === "result") {
      if (!recorded.current) {
        recorded.current = true;
        const endedAt = state.endedAt ?? Date.now();
        addEntry({
          id: uid("h"),
          game: "werewolf",
          gameName: game.name,
          playedAt: endedAt,
          durationSec: Math.max(1, Math.round((endedAt - state.startedAt) / 1000)),
          players: state.players.map((player) => player.name),
          winner: state.winner ?? "none",
          winnerNames: werewolfWinnerNames(state),
          rounds: state.day,
          detail: `${state.night} / ${state.day}`,
        });
        clearSession();
      }
      return;
    }
    saveSession({ game: "werewolf", updatedAt: Date.now(), state });
  }, [state, addEntry]);

  useEffect(() => {
    setDealStage("handover");
    setRevealDone(false);
  }, [state?.phase, state?.dealIndex]);

  useEffect(() => {
    setAllRead(false);
  }, [state?.phase]);

  useEffect(() => {
    setWolfStage("handover");
    setVictimPick(null);
  }, [state?.phase, state?.night]);

  useEffect(() => {
    setDoctorStage("handover");
    setProtectPick(null);
  }, [state?.phase, state?.night]);

  useEffect(() => {
    setSeerStage("handover");
    setCheckPick(null);
    setSeerRevealed(false);
  }, [state?.phase, state?.night]);

  useEffect(() => {
    setShootPick(null);
  }, [state?.phase, state?.day]);

  useEffect(() => {
    setVoteStage("handover");
    setVotePick(null);
  }, [state?.phase, state?.voteIndex, state?.revoted, state?.day]);

  useEffect(() => {
    setHandCounts({});
  }, [state?.phase, state?.day, state?.revoted]);

  const nightPhase = Boolean(
    state && ["night", "wolf", "doctor", "seer"].includes(state.phase),
  );

  useEffect(() => {
    setNightOverride(nightPhase);
  }, [nightPhase, setNightOverride]);

  useEffect(() => {
    return () => setNightOverride(false);
  }, [setNightOverride]);

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
      case "reveal":
        return `${t("phaseDeal")} · ${Math.min(state.dealIndex + 1, state.players.length)}/${state.players.length}`;
      case "night":
        return t("nightN", { n: state.night });
      case "wolf":
        return `${t("nightN", { n: state.night })} · ${t("werewolfRole")}`;
      case "doctor":
        return `${t("nightN", { n: state.night })} · ${t("doctorRole")}`;
      case "seer":
        return `${t("nightN", { n: state.night })} · ${t("seerRole")}`;
      case "morning":
        return t("morningN", { n: state.day });
      case "hunter":
      case "hunterResult":
        return t("hunter");
      case "day":
        return t("dayN", { n: state.day });
      case "vote":
      case "votesDone":
      case "tally":
        return t("votingDay", { n: state.day });
      case "execution":
        return `${t("execution")} · ${t("dayN", { n: state.day })}`;
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

  const continueFromResume = () => {
    setResumeGate(false);
    resetFlow();
  };

  if (!state) {
    return (
      <div className="container play">
        <div className="screen__center" style={{ minHeight: "60vh" }}>
          <p className="screen__text">{t("loading")}…</p>
        </div>
      </div>
    );
  }

  const alive = aliveWerewolfPlayers(state);
  const currentDealPlayer = state.players[state.dealIndex];
  const currentVoter = alive[state.voteIndex];
  const doctor = rolePlayer(state, "doctor");
  const seer = rolePlayer(state, "seer");
  const hunter = playerOf(state, state.pendingHunterId);
  const victim = playerOf(state, state.nightRecord.victimId);
  const executed = playerOf(state, state.executedId);
  const hunterTarget = playerOf(state, state.hunterTargetId);
  const top = state.tally[0];
  const topPlayer = top ? playerOf(state, top.id) : undefined;
  const tiedTop = top ? state.tally.filter((row) => row.votes === top.votes) : [];
  const isTie = !top || tiedTop.length > 1;
  const durationMinutes = Math.max(
    1,
    Math.round(((state.endedAt ?? state.startedAt) - state.startedAt) / 60000),
  );
  const hasDeadDoctor = state.players.some((player) => player.role === "doctor");
  const hasDeadSeer = state.players.some((player) => player.role === "seer");

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
        onAlive={() => {
          setPaused(false);
          setAliveOpen(true);
        }}
        onPeek={() => {
          setPaused(false);
          setPeekOpen(true);
        }}
        onRoles={
          state.config.moderatorMode
            ? () => {
                setPaused(false);
                setHostRolesOpen(true);
              }
            : undefined
        }
      />
      <RulesDialog open={rulesOpen} onClose={() => setRulesOpen(false)} game={game} />
      <ExitDialog open={exitOpen} onCancel={() => setExitOpen(false)} onExit={endGame} />
      <AliveDialog
        open={aliveOpen}
        onClose={() => setAliveOpen(false)}
        players={state.players}
        t={t}
      />
      <PeekDialog
        open={peekOpen}
        onClose={() => setPeekOpen(false)}
        state={state}
        t={t}
        lang={lang}
      />
      <HostRolesDialog
        open={hostRolesOpen}
        onClose={() => setHostRolesOpen(false)}
        players={state.players}
        roleLabel={(role) => werewolfRoleLabel(role as WerewolfRole, lang)}
      />
    </div>
  );

  if (resumeGate) {
    return shell(
      <Handoff
        eyebrow={t("resumed")}
        name={t("continueAsHost")}
        hint={t("resumeSafe")}
        buttonLabel={t("imHost")}
        onContinue={continueFromResume}
        icon="i-hand"
      />,
    );
  }

  if (state.phase === "reveal" && currentDealPlayer) {
    if (allRead) {
      return shell(
        <section className="screen">
          <ProgressDots total={state.players.length} done={state.players.length} />
          <div className="screen__head">
            <LabelTag>
              {state.players.length} / {state.players.length}
            </LabelTag>
            <h2 className="screen__title">{t("allSeen")}</h2>
            <p className="screen__text">{t("allSeenWerewolf")}</p>
          </div>
          <div className="screen__foot">
            <Button
              size="lg"
              block
              onClick={() =>
                setState((current) => (current ? advanceWerewolfReveal(current) : current))
              }
            >
              {t("startGame")}
            </Button>
          </div>
        </section>,
      );
    }

    return shell(
      dealStage === "handover" ? (
        <Handoff
          eyebrow={`${t("phaseDeal")} · ${state.dealIndex + 1}/${state.players.length}`}
          name={currentDealPlayer.name}
          hint={t("tableDealHint", { name: currentDealPlayer.name })}
          buttonLabel={t("imReady", { name: currentDealPlayer.name })}
          onContinue={() => setDealStage("reveal")}
        />
      ) : (
        <section className="screen">
          <ProgressDots total={state.players.length} done={state.dealIndex} />
          <RevealCard
            key={`${currentDealPlayer.id}-${paused}-${rulesOpen}`}
            playerName={currentDealPlayer.name}
            roleLabel={t("roleYours")}
            secret={werewolfRoleLabel(currentDealPlayer.role, lang)}
            note={roleNote(state, currentDealPlayer, t)}
            variant={currentDealPlayer.role === "wolf" ? "impostor" : "default"}
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
                if (state.dealIndex + 1 >= state.players.length) {
                  setAllRead(true);
                  setRevealDone(false);
                  return;
                }
                setState((current) => (current ? advanceWerewolfReveal(current) : current));
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

  if (state.phase === "night") {
    return shell(
      <section className="screen">
        <div className="handover">
          <span className="handover__icon">
            <Icon name="i-moon" />
          </span>
          <span className="handover__eyebrow">{t("nightN", { n: state.night })}</span>
          <h2 className="handover__name">{t("nightFalls")}</h2>
          <p>{t("nightText")}</p>
        </div>
        <div className="screen__foot">
          <Button
            size="lg"
            block
            onClick={() => setState((current) => (current ? startWerewolfNight(current) : current))}
          >
            {t("startNight")}
          </Button>
        </div>
      </section>,
    );
  }

  if (state.phase === "wolf") {
    if (wolfStage === "handover") {
      return shell(
        <Handoff
          eyebrow={t("wolfOpenEyes")}
          name={t("passToWolf")}
          hint={state.night === 1 ? t("wolfTogether") : t("wolfTakePhone")}
          buttonLabel={t("weAreWolves")}
          onContinue={() => setWolfStage("pick")}
        />,
      );
    }

    const selected = playerOf(state, victimPick);
    const nonWolvesAlive = alive.filter((player) => player.role !== "wolf");

    return shell(
      <section className="screen">
        <div className="screen__head">
          <LabelTag tone="grape">{t("werewolfRole")}</LabelTag>
          <h2 className="screen__title">{t("chooseVictim")}</h2>
          <p className="screen__text">{t("agreeFirst", { n: wolfAlive(state) })}</p>
        </div>
        <PickList
          name={`victim-${state.night}`}
          legend={t("chooseVictim")}
          players={alive.map((player) => ({ id: player.id, name: player.name }))}
          selectedId={victimPick}
          onSelect={setVictimPick}
          disabledIds={state.players
            .filter((player) => player.role === "wolf")
            .map((player) => player.id)}
          noteFor={(player) =>
            playerOf(state, player.id)?.role === "wolf" ? t("packMate") : undefined
          }
        />
        <div className="screen__foot">
          <Button
            size="lg"
            block
            disabled={!victimPick}
            onClick={() => {
              if (!victimPick) return;
              setState((current) =>
                current ? chooseWolfVictim(current, victimPick) : current,
              );
              setVictimPick(null);
            }}
          >
            {selected ? t("attackName", { name: selected.name }) : t("chooseVictimBtn")}
          </Button>
          {nonWolvesAlive.length === 0 ? (
            <Button
              variant="ghost"
              block
              onClick={() =>
                setState((current) => (current ? chooseWolfVictim(current, "") : current))
              }
            >
              {t("skipAction")}
            </Button>
          ) : null}
        </div>
      </section>,
    );
  }

  if (state.phase === "doctor") {
    if (!doctor) {
      if (doctorStage === "handover") {
        return shell(
          <Handoff
            eyebrow={t("doctorOpenEyes")}
            name={t("doctorRole")}
            hint={hasDeadDoctor ? t("waitDeadRole") : t("waitRole")}
            buttonLabel={t("waitContinue")}
            onContinue={() => setDoctorStage("wait")}
          />,
        );
      }
      return shell(
        <WaitScreen
          role={t("doctorRole")}
          t={t}
          onDone={() => setState((current) => (current ? doctorProtect(current, null) : current))}
        />,
      );
    }

    if (doctorStage === "handover") {
      return shell(
        <Handoff
          eyebrow={t("doctorOpenEyes")}
          name={t("passToDoctor")}
          hint={t("doctorTakePhone")}
          buttonLabel={t("iAmDoctor")}
          onContinue={() => setDoctorStage("pick")}
        />,
      );
    }

    const disabled = [
      ...(state.lastProtectedId ? [state.lastProtectedId] : []),
      ...(!state.config.doctorSelfProtect ? [doctor.id] : []),
    ];
    const selectable = alive.filter((player) => !disabled.includes(player.id));
    const selected = playerOf(state, protectPick);

    return shell(
      <section className="screen">
        <div className="screen__head">
          <LabelTag tone="grape">{t("doctorRole")}</LabelTag>
          <h2 className="screen__title">{t("protectWho")}</h2>
          <p className="screen__text">{t("protectRule")}</p>
        </div>
        <PickList
          name={`protect-${state.night}`}
          legend={t("protectWho")}
          players={alive.map((player) => ({ id: player.id, name: player.name }))}
          selectedId={protectPick}
          onSelect={setProtectPick}
          disabledIds={disabled}
          noteFor={(player) => {
            if (!state.config.doctorSelfProtect && player.id === doctor.id) return t("you");
            if (player.id === state.lastProtectedId) return t("protectedLastNight");
            return undefined;
          }}
        />
        <div className="screen__foot">
          <Button
            size="lg"
            block
            disabled={!protectPick}
            onClick={() => {
              if (!protectPick) return;
              setState((current) =>
                current ? doctorProtect(current, protectPick) : current,
              );
              setProtectPick(null);
            }}
          >
            {selected ? t("protectName", { name: selected.name }) : t("choosePlayerBtn")}
          </Button>
          {selectable.length === 0 ? (
            <Button
              variant="ghost"
              block
              onClick={() =>
                setState((current) => (current ? doctorProtect(current, null) : current))
              }
            >
              {t("skipProtection")}
            </Button>
          ) : null}
        </div>
      </section>,
    );
  }

  if (state.phase === "seer") {
    if (!seer) {
      if (seerStage === "handover") {
        return shell(
          <Handoff
            eyebrow={t("seerOpenEyes")}
            name={t("passToSeer")}
            hint={hasDeadSeer ? t("waitDeadRole") : t("waitRole")}
            buttonLabel={t("waitContinue")}
            onContinue={() => setSeerStage("wait")}
          />,
        );
      }
      return shell(
        <WaitScreen
          role={t("seerRole")}
          t={t}
          onDone={() => setState((current) => (current ? resolveWerewolfNight(current) : current))}
        />,
      );
    }

    if (seerStage === "handover") {
      return shell(
        <Handoff
          eyebrow={t("seerOpenEyes")}
          name={t("passToSeer")}
          hint={t("seerTakePhone")}
          buttonLabel={t("iAmSeer")}
          onContinue={() => setSeerStage(state.seerCheck ? "result" : "pick")}
        />,
      );
    }

    if (seerStage === "result" && state.seerCheck) {
      const target = playerOf(state, state.seerCheck.targetId);
      return shell(
        <section className="screen">
          <RevealCard
            key={`seer-${state.night}-${paused}-${rulesOpen}`}
            playerName={seer.name}
            roleLabel={t("seerResult")}
            secret={state.seerCheck.isWolf ? t("isWerewolf") : t("notWerewolf")}
            note={
              state.seerCheck.isWolf
                ? t("isWerewolfNote", { name: target?.name ?? "—" })
                : t("notWerewolfNote", { name: target?.name ?? "—" })
            }
            variant={state.seerCheck.isWolf ? "impostor" : "default"}
            hint={t("holdToSee")}
            onRevealed={() => {
              setSeerRevealed(true);
              if (settings.vibration && "vibrate" in navigator) navigator.vibrate(30);
            }}
          />
          <div className="screen__foot">
            <Button
              size="lg"
              block
              disabled={!seerRevealed}
              onClick={() =>
                setState((current) => (current ? resolveWerewolfNight(current) : current))
              }
            >
              {t("closeCard")}
            </Button>
          </div>
        </section>,
      );
    }

    const selected = playerOf(state, checkPick);
    return shell(
      <section className="screen">
        <div className="screen__head">
          <LabelTag tone="grape">{t("seerRole")}</LabelTag>
          <h2 className="screen__title">{t("checkWho")}</h2>
          <p className="screen__text">{t("checkHint")}</p>
        </div>
        <PickList
          name={`check-${state.night}`}
          legend={t("checkWho")}
          players={alive.map((player) => ({ id: player.id, name: player.name }))}
          selectedId={checkPick}
          onSelect={setCheckPick}
          disabledIds={[seer.id]}
          noteFor={(player) => (player.id === seer.id ? t("you") : undefined)}
        />
        <div className="screen__foot">
          <Button
            size="lg"
            block
            disabled={!checkPick}
            onClick={() => {
              if (!checkPick) return;
              setState((current) =>
                current ? seerCheckPlayer(current, checkPick) : current,
              );
              setCheckPick(null);
              setSeerStage("result");
            }}
          >
            {selected ? t("checkName", { name: selected.name }) : t("choosePlayerBtn")}
          </Button>
        </div>
      </section>,
    );
  }

  if (state.phase === "morning") {
    let text = victim ? t("diedText", { name: victim.name }) : t("noDeathText");
    if (victim) {
      if (state.pendingHunterId) {
        text = `${text} ${t("hunterTriggered", { name: victim.name })}`;
      } else if (state.config.openRolesOnDeath) {
        text = `${text} ${t("victimRole", {
          name: victim.name,
          role: werewolfRoleLabel(victim.role, lang),
        })}`;
      } else {
        text = `${text} ${t("victimRoleHidden", { name: victim.name })}`;
      }
    }

    const nextLabel = state.pendingHunterId
      ? t("continueHunter")
      : state.winner
        ? t("seeResult")
        : t("startDiscussion");

    return shell(
      <section className="screen">
        <div className="verdict">
          <span className="verdict__icon">
            <Icon name="i-sun" />
          </span>
          <LabelTag>{t("morningN", { n: state.day })}</LabelTag>
          <h2 className="screen__title">
            {victim ? t("died", { name: victim.name }) : t("noDeath")}
          </h2>
          <p className="verdict__text">{text}</p>
        </div>
        <div className="screen__foot">
          <Button
            size="lg"
            block
            onClick={() =>
              setState((current) => (current ? finishWerewolfMorning(current) : current))
            }
          >
            {nextLabel}
          </Button>
        </div>
      </section>,
    );
  }

  if (state.phase === "hunter") {
    if (!hunter) {
      return shell(
        <section className="screen">
          <div className="screen__center">
            <Button
              onClick={() =>
                setState((current) => (current ? finishHunterResult(current) : current))
              }
            >
              {t("waitContinue")}
            </Button>
          </div>
        </section>,
      );
    }

    return shell(
      <section className="screen">
        <div className="screen__head">
          <LabelTag tone="grape">{t("hunter")}</LabelTag>
          <h2 className="screen__title">{t("hunterChoose", { name: hunter.name })}</h2>
          <p className="screen__text">{t("hunterChooseHint")}</p>
        </div>
        <PickList
          name={`shoot-${state.day}`}
          legend={t("hunterChoose", { name: hunter.name })}
          players={alive.map((player) => ({ id: player.id, name: player.name }))}
          selectedId={shootPick}
          onSelect={setShootPick}
        />
        <div className="screen__foot">
          <Button
            size="lg"
            block
            disabled={!shootPick}
            onClick={() => {
              if (!shootPick) return;
              setState((current) => (current ? hunterShoot(current, shootPick) : current));
              setShootPick(null);
            }}
          >
            {shootPick
              ? t("shootName", { name: playerOf(state, shootPick)?.name ?? "—" })
              : t("choosePlayerBtn")}
          </Button>
        </div>
      </section>,
    );
  }

  if (state.phase === "hunterResult") {
    return shell(
      <section className="screen">
        <div className="verdict">
          <span className="verdict__icon">
            <Icon name="i-bolt" />
          </span>
          <LabelTag>{t("shot")}</LabelTag>
          <h2 className="screen__title">
            {hunterTarget ? t("shotTitle", { name: hunterTarget.name }) : t("shot")}
          </h2>
          <p className="verdict__text">
            {hunterTarget
              ? t("shotWasRole", {
                  name: hunterTarget.name,
                  role: werewolfRoleLabel(hunterTarget.role, lang),
                })
              : ""}
          </p>
        </div>
        <div className="screen__foot">
          <Button
            size="lg"
            block
            onClick={() =>
              setState((current) => (current ? finishHunterResult(current) : current))
            }
          >
            {state.winner
              ? t("seeResult")
              : state.hunterCause === "execution"
                ? t("startNightN", { n: state.night + 1 })
                : t("startDiscussion")}
          </Button>
        </div>
      </section>,
    );
  }

  if (state.phase === "day") {
    return shell(
      <section className="screen">
        <div className="screen__head">
          <LabelTag>{t("dayN", { n: state.day })}</LabelTag>
          <h2 className="screen__title">{t("dayDiscussion")}</h2>
          <p className="screen__text">{t("dayQuestion")}</p>
        </div>
        <div className="screen__center">
          <Timer
            seconds={state.config.dayMinutes * 60}
            allowAdjust
            onAdjust={(delta) =>
              showToast(delta < 0 ? t("timerMinusToast") : t("timerPlusToast"), "info")
            }
          />
        </div>
        <section className="panel" aria-labelledby="alive-day">
          <h3 className="panel__title" id="alive-day">
            {t("aliveDead", {
              alive: alive.length,
              dead: state.players.length - alive.length,
            })}
          </h3>
          <RankList
            rows={state.players.map((player) => ({
              id: player.id,
              name: player.name,
              badge: player.alive ? t("aliveStatus") : t("deadStatus"),
              badgeTone: player.alive ? ("success" as const) : ("error" as const),
              out: !player.alive,
            }))}
          />
        </section>
        <div className="screen__foot">
          <Button
            size="lg"
            block
            onClick={() =>
              setState((current) => (current ? startWerewolfVote(current) : current))
            }
          >
            {t("startVoting")}
          </Button>
        </div>
      </section>,
    );
  }

  if (state.phase === "vote") {
    if (state.config.voteMode === "hand") {
      const total = alive.reduce((sum, player) => sum + (handCounts[player.id] ?? 0), 0);
      return shell(
        <section className="screen">
          <div className="screen__head">
            <LabelTag>{t("votingDay", { n: state.day })}</LabelTag>
            <h2 className="screen__title">{t("handCountTitle")}</h2>
            <p className="screen__text">{t("handCountText")}</p>
          </div>
          <ul className="rank-list">
            {alive.map((player) => {
              const count = handCounts[player.id] ?? 0;
              return (
                <li className="rank-row" key={player.id}>
                  <Avatar name={player.name} tone={avatarTone(player.name)} />
                  <span className="rank-row__name">{player.name}</span>
                  <div className="stepper">
                    <Button
                      size="sm"
                      variant="ghost"
                      iconOnly
                      round
                      aria-label={`${player.name} −1`}
                      disabled={count <= 0}
                      onClick={() =>
                        setHandCounts((current) => ({
                          ...current,
                          [player.id]: Math.max(0, (current[player.id] ?? 0) - 1),
                        }))
                      }
                    >
                      <Icon name="i-minus" />
                    </Button>
                    <span className="stepper__value">{count}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      iconOnly
                      round
                      aria-label={`${player.name} +1`}
                      disabled={total >= alive.length}
                      onClick={() =>
                        setHandCounts((current) => ({
                          ...current,
                          [player.id]: Math.min(
                            alive.length,
                            (current[player.id] ?? 0) + 1,
                          ),
                        }))
                      }
                    >
                      <Icon name="i-plus" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="field__hint">
            {t("totalVotes", { n: total, max: alive.length })}
          </p>
          <div className="screen__foot">
            <Button
              size="lg"
              block
              disabled={total !== alive.length}
              onClick={() => {
                const counts: Record<string, number> = {};
                alive.forEach((player) => {
                  counts[player.id] = handCounts[player.id] ?? 0;
                });
                setState((current) =>
                  current ? submitHandCounts(current, counts) : current,
                );
              }}
            >
              {t("countVotes")}
            </Button>
          </div>
        </section>,
      );
    }

    if (!currentVoter) {
      return shell(
        <section className="screen">
          <div className="screen__center">
            <Button
              onClick={() =>
                setState((current) => (current ? openWerewolfTally(current) : current))
              }
            >
              {t("openVotes")}
            </Button>
          </div>
        </section>,
      );
    }

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
            name={`vote-${state.day}-${state.voteIndex}`}
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
                  current
                    ? submitWerewolfVote(current, currentVoter.id, votePick)
                    : current,
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
          <LabelTag>
            {alive.length} / {alive.length}
          </LabelTag>
          <h2 className="screen__title">{t("allVoted")}</h2>
          <p className="screen__text">{t("allVotedText")}</p>
        </div>
        <div className="screen__foot">
          <Button
            size="lg"
            block
            onClick={() =>
              setState((current) => (current ? openWerewolfTally(current) : current))
            }
          >
            {t("openVotes")}
          </Button>
        </div>
      </section>,
    );
  }

  if (state.phase === "tally") {
    const revoteAvailable =
      isTie && state.config.tieRule === "revote" && !state.revoted;
    const label = revoteAvailable
      ? t("revoteBtn")
      : isTie
        ? t("noExecutionBtn")
        : t("executeName", { name: topPlayer?.name ?? "—" });

    return shell(
      <section className="screen">
        <div className="screen__head">
          <LabelTag>{t("votingDay", { n: state.day })}</LabelTag>
          <h2 className="screen__title">{t("voteResults")}</h2>
          {isTie ? (
            <p className="screen__text">
              {revoteAvailable ? t("revoteText") : t("tieText")}
            </p>
          ) : null}
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
            onClick={() =>
              setState((current) => (current ? resolveWerewolfVote(current) : current))
            }
          >
            {label}
          </Button>
        </div>
      </section>,
    );
  }

  if (state.phase === "execution") {
    if (!executed) {
      return shell(
        <section className="screen">
          <div className="verdict">
            <span className="verdict__icon">
              <Icon name="i-info" />
            </span>
            <LabelTag>{t("noExecutionTitle")}</LabelTag>
            <h2 className="screen__title">{t("noExecutionTitle")}</h2>
            <p className="verdict__text">{t("tieText")}</p>
          </div>
          <div className="screen__foot">
            <Button
              size="lg"
              block
              onClick={() =>
                setState((current) =>
                  current ? finishWerewolfExecution(current) : current,
                )
              }
            >
              {t("startNightN", { n: state.night + 1 })}
            </Button>
          </div>
        </section>,
      );
    }

    const text = state.pendingHunterId
      ? t("hunterTriggered", { name: executed.name })
      : state.winner === "village"
        ? t("allWolvesOut")
        : state.winner === "wolves"
          ? t("wolvesWinText")
          : t("stillWolves");

    return shell(
      <section className="screen">
        <div className="verdict">
          <span className="verdict__icon">
            <Icon name="i-paw" />
          </span>
          <LabelTag>{t("executed")}</LabelTag>
          <h2 className="screen__title">
            {t("executedRole", {
              name: executed.name,
              role: werewolfRoleLabel(executed.role, lang),
            })}
          </h2>
          <p className="verdict__text">{text}</p>
        </div>
        <div className="screen__foot">
          <Button
            size="lg"
            block
            onClick={() =>
              setState((current) =>
                current ? finishWerewolfExecution(current) : current,
              )
            }
          >
            {state.pendingHunterId
              ? t("continueHunter")
              : state.winner
                ? t("seeResult")
                : t("startNightN", { n: state.night + 1 })}
          </Button>
        </div>
      </section>,
    );
  }

  if (state.phase === "result") {
    const winner = state.winner;
    const heading =
      winner === "village"
        ? t("villageWin")
        : winner === "wolves"
          ? t("wolvesWin")
          : t("noWinner");
    const text =
      winner === "village"
        ? t("allWolvesOut")
        : winner === "wolves"
          ? t("wolvesWinText")
          : t("noWinnerText");

    return shell(
      <section className="screen">
        <div className={winner === "wolves" ? "verdict verdict--grape" : "verdict"}>
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
            <Icon
              name={winner === "village" ? "i-trophy" : winner === "wolves" ? "i-paw" : "i-info"}
            />
          </m.span>
          <LabelTag>
            {t("resultDays", { n: state.day, minutes: durationMinutes })}
          </LabelTag>
          <h2 className="screen__title">{heading}</h2>
          <p className="verdict__text">{text}</p>
        </div>

        <section className="panel" aria-labelledby="all-roles-title">
          <h3 className="panel__title" id="all-roles-title">
            {t("allRoles")}
          </h3>
          <RankList
            rows={state.players.map((player) => ({
              id: player.id,
              name: player.name,
              badge: werewolfRoleLabel(player.role, lang),
              badgeTone:
                player.role === "wolf"
                  ? ("error" as const)
                  : player.role === "villager"
                    ? undefined
                    : ("info" as const),
              out: !player.alive,
            }))}
          />
        </section>

        <section className="panel" aria-labelledby="timeline-title">
          <h3 className="panel__title" id="timeline-title">
            {t("timeline")}
          </h3>
          <ol className="role-list">
            {state.log.map((entry, index) => {
              const player = playerOf(state, entry.playerId);
              const badge =
                entry.kind === "night"
                  ? t("nightN", { n: entry.day })
                  : entry.kind === "shot"
                    ? t("morningN", { n: entry.day })
                    : t("dayShort", { n: entry.day });
              const body =
                entry.kind === "night"
                  ? entry.noDeath
                    ? t("timelineNoDeathBody")
                    : t("timelineNightBody", { name: player?.name ?? "—" })
                  : entry.kind === "shot"
                    ? t("timelineShotBody", { name: player?.name ?? "—" })
                    : entry.noExecution
                      ? t("timelineNoVoteBody")
                      : t("timelineVoteBody", { name: player?.name ?? "—" });
              return (
                <li className="role" key={`${entry.kind}-${entry.day}-${index}`}>
                  <Badge>{badge}</Badge>
                  <span className="role__body">{body}</span>
                </li>
              );
            })}
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
          <LinkButton href="/play/werewolf/setup" variant="ghost">
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
        <p className="screen__text">{t("loading")}…</p>
      </div>
    </section>,
  );
}

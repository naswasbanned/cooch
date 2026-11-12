"use client";

import Link from "next/link";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { GameCard } from "@/components/GameCard";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/Section";
import { SiteShell } from "@/components/SiteShell";
import { getGame, LIVE_GAMES } from "@/lib/games";
import { useHistory } from "@/lib/history";
import { useActiveSession } from "@/lib/session";
import { useSettings } from "@/lib/settings";
import type { ImpostorState } from "@/lib/game/impostor";
import type { WerewolfState } from "@/lib/game/werewolf";

function sessionPhaseLabel(
  session: NonNullable<ReturnType<typeof useActiveSession>["session"]>,
  t: ReturnType<typeof useSettings>["t"],
) {
  if (session.game === "impostor") {
    const state = session.state as ImpostorState;
    switch (state.phase) {
      case "deal":
        return t("phaseDeal");
      case "order":
      case "clue":
        return t("phaseClues", { n: state.round });
      case "discussion":
        return t("phaseDiscussion", { n: state.round });
      case "vote":
      case "votesDone":
      case "tally":
        return t("phaseVoting", { n: state.round });
      case "elimination":
      case "noElimination":
        return t("phaseElimination", { n: state.round });
      case "guess":
      case "guessWrong":
        return t("phaseGuess", { n: state.round });
      default:
        return t("activeSession");
    }
  }
  const state = session.state as WerewolfState;
  switch (state.phase) {
    case "reveal":
      return t("phaseDeal");
    case "night":
    case "wolf":
    case "doctor":
    case "seer":
      return t("nightN", { n: state.night });
    case "morning":
    case "hunter":
    case "hunterResult":
      return t("morningN", { n: state.day });
    case "day":
      return t("dayN", { n: state.day });
    case "vote":
    case "votesDone":
    case "tally":
    case "execution":
      return t("phaseVoting", { n: state.day });
    default:
      return t("activeSession");
  }
}

export default function HomePage() {
  const { t, pickText } = useSettings();
  const { history, hydrated: historyReady } = useHistory();
  const { session } = useActiveSession();

  const recentSlugs = Array.from(new Set(history.map((entry) => entry.game))).slice(0, 4);
  const recentGames = recentSlugs.map((slug) => getGame(slug)).filter(Boolean);
  const featured = LIVE_GAMES.find((game) => game.featured) ?? LIVE_GAMES[0];

  return (
    <SiteShell>
      <main className="container page" id="main">
        {session ? (
          <Reveal>
            <div className="alert resume" role="status">
              <Icon name="i-clock" />
              <div className="alert__body">
                <span className="alert__title">{t("resumeTitle")}</span>
                <span>
                  {t("resumeMeta", {
                    game: session.game === "impostor" ? "Guess the Impostor" : "Werewolf",
                    phase: sessionPhaseLabel(session, t),
                    players: Array.isArray(
                      (session.state as { players?: unknown[] }).players,
                    )
                      ? (session.state as { players: unknown[] }).players.length
                      : 0,
                  })}
                </span>
              </div>
              <Link className="btn btn--secondary" href={`/play/${session.game}`}>
                {t("resumeCta")}
              </Link>
            </div>
          </Reveal>
        ) : null}

        <Reveal className="page-header">
          <h1 className="page-header__title">{t("homeTitle")}</h1>
          <p className="page-header__text">{t("homeSubtitle")}</p>
        </Reveal>

        {featured ? (
          <section className="page-section--tight" aria-labelledby="featured-title">
            <h2 className="sr-only" id="featured-title">
              {t("featuredGames")}
            </h2>
            <GameCard game={featured} large featured favorite />
          </section>
        ) : null}

        {historyReady && recentGames.length ? (
          <section className="page-section" aria-labelledby="recent-title">
            <SectionHeading
              title={t("recentlyPlayed")}
              action={{ label: t("navHistory"), href: "/history" }}
              id="recent-title"
            />
            <div className="card-row">
              {recentGames.map((game, index) => (
                <GameCard key={game!.slug} game={game!} index={index} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="page-section" aria-labelledby="all-title">
          <SectionHeading
            title={t("allGames")}
            subtitle={t("gameCount", { n: 12 })}
            id="all-title"
          />
          <Reveal>
            <CatalogBrowser variant="home" />
          </Reveal>
        </section>

        <Reveal
          as="section"
          className="page-section panel"
          labelledBy="home-how-title"
        >
          <h2 className="panel__title" id="home-how-title">
            {t("howToTitle")}
          </h2>
          <p className="panel__text">{t("howToSubtitle")}</p>
          <div className="cluster">
            <Link className="btn btn--ghost" href="/how-to">
              {t("howToShort")}
            </Link>
            <Link className="link" href="/word-bank">
              {t("wordBank")}
            </Link>
            <Link className="link" href="/privacy">
              {pickText({ id: "Privasi", en: "Privacy" })}
            </Link>
          </div>
        </Reveal>
      </main>
    </SiteShell>
  );
}

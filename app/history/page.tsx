"use client";

import Link from "next/link";
import { m } from "motion/react";
import { Avatar } from "@/components/Badge";
import { EmptyState, SectionHeading } from "@/components/Section";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";
import { MOTION_EASE, Reveal, itemDelay } from "@/components/motion/Reveal";
import { computeStats, useHistory } from "@/lib/history";
import { getGame } from "@/lib/games";
import { useSettings } from "@/lib/settings";
import { avatarTone, formatDuration, formatRelativeDate } from "@/lib/utils";
import type { HistoryEntry } from "@/lib/types";

function resultLabel(entry: HistoryEntry, t: ReturnType<typeof useSettings>["t"]) {
  switch (entry.winner) {
    case "citizens":
      return t("historyWinCitizens");
    case "evil":
      return t("historyWinEvil");
    case "village":
      return t("historyWinVillage");
    case "wolves":
      return t("historyWinWolves");
    default:
      return t("historyWinNone");
  }
}

export default function HistoryPage() {
  const { t, lang, pickText } = useSettings();
  const { history, hydrated } = useHistory();
  const stats = computeStats(history);

  const today = new Date();
  const days = stats.weekDays.map((done, index) => {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return {
      done,
      label: date.toLocaleDateString(lang === "id" ? "id-ID" : "en-GB", { weekday: "short" }),
    };
  });
  const weekCount = days.filter((day) => day.done).length;

  const podium = stats.champions.slice(0, 3);
  const rest = stats.champions.slice(3);
  const podiumOrder =
    podium.length === 3
      ? [podium[1], podium[0], podium[2]]
      : podium.length === 2
        ? [podium[1], podium[0]]
        : podium;

  return (
    <SiteShell tabbar={false}>
      <main className="container page" id="main">
        <Reveal className="page-header">
          <h1 className="page-header__title">{t("historyTitle")}</h1>
          <p className="page-header__text">{t("historySubtitle")}</p>
        </Reveal>

        {hydrated ? (
          <>
            <section className="page-section--tight" aria-label={t("historyTitle")}>
              <div className="stat-grid">
                <m.div
                  className="stat-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 0.45, delay: itemDelay(0), ease: MOTION_EASE }}
                >
                  <div className="stat-card__banner">
                    <span>{t("gamesPlayed")}</span>
                    <Icon name="i-trophy" />
                  </div>
                  <span className="stat-card__value">{stats.played}</span>
                </m.div>
                <m.div
                  className="stat-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 0.45, delay: itemDelay(1), ease: MOTION_EASE }}
                >
                  <div className="stat-card__banner stat-card__banner--grape">
                    <span>{t("longestGame")}</span>
                    <Icon name="i-clock" />
                  </div>
                  <span className="stat-card__value">
                    {stats.longestSeconds ? formatDuration(stats.longestSeconds, lang) : "—"}
                  </span>
                </m.div>
                <m.div
                  className="stat-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 0.45, delay: itemDelay(2), ease: MOTION_EASE }}
                >
                  <div className="stat-card__banner stat-card__banner--sun">
                    <span>{t("winRate")}</span>
                    <Icon name="i-users" />
                  </div>
                  <span className="stat-card__value">
                    {stats.citizenWinRate === null ? "—" : `${stats.citizenWinRate}%`}
                  </span>
                </m.div>
                <m.div
                  className="stat-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 0.45, delay: itemDelay(3), ease: MOTION_EASE }}
                >
                  <div className="stat-card__banner stat-card__banner--leaf">
                    <span>{t("streakTitle")}</span>
                    <Icon name="i-flame" />
                  </div>
                  <span className="stat-card__value">{stats.streakDays}</span>
                </m.div>
              </div>
            </section>

            <Reveal as="section" className="page-section panel" labelledBy="streak-title">
              <div className="section-heading">
                <div className="section-heading__text">
                  <span className="label-tag">{t("streakTitle")}</span>
                  <h2 className="panel__title" id="streak-title">
                    {t("daysThisWeek", { n: weekCount })}
                  </h2>
                </div>
              </div>
              <div className="streak" aria-label={t("playedDaysAria", { n: weekCount })}>
                {days.map((day, index) => (
                  <m.div
                    className={day.done ? "streak__day streak__day--done" : "streak__day"}
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 340,
                      damping: 22,
                      delay: itemDelay(index, 0.04, 0.28),
                    }}
                  >
                    {day.label}
                    <span className="streak__mark">
                      {day.done ? <Icon name="i-check" size="sm" /> : null}
                    </span>
                  </m.div>
                ))}
              </div>
            </Reveal>

            <div className="history-grid">
              <section className="page-section" aria-labelledby="recent-title">
                <SectionHeading title={t("recentGames")} id="recent-title" />
                {history.length ? (
                  <div className="sheet">
                    <ul className="menu-list meta-list">
                      {history.slice(0, 20).map((entry, index) => {
                        const game = getGame(entry.game);
                        return (
                          <m.li
                            className="menu-list__item"
                            key={entry.id}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.35,
                              delay: itemDelay(index, 0.03, 0.24),
                              ease: MOTION_EASE,
                            }}
                          >
                            <Link
                              className="menu-list__link"
                              href={`/games/${entry.game}`}
                            >
                              <span className="menu-list__icon">
                                <Icon name={game?.icon ?? "i-dice"} />
                              </span>
                              <span className="menu-list__text">
                                {pickText(entry.gameName)}
                                <small>
                                  {t("historyMeta", {
                                    when: formatRelativeDate(entry.playedAt, lang),
                                    players: entry.players.length,
                                    result: resultLabel(entry, t),
                                  })}
                                  {" · "}
                                  {t("historyDuration", {
                                    minutes: Math.max(1, Math.round(entry.durationSec / 60)),
                                  })}
                                </small>
                              </span>
                              <Icon name="i-chevron-right" />
                            </Link>
                          </m.li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <EmptyState
                    icon="i-trophy"
                    art="/art/empty-cards.svg"
                    title={t("noHistoryTitle")}
                    text={t("noHistoryText")}
                    action={
                      <Link className="btn" href="/games">
                        {t("pickGame")}
                      </Link>
                    }
                  />
                )}
              </section>

              <section className="page-section" aria-labelledby="board-title">
                <SectionHeading
                  title={t("champions")}
                  subtitle={t("championsSub")}
                  id="board-title"
                />
                {podium.length ? (
                  <div className="board">
                    <div className="podium">
                      {podiumOrder.map((champion) => {
                        const place = stats.champions.indexOf(champion) + 1;
                        return (
                          <m.div
                            className={`podium__place podium__place--${place}`}
                            key={champion.name}
                            initial={{ opacity: 0, y: 18, scale: 0.94 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 22,
                              delay: itemDelay(3 - place, 0.06, 0.18),
                            }}
                          >
                            <Avatar
                              name={champion.name}
                              tone={avatarTone(champion.name)}
                              size={place === 1 ? "lg" : "sm"}
                              ring={place === 1}
                            />
                            <span className="podium__name">{champion.name}</span>
                            <span className="points">
                              <Icon name="i-coin" className="icon--fill" size="sm" />
                              {champion.points}
                            </span>
                            <span className="podium__block">{place}</span>
                          </m.div>
                        );
                      })}
                    </div>
                    {rest.length ? (
                      <ol className="rank-list" start={4}>
                        {rest.map((champion, index) => (
                          <li className="rank-row" key={champion.name}>
                            <span className="rank-row__pos">{index + 4}</span>
                            <Avatar
                              name={champion.name}
                              tone={avatarTone(champion.name)}
                              size="sm"
                            />
                            <span className="rank-row__name">{champion.name}</span>
                            <span className="points">
                              <Icon name="i-coin" className="icon--fill" size="sm" />
                              {champion.points}
                            </span>
                          </li>
                        ))}
                      </ol>
                    ) : null}
                  </div>
                ) : (
                  <EmptyState
                    icon="i-trophy"
                    art="/art/empty-cards.svg"
                    title={t("noChampionsTitle")}
                    text={t("noChampionsText")}
                  />
                )}
              </section>
            </div>
          </>
        ) : (
          <p className="text-muted">{t("activeSession")}…</p>
        )}
      </main>
    </SiteShell>
  );
}

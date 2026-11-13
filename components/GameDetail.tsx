"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, LabelTag } from "@/components/Badge";
import { Button, LinkButton } from "@/components/Button";
import { ArtImage } from "@/components/ArtImage";
import { RulesDialog } from "@/components/Dialogs";
import { GameCard } from "@/components/GameCard";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/Section";
import { SideScroll } from "@/components/SideScroll";
import { SiteShell } from "@/components/SiteShell";
import { getGame, similarGames } from "@/lib/games";
import { useSettings } from "@/lib/settings";
import { useToast } from "@/lib/toast";

const SHOTS: Record<string, Array<{ icon: string; label: "screenHandoff" | "screenSecret" | "screenVoting" | "screenResult" | "nightShot" | "wolfShot" | "morningShot"; caption: "screenHandoff" | "screenSecret" | "screenVoting" | "screenResult" }>> = {
  impostor: [
    { icon: "i-hand", label: "screenHandoff", caption: "screenHandoff" },
    { icon: "i-eye", label: "screenSecret", caption: "screenSecret" },
    { icon: "i-users", label: "screenVoting", caption: "screenVoting" },
    { icon: "i-trophy", label: "screenResult", caption: "screenResult" },
  ],
  werewolf: [
    { icon: "i-moon", label: "nightShot", caption: "screenSecret" },
    { icon: "i-paw", label: "wolfShot", caption: "screenHandoff" },
    { icon: "i-users", label: "morningShot", caption: "screenVoting" },
    { icon: "i-trophy", label: "screenResult", caption: "screenResult" },
  ],
};

export function GameDetail({ slug }: { slug: string }) {
  const { t, pickText } = useSettings();
  const { showToast } = useToast();
  const [rulesOpen, setRulesOpen] = useState(false);
  const game = getGame(slug);

  if (!game) {
    return (
      <SiteShell tabbar={false}>
        <main className="container page notfound-wrap" id="main">
          <div className="notfound">
            <p className="notfound__code">404</p>
            <h1 className="page-header__title">{t("notFoundTitle")}</h1>
            <p className="page-header__text">{t("notFoundText")}</p>
            <LinkButton href="/games" size="lg" icon="i-arrow-left">
              {t("allGames")}
            </LinkButton>
          </div>
        </main>
      </SiteShell>
    );
  }

  const live = game.status === "live";
  const level =
    game.level === "easy" ? t("levelEasy") : game.level === "medium" ? t("levelMedium") : t("levelHard");
  const shots = SHOTS[game.slug] ?? [];
  const similar = similarGames(game.slug, 4);
  const startHref = `/play/${game.slug}/setup`;

  const startAction = live ? (
    <LinkButton href={startHref} size="lg" icon="i-play">
      {t("start")}
    </LinkButton>
  ) : (
    <Button
      size="lg"
      icon="i-clock"
      onClick={() => showToast(t("comingSoonText"), "info")}
    >
      {t("soonBadge")}
    </Button>
  );

  return (
    <SiteShell tabbar={false}>
      <main className="container page" id="main">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <ol className="breadcrumb__list">
            <li className="breadcrumb__item">
              <Link className="breadcrumb__link" href="/">
                {t("home")}
              </Link>
            </li>
            <li className="breadcrumb__item">
              <Link className="breadcrumb__link" href="/games">
                {t("browse")}
              </Link>
            </li>
            <li className="breadcrumb__item">
              <span aria-current="page">{pickText(game.name)}</span>
            </li>
          </ol>
        </nav>

        <Reveal as="section" className="detail" labelledBy="game-title" y={12}>
          <div className="detail__media">
            <div className={`card__media${game.media !== "default" ? ` card__media--${game.media}` : ""}`}>
              {game.isNew ? (
                <span className="card__corner badge badge--new">{t("newBadge")}</span>
              ) : !live ? (
                <span className="card__corner badge">{t("soonBadge")}</span>
              ) : null}
              {game.art ? (
                <ArtImage
                  className="card__art"
                  src={game.art}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <Icon name={game.icon} className="card__glyph" />
              )}
            </div>
          </div>
          <div className="detail__info">
            <LabelTag>{t("partySocial")}</LabelTag>
            <h1 className="detail__title" id="game-title">
              {pickText(game.name)}
            </h1>
            <p className="detail__text">{pickText(game.description)}</p>
            <div className="stat-row">
              <div className="stat">
                <span className="stat__label">{t("players")}</span>
                <span className="stat__value">
                  {game.minPlayers === game.maxPlayers
                    ? game.minPlayers
                    : `${game.minPlayers}-${game.maxPlayers}`}
                </span>
              </div>
              <div className="stat">
                <span className="stat__label">{t("duration")}</span>
                <span className="stat__value">
                  {game.minutes} {t("minutesShort")}
                </span>
              </div>
              <div className="stat">
                <span className="stat__label">{t("level")}</span>
                <span className="stat__value">{level}</span>
              </div>
            </div>
            <div className="detail__actions">
              {startAction}
              <Button variant="ghost" size="lg" icon="i-help" onClick={() => setRulesOpen(true)}>
                {t("howToPlay")}
              </Button>
            </div>
          </div>
        </Reveal>

        {game.steps.length ? (
          <Reveal as="section" className="page-section" labelledBy="steps-title">
            <SectionHeading
              title={t("howToPlay")}
              subtitle={t("howToSub")}
              id="steps-title"
            />
            <ol className="role-list">
              {game.steps.map((step, index) => (
                <li className="role" key={index}>
                  <Badge>{index + 1}</Badge>
                  <div className="role__body">
                    <span className="role__name">{pickText(step.title)}</span>
                    <span className="text-muted">{pickText(step.text)}</span>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        ) : (
          <Reveal as="section" className="page-section panel" labelledBy="soon-title">
            <h2 className="panel__title" id="soon-title">
              {t("comingSoonTitle")}
            </h2>
            <p className="panel__text">{t("comingSoonText")}</p>
            <div className="cluster">
              <LinkButton href="/games/impostor" icon="i-mask">
                {pickText({ id: "Guess the Impostor", en: "Guess the Impostor" })}
              </LinkButton>
              <LinkButton href="/games/werewolf" variant="secondary" icon="i-moon">
                Werewolf
              </LinkButton>
            </div>
          </Reveal>
        )}

        {game.roles.length ? (
          <Reveal as="section" className="page-section panel" labelledBy="roles-title">
            <h2 className="panel__title" id="roles-title">
              {t("roles")}
            </h2>
            <div className="role-list">
              {game.roles.map((role) => (
                <div className="role" key={role.name.id}>
                  <span className="menu-list__icon">
                    <Icon name={role.icon} />
                  </span>
                  <div className="role__body">
                    <span className="role__name">{pickText(role.name)}</span>
                    <span className="cluster">
                      <Badge
                        tone={
                          role.team === "citizen" || role.team === "village" ? "info" : "error"
                        }
                      >
                        {role.team === "citizen"
                          ? t("teamCitizen")
                          : role.team === "village"
                            ? t("teamVillage")
                            : role.team === "wolf"
                              ? t("teamWolf")
                              : t("teamEvil")}
                      </Badge>
                      {role.optional ? <Badge>{t("optional")}</Badge> : null}
                    </span>
                    <span className="text-muted">{pickText(role.text)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        ) : null}

        {shots.length ? (
          <Reveal as="section" className="page-section" labelledBy="shots-title">
            <SectionHeading title={t("gameScreens")} id="shots-title" />
            <SideScroll className="shots">
              {shots.map((shot, index) => (
                <figure className="shot" key={index}>
                  <div
                    className={`shot__frame${index === 1 ? " shot__frame--grape" : index === 2 ? " shot__frame--sky" : ""}`}
                    aria-hidden="true"
                  >
                    <Icon name={shot.icon} />
                    <span>{t(shot.label)}</span>
                  </div>
                  <figcaption>{t(shot.caption)}</figcaption>
                </figure>
              ))}
            </SideScroll>
          </Reveal>
        ) : null}

        <Reveal as="section" className="page-section" labelledBy="similar-title">
          <SectionHeading
            title={t("similarGames")}
            action={{ label: t("viewAll"), href: "/games" }}
            id="similar-title"
          />
          <div className="card-grid">
            {similar.map((other, index) => (
              <GameCard key={other.slug} game={other} favorite index={index} />
            ))}
          </div>
        </Reveal>

        <div className="sticky-cta sticky-cta--mobile">
          <div className="sticky-cta__inner">
            <Button variant="ghost" size="lg" icon="i-help" onClick={() => setRulesOpen(true)}>
              {t("howToPlay")}
            </Button>
            {live ? (
              <LinkButton href={startHref} size="lg" icon="i-play">
                {t("start")}
              </LinkButton>
            ) : (
              <Button
                size="lg"
                icon="i-clock"
                onClick={() => showToast(t("comingSoonText"), "info")}
              >
                {t("soonBadge")}
              </Button>
            )}
          </div>
        </div>
      </main>

      <RulesDialog open={rulesOpen} onClose={() => setRulesOpen(false)} game={game} />
    </SiteShell>
  );
}

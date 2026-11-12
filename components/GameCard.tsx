"use client";

import Link from "next/link";
import { m } from "motion/react";
import { useFavorites } from "@/lib/favorites";
import { useSettings } from "@/lib/settings";
import type { GameMeta } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";
import { Icon } from "./Icon";
import { ArtImage } from "./ArtImage";
import { MOTION_EASE, itemDelay, useMotionReduced } from "./motion/Reveal";

const MEDIA_CLASS: Record<GameMeta["media"], string> = {
  default: "",
  night: "card__media--night",
  grape: "card__media--grape",
  sun: "card__media--sun",
  leaf: "card__media--leaf",
};

export function gameLevelTone(level: GameMeta["level"]) {
  return level === "easy" ? "success" : level === "medium" ? "warning" : "error";
}

export function GameCard({
  game,
  horizontal,
  large,
  featured,
  favorite = true,
  index = 0,
}: {
  game: GameMeta;
  horizontal?: boolean;
  large?: boolean;
  featured?: boolean;
  favorite?: boolean;
  index?: number;
}) {
  const { t, pickText } = useSettings();
  const { isFavorite, toggleFavorite } = useFavorites();
  const reduceMotion = useMotionReduced();
  const live = game.status === "live";
  const fav = isFavorite(game.slug);
  const level =
    game.level === "easy" ? t("levelEasy") : game.level === "medium" ? t("levelMedium") : t("levelHard");
  const players =
    game.minPlayers === game.maxPlayers
      ? t("playerCount", { n: game.minPlayers })
      : `${game.minPlayers}-${game.maxPlayers}`;

  const media = (
    <div className={cn("card__media", MEDIA_CLASS[game.media])}>
      {!horizontal && game.isNew ? (
        <span className="card__corner badge badge--new">{t("newBadge")}</span>
      ) : !horizontal && !live ? (
        <span className="card__corner badge">{t("soonBadge")}</span>
      ) : null}
      {game.art ? (
        <ArtImage
          className="card__art"
          src={game.art}
          alt=""
          aria-hidden="true"
          draggable={false}
          loading={large || featured ? "eager" : "lazy"}
          decoding="async"
        />
      ) : (
        <Icon name={game.icon} className="card__glyph" />
      )}
      {favorite && live ? (
        <button
          className="card__fav"
          type="button"
          aria-pressed={fav}
          aria-label={fav ? t("removeFavorite") : t("addFavorite")}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleFavorite(game.slug);
          }}
        >
          <Icon name="i-star" className="icon--fill" />
        </button>
      ) : null}
    </div>
  );

  const body = (
    <div className="card__body">
      <h3 className="card__title">
        {live ? <Link href={`/games/${game.slug}`}>{pickText(game.name)}</Link> : pickText(game.name)}
      </h3>
      <p className="card__text">{pickText(game.short)}</p>
    </div>
  );

  const meta = (
    <div className="card__meta">
      {horizontal && game.isNew ? <Badge tone="new">{t("newBadge")}</Badge> : null}
      {horizontal && !live ? <Badge>{t("soonBadge")}</Badge> : null}
      <Badge icon="i-users">{players}</Badge>
      <Badge icon="i-clock">{game.minutes} {t("minutesShort")}</Badge>
      {live ? <Badge tone={gameLevelTone(game.level)}>{level}</Badge> : null}
    </div>
  );

  return (
    <m.article
      className={cn(
        "card",
        horizontal && "card--horizontal",
        large && "card--large",
        featured && "card--featured",
        live ? "card--interactive" : "card--soon",
      )}
      aria-disabled={!live || undefined}
      data-name={pickText(game.name)}
      data-tags={game.tags.join(" ")}
      data-min={game.minPlayers}
      data-max={game.maxPlayers}
      data-minutes={game.minutes}
      data-level={game.level}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.45, delay: itemDelay(index), ease: MOTION_EASE }}
      whileHover={
        live && !reduceMotion
          ? { y: -4, transition: { type: "spring", stiffness: 420, damping: 28 } }
          : undefined
      }
      whileTap={
        live && !reduceMotion
          ? { y: 0, scale: 0.992, transition: { duration: 0.12 } }
          : undefined
      }
    >
      {media}
      {horizontal ? (
        <div className="card__main">
          {body}
          {meta}
        </div>
      ) : (
        <>
          {body}
          {meta}
        </>
      )}
    </m.article>
  );
}

"use client";

import { useMemo, useState } from "react";
import { GAMES } from "@/lib/games";
import { useSettings } from "@/lib/settings";
import type { GameMeta } from "@/lib/types";
import { Badge, Chip } from "./Badge";
import { Button } from "./Button";
import { EmptyState } from "./Section";
import { GameCard } from "./GameCard";
import { Icon } from "./Icon";
import { Modal } from "./Modal";
import { SideScroll } from "./SideScroll";

type CategoryKey =
  | "all"
  | "party"
  | "kuis"
  | "solo"
  | "duo"
  | "puzzle"
  | "arcade";

const CATEGORIES: Array<{ value: CategoryKey; key: Parameters<ReturnType<typeof useSettings>["t"]>[0] }> = [
  { value: "all", key: "categoryAll" },
  { value: "party", key: "categoryParty" },
  { value: "kuis", key: "categoryQuiz" },
  { value: "solo", key: "categorySolo" },
  { value: "duo", key: "categoryDuo" },
  { value: "puzzle", key: "categoryPuzzle" },
  { value: "arcade", key: "categoryArcade" },
];

function matchesQuery(game: GameMeta, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  const haystack = [
    game.name.id,
    game.name.en,
    game.short.id,
    game.short.en,
    game.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(normalized);
}

export function CatalogBrowser({ variant = "home" }: { variant?: "home" | "browse" }) {
  const { t, pickText } = useSettings();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryKey>("all");
  const [players, setPlayers] = useState("");
  const [duration, setDuration] = useState("");
  const [level, setLevel] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const advancedCount = [players, duration, level].filter(Boolean).length;

  const filtered = useMemo(
    () =>
      GAMES.filter((game) => {
        if (!matchesQuery(game, query)) return false;
        if (category !== "all" && !game.tags.includes(category)) return false;
        if (players) {
          const count = Number(players);
          if (count < game.minPlayers || count > game.maxPlayers) return false;
        }
        if (duration && game.minutes > Number(duration)) return false;
        if (level && game.level !== level) return false;
        return true;
      }),
    [query, category, players, duration, level],
  );

  const reset = () => {
    setQuery("");
    setCategory("all");
    setPlayers("");
    setDuration("");
    setLevel("");
  };

  const searchId = variant === "home" ? "home-search" : "f-search";
  const gridClass = variant === "browse" ? "card-list" : "card-grid";

  return (
    <div>
      <section className="page-section--tight" id="cari" aria-label={t("searchGame")}>
        <div className={variant === "browse" ? "search-bar" : ""}>
          <div className="field">
            <label className="field__label" htmlFor={searchId}>
              {t("searchGame")}
            </label>
            <div className="input-wrap">
              <Icon name="i-search" />
              <input
                className="input"
                id={searchId}
                type="search"
                placeholder={t("searchPlaceholder")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>
          {variant === "browse" ? (
            <Button variant="ghost" onClick={() => setFiltersOpen(true)}>
              <Icon name="i-filter" />
              {t("filter")}
              {advancedCount ? <Badge tone="accent">{advancedCount}</Badge> : null}
            </Button>
          ) : null}
        </div>
        <div className="page-section--tight">
          <SideScroll className="chip-row" role="group" aria-label={t("browse")}>
            {CATEGORIES.map((item) => (
              <Chip
                key={item.value}
                value={item.value}
                pressed={category === item.value}
                onClick={() => setCategory(item.value)}
              >
                {t(item.key)}
              </Chip>
            ))}
          </SideScroll>
        </div>
      </section>

      <section aria-labelledby={`${variant}-result-title`}>
        {variant === "browse" ? (
          <div className="catalog-bar">
            <h2 className="sr-only" id={`${variant}-result-title`}>
              {t("seeResults")}
            </h2>
            <p className="catalog-bar__count" aria-live="polite">
              {t("resultsCount", { n: filtered.length })}
            </p>
            <Button variant="ghost" size="sm" onClick={reset}>
              {t("resetFilter")}
            </Button>
          </div>
        ) : (
          <h2 className="sr-only" id={`${variant}-result-title`}>
            {t("allGames")}
          </h2>
        )}

        {filtered.length ? (
          <div className={gridClass}>
            {filtered.map((game, index) => (
              <GameCard
                key={game.slug}
                game={game}
                index={index}
                horizontal={variant === "browse"}
                favorite={variant !== "browse"}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            art="/art/empty-cards.svg"
            title={t("noGamesTitle")}
            text={variant === "home" ? t("noGamesText") : t("noGamesTextBrowse")}
            action={
              <Button variant="ghost" onClick={reset}>
                {t("resetFilter")}
              </Button>
            }
          />
        )}
      </section>

      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title={t("filterTitle")}
        labelledBy="filter-modal-title"
        actions={
          <>
            <Button variant="ghost" onClick={reset}>
              {t("reset")}
            </Button>
            <Button onClick={() => setFiltersOpen(false)}>{t("seeResults")}</Button>
          </>
        }
      >
        <div className="field">
          <label className="field__label" htmlFor="f-players">
            {t("howManyPeople")}
          </label>
          <select
            className="select"
            id="f-players"
            value={players}
            onChange={(event) => setPlayers(event.target.value)}
          >
            <option value="">{t("all")}</option>
            <option value="1">{t("onlyOne")}</option>
            <option value="2">{t("peopleCount", { n: 2 })}</option>
            <option value="4">{t("peopleCount", { n: 4 })}</option>
            <option value="6">{t("peopleCount", { n: 6 })}</option>
            <option value="8">{t("peopleCount", { n: 8 })}</option>
            <option value="12">{t("peopleCount", { n: 12 })}</option>
            <option value="20">{t("peopleCount", { n: 20 })}</option>
          </select>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="f-duration">
            {t("durationLimit")}
          </label>
          <select
            className="select"
            id="f-duration"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
          >
            <option value="">{t("all")}</option>
            <option value="5">{t("maxMinutes", { n: 5 })}</option>
            <option value="15">{t("maxMinutes", { n: 15 })}</option>
            <option value="30">{t("maxMinutes", { n: 30 })}</option>
          </select>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="f-level">
            {t("difficulty")}
          </label>
          <select
            className="select"
            id="f-level"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
          >
            <option value="">{t("all")}</option>
            <option value="easy">{t("levelEasy")}</option>
            <option value="medium">{t("levelMedium")}</option>
            <option value="hard">{t("levelHard")}</option>
          </select>
        </div>
        <p className="field__hint">{t("browseSubtitle")}</p>
        <span className="sr-only">{pickText({ id: "Filter", en: "Filter" })}</span>
      </Modal>
    </div>
  );
}

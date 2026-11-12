"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Modal } from "@/components/Modal";
import { Reveal } from "@/components/motion/Reveal";
import { SiteShell } from "@/components/SiteShell";
import { Stepper } from "@/components/Stepper";
import { PlayersPanel } from "@/components/setup/PlayersPanel";
import { loadSetup, saveSetup, useSettings } from "@/lib/settings";
import { maxImpostors } from "@/lib/game/impostor";
import type { ImpostorConfig, WordLang } from "@/lib/types";
import { shuffle } from "@/lib/utils";
import { WORD_CATEGORIES } from "@/lib/words";

const DEFAULT_CONFIG: ImpostorConfig = {
  players: ["Dina", "Raka", "Sari", "Bima", "Yanti", "Eko"],
  impostors: 1,
  chameleon: false,
  categoryIds: WORD_CATEGORIES.map((category) => category.id),
  timerMinutes: 3,
  allowGuess: true,
  wordLang: "app",
};

export function ImpostorSetup() {
  const router = useRouter();
  const { t, pickText, settings } = useSettings();
  const [config, setConfig] = useState<ImpostorConfig>(DEFAULT_CONFIG);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    setConfig(loadSetup<ImpostorConfig>("impostor", DEFAULT_CONFIG));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveSetup("impostor", config);
  }, [config, loaded]);

  const categories = useMemo(
    () => [
      ...WORD_CATEGORIES.map((category) => ({
        id: category.id,
        name: pickText(category.name),
      })),
      ...settings.customCategories.map((category) => ({
        id: `custom:${category.id}`,
        name: category.name,
      })),
    ],
    [pickText, settings.customCategories],
  );

  const allIds = categories.map((category) => category.id);
  const selected = config.categoryIds.filter((id) => allIds.includes(id));
  const categorySummary =
    !selected.length || selected.length === allIds.length
      ? t("allCategoriesRandom")
      : selected.length === 1
        ? categories.find((category) => category.id === selected[0])?.name ?? ""
        : t("categoriesSelected", { n: selected.length });

  const max = maxImpostors(config.players.length);
  const chameleonAllowed = config.players.length >= 6;

  const setCount = (count: number) => {
    setConfig((current) => {
      const players = [...current.players];
      while (players.length < count) players.push("");
      players.length = count;
      return {
        ...current,
        players,
        impostors: Math.min(current.impostors, maxImpostors(count)),
        chameleon: count >= 6 ? current.chameleon : false,
      };
    });
  };

  const removePlayer = (index: number) => {
    setConfig((current) => {
      if (current.players.length <= 3) return current;
      const players = current.players.filter((_, position) => position !== index);
      return {
        ...current,
        players,
        impostors: Math.min(current.impostors, maxImpostors(players.length)),
        chameleon: players.length >= 6 ? current.chameleon : false,
      };
    });
  };

  const toggleCategory = (id: string) => {
    setConfig((current) => {
      const next = current.categoryIds.includes(id)
        ? current.categoryIds.filter((item) => item !== id)
        : [...current.categoryIds, id];
      return { ...current, categoryIds: next };
    });
  };

  const start = (event: FormEvent) => {
    event.preventDefault();
    const effective = config.players.map((name, index) =>
      (name.trim() || t("playerPlaceholder", { n: index + 1 })).toLocaleLowerCase(),
    );
    if (new Set(effective).size !== effective.length) {
      setError(t("duplicateNames"));
      return;
    }
    const next: ImpostorConfig = {
      ...config,
      impostors: Math.min(Math.max(1, config.impostors), max),
      chameleon: chameleonAllowed && config.chameleon,
      categoryIds: selected.length ? selected : allIds,
      players: config.players.map((name, index) =>
        name.trim() || t("playerPlaceholder", { n: index + 1 }),
      ),
    };
    saveSetup("impostor", next);
    router.push("/play/impostor?new=1");
  };

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
              <Link className="breadcrumb__link" href="/games/impostor">
                Guess the Impostor
              </Link>
            </li>
            <li className="breadcrumb__item">
              <span aria-current="page">{t("setupTitle")}</span>
            </li>
          </ol>
        </nav>

        <Reveal className="page-header">
          <h1 className="page-header__title">{t("setupTitle")}</h1>
          <p className="page-header__text">{t("setupSubtitle")}</p>
        </Reveal>

        <form
          className="setup"
          onSubmit={start}
          aria-label={t("setupAria", { game: "Guess the Impostor" })}
          noValidate
        >
          <PlayersPanel
            names={config.players}
            min={3}
            max={20}
            onCountChange={setCount}
            onNameChange={(index, value) =>
              setConfig((current) => ({
                ...current,
                players: current.players.map((name, position) =>
                  position === index ? value : name,
                ),
              }))
            }
            onRemove={removePlayer}
            onShuffle={() =>
              setConfig((current) => ({ ...current, players: shuffle(current.players) }))
            }
          />

          <Reveal as="section" className="panel" labelledBy="g-title">
            <h2 className="panel__title" id="g-title">
              {t("gameSettings")}
            </h2>
            <div className="field">
              <span className="field__label" id="lbl-impostors">
                {t("impostorCount")}
              </span>
              <Stepper
                value={config.impostors}
                min={1}
                max={max}
                onChange={(value) => setConfig((current) => ({ ...current, impostors: value }))}
                label="lbl-impostors"
                decreaseLabel={t("back")}
                increaseLabel={t("add")}
              />
              <span className="field__hint">
                {t("impostorMaxHint", { n: max, players: config.players.length })}
              </span>
            </div>

            <div>
              <label className="toggle">
                {t("chameleon")}
                <input
                  className="toggle__input"
                  type="checkbox"
                  role="switch"
                  checked={config.chameleon}
                  disabled={!chameleonAllowed}
                  aria-describedby="chameleon-hint"
                  onChange={(event) =>
                    setConfig((current) => ({ ...current, chameleon: event.target.checked }))
                  }
                />
              </label>
              <span className="field__hint" id="chameleon-hint">
                {t("chameleonHint")}
              </span>
            </div>

            <ul className="menu-list meta-list">
              <li className="menu-list__item">
                <button
                  className="menu-list__link"
                  type="button"
                  onClick={() => setCategoryOpen(true)}
                >
                  <span className="menu-list__icon">
                    <Icon name="i-sparkle" />
                  </span>
                  <span className="menu-list__text">
                    {t("wordCategory")}
                    <small>{categorySummary}</small>
                  </span>
                  <Icon name="i-chevron-right" />
                </button>
              </li>
            </ul>

            <div className="field">
              <span className="field__label" id="lbl-timer">
                {t("discussionTimer")}
              </span>
              <Stepper
                value={config.timerMinutes}
                min={1}
                max={10}
                onChange={(value) =>
                  setConfig((current) => ({ ...current, timerMinutes: value }))
                }
                label="lbl-timer"
                decreaseLabel={t("minusMinute")}
                increaseLabel={t("plusMinute")}
              />
              <span className="field__hint">{t("minutesHint")}</span>
            </div>

            <label className="toggle">
              {t("allowGuess")}
              <input
                className="toggle__input"
                type="checkbox"
                role="switch"
                checked={config.allowGuess}
                onChange={(event) =>
                  setConfig((current) => ({ ...current, allowGuess: event.target.checked }))
                }
              />
            </label>
          </Reveal>

          <Reveal>
            <div className="accordion">
              <details className="accordion__item">
                <summary className="accordion__summary">
                  {t("advancedSettings")}
                  <Icon name="i-chevron-down" />
                </summary>
                <div className="accordion__content">
                  <div className="field">
                    <label className="field__label" htmlFor="f-word-lang">
                      {t("wordLanguage")}
                    </label>
                    <select
                      className="select"
                      id="f-word-lang"
                      value={config.wordLang}
                      onChange={(event) =>
                        setConfig((current) => ({
                          ...current,
                          wordLang: event.target.value as WordLang,
                        }))
                      }
                    >
                      <option value="app">{t("followApp")}</option>
                      <option value="id">{t("indonesian")}</option>
                      <option value="en">{t("english")}</option>
                    </select>
                  </div>
                </div>
              </details>
            </div>
          </Reveal>

          <div className="sticky-cta">
            {error ? (
              <div className="alert alert--error setup-error" role="alert">
                <Icon name="i-alert" />
                <div className="alert__body">
                  <span>{error}</span>
                </div>
              </div>
            ) : null}
            <div className="sticky-cta__inner">
              <p className="sticky-cta__info">
                <strong>{t("playersReady", { n: config.players.length })}</strong>
                {t("setupSummaryImpostor", {
                  impostors: config.impostors,
                  categories: categorySummary,
                  minutes: config.timerMinutes,
                })}
              </p>
              <Button type="submit" size="lg" icon="i-play">
                {t("startSession")}
              </Button>
            </div>
          </div>
        </form>
      </main>

      <Modal
        open={categoryOpen}
        onClose={() => setCategoryOpen(false)}
        title={t("categoryModalTitle")}
        labelledBy="category-modal-title"
        actions={
          <>
            <Button variant="ghost" onClick={() => setConfig((current) => ({ ...current, categoryIds: allIds }))}>
              {t("selectAll")}
            </Button>
            <Button onClick={() => setCategoryOpen(false)}>{t("done")}</Button>
          </>
        }
      >
        <fieldset className="choice-group choice-grid">
          <legend className="sr-only">{t("wordCategory")}</legend>
          {categories.map((category) => (
            <label className="choice" key={category.id}>
              <input
                className="choice__input"
                type="checkbox"
                checked={selected.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
              />
              {category.name}
            </label>
          ))}
        </fieldset>
        <p className="field__hint">{t("categoryModalHint")}</p>
        <p className="field__hint">
          <Link className="link" href="/word-bank">
            {t("openWordBank")}
          </Link>
        </p>
        <Badge>{t("categoriesSelected", { n: selected.length })}</Badge>
      </Modal>
    </SiteShell>
  );
}

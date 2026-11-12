"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { SiteShell } from "@/components/SiteShell";
import { Stepper } from "@/components/Stepper";
import { PlayersPanel } from "@/components/setup/PlayersPanel";
import { loadSetup, saveSetup, useSettings } from "@/lib/settings";
import { clampComposition, suggestedComposition } from "@/lib/game/werewolf";
import type { WerewolfConfig } from "@/lib/types";
import { shuffle } from "@/lib/utils";

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

export function WerewolfSetup() {
  const router = useRouter();
  const { t } = useSettings();
  const [config, setConfig] = useState<WerewolfConfig>(DEFAULT_CONFIG);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setConfig(loadSetup<WerewolfConfig>("werewolf", DEFAULT_CONFIG));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveSetup("werewolf", config);
  }, [config, loaded]);

  const comp = clampComposition(config.players.length, {
    wolves: config.wolves,
    seer: config.seer,
    doctor: config.doctor,
    hunter: config.hunter,
    villagers: 0,
  });
  const villagers =
    config.players.length - comp.wolves - comp.seer - comp.doctor - (comp.hunter ? 1 : 0);
  const maxWolves = Math.max(1, config.players.length - 2);

  const special = [
    comp.seer ? t("seerRole") : "",
    comp.doctor ? t("doctorRole") : "",
    comp.hunter ? t("hunterRole") : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const setCount = (count: number) => {
    setConfig((current) => {
      const players = [...current.players];
      while (players.length < count) players.push("");
      players.length = count;
      const suggestion = suggestedComposition(count);
      return {
        ...current,
        players,
        wolves: suggestion.wolves,
        seer: suggestion.seer,
        doctor: suggestion.doctor,
        hunter: current.hunter,
      };
    });
  };

  const removePlayer = (index: number) => {
    setConfig((current) => {
      if (current.players.length <= 5) return current;
      const players = current.players.filter((_, position) => position !== index);
      const suggestion = suggestedComposition(players.length);
      return {
        ...current,
        players,
        wolves: suggestion.wolves,
        seer: suggestion.seer,
        doctor: suggestion.doctor,
      };
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
    if (villagers < 1) {
      setError(t("wolfNeedsVillager"));
      return;
    }
    const next: WerewolfConfig = {
      ...config,
      players: config.players.map((name, index) =>
        name.trim() || t("playerPlaceholder", { n: index + 1 }),
      ),
      wolves: comp.wolves,
      seer: comp.seer,
      doctor: comp.doctor,
      hunter: comp.hunter,
    };
    saveSetup("werewolf", next);
    router.push("/play/werewolf?new=1");
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
              <Link className="breadcrumb__link" href="/games/werewolf">
                Werewolf
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
          aria-label={t("setupAria", { game: "Werewolf" })}
          noValidate
        >
          <PlayersPanel
            names={config.players}
            min={5}
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
              {t("composition")}
            </h2>
            <p className="panel__text">{t("compositionHint")}</p>
            <div className="composition">
              <div className="composition__row">
                <span className="field__label" id="lbl-wolf">
                  {t("werewolfRole")}
                </span>
                <Stepper
                  value={comp.wolves}
                  min={1}
                  max={maxWolves}
                  onChange={(value) => setConfig((current) => ({ ...current, wolves: value }))}
                  label="lbl-wolf"
                  decreaseLabel={t("back")}
                  increaseLabel={t("add")}
                />
              </div>
              <div className="composition__row">
                <span className="field__label" id="lbl-seer">
                  {t("seerRole")}
                </span>
                <Stepper
                  value={comp.seer}
                  min={0}
                  max={1}
                  onChange={(value) => setConfig((current) => ({ ...current, seer: value }))}
                  label="lbl-seer"
                  decreaseLabel={t("back")}
                  increaseLabel={t("add")}
                />
              </div>
              <div className="composition__row">
                <span className="field__label" id="lbl-doctor">
                  {t("doctorRole")}
                </span>
                <Stepper
                  value={comp.doctor}
                  min={0}
                  max={1}
                  onChange={(value) => setConfig((current) => ({ ...current, doctor: value }))}
                  label="lbl-doctor"
                  decreaseLabel={t("back")}
                  increaseLabel={t("add")}
                />
              </div>
              <label className="toggle composition__row">
                {t("hunterHint")}
                <input
                  className="toggle__input"
                  type="checkbox"
                  role="switch"
                  checked={comp.hunter}
                  onChange={(event) =>
                    setConfig((current) => ({ ...current, hunter: event.target.checked }))
                  }
                />
              </label>
              <div className="composition__row">
                <span className="field__label">{t("villagerRest")}</span>
                <span className="composition__count">{Math.max(0, villagers)}</span>
              </div>
            </div>
            {villagers < 1 ? (
              <p className="field__error">
                <Icon name="i-alert" />
                {t("wolfNeedsVillager")}
              </p>
            ) : null}
          </Reveal>

          <Reveal as="section" className="panel" labelledBy="h-title">
            <h2 className="panel__title" id="h-title">
              {t("hostSettings")}
            </h2>
            <div className="field">
              <span className="field__label" id="lbl-day">
                {t("dayTimer")}
              </span>
              <Stepper
                value={config.dayMinutes}
                min={1}
                max={10}
                onChange={(value) => setConfig((current) => ({ ...current, dayMinutes: value }))}
                label="lbl-day"
                decreaseLabel={t("minusMinute")}
                increaseLabel={t("plusMinute")}
              />
              <span className="field__hint">{t("minutesHint")}</span>
            </div>

            <div className="field">
              <span className="field__label" id="lbl-vote">
                {t("votingMethod")}
              </span>
              <div className="segmented" role="radiogroup" aria-labelledby="lbl-vote">
                <label className="segmented__option">
                  <input
                    type="radio"
                    name="vote-mode"
                    value="secret"
                    checked={config.voteMode === "secret"}
                    onChange={() => setConfig((current) => ({ ...current, voteMode: "secret" }))}
                  />
                  <span>{t("secretPass")}</span>
                </label>
                <label className="segmented__option">
                  <input
                    type="radio"
                    name="vote-mode"
                    value="hand"
                    checked={config.voteMode === "hand"}
                    onChange={() => setConfig((current) => ({ ...current, voteMode: "hand" }))}
                  />
                  <span>{t("handCount")}</span>
                </label>
              </div>
              <span className="field__hint">{t("handCountHint")}</span>
            </div>

            <label className="toggle">
              {t("openRolesOnDeath")}
              <input
                className="toggle__input"
                type="checkbox"
                role="switch"
                checked={config.openRolesOnDeath}
                onChange={(event) =>
                  setConfig((current) => ({ ...current, openRolesOnDeath: event.target.checked }))
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
                <fieldset className="choice-group">
                  <legend className="field__label">{t("tieResult")}</legend>
                  <label className="choice">
                    <input
                      className="choice__input"
                      type="radio"
                      name="tie"
                      checked={config.tieRule === "none"}
                      onChange={() => setConfig((current) => ({ ...current, tieRule: "none" }))}
                    />
                    {t("noExecution")}
                  </label>
                  <label className="choice">
                    <input
                      className="choice__input"
                      type="radio"
                      name="tie"
                      checked={config.tieRule === "revote"}
                      onChange={() => setConfig((current) => ({ ...current, tieRule: "revote" }))}
                    />
                    {t("revote")}
                  </label>
                </fieldset>
                <label className="toggle">
                  {t("doctorSelfProtect")}
                  <input
                    className="toggle__input"
                    type="checkbox"
                    role="switch"
                    checked={config.doctorSelfProtect}
                    onChange={(event) =>
                      setConfig((current) => ({
                        ...current,
                        doctorSelfProtect: event.target.checked,
                      }))
                    }
                  />
                </label>
                <label className="toggle">
                  {t("moderatorMode")}
                  <input
                    className="toggle__input"
                    type="checkbox"
                    role="switch"
                    checked={config.moderatorMode}
                    aria-describedby="mod-hint"
                    onChange={(event) =>
                      setConfig((current) => ({
                        ...current,
                        moderatorMode: event.target.checked,
                      }))
                    }
                  />
                </label>
                <p className="field__hint" id="mod-hint">
                  {t("moderatorHint")}
                </p>
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
                {t("setupSummaryWerewolf", {
                  wolves: comp.wolves,
                  special: special || t("specialNone"),
                  minutes: config.dayMinutes,
                })}
              </p>
              <Button type="submit" size="lg" icon="i-play">
                {t("startSession")}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </SiteShell>
  );
}

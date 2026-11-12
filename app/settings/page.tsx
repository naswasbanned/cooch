"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Modal } from "@/components/Modal";
import { Reveal } from "@/components/motion/Reveal";
import { SiteShell } from "@/components/SiteShell";
import { useFavorites } from "@/lib/favorites";
import { useHistory } from "@/lib/history";
import { useSettings } from "@/lib/settings";
import { DEFAULT_SETTINGS, clearLocalData } from "@/lib/storage";
import { useToast } from "@/lib/toast";
import { uid } from "@/lib/utils";

type ThemeValue = "night" | "light" | "system";

export default function SettingsPage() {
  const { settings, update, addCategory, deleteCategory, t } = useSettings();
  const { clearFavorites } = useFavorites();
  const { clearHistory } = useHistory();
  const { showToast } = useToast();

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [name, setName] = useState("");
  const [words, setWords] = useState("");
  const [error, setError] = useState<"name" | "words" | null>(null);

  const closeCategory = () => {
    setCategoryOpen(false);
    setName("");
    setWords("");
    setError(null);
  };

  const saveCategory = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const parsed = Array.from(
      new Set(
        words
          .split("\n")
          .map((word) => word.trim())
          .filter(Boolean),
      ),
    );
    if (!trimmedName) {
      setError("name");
      return;
    }
    if (!parsed.length) {
      setError("words");
      return;
    }
    addCategory({ id: uid("cat"), name: trimmedName, words: parsed });
    showToast(t("categorySaved"), "success");
    closeCategory();
  };

  const clearData = () => {
    clearLocalData();
    update(DEFAULT_SETTINGS);
    clearFavorites();
    clearHistory();
    setClearOpen(false);
    showToast(t("dataCleared"), "success");
  };

  const themeValue: ThemeValue =
    settings.theme === "night" ? "night" : settings.theme === "system" ? "system" : "light";

  return (
    <SiteShell>
      <main className="container page" id="main">
        <Reveal className="page-header">
          <h1 className="page-header__title">{t("settingsTitle")}</h1>
          <p className="page-header__text">{t("settingsSubtitle")}</p>
        </Reveal>

        <div className="settings">
          <Reveal as="section" className="panel" labelledBy="s-lang">
            <h2 className="panel__title" id="s-lang">
              {t("language")}
            </h2>
            <div className="segmented" role="radiogroup" aria-labelledby="s-lang">
              {(["id", "en"] as const).map((lang) => (
                <label className="segmented__option" key={lang}>
                  <input
                    type="radio"
                    name="lang-settings"
                    value={lang}
                    checked={settings.language === lang}
                    onChange={() => update({ language: lang })}
                  />
                  <span>{lang === "id" ? t("indonesian") : t("english")}</span>
                </label>
              ))}
            </div>
            <p className="field__hint">{t("languageHint")}</p>
          </Reveal>

          <Reveal as="section" className="panel" labelledBy="s-look">
            <h2 className="panel__title" id="s-look">
              {t("appearance")}
            </h2>
            <div className="field">
              <span className="field__label" id="lbl-theme">
                {t("theme")}
              </span>
              <div className="segmented" role="radiogroup" aria-labelledby="lbl-theme">
                {(
                  [
                    { value: "night", label: t("themeDark") },
                    { value: "light", label: t("themeLight") },
                    { value: "system", label: t("themeSystem") },
                  ] as const
                ).map((option) => (
                  <label className="segmented__option" key={option.value}>
                    <input
                      type="radio"
                      name="theme"
                      value={option.value}
                      checked={themeValue === option.value}
                      onChange={() => update({ theme: option.value })}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="field">
              <span className="field__label" id="lbl-text">
                {t("textSize")}
              </span>
              <div className="segmented" role="radiogroup" aria-labelledby="lbl-text">
                {(
                  [
                    { value: "md", label: t("textNormal") },
                    { value: "lg", label: t("textLarge") },
                  ] as const
                ).map((option) => (
                  <label className="segmented__option" key={option.value}>
                    <input
                      type="radio"
                      name="text-size"
                      value={option.value}
                      checked={settings.textSize === option.value}
                      onChange={() => update({ textSize: option.value })}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="toggle">
                {t("reduceMotion")}
                <input
                  className="toggle__input"
                  type="checkbox"
                  role="switch"
                  checked={settings.reduceMotion}
                  onChange={(event) => update({ reduceMotion: event.target.checked })}
                />
              </label>
              <label className="toggle">
                {t("vibration")}
                <input
                  className="toggle__input"
                  type="checkbox"
                  role="switch"
                  checked={settings.vibration}
                  onChange={(event) => update({ vibration: event.target.checked })}
                />
              </label>
            </div>
          </Reveal>

          <Reveal as="section" className="panel" labelledBy="s-cat">
            <h2 className="panel__title" id="s-cat">
              {t("customCategories")}
            </h2>
            <p className="panel__text">{t("customCategoriesText")}</p>
            {settings.customCategories.length ? (
              <ul className="menu-list meta-list">
                {settings.customCategories.map((category) => (
                  <li className="menu-list__item" key={category.id}>
                    <div className="menu-list__link">
                      <span className="menu-list__icon">
                        <Icon name="i-sparkle" />
                      </span>
                      <span className="menu-list__text">
                        {category.name}
                        <small>{t("wordCount", { n: category.words.length })}</small>
                      </span>
                      <button
                        className="btn btn--ghost btn--icon btn--sm btn--round"
                        type="button"
                        aria-label={t("deleteCategory", { name: category.name })}
                        onClick={() => {
                          deleteCategory(category.id);
                          showToast(t("categoryDeleted"));
                        }}
                      >
                        <Icon name="i-close" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="field__hint">{t("noCustomCategories")}</p>
            )}
            <div className="cluster">
              <Button variant="ghost" icon="i-plus" onClick={() => setCategoryOpen(true)}>
                {t("addCategory")}
              </Button>
            </div>
          </Reveal>

          <Reveal as="section" className="panel" labelledBy="s-data">
            <h2 className="panel__title" id="s-data">
              {t("dataTitle")}
            </h2>
            <p className="panel__text">{t("dataText")}</p>
            <div className="cluster">
              <Button variant="danger" onClick={() => setClearOpen(true)}>
                {t("clearData")}
              </Button>
            </div>
          </Reveal>

          <Reveal as="section" className="panel" labelledBy="s-about">
            <h2 className="panel__title" id="s-about">
              {t("aboutTitle")}
            </h2>
            <div className="cluster">
              <Badge>{t("version")}</Badge>
              <Badge tone="success" icon="i-check-circle">
                {t("offlineReady")}
              </Badge>
            </div>
            <p className="panel__text">{t("aboutText")}</p>
            <div className="cluster">
              <Link className="link" href="/privacy">
                {t("privacy")}
              </Link>
              <Link className="link" href="/how-to">
                {t("howToShort")}
              </Link>
            </div>
          </Reveal>
        </div>
      </main>

      <Modal
        open={categoryOpen}
        onClose={closeCategory}
        title={t("newCategory")}
        labelledBy="category-modal-title"
        actions={
          <>
            <Button variant="ghost" onClick={closeCategory}>
              {t("cancel")}
            </Button>
            <Button type="submit" form="category-form">
              {t("saveCategory")}
            </Button>
          </>
        }
      >
        <form id="category-form" className="stack" onSubmit={saveCategory} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="c-name">
              {t("categoryName")}
            </label>
            <input
              className="input"
              id="c-name"
              type="text"
              maxLength={24}
              placeholder={t("categoryNamePlaceholder")}
              value={name}
              aria-describedby={error === "name" ? "c-name-err" : undefined}
              onChange={(event) => {
                setName(event.target.value);
                setError(null);
              }}
            />
            {error === "name" ? (
              <span className="field__error" id="c-name-err">
                <Icon name="i-alert" />
                {t("categoryNameError")}
              </span>
            ) : null}
          </div>
          <div className="field">
            <label className="field__label" htmlFor="c-words">
              {t("wordsList")}
            </label>
            <textarea
              className="textarea"
              id="c-words"
              placeholder={t("wordsPlaceholder")}
              value={words}
              aria-describedby={error === "words" ? "c-words-err" : "c-words-hint"}
              onChange={(event) => {
                setWords(event.target.value);
                setError(null);
              }}
            />
            <span className="field__hint" id="c-words-hint">
              {t("wordsHint")}
            </span>
            {error === "words" ? (
              <span className="field__error" id="c-words-err">
                <Icon name="i-alert" />
                {t("wordsError")}
              </span>
            ) : null}
          </div>
        </form>
      </Modal>

      <Modal
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        title={t("clearTitle")}
        labelledBy="clear-modal-title"
        actions={
          <>
            <Button variant="ghost" onClick={() => setClearOpen(false)} autoFocus>
              {t("cancel")}
            </Button>
            <Button variant="danger" onClick={clearData}>
              {t("delete")}
            </Button>
          </>
        }
      >
        <p>{t("clearText")}</p>
      </Modal>
    </SiteShell>
  );
}

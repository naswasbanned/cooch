"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { txt, tr, type TextKey } from "./i18n";
import { DEFAULT_SETTINGS, STORAGE_KEYS, loadSettings, readJSON, writeJSON } from "./storage";
import type { CustomCategory, Lang, Settings } from "./types";

type ResolvedTheme = "light" | "night";

interface SettingsContextValue {
  settings: Settings;
  hydrated: boolean;
  lang: Lang;
  resolvedTheme: ResolvedTheme;
  nightOverride: boolean;
  setNightOverride: (active: boolean) => void;
  update: (patch: Partial<Settings>) => void;
  setLanguage: (lang: Lang) => void;
  addCategory: (category: CustomCategory) => void;
  deleteCategory: (id: string) => void;
  t: (key: TextKey, vars?: Record<string, string | number>) => string;
  pickText: (value: { id: string; en: string }) => string;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function systemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "light";
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const [system, setSystem] = useState<ResolvedTheme>("light");
  const [nightOverride, setNightOverrideState] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setSystem(systemTheme());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!window.matchMedia) return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystem(query.matches ? "night" : "light");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeJSON(STORAGE_KEYS.settings, settings);
  }, [settings, hydrated]);

  const resolvedTheme: ResolvedTheme = nightOverride
    ? "night"
    : settings.theme === "system"
      ? system
      : settings.theme;

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolvedTheme;
    root.dataset.textSize = settings.textSize;
    root.lang = settings.language;
    if (settings.reduceMotion) {
      root.dataset.motion = "reduce";
    } else {
      delete root.dataset.motion;
    }
  }, [resolvedTheme, settings.textSize, settings.language, settings.reduceMotion]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((current) => ({ ...current, ...patch }));
  }, []);

  const setLanguage = useCallback((language: Lang) => {
    setSettings((current) => ({ ...current, language }));
  }, []);

  const addCategory = useCallback((category: CustomCategory) => {
    setSettings((current) => ({
      ...current,
      customCategories: [
        ...current.customCategories.filter((item) => item.id !== category.id),
        category,
      ],
    }));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setSettings((current) => ({
      ...current,
      customCategories: current.customCategories.filter((item) => item.id !== id),
    }));
  }, []);

  const setNightOverride = useCallback((active: boolean) => {
    setNightOverrideState(active);
  }, []);

  const value = useMemo<SettingsContextValue>(() => {
    const lang = settings.language;
    return {
      settings,
      hydrated,
      lang,
      resolvedTheme,
      nightOverride,
      setNightOverride,
      update,
      setLanguage,
      addCategory,
      deleteCategory,
      t: (key, vars) => tr(lang, txt[key], vars),
      pickText: (value) => value[lang] || value.id || value.en,
    };
  }, [
    settings,
    hydrated,
    resolvedTheme,
    nightOverride,
    setNightOverride,
    update,
    setLanguage,
    addCategory,
    deleteCategory,
  ]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used inside SettingsProvider");
  return context;
}

/** Reads the setup draft for a game, falling back to defaults. */
export function loadSetup<T>(slug: string, fallback: T): T {
  return readJSON<T>(STORAGE_KEYS.setup(slug), fallback);
}

export function saveSetup<T>(slug: string, value: T) {
  writeJSON(STORAGE_KEYS.setup(slug), value);
}

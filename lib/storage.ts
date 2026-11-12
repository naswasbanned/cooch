import type { SessionEnvelope, Settings } from "./types";

export const STORAGE_KEYS = {
  settings: "cooch.settings.v1",
  favorites: "cooch.favorites.v1",
  history: "cooch.history.v1",
  session: "cooch.session.v1",
  setup: (slug: string) => `cooch.setup.${slug}.v1`,
} as const;

export const DEFAULT_SETTINGS: Settings = {
  language: "id",
  theme: "light",
  textSize: "md",
  vibration: true,
  reduceMotion: false,
  wordLang: "app",
  customCategories: [],
};

function hasWindow() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readJSON<T>(key: string, fallback: T): T {
  if (!hasWindow()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): boolean {
  if (!hasWindow()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string) {
  if (!hasWindow()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Storage can be blocked in private mode; the demo keeps running in memory.
  }
}

export function clearLocalData() {
  if (!hasWindow()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEYS.settings);
    window.localStorage.removeItem(STORAGE_KEYS.favorites);
    window.localStorage.removeItem(STORAGE_KEYS.history);
    window.localStorage.removeItem(STORAGE_KEYS.session);
    const setupKeys: string[] = [];
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key?.startsWith("cooch.setup.")) setupKeys.push(key);
    }
    setupKeys.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // Ignore blocked storage.
  }
}

export function loadSettings(): Settings {
  const stored = readJSON<Partial<Settings>>(STORAGE_KEYS.settings, {});
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    customCategories: Array.isArray(stored.customCategories) ? stored.customCategories : [],
  };
}

export function loadFavorites(): string[] {
  const stored = readJSON<unknown>(STORAGE_KEYS.favorites, []);
  return Array.isArray(stored) ? stored.filter((item): item is string => typeof item === "string") : [];
}

export function loadSession(): SessionEnvelope | null {
  const stored = readJSON<SessionEnvelope | null>(STORAGE_KEYS.session, null);
  if (!stored || (stored.game !== "impostor" && stored.game !== "werewolf")) return null;
  if (!stored.state || typeof stored.updatedAt !== "number") return null;
  return stored;
}

export function saveSession(session: SessionEnvelope) {
  writeJSON(STORAGE_KEYS.session, session);
}

export function clearSession() {
  removeKey(STORAGE_KEYS.session);
}

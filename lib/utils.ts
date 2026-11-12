import type { Lang, Localized } from "./types";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function sample<T>(items: readonly T[]): T | undefined {
  if (!items.length) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}

export function uid(prefix = "p") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function pick(value: Localized, lang: Lang) {
  return value[lang] || value.id || value.en;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const TONES = ["", "avatar--sky", "avatar--grape", "avatar--leaf", "avatar--sun"];
export function avatarTone(seed: string | number) {
  const value =
    typeof seed === "number"
      ? seed
      : Array.from(seed).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return TONES[Math.abs(value) % TONES.length];
}

export function formatClock(totalSeconds: number) {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

export function formatDuration(seconds: number, lang: Lang) {
  const mins = Math.max(1, Math.round(seconds / 60));
  return lang === "id" ? `${mins} mnt` : `${mins} min`;
}

export function formatRelativeDate(timestamp: number, lang: Lang) {
  const date = new Date(timestamp);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const days = Math.round((startOfToday - startOfDate) / 86_400_000);
  if (days === 0) return lang === "id" ? "Hari ini" : "Today";
  if (days === 1) return lang === "id" ? "Kemarin" : "Yesterday";
  if (days > 1 && days < 7) {
    return date.toLocaleDateString(lang === "id" ? "id-ID" : "en-GB", { weekday: "long" });
  }
  return date.toLocaleDateString(lang === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function normalize(value: string) {
  return value
    .toLocaleLowerCase("id-ID")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function sameWord(a: string, b: string) {
  return normalize(a) === normalize(b);
}

export function minutesLabel(minutes: number, lang: Lang) {
  return lang === "id" ? `${minutes} mnt` : `${minutes} min`;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

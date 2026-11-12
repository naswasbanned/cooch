export type Lang = "id" | "en";

export type Localized = { id: string; en: string };

export type Theme = "light" | "night" | "system";
export type TextSize = "md" | "lg";
export type WordLang = "app" | "id" | "en";

export interface CustomCategory {
  id: string;
  name: string;
  words: string[];
}

export interface Settings {
  language: Lang;
  theme: Theme;
  textSize: TextSize;
  vibration: boolean;
  reduceMotion: boolean;
  wordLang: WordLang;
  customCategories: CustomCategory[];
}

export type GameSlug = "impostor" | "werewolf";
export type GameStatus = "live" | "soon";
export type Level = "easy" | "medium" | "hard";

export interface GameStep {
  title: Localized;
  text: Localized;
}

export interface GameRole {
  name: Localized;
  team: "citizen" | "evil" | "village" | "wolf";
  icon: string;
  text: Localized;
  optional?: boolean;
}

export interface GameMeta {
  slug: string;
  name: Localized;
  short: Localized;
  description: Localized;
  icon: string;
  media: "default" | "night" | "grape" | "sun" | "leaf";
  art?: string;
  tags: string[];
  minPlayers: number;
  maxPlayers: number;
  minutes: number;
  level: Level;
  status: GameStatus;
  featured?: boolean;
  isNew?: boolean;
  steps: GameStep[];
  roles: GameRole[];
  rules: Localized[];
}

export interface WordEntry {
  id: string;
  word: Localized;
  lookalike: Localized;
}

export interface WordCategory {
  id: string;
  name: Localized;
  icon: string;
  words: WordEntry[];
}

export interface HistoryEntry {
  id: string;
  game: GameSlug;
  gameName: Localized;
  playedAt: number;
  durationSec: number;
  players: string[];
  winner: "citizens" | "evil" | "village" | "wolves" | "none";
  winnerNames: string[];
  rounds: number;
  detail?: string;
}

export interface SessionEnvelope {
  game: GameSlug;
  updatedAt: number;
  state: import("./game/impostor").ImpostorState | import("./game/werewolf").WerewolfState;
}

export interface PlayerBase {
  id: string;
  name: string;
  alive: boolean;
}

export interface ImpostorConfig {
  players: string[];
  impostors: number;
  chameleon: boolean;
  categoryIds: string[];
  timerMinutes: number;
  allowGuess: boolean;
  wordLang: WordLang;
}

export interface WerewolfConfig {
  players: string[];
  wolves: number;
  seer: number;
  doctor: number;
  hunter: boolean;
  dayMinutes: number;
  voteMode: "secret" | "hand";
  openRolesOnDeath: boolean;
  tieRule: "none" | "revote";
  doctorSelfProtect: boolean;
  moderatorMode: boolean;
}

export type ImpostorRole = "citizen" | "chameleon" | "impostor";
export type WerewolfRole = "wolf" | "villager" | "seer" | "doctor" | "hunter";

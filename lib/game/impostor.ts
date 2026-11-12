import { shuffle, sample, sameWord, uid } from "../utils";
import { WORD_CATEGORIES } from "../words";
import type {
  CustomCategory,
  ImpostorConfig,
  ImpostorRole,
  Lang,
  Localized,
  WordCategory,
} from "../types";

export type ImpostorPhase =
  | "deal"
  | "order"
  | "clue"
  | "discussion"
  | "vote"
  | "votesDone"
  | "tally"
  | "elimination"
  | "noElimination"
  | "guess"
  | "guessWrong"
  | "result";

export interface ImpostorPlayer {
  id: string;
  name: string;
  role: ImpostorRole;
  alive: boolean;
}

export interface ImpostorTallyRow {
  id: string;
  votes: number;
}

export interface ImpostorState {
  version: 1;
  phase: ImpostorPhase;
  config: ImpostorConfig;
  players: ImpostorPlayer[];
  category: Localized;
  word: string;
  chameleonWord: string | null;
  dealIndex: number;
  round: number;
  clueOrder: string[];
  clueIndex: number;
  votes: Record<string, string>;
  voteIndex: number;
  tally: ImpostorTallyRow[];
  eliminatedId: string | null;
  guess: string;
  guessCorrect: boolean | null;
  winner: "citizens" | "evil" | null;
  startedAt: number;
  roundStartedAt: number;
  endedAt?: number;
  tie: boolean;
}

export function maxImpostors(playerCount: number) {
  return Math.max(1, Math.floor(playerCount / 3));
}

export function maxEvil(playerCount: number) {
  return Math.max(1, Math.floor((playerCount - 1) / 2));
}

function customCategoryToWords(category: CustomCategory): WordCategory {
  const words = category.words.filter(Boolean);
  return {
    id: `custom:${category.id}`,
    name: category.name
      ? { id: category.name, en: category.name }
      : { id: "Kategori sendiri", en: "Custom category" },
    icon: "i-sparkle",
    words: words.map((word, index) => ({
      id: `${category.id}-${index}`,
      word: { id: word, en: word },
      lookalike: { id: words[(index + 1) % words.length] ?? word, en: words[(index + 1) % words.length] ?? word },
    })),
  };
}

export function resolveWordCategories(
  categoryIds: string[],
  customCategories: CustomCategory[] = [],
): WordCategory[] {
  const custom = customCategories.map(customCategoryToWords);
  const all = [...WORD_CATEGORIES, ...custom];
  if (!categoryIds.length) return all;
  const selected = all.filter((category) => categoryIds.includes(category.id));
  return selected.length ? selected : all;
}

function playerName(name: string, index: number, lang: Lang) {
  const trimmed = name.trim();
  if (trimmed) return trimmed;
  return lang === "id" ? `Pemain ${index + 1}` : `Player ${index + 1}`;
}

export function createImpostorState(
  config: ImpostorConfig,
  lang: Lang,
  customCategories: CustomCategory[] = [],
): ImpostorState {
  const pool = resolveWordCategories(config.categoryIds, customCategories);
  const category = sample(pool) ?? WORD_CATEGORIES[0];
  const entry = sample(category.words) ?? category.words[0];

  const names = config.players.map((name, index) => playerName(name, index, lang));
  const order = shuffle(names.map((name, index) => ({ id: uid("p"), name, index })));

  const impostors = Math.min(Math.max(1, config.impostors), maxImpostors(names.length));
  const chameleon = config.chameleon && names.length >= 6 ? 1 : 0;
  const players: ImpostorPlayer[] = order.map((entryPlayer, index) => {
    let role: ImpostorRole = "citizen";
    if (index < impostors) role = "impostor";
    else if (index < impostors + chameleon) role = "chameleon";
    return {
      id: entryPlayer.id,
      name: entryPlayer.name,
      role,
      alive: true,
    };
  });

  const now = Date.now();
  return {
    version: 1,
    phase: "deal",
    config: { ...config, players: names },
    players,
    category: category.name,
    word: entry.word[lang] || entry.word.id,
    chameleonWord: chameleon ? entry.lookalike[lang] || entry.lookalike.id : null,
    dealIndex: 0,
    round: 1,
    clueOrder: shuffle(players.map((player) => player.id)),
    clueIndex: 0,
    votes: {},
    voteIndex: 0,
    tally: [],
    eliminatedId: null,
    guess: "",
    guessCorrect: null,
    winner: null,
    startedAt: now,
    roundStartedAt: now,
    tie: false,
  };
}

export function aliveImpostorPlayers(state: ImpostorState) {
  return state.players.filter((player) => player.alive);
}

export function evilAlive(state: ImpostorState) {
  return state.players.filter((player) => player.alive && player.role !== "citizen").length;
}

export function citizenAlive(state: ImpostorState) {
  return state.players.filter((player) => player.alive && player.role === "citizen").length;
}

export function advanceDeal(state: ImpostorState): ImpostorState {
  if (state.dealIndex + 1 >= state.players.length) {
    return { ...state, phase: "order", dealIndex: state.players.length };
  }
  return { ...state, dealIndex: state.dealIndex + 1 };
}

export function startClueRound(state: ImpostorState): ImpostorState {
  return { ...state, phase: "clue", clueIndex: 0, clueOrder: shuffle(aliveImpostorPlayers(state).map((p) => p.id)) };
}

export function nextClue(state: ImpostorState): ImpostorState {
  if (state.clueIndex + 1 >= state.clueOrder.length) {
    return { ...state, phase: "discussion", roundStartedAt: Date.now() };
  }
  return { ...state, clueIndex: state.clueIndex + 1 };
}

export function startVoting(state: ImpostorState): ImpostorState {
  return { ...state, phase: "vote", voteIndex: 0, votes: {}, tally: [], tie: false };
}

export function submitImpostorVote(
  state: ImpostorState,
  voterId: string,
  targetId: string,
): ImpostorState {
  if (state.phase !== "vote") return state;
  const voters = aliveImpostorPlayers(state);
  const votes = { ...state.votes, [voterId]: targetId };
  if (state.voteIndex + 1 >= voters.length) {
    return { ...state, votes, voteIndex: voters.length, phase: "votesDone" };
  }
  return { ...state, votes, voteIndex: state.voteIndex + 1 };
}

export function openTally(state: ImpostorState): ImpostorState {
  const counts = new Map<string, number>();
  Object.values(state.votes).forEach((targetId) => {
    counts.set(targetId, (counts.get(targetId) ?? 0) + 1);
  });
  const tally = Array.from(counts.entries())
    .map(([id, votes]) => ({ id, votes }))
    .sort((a, b) => b.votes - a.votes);
  return { ...state, phase: "tally", tally };
}

function winnerAfterDeath(state: ImpostorState): "citizens" | "evil" | null {
  const evil = evilAlive(state);
  const citizens = citizenAlive(state);
  if (evil === 0) return "citizens";
  if (evil >= citizens) return "evil";
  return null;
}

export function resolveImpostorElimination(state: ImpostorState): ImpostorState {
  const top = state.tally[0];
  if (!top) return { ...state, phase: "noElimination", tie: true, eliminatedId: null };

  const tied = state.tally.filter((row) => row.votes === top.votes);
  if (tied.length > 1) {
    return { ...state, phase: "noElimination", tie: true, eliminatedId: null };
  }

  const eliminated = state.players.find((player) => player.id === top.id);
  if (!eliminated) return { ...state, phase: "noElimination", tie: true, eliminatedId: null };

  const players = state.players.map((player) =>
    player.id === top.id ? { ...player, alive: false } : player,
  );
  const next = { ...state, players, eliminatedId: top.id, tie: false };
  const winner = winnerAfterDeath(next);
  if (winner) {
    return { ...next, phase: "result", winner, endedAt: Date.now() };
  }
  if (eliminated.role === "impostor" && next.config.allowGuess) {
    return { ...next, phase: "guess", guess: "", guessCorrect: null };
  }
  return { ...next, phase: "elimination" };
}

export function submitImpostorGuess(state: ImpostorState, guess: string): ImpostorState {
  const correct = sameWord(guess, state.word);
  if (correct) {
    return {
      ...state,
      guess,
      guessCorrect: true,
      phase: "result",
      winner: "evil",
      endedAt: Date.now(),
    };
  }
  return { ...state, guess, guessCorrect: false, phase: "guessWrong" };
}

export function nextImpostorRound(state: ImpostorState): ImpostorState {
  const alive = aliveImpostorPlayers(state);
  return {
    ...state,
    phase: "order",
    round: state.round + 1,
    clueOrder: shuffle(alive.map((player) => player.id)),
    clueIndex: 0,
    votes: {},
    voteIndex: 0,
    tally: [],
    eliminatedId: null,
    guess: "",
    guessCorrect: null,
    tie: false,
    roundStartedAt: Date.now(),
  };
}

export function finishImpostorGame(state: ImpostorState): ImpostorState {
  return { ...state, phase: "result", endedAt: state.endedAt ?? Date.now() };
}

export function impostorWinnerNames(state: ImpostorState): string[] {
  if (!state.winner) return [];
  return state.players
    .filter((player) =>
      state.winner === "citizens" ? player.role === "citizen" : player.role !== "citizen",
    )
    .map((player) => player.name);
}

export function impostorRoleLabel(role: ImpostorRole, lang: Lang): string {
  if (role === "impostor") return lang === "id" ? "Impostor" : "Impostor";
  if (role === "chameleon") return "Chameleon";
  return lang === "id" ? "Warga" : "Citizen";
}

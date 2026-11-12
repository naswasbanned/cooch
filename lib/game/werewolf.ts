import { shuffle, uid } from "../utils";
import type { Lang, WerewolfConfig, WerewolfRole } from "../types";

export type WerewolfPhase =
  | "reveal"
  | "night"
  | "wolf"
  | "doctor"
  | "seer"
  | "morning"
  | "hunter"
  | "hunterResult"
  | "day"
  | "vote"
  | "votesDone"
  | "tally"
  | "execution"
  | "result";

export interface WerewolfPlayer {
  id: string;
  name: string;
  role: WerewolfRole;
  alive: boolean;
}

export interface NightRecord {
  night: number;
  wolfTargetId: string | null;
  protectedId: string | null;
  seerCheckId: string | null;
  seerIsWolf: boolean | null;
  victimId: string | null;
  saved: boolean;
}

export interface WerewolfTallyRow {
  id: string;
  votes: number;
}

export interface WerewolfLogEntry {
  kind: "night" | "vote" | "shot";
  day: number;
  playerId?: string;
  noDeath?: boolean;
  noExecution?: boolean;
  role?: WerewolfRole;
}

export interface WerewolfState {
  version: 1;
  phase: WerewolfPhase;
  config: WerewolfConfig;
  players: WerewolfPlayer[];
  dealIndex: number;
  night: number;
  day: number;
  nightRecord: NightRecord;
  lastProtectedId: string | null;
  nightHistory: NightRecord[];
  pendingHunterId: string | null;
  hunterCause: "night" | "execution" | null;
  hunterTargetId: string | null;
  hunterShotRole: WerewolfRole | null;
  votes: Record<string, string>;
  voteIndex: number;
  handCounts: Record<string, number> | null;
  tally: WerewolfTallyRow[];
  executedId: string | null;
  executedRole: WerewolfRole | null;
  tie: boolean;
  revoted: boolean;
  seerCheck: { targetId: string; isWolf: boolean } | null;
  winner: "village" | "wolves" | null;
  startedAt: number;
  endedAt?: number;
  log: WerewolfLogEntry[];
}

export interface WerewolfComposition {
  wolves: number;
  seer: number;
  doctor: number;
  hunter: boolean;
  villagers: number;
}

export function suggestedComposition(playerCount: number): WerewolfComposition {
  const wolves = playerCount >= 16 ? 4 : playerCount >= 12 ? 3 : playerCount >= 7 ? 2 : 1;
  const doctor = playerCount >= 7 ? 1 : 0;
  const seer = 1;
  const villagers = Math.max(1, playerCount - wolves - seer - doctor);
  return { wolves, seer, doctor, hunter: false, villagers };
}

export function clampComposition(
  playerCount: number,
  composition: WerewolfComposition,
): WerewolfComposition {
  const wolves = Math.max(1, Math.min(composition.wolves, playerCount - 2));
  const seer = Math.max(0, Math.min(1, composition.seer));
  const doctor = Math.max(0, Math.min(1, composition.doctor));
  const hunter = composition.hunter;
  const special = wolves + seer + doctor + (hunter ? 1 : 0);
  const safeWolves = special > playerCount - 1 ? Math.max(1, wolves - (special - (playerCount - 1))) : wolves;
  const villagers = Math.max(1, playerCount - safeWolves - seer - doctor - (hunter ? 1 : 0));
  return { wolves: safeWolves, seer, doctor, hunter, villagers };
}

function playerName(name: string, index: number, lang: Lang) {
  const trimmed = name.trim();
  if (trimmed) return trimmed;
  return lang === "id" ? `Pemain ${index + 1}` : `Player ${index + 1}`;
}

function emptyNight(night: number): NightRecord {
  return {
    night,
    wolfTargetId: null,
    protectedId: null,
    seerCheckId: null,
    seerIsWolf: null,
    victimId: null,
    saved: false,
  };
}

export function createWerewolfState(config: WerewolfConfig, lang: Lang): WerewolfState {
  const names = config.players.map((name, index) => playerName(name, index, lang));
  const composition = clampComposition(names.length, {
    wolves: config.wolves,
    seer: config.seer,
    doctor: config.doctor,
    hunter: config.hunter,
    villagers: 0,
  });

  const roles: WerewolfRole[] = [];
  for (let index = 0; index < composition.wolves; index += 1) roles.push("wolf");
  for (let index = 0; index < composition.seer; index += 1) roles.push("seer");
  for (let index = 0; index < composition.doctor; index += 1) roles.push("doctor");
  if (composition.hunter) roles.push("hunter");
  while (roles.length < names.length) roles.push("villager");

  const shuffledRoles = shuffle(roles);
  const order = shuffle(names.map((name) => ({ id: uid("p"), name })));
  const players: WerewolfPlayer[] = order.map((player, index) => ({
    id: player.id,
    name: player.name,
    role: shuffledRoles[index] ?? "villager",
    alive: true,
  }));

  const now = Date.now();
  return {
    version: 1,
    phase: "reveal",
    config: {
      ...config,
      players: names,
      wolves: composition.wolves,
      seer: composition.seer,
      doctor: composition.doctor,
      hunter: composition.hunter,
    },
    players,
    dealIndex: 0,
    night: 1,
    day: 1,
    nightRecord: emptyNight(1),
    lastProtectedId: null,
    nightHistory: [],
    pendingHunterId: null,
    hunterCause: null,
    hunterTargetId: null,
    hunterShotRole: null,
    votes: {},
    voteIndex: 0,
    handCounts: null,
    tally: [],
    executedId: null,
    executedRole: null,
    tie: false,
    revoted: false,
    seerCheck: null,
    winner: null,
    startedAt: now,
    log: [],
  };
}

export function aliveWerewolfPlayers(state: WerewolfState) {
  return state.players.filter((player) => player.alive);
}

export function rolePlayer(state: WerewolfState, role: WerewolfRole) {
  return state.players.find((player) => player.role === role && player.alive) ?? null;
}

export function wolfAlive(state: WerewolfState) {
  return state.players.filter((player) => player.alive && player.role === "wolf").length;
}

export function nonWolfAlive(state: WerewolfState) {
  return state.players.filter((player) => player.alive && player.role !== "wolf").length;
}

function checkWerewolfWinner(state: WerewolfState): "village" | "wolves" | null {
  const wolves = wolfAlive(state);
  const villagers = nonWolfAlive(state);
  if (wolves === 0) return "village";
  if (wolves >= villagers) return "wolves";
  return null;
}

export function advanceWerewolfReveal(state: WerewolfState): WerewolfState {
  if (state.dealIndex + 1 >= state.players.length) {
    return { ...state, phase: "night", dealIndex: state.players.length };
  }
  return { ...state, dealIndex: state.dealIndex + 1 };
}

export function startWerewolfNight(state: WerewolfState): WerewolfState {
  return {
    ...state,
    phase: "wolf",
    nightRecord: emptyNight(state.night),
    seerCheck: null,
    hunterTargetId: null,
    hunterShotRole: null,
    votes: {},
    voteIndex: 0,
    handCounts: null,
    tally: [],
    executedId: null,
    executedRole: null,
    tie: false,
    revoted: false,
  };
}

export function chooseWolfVictim(state: WerewolfState, targetId: string): WerewolfState {
  return {
    ...state,
    nightRecord: { ...state.nightRecord, wolfTargetId: targetId },
    phase: "doctor",
  };
}

export function doctorProtect(state: WerewolfState, targetId: string | null): WerewolfState {
  return {
    ...state,
    nightRecord: { ...state.nightRecord, protectedId: targetId },
    phase: "seer",
  };
}

export function seerCheckPlayer(state: WerewolfState, targetId: string): WerewolfState {
  const target = state.players.find((player) => player.id === targetId);
  const isWolf = target?.role === "wolf";
  return {
    ...state,
    seerCheck: { targetId, isWolf },
    nightRecord: {
      ...state.nightRecord,
      seerCheckId: targetId,
      seerIsWolf: isWolf,
    },
  };
}

export function resolveWerewolfNight(state: WerewolfState): WerewolfState {
  const record = state.nightRecord;
  const target = state.players.find((player) => player.id === record.wolfTargetId);
  const saved = Boolean(record.wolfTargetId && record.protectedId === record.wolfTargetId);
  const victimId = target && !saved ? target.id : null;
  const players = victimId
    ? state.players.map((player) => (player.id === victimId ? { ...player, alive: false } : player))
    : state.players;
  const victim = state.players.find((player) => player.id === victimId) ?? null;

  const resolvedRecord: NightRecord = { ...record, victimId, saved };
  const log: WerewolfLogEntry[] = [
    ...state.log,
    {
      kind: "night",
      day: state.day,
      playerId: victimId ?? undefined,
      noDeath: !victimId,
      role: victim?.role,
    },
  ];

  const next: WerewolfState = {
    ...state,
    players,
    nightRecord: resolvedRecord,
    nightHistory: [...state.nightHistory, resolvedRecord],
    lastProtectedId: record.protectedId,
    log,
    phase: "morning",
    seerCheck: state.seerCheck,
    pendingHunterId: victim?.role === "hunter" ? victim.id : null,
    hunterCause: victim?.role === "hunter" ? "night" : null,
  };

  // If a Hunter died, the shot must resolve before the winner is locked in.
  if (next.pendingHunterId) return next;

  const winner = checkWerewolfWinner(next);
  return winner ? { ...next, winner, endedAt: Date.now() } : next;
}

export function finishWerewolfMorning(state: WerewolfState): WerewolfState {
  if (state.pendingHunterId) return { ...state, phase: "hunter" };
  if (state.winner) return { ...state, phase: "result" };
  return { ...state, phase: "day" };
}

export function hunterShoot(state: WerewolfState, targetId: string): WerewolfState {
  const target = state.players.find((player) => player.id === targetId);
  const players = state.players.map((player) =>
    player.id === targetId ? { ...player, alive: false } : player,
  );
  const next: WerewolfState = {
    ...state,
    players,
    hunterTargetId: targetId,
    hunterShotRole: target?.role ?? null,
    pendingHunterId: null,
    phase: "hunterResult",
    log: [
      ...state.log,
      { kind: "shot", day: state.day, playerId: targetId, role: target?.role },
    ],
  };
  const winner = checkWerewolfWinner(next);
  return winner ? { ...next, winner, endedAt: Date.now() } : next;
}

export function finishHunterResult(state: WerewolfState): WerewolfState {
  if (state.winner) return { ...state, phase: "result" };
  if (state.hunterCause === "execution") {
    return startNextWerewolfNight(state);
  }
  return { ...state, phase: "day", hunterCause: null };
}

export function startWerewolfVote(state: WerewolfState, revote = false): WerewolfState {
  return {
    ...state,
    phase: "vote",
    votes: {},
    voteIndex: 0,
    handCounts: null,
    tally: [],
    executedId: null,
    executedRole: null,
    tie: false,
    revoted: revote ? true : false,
  };
}

export function submitWerewolfVote(
  state: WerewolfState,
  voterId: string,
  targetId: string,
): WerewolfState {
  if (state.phase !== "vote") return state;
  const voters = aliveWerewolfPlayers(state);
  const votes = { ...state.votes, [voterId]: targetId };
  if (state.voteIndex + 1 >= voters.length) {
    return { ...state, votes, voteIndex: voters.length, phase: "votesDone" };
  }
  return { ...state, votes, voteIndex: state.voteIndex + 1 };
}

export function submitHandCounts(
  state: WerewolfState,
  counts: Record<string, number>,
): WerewolfState {
  return { ...state, handCounts: counts, phase: "votesDone" };
}

export function openWerewolfTally(state: WerewolfState): WerewolfState {
  const counts = new Map<string, number>();
  if (state.handCounts) {
    Object.entries(state.handCounts).forEach(([id, votes]) => counts.set(id, votes));
  } else {
    Object.values(state.votes).forEach((targetId) => {
      counts.set(targetId, (counts.get(targetId) ?? 0) + 1);
    });
  }
  const tally = Array.from(counts.entries())
    .map(([id, votes]) => ({ id, votes }))
    .sort((a, b) => b.votes - a.votes);
  return { ...state, phase: "tally", tally };
}

export function resolveWerewolfVote(state: WerewolfState): WerewolfState {
  const top = state.tally[0];
  if (!top) {
    return { ...state, phase: "execution", executedId: null, executedRole: null, tie: true };
  }
  const tied = state.tally.filter((row) => row.votes === top.votes);
  if (tied.length > 1) {
    if (state.config.tieRule === "revote" && !state.revoted) {
      return startWerewolfVote(state, true);
    }
    return { ...state, phase: "execution", executedId: null, executedRole: null, tie: true };
  }

  const executed = state.players.find((player) => player.id === top.id);
  const players = state.players.map((player) =>
    player.id === top.id ? { ...player, alive: false } : player,
  );
  const next: WerewolfState = {
    ...state,
    players,
    executedId: top.id,
    executedRole: executed?.role ?? null,
    phase: "execution",
    tie: false,
    log: [
      ...state.log,
      { kind: "vote", day: state.day, playerId: top.id, role: executed?.role },
    ],
  };
  if (executed?.role === "hunter") {
    return {
      ...next,
      pendingHunterId: executed.id,
      hunterCause: "execution",
      winner: null,
    };
  }
  const winner = checkWerewolfWinner(next);
  return winner ? { ...next, winner, endedAt: Date.now() } : next;
}

export function finishWerewolfExecution(state: WerewolfState): WerewolfState {
  if (state.pendingHunterId) return { ...state, phase: "hunter" };
  if (state.winner) return { ...state, phase: "result" };
  if (!state.executedId) {
    return startNextWerewolfNight({ ...state, log: [...state.log, { kind: "vote", day: state.day, noExecution: true }] });
  }
  return startNextWerewolfNight(state);
}

export function startNextWerewolfNight(state: WerewolfState): WerewolfState {
  return {
    ...state,
    phase: "night",
    night: state.night + 1,
    day: state.day + 1,
    nightRecord: emptyNight(state.night + 1),
    seerCheck: null,
    pendingHunterId: null,
    hunterCause: null,
    hunterTargetId: null,
    hunterShotRole: null,
    votes: {},
    voteIndex: 0,
    handCounts: null,
    tally: [],
    executedId: null,
    executedRole: null,
    tie: false,
    revoted: false,
  };
}

export function werewolfWinnerNames(state: WerewolfState): string[] {
  if (!state.winner) return [];
  return state.players
    .filter((player) =>
      state.winner === "village" ? player.role !== "wolf" : player.role === "wolf",
    )
    .map((player) => player.name);
}

export function werewolfRoleLabel(role: WerewolfRole, lang: Lang): string {
  const labels: Record<WerewolfRole, { id: string; en: string }> = {
    wolf: { id: "Werewolf", en: "Werewolf" },
    villager: { id: "Villager", en: "Villager" },
    seer: { id: "Seer", en: "Seer" },
    doctor: { id: "Doctor", en: "Doctor" },
    hunter: { id: "Hunter", en: "Hunter" },
  };
  return labels[role][lang];
}

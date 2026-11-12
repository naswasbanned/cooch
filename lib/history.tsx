"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { STORAGE_KEYS, readJSON, writeJSON } from "./storage";
import type { HistoryEntry } from "./types";

interface HistoryContextValue {
  history: HistoryEntry[];
  hydrated: boolean;
  addEntry: (entry: HistoryEntry) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);

function loadHistory(): HistoryEntry[] {
  const stored = readJSON<unknown>(STORAGE_KEYS.history, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter((entry): entry is HistoryEntry => {
    if (!entry || typeof entry !== "object") return false;
    const candidate = entry as Partial<HistoryEntry>;
    return (
      typeof candidate.id === "string" &&
      (candidate.game === "impostor" || candidate.game === "werewolf") &&
      typeof candidate.playedAt === "number"
    );
  });
}

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeJSON(STORAGE_KEYS.history, history);
  }, [history, hydrated]);

  const addEntry = useCallback((entry: HistoryEntry) => {
    setHistory((current) => [entry, ...current.filter((item) => item.id !== entry.id)].slice(0, 100));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const value = useMemo<HistoryContextValue>(
    () => ({ history, hydrated, addEntry, clearHistory }),
    [history, hydrated, addEntry, clearHistory],
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) throw new Error("useHistory must be used inside HistoryProvider");
  return context;
}

export interface HistoryStats {
  played: number;
  longestSeconds: number;
  citizenWinRate: number | null;
  streakDays: number;
  weekDays: boolean[];
  champions: Array<{ name: string; points: number; wins: number; games: number }>;
}

export function computeStats(history: HistoryEntry[]): HistoryStats {
  const played = history.length;
  const longestSeconds = history.reduce((max, entry) => Math.max(max, entry.durationSec), 0);
  const citizenWins = history.filter(
    (entry) => entry.winner === "citizens" || entry.winner === "village",
  ).length;
  const citizenWinRate = played ? Math.round((citizenWins / played) * 100) : null;

  const dayKeys = new Set(
    history.map((entry) => {
      const date = new Date(entry.playedAt);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }),
  );
  let streakDays = 0;
  const cursor = new Date();
  // A streak may start today or yesterday; both are common "current streak" rules.
  if (!dayKeys.has(`${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`)) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (dayKeys.has(`${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`)) {
    streakDays += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return dayKeys.has(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
  });

  const scores = new Map<string, { points: number; wins: number; games: number }>();
  history.forEach((entry) => {
    entry.players.forEach((name) => {
      const current = scores.get(name) ?? { points: 0, wins: 0, games: 0 };
      const won = entry.winnerNames.includes(name);
      current.games += 1;
      current.wins += won ? 1 : 0;
      current.points += won ? 3 : 1;
      scores.set(name, current);
    });
  });
  const champions = Array.from(scores.entries())
    .map(([name, value]) => ({ name, ...value }))
    .sort((a, b) => b.points - a.points || b.wins - a.wins)
    .slice(0, 5);

  return { played, longestSeconds, citizenWinRate, streakDays, weekDays, champions };
}

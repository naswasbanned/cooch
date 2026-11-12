"use client";

import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS, loadSession } from "./storage";
import type { SessionEnvelope } from "./types";

/** Reads the single active session. The storage event keeps tabs in sync. */
export function useActiveSession() {
  const [session, setSession] = useState<SessionEnvelope | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => {
    setSession(loadSession());
    setHydrated(true);
  }, []);

  useEffect(() => {
    refresh();
    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key === STORAGE_KEYS.session) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  return { session, hydrated, refresh };
}

"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { STORAGE_KEYS, loadFavorites, writeJSON } from "./storage";

interface FavoritesContextValue {
  favorites: string[];
  hydrated: boolean;
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavorites(loadFavorites());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeJSON(STORAGE_KEYS.favorites, favorites);
  }, [favorites, hydrated]);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      hydrated,
      isFavorite: (slug) => favorites.includes(slug),
      toggleFavorite,
      clearFavorites,
    }),
    [favorites, hydrated, toggleFavorite, clearFavorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside FavoritesProvider");
  return context;
}

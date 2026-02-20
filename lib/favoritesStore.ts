'use client';

import { create } from 'zustand';

interface FavoritesState {
  favoriteShowIds: Set<number>;
  toggle: (showId: number) => void;
  isFavorite: (showId: number) => boolean;
  getAll: () => number[];
}

function loadFavorites(): Set<number> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem('podshrink-favorites');
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

function saveFavorites(ids: Set<number>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('podshrink-favorites', JSON.stringify([...ids]));
}

export const useFavorites = create<FavoritesState>((set, get) => ({
  favoriteShowIds: loadFavorites(),
  toggle: (showId: number) => {
    const current = new Set(get().favoriteShowIds);
    if (current.has(showId)) {
      current.delete(showId);
    } else {
      current.add(showId);
    }
    saveFavorites(current);
    set({ favoriteShowIds: current });
  },
  isFavorite: (showId: number) => get().favoriteShowIds.has(showId),
  getAll: () => [...get().favoriteShowIds],
}));

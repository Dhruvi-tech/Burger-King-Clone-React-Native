import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from './storage';

const FAVORITES_KEY = '@favorites_v1';

const FavoritesContext = createContext({
  favorites: [],
  favoriteCount: 0,
  toggleFavorite: () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    storage.getItem(FAVORITES_KEY).then(saved => {
      if (Array.isArray(saved)) {
        setFavorites(saved);
      }
    });
  }, []);

  const toggleFavorite = useCallback((item) => {
    setFavorites(current => {
      const exists = current.some(fav => fav.id === item.id);
      const next = exists ? current.filter(fav => fav.id !== item.id) : [...current, item];
      storage.setItem(FAVORITES_KEY, next);
      return next;
    });
  }, []);

  const favoriteIds = useMemo(() => new Set(favorites.map(item => item.id)), [favorites]);

  const isFavorite = useCallback((itemId) => favoriteIds.has(itemId), [favoriteIds]);

  const value = useMemo(() => ({
    favorites,
    favoriteCount: favorites.length,
    toggleFavorite,
    isFavorite,
  }), [favorites, isFavorite, toggleFavorite]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  return useContext(FavoritesContext);
}

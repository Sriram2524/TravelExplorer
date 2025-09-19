import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'travel-app-favorites';

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (destinationId: string) => boolean;
  toggleFavorite: (destinationId: string) => void;
  addFavorite: (destinationId: string) => void;
  removeFavorite: (destinationId: string) => void;
  clearFavorites: () => void;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on initialization
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsedFavorites = JSON.parse(stored);
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
        }
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  const isFavorite = useCallback((destinationId: string) => {
    return favorites.includes(destinationId);
  }, [favorites]);

  const toggleFavorite = useCallback((destinationId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(destinationId) 
        ? prev.filter(id => id !== destinationId)
        : [...prev, destinationId];
      return newFavorites;
    });
  }, []);

  const addFavorite = useCallback((destinationId: string) => {
    setFavorites(prev => {
      if (!prev.includes(destinationId)) {
        return [...prev, destinationId];
      }
      return prev;
    });
  }, []);

  const removeFavorite = useCallback((destinationId: string) => {
    setFavorites(prev => prev.filter(id => id !== destinationId));
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const value: FavoritesContextType = {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
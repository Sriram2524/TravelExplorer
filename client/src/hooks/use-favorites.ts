import { useState, useEffect, useCallback } from 'react';
import { Destination } from '@shared/schema';

const FAVORITES_STORAGE_KEY = 'travel-app-favorites';

export function useFavorites() {
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
      if (prev.includes(destinationId)) {
        // Remove from favorites
        return prev.filter(id => id !== destinationId);
      } else {
        // Add to favorites
        return [...prev, destinationId];
      }
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

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  };
}
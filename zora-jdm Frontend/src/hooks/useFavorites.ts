import { useState, useEffect } from 'react';
import { Car } from '../constants';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load favorites:', e);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (carId: string) => {
    setFavorites(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
  };

  const isFavorite = (carId: string) => favorites.includes(carId);

  const addFavorite = (carId: string) => {
    if (!favorites.includes(carId)) {
      setFavorites(prev => [...prev, carId]);
    }
  };

  const removeFavorite = (carId: string) => {
    setFavorites(prev => prev.filter(id => id !== carId));
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    addFavorite,
    removeFavorite,
    favoriteCount: favorites.length
  };
}

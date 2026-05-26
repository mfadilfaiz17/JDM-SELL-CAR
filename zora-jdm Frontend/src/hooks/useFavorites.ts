import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from backend on mount
  useEffect(() => {
    const loadFavorites = async () => {
      console.log('📋 Loading favorites...');
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          console.log('🔐 User is logged in, fetching from backend...');
          // User is logged in, fetch from backend
          const backendFavorites = await apiClient.favorites.getAll();
          console.log('✅ Loaded favorites from backend:', backendFavorites);
          setFavorites(backendFavorites);
          // Sync to localStorage as backup
          localStorage.setItem('favorites', JSON.stringify(backendFavorites));
        } else {
          console.log('⚠️ User not logged in, using localStorage...');
          // User not logged in, use localStorage
          const stored = localStorage.getItem('favorites');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              console.log('✅ Loaded favorites from localStorage:', parsed);
              setFavorites(parsed);
            } catch (e) {
              console.error('❌ Failed to load favorites from localStorage:', e);
            }
          } else {
            console.log('ℹ️ No favorites found in localStorage');
          }
        }
      } catch (error: any) {
        console.error('❌ Failed to load favorites from backend:', error);
        console.error('Error details:', error.message);
        // Fallback to localStorage
        const stored = localStorage.getItem('favorites');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            console.log('⏪ Fallback: Loaded favorites from localStorage:', parsed);
            setFavorites(parsed);
          } catch (e) {
            console.error('❌ Failed to load favorites from localStorage:', e);
          }
        }
      } finally {
        setLoading(false);
        console.log('✅ Favorites loading complete');
      }
    };

    loadFavorites();
  }, []);

  const toggleFavorite = async (carId: string) => {
    console.log('🔄 Toggle favorite for car:', carId);
    const isCurrentlyFavorite = favorites.includes(carId);
    console.log('Current favorite status:', isCurrentlyFavorite);
    
    // Optimistic update - update UI immediately
    const newFavorites = isCurrentlyFavorite
      ? favorites.filter(id => id !== carId)
      : [...favorites, carId];
    
    console.log('New favorites array:', newFavorites);
    
    // Update state immediately for instant UI feedback
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));

    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        console.log('🔐 User is logged in, syncing with backend...');
        // User is logged in, sync with backend
        if (isCurrentlyFavorite) {
          console.log('🗑️ Removing from backend...');
          await apiClient.favorites.remove(carId);
          console.log('✅ Removed from favorites (backend)');
        } else {
          console.log('➕ Adding to backend...');
          await apiClient.favorites.add(carId);
          console.log('✅ Added to favorites (backend)');
        }
      } else {
        console.log('⚠️ User not logged in - using localStorage only');
      }
    } catch (error: any) {
      console.error('❌ Failed to sync favorite with backend:', error);
      console.error('Error details:', error.message);
      
      // DON'T revert - keep the optimistic update even if backend fails
      // This allows favorites to work offline or when backend is down
      console.log('⚠️ Keeping local changes despite backend error');
    }
  };

  const isFavorite = (carId: string) => favorites.includes(carId);

  const addFavorite = async (carId: string) => {
    if (!favorites.includes(carId)) {
      const newFavorites = [...favorites, carId];
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          await apiClient.favorites.add(carId);
        }
      } catch (error) {
        console.error('Failed to add favorite:', error);
      }
    }
  };

  const removeFavorite = async (carId: string) => {
    const newFavorites = favorites.filter(id => id !== carId);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await apiClient.favorites.remove(carId);
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    addFavorite,
    removeFavorite,
    favoriteCount: favorites.length,
    loading
  };
}

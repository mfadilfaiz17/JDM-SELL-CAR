/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '../../hooks/useFavorites';

describe('useFavorites Hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Initial State', () => {
    test('should initialize with empty favorites', () => {
      const { result } = renderHook(() => useFavorites());
      expect(result.current.favorites).toEqual([]);
    });

    test('should load favorites from localStorage', () => {
      localStorage.setItem('favorites', JSON.stringify(['car-1', 'car-2']));
      const { result } = renderHook(() => useFavorites());
      expect(result.current.favorites).toEqual(['car-1', 'car-2']);
    });
  });

  describe('Toggle Favorite', () => {
    test('should add car to favorites', () => {
      const { result } = renderHook(() => useFavorites());
      
      act(() => {
        result.current.toggleFavorite('car-1');
      });
      
      expect(result.current.favorites).toContain('car-1');
    });

    test('should remove car from favorites', () => {
      localStorage.setItem('favorites', JSON.stringify(['car-1']));
      const { result } = renderHook(() => useFavorites());
      
      act(() => {
        result.current.toggleFavorite('car-1');
      });
      
      expect(result.current.favorites).not.toContain('car-1');
    });

    test('should toggle multiple cars', () => {
      const { result } = renderHook(() => useFavorites());
      
      act(() => {
        result.current.toggleFavorite('car-1');
        result.current.toggleFavorite('car-2');
        result.current.toggleFavorite('car-3');
      });
      
      expect(result.current.favorites).toHaveLength(3);
      expect(result.current.favorites).toContain('car-1');
      expect(result.current.favorites).toContain('car-2');
      expect(result.current.favorites).toContain('car-3');
    });
  });

  describe('Is Favorite', () => {
    test('should return true for favorite car', () => {
      localStorage.setItem('favorites', JSON.stringify(['car-1']));
      const { result } = renderHook(() => useFavorites());
      
      expect(result.current.isFavorite('car-1')).toBe(true);
    });

    test('should return false for non-favorite car', () => {
      localStorage.setItem('favorites', JSON.stringify(['car-1']));
      const { result } = renderHook(() => useFavorites());
      
      expect(result.current.isFavorite('car-2')).toBe(false);
    });

    test('should return false for empty favorites', () => {
      const { result } = renderHook(() => useFavorites());
      
      expect(result.current.isFavorite('car-1')).toBe(false);
    });
  });

  describe('Persistence', () => {
    test('should persist favorites to localStorage', () => {
      const { result } = renderHook(() => useFavorites());
      
      act(() => {
        result.current.toggleFavorite('car-1');
      });
      
      const stored = JSON.parse(localStorage.getItem('favorites') || '[]');
      expect(stored).toContain('car-1');
    });

    test('should maintain favorites across hook instances', () => {
      const { result: result1 } = renderHook(() => useFavorites());
      
      act(() => {
        result1.current.toggleFavorite('car-1');
      });
      
      const { result: result2 } = renderHook(() => useFavorites());
      expect(result2.current.favorites).toContain('car-1');
    });
  });

  describe('Edge Cases', () => {
    test('should handle duplicate additions', () => {
      const { result } = renderHook(() => useFavorites());
      
      act(() => {
        result.current.toggleFavorite('car-1');
        result.current.toggleFavorite('car-1');
      });
      
      expect(result.current.favorites).not.toContain('car-1');
    });

    test('should handle empty string car ID', () => {
      const { result } = renderHook(() => useFavorites());
      
      act(() => {
        result.current.toggleFavorite('');
      });
      
      expect(result.current.favorites).toContain('');
    });

    test('should handle special characters in car ID', () => {
      const { result } = renderHook(() => useFavorites());
      const specialId = 'car-@#$%^&*()';
      
      act(() => {
        result.current.toggleFavorite(specialId);
      });
      
      expect(result.current.favorites).toContain(specialId);
    });
  });
});

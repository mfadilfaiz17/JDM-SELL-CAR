/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheOptions {
  ttl?: number; // Default: 5 minutes
}

// Global cache store
const cacheStore = new Map<string, CacheEntry<any>>();

/**
 * Hook for caching data with TTL (Time To Live)
 * @param key - Cache key
 * @param fetcher - Function to fetch data
 * @param options - Cache options
 * @returns Cached data, loading state, and error
 */
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const { ttl = 5 * 60 * 1000 } = options; // Default 5 minutes
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const isCacheValid = useCallback(() => {
    const cached = cacheStore.get(key);
    if (!cached) return false;
    const now = Date.now();
    return now - cached.timestamp < cached.ttl;
  }, [key]);

  const getCachedData = useCallback(() => {
    const cached = cacheStore.get(key);
    return cached?.data || null;
  }, [key]);

  const setCachedData = useCallback((newData: T) => {
    cacheStore.set(key, {
      data: newData,
      timestamp: Date.now(),
      ttl,
    });
  }, [key, ttl]);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setCachedData(result);
      setData(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      // Try to use stale cache on error
      const staleData = getCachedData();
      if (staleData) {
        setData(staleData);
      }
    } finally {
      setLoading(false);
    }
  }, [fetcher, setCachedData, getCachedData]);

  useEffect(() => {
    // Check if we have valid cache
    if (isCacheValid()) {
      const cachedData = getCachedData();
      setData(cachedData);
      setLoading(false);
      return;
    }

    // Fetch new data
    refetch();
  }, [key, isCacheValid, getCachedData, refetch]);

  return { data, loading, error, refetch };
}

/**
 * Clear cache entry
 */
export function clearCache(key: string): void {
  cacheStore.delete(key);
}

/**
 * Clear all cache
 */
export function clearAllCache(): void {
  cacheStore.clear();
}

/**
 * Get cache size
 */
export function getCacheSize(): number {
  return cacheStore.size;
}

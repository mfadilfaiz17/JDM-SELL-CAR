/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';

interface PaginationOptions {
  itemsPerPage?: number;
  initialPage?: number;
}

interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  currentItems: T[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Hook for managing pagination of arrays
 * @param items - Array of items to paginate
 * @param options - Pagination options
 * @returns Pagination state and controls
 */
export function usePagination<T>(
  items: T[],
  options: PaginationOptions = {}
): PaginationResult<T> {
  const { itemsPerPage = 12, initialPage = 1 } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  return {
    currentPage,
    totalPages,
    totalItems: items.length,
    itemsPerPage,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

import { useState, useEffect, useCallback } from 'react';
import { fetchBatteries } from '../api/batteryApi';

export const useBatteryData = (filters, sortBy, searchTerm, page) => {
  const [batteries, setBatteries] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadBatteries = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchBatteries({
        ...filters,
        sortBy,
        searchTerm,
        page,
      });
      setBatteries(response.data);
      setAllBrands(response.allBrands);
      setHasMore(response.hasMore);
      setTotalCount(response.totalCount);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch batteries. Please try again later.');
      console.error('Error fetching batteries:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, searchTerm, page]);

  useEffect(() => {
    loadBatteries();
  }, [loadBatteries]);

  return { 
    batteries, 
    allBrands, 
    loading, 
    error, 
    hasMore,
    totalCount,
    currentPage,
    totalPages,
    loadBatteries
  };
};
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchBatteries } from '../api/batteryApi';

export const useBatteryData = (filters, sortBy, searchTerm) => {
  const [batteries, setBatteries] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const prevFiltersRef = useRef();
  const prevSortByRef = useRef();
  const prevSearchTermRef = useRef();

  const loadBatteries = useCallback(async (isLoadingMore = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const currentPage = isLoadingMore ? page + 1 : 1;
      const response = await fetchBatteries({
        ...filters,
        sortBy,
        searchTerm,
        page: currentPage,
      });
      
      if (response.error) {
        setError(response.error);
        return;
      }

      const newBatteries = response.data;
      
      setBatteries(prev => isLoadingMore ? [...prev, ...newBatteries] : newBatteries);
      setAllBrands(response.allBrands);
      setTotalCount(response.totalCount);
      
      const totalLoaded = isLoadingMore ? batteries.length + newBatteries.length : newBatteries.length;
      const moreAvailable = totalLoaded < response.totalCount && newBatteries.length > 0;
      setHasMore(moreAvailable);
      
      setPage(currentPage);
      setError(null);
    } catch (err) {
      setError('Failed to fetch batteries. Please try again later.');
      console.error('Error fetching batteries:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, searchTerm, page, batteries.length]);

  useEffect(() => {
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(prevFiltersRef.current);
    const sortByChanged = sortBy !== prevSortByRef.current;
    const searchTermChanged = searchTerm !== prevSearchTermRef.current;

    if (filtersChanged || sortByChanged || searchTermChanged) {
      setPage(1);
      setBatteries([]);
      setHasMore(true);
      loadBatteries(false);

      prevFiltersRef.current = filters;
      prevSortByRef.current = sortBy;
      prevSearchTermRef.current = searchTerm;
    }
  }, [filters, sortBy, searchTerm, loadBatteries]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadBatteries(true);
    }
  }, [loading, hasMore, loadBatteries]);

  return { 
    batteries, 
    allBrands, 
    loading, 
    error, 
    hasMore,
    loadMore,
    totalCount
  };
};
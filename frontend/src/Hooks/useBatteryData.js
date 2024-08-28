import { useState, useEffect, useCallback } from 'react';
import { fetchBatteries } from '../api/batteryApi';

export const useBatteryData = (filters, sortBy, searchTerm) => {
  const [batteries, setBatteries] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadBatteries = useCallback(async (isLoadingMore = false) => {
    setLoading(true);
    try {
      const currentPage = isLoadingMore ? page + 1 : 1;
      const response = await fetchBatteries({
        ...filters,
        sortBy,
        searchTerm,
        page: currentPage,
      });
      
      const newBatteries = response.data;
      
      setBatteries(prev => isLoadingMore ? [...prev, ...newBatteries] : newBatteries);
      setAllBrands(response.allBrands);
      setTotalCount(response.totalCount);
      
      const totalLoaded = isLoadingMore ? batteries.length + newBatteries.length : newBatteries.length;
      const moreAvailable = totalLoaded < response.totalCount && newBatteries.length > 0;
      setHasMore(moreAvailable);
      
      setPage(currentPage);
      setError(null);

      // console.log('Data loaded:', {
      //   totalLoaded,
      //   totalCount: response.totalCount,
      //   moreAvailable,
      //   isLoadingMore,
      //   newBatteriesCount: newBatteries.length
      // });
    } catch (err) {
      setError('Failed to fetch batteries. Please try again later.');
      console.error('Error fetching batteries:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, searchTerm, page, batteries.length]);

  useEffect(() => {
    setPage(1);
    setBatteries([]);
    setHasMore(true);
    loadBatteries(false);
  }, [filters, sortBy, searchTerm]);

  const loadMore = () => {
    if (!loading && hasMore) {
      loadBatteries(true);
    }
  };

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
import { useState, useEffect, useCallback } from 'react';
import { fetchBatteries } from '../api/batteryApi';

export const useBatteryData = (filters, sortBy, searchTerm, page) => {
  const [batteries, setBatteries] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const loadBatteries = useCallback(async () => {
    setLoading(true);
    try {
        console.log('Fetching batteries with filters:', filters);
        const response = await fetchBatteries({
            ...filters,
            sortBy,
            searchTerm,
            page,
        });
        console.log('Full fetched battery data:', response);
        setBatteries(response.data);
        setAllBrands(response.allBrands);
        setHasMore(response.hasMore);
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

  return { batteries, allBrands, loading, error, hasMore };
};

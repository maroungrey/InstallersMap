import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

function useBusinessData(selectedTable) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBusinesses = useCallback(async (table) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/installers?table=${table}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const processedData = Array.isArray(data) ? data : [data];
      const businessesWithCoordinates = processedData.map(business => ({
        ...business,
        latitude: business.pin?.lat,
        longitude: business.pin?.lng
      }));
      setBusinesses(businessesWithCoordinates);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedTable) {
      fetchBusinesses(selectedTable);
    }
  }, [fetchBusinesses, selectedTable]);

  return { businesses, loading, error };
}

export default useBusinessData;
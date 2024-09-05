import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

const useBusinessData = () => {
  const [sidebarBusinesses, setSidebarBusinesses] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSidebarBusinesses = useCallback(async (center, radius, table = 'golf-cart') => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/installers/nearby`, {
        params: {
          table,
          centerLat: center[0],
          centerLng: center[1],
          radius,
          limit: 20
        }
      });

      setSidebarBusinesses(response.data);
    } catch (err) {
      console.error('Error fetching sidebar businesses:', err);
      setError('Failed to fetch nearby businesses. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMapData = useCallback(async (bounds, zoom, table = 'golf-cart') => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/installers/map`, {
        params: {
          table,
          minLat: bounds.getSouthWest().lat,
          maxLat: bounds.getNorthEast().lat,
          minLng: bounds.getSouthWest().lng,
          maxLng: bounds.getNorthEast().lng,
          zoom
        }
      });

      setMapData(response.data);
    } catch (err) {
      console.error('Error fetching map data:', err);
      setError('Failed to fetch map data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { sidebarBusinesses, mapData, loading, error, fetchSidebarBusinesses, fetchMapData };
};

export default useBusinessData;
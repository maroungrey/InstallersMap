import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

const useBusinessData = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBusinesses = useCallback(async (center, zoom) => {
    setLoading(true);
    setError(null);

    // Adjust radius based on zoom level
    const radius = Math.max(5000 / Math.pow(2, zoom), 100); // km

    try {
      const response = await axios.get(`${API_BASE_URL}/installers`, {
        params: {
          centerLat: center[0],
          centerLng: center[1],
          zoom: zoom,
          radius: radius
        }
      });

      console.log('Fetched businesses:', response.data.length);
      setBusinesses(response.data);
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setError('Failed to fetch businesses. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { businesses, loading, error, fetchBusinesses };
};

export default useBusinessData;
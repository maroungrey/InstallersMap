import { useState, useEffect } from 'react';

export const useBatteries = () => {
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatteries = async () => {
      try {
        const response = await fetch('http://localhost:8081/batteries');
        if (!response.ok) {
          throw new Error('Failed to fetch batteries');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setBatteries(data);
        } else if (typeof data === 'object' && data !== null) {
          // Convert object to array
          const batteriesArray = Object.values(data);
          setBatteries(batteriesArray);
        } else {
          console.error('Received unexpected data format:', data);
          setBatteries([]);
          setError('Received invalid data format from server');
        }
      } catch (err) {
        console.error('Error fetching batteries:', err);
        setError(err.message);
        setBatteries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBatteries();
  }, []);

  return { batteries, loading, error };
};
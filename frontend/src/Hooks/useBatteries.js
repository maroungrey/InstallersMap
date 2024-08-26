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
        setBatteries(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBatteries();
  }, []);

  return { batteries, loading, error };
};
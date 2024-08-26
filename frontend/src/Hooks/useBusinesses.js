import { useState, useEffect, useMemo } from 'react';

export const useBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch('http://localhost:8081/installers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const transformedData = data.map(business => ({
          ...business,
          geocode: [business.latitude, business.longitude],
        }));
        setBusinesses(transformedData);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchBusinesses();
  }, []);

  const memoizedBusinesses = useMemo(() => businesses, [businesses]);

  return { businesses, memoizedBusinesses };
};
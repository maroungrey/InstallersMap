import { useEffect, useState } from 'react';

function GeocodeConverter({ addressOrZip, onGeocode }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const convertToCoordinates = async () => {
      if (!addressOrZip) return;

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressOrZip)}&format=json&limit=1`);
        const data = await response.json();

        if (isMounted) {
          if (data.length > 0) {
            const { lat, lon } = data[0];
            onGeocode({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
          } else {
            setError('No results found for the provided address or zip code.');
            onGeocode(null); // Pass null to indicate failure
          }
        }
      } catch (error) {
        if (isMounted) {
          setError('An error occurred while fetching the geocode.');
          onGeocode(null); // Pass null to indicate failure
        }
      }
    };

    convertToCoordinates();

    return () => {
      isMounted = false;
    };
  }, [addressOrZip, onGeocode]);

  return null; // No UI elements, purely functional
}

export default GeocodeConverter;
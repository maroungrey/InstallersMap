import { useState, useCallback, useEffect } from 'react';

export const useGeocode = (addressOrZip, onCoordinatesUpdate) => {
  const [shouldGeocode, setShouldGeocode] = useState(false);
  const [geocodeError, setGeocodeError] = useState(null);

  const handleGeocode = useCallback((result) => {
    if (result && result.latitude && result.longitude) {
      onCoordinatesUpdate(result.latitude, result.longitude, result.country);
      setGeocodeError(null);
    } else {
      setGeocodeError("Unable to find the location. Please try a more specific address or zip code.");
      console.error("Geocoding failed: Invalid or null result", result);
    }
  }, [onCoordinatesUpdate]);

  useEffect(() => {
    const geocode = async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressOrZip)}&limit=1`, {
          headers: {
            'User-Agent': 'Lithium Installers Map (maroungrey@gmail.com)' // Replace with your app name and contact email
          }
        });
        const data = await response.json();

        if (data && data.length > 0) {
          const result = data[0];
          const latitude = parseFloat(result.lat);
          const longitude = parseFloat(result.lon);
          
          handleGeocode({
            latitude: latitude,
            longitude: longitude,
            country: result.address ? result.address.country : null
          });
        } else {
          setGeocodeError('No results found');
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        setGeocodeError(error.message || 'An error occurred during geocoding');
      }
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const geocodeWithDelay = async () => {
      if (shouldGeocode) {
        await delay(1000); // 1 second delay to comply with usage policy
        await geocode();
      }
    };

    geocodeWithDelay();
  }, [addressOrZip, shouldGeocode, handleGeocode]);

  const startGeocoding = useCallback(() => {
    setShouldGeocode(true);
    setGeocodeError(null); 
  }, []);

  return {
    shouldGeocode,
    geocodeError,
    startGeocoding,
    setShouldGeocode,
    setGeocodeError
  };
};

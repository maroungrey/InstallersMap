import React, { useEffect } from 'react';

function GeocodeConverter({ addressOrZip, onGeocode, onError }) {
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
          
          onGeocode({
            latitude: latitude,
            longitude: longitude,
            country: result.address ? result.address.country : null
          });
        } else {
          onError('No results found');
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        onError(error.message || 'An error occurred during geocoding');
      }
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const geocodeWithDelay = async () => {
      await delay(1000); // 1 second delay to comply with usage policy
      await geocode();
    };

    geocodeWithDelay();
  }, [addressOrZip, onGeocode, onError]);
  return null;
}

export default GeocodeConverter;
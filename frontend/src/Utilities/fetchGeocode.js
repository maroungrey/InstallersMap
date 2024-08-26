export const fetchGeocode = async (addressOrZip) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressOrZip)}&limit=1`, 
        {
          headers: {
            'User-Agent': 'Lithium Installers Map (maroungrey@gmail.com)', // Replace with your app name and contact email
          },
        }
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const result = data[0];
        return {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          country: result.address?.country || null,
        };
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      throw new Error(error.message || 'An error occurred during geocoding');
    }
  };
  
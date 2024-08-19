// geocode.js
export async function geocodeZipCode(zipCode) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${zipCode}`);
    const data = await response.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } else {
      throw new Error("Location not found");
    }
  }
  
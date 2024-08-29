import React, { useEffect, useCallback } from 'react';
import { useMap } from 'react-leaflet';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const MapUpdateHandler = ({ businesses, onBusinessesUpdate }) => {
  const map = useMap();

  const updateBusinesses = useCallback(() => {
    const center = map.getCenter();
    const updatedBusinesses = businesses.map(business => ({
      ...business,
      distance: calculateDistance(
        center.lat, center.lng,
        business.latitude, business.longitude
      )
    }));
    onBusinessesUpdate(updatedBusinesses);
  }, [businesses, map, onBusinessesUpdate]);

  useEffect(() => {
    const handleMapChange = () => {
      updateBusinesses();
    };

    map.on('moveend zoomend', handleMapChange);

    updateBusinesses(); // Initial update

    return () => {
      map.off('moveend zoomend', handleMapChange);
    };
  }, [map, updateBusinesses]);

  return null;
};

export default MapUpdateHandler;
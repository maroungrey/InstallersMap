import { useRef, useState, useCallback } from 'react';

export const useMap = () => {
  const mapRef = useRef(null);
  const [selectedBusinessIndex, setSelectedBusinessIndex] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 34.052235, lng: -118.243683 });

  const handleMapLoad = useCallback((map) => {
    mapRef.current = map;
    const updateCenter = () => {
      const center = map.getCenter();
      setMapCenter({ lat: center.lat, lng: center.lng });
      console.log('Map center updated:', { lat: center.lat, lng: center.lng });
    };
    map.on('moveend', updateCenter);
    updateCenter(); // Set initial center
  }, []);

  const handleBusinessClick = useCallback((geocode) => {
    if (mapRef.current) {
      mapRef.current.flyTo(geocode, 13, {
        animate: true,
        duration: 1.3,
        easeLinearity: 0.5,
      });
    }
  }, []);

  const handleMarkerClick = useCallback((index) => {
    setSelectedBusinessIndex(index);
  }, []);

  const handleCoordinatesUpdate = useCallback((latitude, longitude, country) => {
    console.log('Updating coordinates:', { latitude, longitude, country });
    
    if (mapRef.current && latitude && longitude) {
      mapRef.current.flyTo([latitude, longitude], 13, {
        animate: true,
        duration: 1.3,
        easeLinearity: 0.5,
      });
      setMapError(null);
    } else {
      setMapError("Invalid coordinates received. Please try a different search.");
      console.error('Invalid coordinates or map reference not available:', { latitude, longitude, mapRef: !!mapRef.current });
    }
  }, []);

  return {
    mapRef,
    mapCenter,
    selectedBusinessIndex,
    mapError,
    handleMapLoad,
    handleBusinessClick,
    handleMarkerClick,
    handleCoordinatesUpdate
  };
};
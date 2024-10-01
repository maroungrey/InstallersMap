import React, { useEffect, useRef, useState } from 'react';

const GoogleBusinessMap = ({ businesses, onMarkerClick }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (window.google && window.google.maps && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 34.052235, lng: -118.243683 }, // Default center (Los Angeles)
        zoom: 10,
      });
      setMap(newMap);
    }
  }, [map]);

  useEffect(() => {
    if (map && businesses.length > 0) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      const bounds = new window.google.maps.LatLngBounds();
      
      businesses.forEach((business, index) => {
        if (business.geocode && business.geocode.latitude && business.geocode.longitude) {
          const position = new window.google.maps.LatLng(
            business.geocode.latitude,
            business.geocode.longitude
          );
          
          const marker = new window.google.maps.Marker({
            position: position,
            map: map,
            title: business.name,
          });

          marker.addListener('click', () => onMarkerClick(index));
          markersRef.current.push(marker);

          bounds.extend(position);
        }
      });

      // Only adjust bounds if we have valid markers
      if (markersRef.current.length > 0) {
        map.fitBounds(bounds);
      }
    }
  }, [map, businesses, onMarkerClick]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default GoogleBusinessMap;
import React, { useCallback, useEffect, useRef } from 'react';
import { Marker, useMap } from "react-leaflet";
import L from 'leaflet';
import pinIcon from '../Assets/pin.png';

// Custom Icon
const customIcon = new L.Icon({
  iconUrl: pinIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

export const BusinessMarker = React.memo(({ business, onMarkerClick }) => {
  const map = useMap();
  const popupRef = useRef(null);
  
  const handleClick = useCallback(() => {
    const { lat, lng } = business.pin;
    map.setView([lat, lng], 15, { animate: true, duration: 0.5 });
    onMarkerClick(business.id, lat, lng);

    map.closePopup();

    const popup = L.popup({
      closeButton: true,
      autoClose: false,
      closeOnEscapeKey: true,
      closeOnClick: false,
      offset: [0, -30],
      autoPan: false,
      className: 'custom-popup'
    })
      .setLatLng([lat, lng])
      .setContent(`
        <div>
          <h3>${business.name}</h3>
          <p>${business.address}</p>
          <p>${business.phone}</p>
          <a href="${business.website}" target="_blank" rel="noopener noreferrer">Website</a>
        </div>
      `)
      .openOn(map);

    popupRef.current = popup;
  }, [map, business, onMarkerClick]);

  useEffect(() => {
    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
      }
    };
  }, []);

  return (
    <Marker 
      position={[business.pin.lat, business.pin.lng]}
      icon={customIcon}
      eventHandlers={{ click: handleClick }}
    />
  );
});
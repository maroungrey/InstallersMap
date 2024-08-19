import React, { useState, useEffect, useCallback, memo } from 'react';
import { Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import 'leaflet/dist/leaflet.css';
import '../../Styles/MapComponent.css';

const BusinessMarkers = memo(({ setMapRef, businesses, onMarkerClick }) => {
  const map = useMap();
  const [activePopup, setActivePopup] = useState(null);

  useEffect(() => {
    if (map) {
      setMapRef(map); // Ensure setMapRef doesn't trigger a re-render that causes this effect to run again
      map.invalidateSize(); // Only run this if necessary
    }
  }, [map, setMapRef]); // Dependencies should be stable and not cause re-renders

  const customIcon = new Icon({
    iconUrl: require("../Assets/pin.png"),
    iconSize: [38, 38],
  });

  const handleMouseOver = useCallback((e, index) => {
    e.target.openPopup();
    setActivePopup(index);
  }, []);

  const handleMouseOut = useCallback((e, index) => {
    if (activePopup === index) {
      e.target.closePopup();
      setActivePopup(null);
    }
  }, [activePopup]);

  const handleMarkerClick = useCallback((index) => {
    onMarkerClick(index);
  }, [onMarkerClick]);

  return (
    <>
      {businesses.map((business, index) => (
        <Marker 
          key={index} 
          position={business.geocode} 
          icon={customIcon}
          eventHandlers={{
            mouseover: (e) => handleMouseOver(e, index),
            mouseout: (e) => handleMouseOut(e, index),
            click: () => handleMarkerClick(index),
          }}
        >
          <Popup>{business.name}</Popup>
        </Marker>
      ))}
    </>
  );
});

export default BusinessMarkers;

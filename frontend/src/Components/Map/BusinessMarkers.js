import React, { useState, useCallback, memo } from 'react';
import { Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import 'leaflet/dist/leaflet.css';
import '../../Styles/MapComponent.css';

const BusinessMarkers = memo(({ businesses }) => {
  const map = useMap();
  const [activePopup, setActivePopup] = useState(null);

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

  const handleMarkerClick = useCallback((business) => {
    map.flyTo(business.geocode, 15, {
      animate: true,
      duration: 1
    });
  }, [map]);

  return (
    <>
      {businesses.map((business, index) => (
        <Marker 
          key={business.id || index} 
          position={business.geocode} 
          icon={customIcon}
          eventHandlers={{
            mouseover: (e) => handleMouseOver(e, index),
            mouseout: (e) => handleMouseOut(e, index),
            click: () => handleMarkerClick(business),
          }}
        >
          <Popup>{business.name}</Popup>
        </Marker>
      ))}
    </>
  );
});

export default BusinessMarkers;
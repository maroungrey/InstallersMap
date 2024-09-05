import React, { useMemo, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pinIcon from '../Assets/pin.png';

// Custom Icons
const customIcon = new L.Icon({
  iconUrl: pinIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const createClusterCustomIcon = function (cluster) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: 'custom-marker-cluster',
    iconSize: [50, 50],
  });
};

// Component: MapController
const MapController = ({ onViewportChanged }) => {
  const map = useMap();

  useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      console.log("Current zoom:", zoom);
      onViewportChanged(center, zoom);
    },
  });

  return null;
};

// Component: BusinessMarker
const BusinessMarker = React.memo(({ business, onMarkerClick }) => {
  return (
    <Marker 
      position={[business.pin.lat, business.pin.lng]}
      icon={customIcon}
      eventHandlers={{ 
        click: () => onMarkerClick(business.id)
      }}
    >
      <Popup>
        <h3>{business.name}</h3>
        <p>{business.address}</p>
        <p>{business.phone}</p>
        <a href={business.website} target="_blank" rel="noopener noreferrer">Website</a>
      </Popup>
    </Marker>
  );
});

// Main Component: BusinessMap
const BusinessMap = ({ 
  businesses, 
  onMarkerClick, 
  center, 
  zoom, 
  mapRef, 
  onViewportChanged 
}) => {
  const markers = useMemo(() => {
    console.log('Creating markers for', businesses.length, 'businesses');
    return businesses.map(business => (
      <BusinessMarker
        key={business.id}
        business={business}
        onMarkerClick={onMarkerClick}
      />
    ));
  }, [businesses, onMarkerClick]);


  useEffect(() => {
    console.log('BusinessMap re-rendered. Businesses:', businesses.length, 'Zoom:', zoom);
  }, [businesses, zoom]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer 
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <MapController onViewportChanged={onViewportChanged} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={120}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
        >
          {markers}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default React.memo(BusinessMap);
import React, { useMemo, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
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

const createClusterIcon = function (count) {
  // Calculate size based on count
  const size = Math.min(80, Math.max(40, 20 + count * 2)); // Min 40px, max 80px
  
  return L.divIcon({
    html: `<div style="width: ${size}px; height: ${size}px; display: flex; justify-content: center; align-items: center; background-color: #1D6BF399; border-radius: 50%; color: white; font-weight: bold;">
             <span>${count}</span>
           </div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(size, size, true),
  });
};

// Component: MapController
const MapController = ({ onViewportChanged, center, zoom, minZoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }, [map, center, zoom]);

  const handleViewportChange = useCallback(() => {
    const center = map.getCenter();
    const zoom = Math.max(map.getZoom(), minZoom);
    const bounds = map.getBounds();
    onViewportChanged(center, zoom, bounds);
  }, [map, onViewportChanged, minZoom]);

  useMapEvents({
    moveend: handleViewportChange,
    zoomend: handleViewportChange,
  });

  return null;
};

const BusinessMarker = React.memo(({ business, onMarkerClick }) => {
  const map = useMap();
  
  const handleClick = () => {
    map.setView([business.pin.lat, business.pin.lng], 15, { animate: true });
    onMarkerClick(business.id, business.pin.lat, business.pin.lng);
  };

  return (
    <Marker 
      position={[business.pin.lat, business.pin.lng]}
      icon={customIcon}
      eventHandlers={{ click: handleClick }}
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

const ClusterMarker = React.memo(({ cluster }) => {
  const map = useMap();
  
  const handleClick = () => {
    map.setView([cluster.lat, cluster.lng], map.getZoom() + 2, { animate: true });
  };

  return (
    <Marker 
      position={[cluster.lat, cluster.lng]}
      icon={createClusterIcon(cluster.count)}
      eventHandlers={{ click: handleClick }}
    >
      <Popup>
        <h3>Cluster</h3>
        <p>{cluster.count} businesses in this area</p>
      </Popup>
    </Marker>
  );
});

const BusinessMap = ({ 
  mapData, 
  onMarkerClick, 
  center, 
  zoom,
  minZoom,
  mapRef, 
  onViewportChanged 
}) => {
  const markers = useMemo(() => {
    console.log('Creating markers for', mapData.length, 'items');
    return mapData.map(item => 
      item.type === 'cluster' 
        ? <ClusterMarker key={`${item.lat}-${item.lng}`} cluster={item} />
        : <BusinessMarker key={item.id} business={item} onMarkerClick={onMarkerClick} />
    );
  }, [mapData, onMarkerClick]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer 
        center={center}
        zoom={zoom}
        minZoom={minZoom}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        zoomControl={false}
      >
        <MapController onViewportChanged={onViewportChanged} center={center} zoom={zoom} minZoom={minZoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {markers}
      </MapContainer>
    </div>
  );
};

export default React.memo(BusinessMap);

// 
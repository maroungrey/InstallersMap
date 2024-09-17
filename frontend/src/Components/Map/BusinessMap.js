import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { BusinessMarker } from './BusinessMarkers';
import { ClusterMarker } from './ClusterMarkers';

// MapController component (modified)
const MapController = ({ onViewportChanged, center, zoom, minZoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 0.5 });
  }, [map, center, zoom]);

  const handleViewportChange = React.useCallback(() => {
    const center = map.getCenter();
    const zoom = Math.max(map.getZoom(), minZoom);
    const bounds = map.getBounds();
    onViewportChanged(center, zoom, bounds);
  }, [map, onViewportChanged, minZoom]);

  useMapEvents({
    moveend: handleViewportChange,
    zoomend: handleViewportChange,
  });

  // Trigger initial viewport change
  useEffect(() => {
    handleViewportChange();
  }, []);

  return null;
};

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
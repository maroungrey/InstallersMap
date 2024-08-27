import React, { useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { divIcon, point } from "leaflet";
import 'leaflet/dist/leaflet.css';
import BusinessMarkers from './BusinessMarkers';

function MapEvents({ onMapLoad }) {
  const map = useMap();
  
  useEffect(() => {
    if (onMapLoad) {
      onMapLoad(map);
    }
  }, [map, onMapLoad]);

  return null;
}


export default function BusinessMap({ mapRef, businesses, onMarkerClick, onMapLoad }) {
  const createCustomClusterIcon = useCallback((cluster) => {
    return new divIcon({
      html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
      className: "custom-marker-cluster",
      iconSize: point(33, 33, true),
    });
  }, []);

  return (
    <MapContainer 
      center={[34.052235, -118.243683]} 
      zoom={10} 
      style={{ height: "100%", width: "100%" }}
      role="region"
      aria-label="Map of businesses"
    >
      <MapEvents onMapLoad={onMapLoad} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createCustomClusterIcon}
      >
      <BusinessMarkers 
        businesses={businesses}
      />
      </MarkerClusterGroup>
    </MapContainer>
  );
}

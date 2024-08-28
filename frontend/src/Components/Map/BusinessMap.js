import React, { useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { divIcon, point } from "leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapController({ onMapLoad }) {
  const map = useMap();
  
  useEffect(() => {
    if (onMapLoad) {
      onMapLoad(map);
    }
  }, [map, onMapLoad]);

  return null;
}

export default function BusinessMap({ businesses, onMarkerClick, onMapLoad }) {
  const createCustomClusterIcon = useCallback((cluster) => {
    return new divIcon({
      html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
      className: "custom-marker-cluster",
      iconSize: point(33, 33, true),
    });
  }, []);

  return (
    <MapContainer 
      center={[39.8283, -98.5795]} // Center of the US
      zoom={4} 
      style={{ height: "100%", width: "100%" }}
      role="region"
      aria-label="Map of businesses"
    >
      <MapController onMapLoad={onMapLoad} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createCustomClusterIcon}
      >
        {businesses.map((business) => {
          if (business.latitude && business.longitude) {
            return (
              <Marker 
                key={business.id} 
                position={[business.latitude, business.longitude]}
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
          }
          console.warn(`Invalid coordinates for business: ${business.id}`);
          return null;
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
import React, { useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { divIcon, point } from "leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pinIcon from '../Assets/pin.png';

// Default icon
const customIcon = new L.Icon({
  iconUrl: pinIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
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

const MAP_CENTER_LAT = process.env.REACT_APP_MAP_CENTER_LAT || 39.8283;
const MAP_CENTER_LNG = process.env.REACT_APP_MAP_CENTER_LNG || -98.5795;
const MAP_INITIAL_ZOOM = process.env.REACT_APP_MAP_INITIAL_ZOOM || 4;

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
      center={[MAP_CENTER_LAT, MAP_CENTER_LNG]} // Center of the US
      zoom={MAP_INITIAL_ZOOM}
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
                  icon={customIcon}  // Use the custom icon
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
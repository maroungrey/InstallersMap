import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, divIcon, point } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

function MapComponent({ setMapRef, businesses }) {
  const map = useMap(); // Access the map instance directly

  useEffect(() => {
    if (map) {
      console.log("Map instance available:", map); // Log the map instance
      setMapRef(map); // Set the map instance in the parent component's ref
      map.invalidateSize(); // Ensure the map resizes correctly
    }
  }, [map, setMapRef]);

  const customIcon = new Icon({
    iconUrl: require("../Assets/pin.png"),
    iconSize: [38, 38]
  });

  return (
    <>
      {businesses.map((business, index) => (
        <Marker 
          key={index} 
          position={business.geocode} 
          icon={customIcon}
        >
          <Popup>{business.name}</Popup>
        </Marker>
      ))}
    </>
  );
}

export default function MapWrapper({ mapRef, businesses }) {
    const createCustomClusterIcon = (cluster) => {
    return new divIcon({
      html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
      className: "custom-marker-cluster",
      iconSize: point(33, 33, true)
    });
  };
  return (
    <MapContainer 
      center={[34.052235, -118.243683]} 
      zoom={10} 
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createCustomClusterIcon}
      >
        <MapComponent setMapRef={(map) => mapRef.current = map} businesses={businesses} />
      </MarkerClusterGroup>
    </MapContainer>
  );
}

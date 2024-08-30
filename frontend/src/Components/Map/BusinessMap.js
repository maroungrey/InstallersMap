import React, { useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { divIcon, point } from "leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaFlag } from 'react-icons/fa';
import pinIcon from '../Assets/pin.png';
import MapUpdateHandler from './MapUpdateHandler';

const customIcon = new L.Icon({
  iconUrl: pinIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const createCustomClusterIcon = (cluster) => {
  return divIcon({
    html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true),
  });
};

export default function BusinessMap({ businesses, onMarkerClick, center, zoom, onBusinessesUpdate, selectedBusiness, onReportIssue }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom, {
        animate: true,
        duration: 0.5, // duration in seconds
      });
    }
  }, [center, zoom]);

  const markers = useMemo(() => {
    return businesses.map((business) => (
      business.latitude && business.longitude ? (
        <Marker 
          key={business.id} 
          position={[business.latitude, business.longitude]}
          icon={customIcon}
          eventHandlers={{
            click: () => {
              onMarkerClick(business.id);
              mapRef.current.setView([business.latitude, business.longitude], 15);
            }
          }}
        >
          <Popup>
            <h3>{business.name}</h3>
            <p>{business.address}</p>
            <p>{business.phone}</p>
            <a href={business.website} target="_blank" rel="noopener noreferrer">Website</a>
            <div 
              className="flag-hover-container mt-2 text-end"
              onClick={(e) => {
                e.stopPropagation();
                onReportIssue(business);
              }}
              style={{ cursor: 'pointer' }}
              aria-label="Report an issue"
            >
              <FaFlag className="flag-hover" size={18} aria-hidden="true" />
            </div>
          </Popup>
        </Marker>
      ) : null
    )).filter(Boolean);
  }, [businesses, onMarkerClick, onReportIssue]);

  return (
    <MapContainer 
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      role="region"
      aria-label="Map of businesses"
      ref={mapRef}
    >
      <MapUpdateHandler businesses={businesses} onBusinessesUpdate={onBusinessesUpdate} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createCustomClusterIcon}
        key={businesses.length}
      >
        {markers}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
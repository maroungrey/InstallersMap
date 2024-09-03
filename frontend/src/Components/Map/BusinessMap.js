import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { divIcon, point } from "leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaFlag } from 'react-icons/fa';
import pinIcon from '../Assets/pin.png';
import MapUpdateHandler from './MapUpdateHandler';

// Constants
const MOBILE_BREAKPOINT = 768;
const MOBILE_ZOOM = 15;
const DESKTOP_ZOOM = 15;

// Custom Icons
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

// Custom Hooks
const useResizeHandler = (mapRef) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    mapRef.current?.invalidateSize();
  }, [mapRef]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return isMobile;
};

const useMapInvalidation = (mapRef, mapInitialized) => {
  const invalidateMapSize = useCallback(() => {
    mapRef.current?.invalidateSize();
  }, [mapRef]);

  useEffect(() => {
    if (mapRef.current && mapInitialized) {
      setTimeout(invalidateMapSize, 100);
    }
  }, [mapInitialized, invalidateMapSize]);

  return invalidateMapSize;
};

// Component: LoadingOverlay
const LoadingOverlay = () => (
  <div className="loading-overlay">
    <div className="loading-content">
      <div className="loading-spinner"></div>
      <p>Loading map...</p>
    </div>
  </div>
);

// Component: MapController
const MapController = ({ selectedBusiness, onPopupToggle, setMapInitialized, setIsLoading, isMobile }) => {
  const map = useMap();
  
  useEffect(() => {
    setMapInitialized(true);
    setIsLoading(false);
    map.invalidateSize();
  }, [map, setMapInitialized, setIsLoading]);

  useEffect(() => {
    if (selectedBusiness?.latitude && selectedBusiness?.longitude) {
      const lat = parseFloat(selectedBusiness.latitude);
      const lng = parseFloat(selectedBusiness.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        const zoomLevel = isMobile ? MOBILE_ZOOM : DESKTOP_ZOOM;
        map.flyTo([lat, lng], zoomLevel, { duration: 0.5 });
      }
    }
  }, [map, selectedBusiness, isMobile]);

  useMapEvents({
    popupopen: (e) => {
      const businessId = e.popup.options.businessId;
      if (businessId) onPopupToggle(businessId);
    },
    popupclose: () => onPopupToggle(null),
  });

  return null;
};

// Component: BusinessMarker
const BusinessMarker = React.memo(({ business, onMarkerClick, onReportIssue, isSelected, openPopupId }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if ((isSelected || business.id === openPopupId) && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isSelected, business.id, openPopupId]);

  const handleReportIssue = useCallback((e) => {
    e.stopPropagation();
    onReportIssue(business);
  }, [business, onReportIssue]);

  return (
    <Marker 
      position={[parseFloat(business.latitude), parseFloat(business.longitude)]}
      icon={customIcon}
      eventHandlers={{ click: () => onMarkerClick(business.id) }}
      ref={markerRef}
    >
      <Popup businessId={business.id}>
        <h3>{business.name}</h3>
        <p>{business.address}</p>
        <p>{business.phone}</p>
        <a href={business.website} target="_blank" rel="noopener noreferrer">Website</a>
        <div 
          className="flag-hover-container mt-2 text-end"
          onClick={handleReportIssue}
          style={{ cursor: 'pointer' }}
          aria-label="Report an issue"
        >
          <FaFlag className="flag-hover" size={18} aria-hidden="true" />
        </div>
      </Popup>
    </Marker>
  );
});

// Main Component: BusinessMap
const BusinessMap = ({ businesses, onMarkerClick, center, zoom, onBusinessesUpdate, selectedBusiness, onReportIssue, onPopupToggle, mapRef, openPopupId }) => {
  const [mapInitialized, setMapInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const isMobile = useResizeHandler(mapRef);
  const invalidateMapSize = useMapInvalidation(mapRef, mapInitialized);

  useEffect(() => {
    if (mapRef.current && mapInitialized && !selectedBusiness) {
      mapRef.current.setView(center, zoom, { animate: true, duration: 0.5 });
    }
  }, [center, zoom, selectedBusiness, mapInitialized]);

  const markers = useMemo(() => 
    businesses.map(business => (
      <BusinessMarker
        key={business.id}
        business={business}
        onMarkerClick={onMarkerClick}
        onReportIssue={onReportIssue}
        isSelected={business.id === selectedBusiness?.id}
        openPopupId={openPopupId}
      />
    )),
    [businesses, onMarkerClick, onReportIssue, selectedBusiness, openPopupId]
  );

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      {isLoading && <LoadingOverlay />}
      <MapContainer 
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        role="region"
        aria-label="Map of businesses"
        ref={mapRef}
        whenCreated={(map) => {
          mapRef.current = map;
          setTimeout(invalidateMapSize, 100);
        }}
      >
        <MapController 
          selectedBusiness={selectedBusiness} 
          onPopupToggle={onPopupToggle}
          setMapInitialized={setMapInitialized}
          setIsLoading={setIsLoading}
          isMobile={isMobile}
        />
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
    </div>
  );
};

export default React.memo(BusinessMap);
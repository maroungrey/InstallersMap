import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
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

const LoadingOverlay = () => (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ marginTop: '10px' }}>Loading map...</p>
    </div>
  </div>
);

export default function BusinessMap({ businesses, onMarkerClick, center, zoom, onBusinessesUpdate, selectedBusiness, onReportIssue, onPopupToggle }) {
  const mapRef = useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const invalidateMapSize = useCallback(() => {
    if (mapRef.current && mapRef.current.invalidateSize) {
      mapRef.current.invalidateSize();
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      invalidateMapSize();
    };

    window.addEventListener('resize', handleResize);

    // Force a resize after a short delay
    const resizeTimer = setTimeout(() => {
      invalidateMapSize();
    }, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [invalidateMapSize]);

  useEffect(() => {
    if (mapRef.current && mapInitialized && !selectedBusiness) {
      mapRef.current.setView(center, zoom, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [center, zoom, selectedBusiness, mapInitialized]);

  function MapController({ selectedBusiness, onPopupToggle }) {
    const map = useMap();
    
    useEffect(() => {
      if (!mapInitialized) {
        setMapInitialized(true);
        setIsLoading(false);
        // Force a resize after the map is initialized
        setTimeout(() => {
          invalidateMapSize();
        }, 100);
      }
    }, [map]);

    useEffect(() => {
      if (selectedBusiness && selectedBusiness.latitude && selectedBusiness.longitude) {
        const lat = parseFloat(selectedBusiness.latitude);
        const lng = parseFloat(selectedBusiness.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          const zoomLevel = isMobile ? 12 : 15;  // Adjust these values as needed
          map.flyTo([lat, lng], zoomLevel, {
            duration: 0.5,
          });
        } else {
          console.warn(`Invalid coordinates for business ${selectedBusiness.id}`);
        }
      }
    }, [map, selectedBusiness, isMobile]);
  
    useMapEvents({
      popupopen: (e) => {
        const businessId = e.popup.options.businessId;
        if (businessId) {
          onPopupToggle(businessId);
        }
      },
      popupclose: () => {
        onPopupToggle(null);
      },
    });
  
    return null;
  }

  const markers = useMemo(() => {
    return businesses.map((business) => {
      const lat = parseFloat(business.latitude);
      const lng = parseFloat(business.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        return (
          <Marker 
            key={business.id} 
            position={[lat, lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => {
                onMarkerClick(business.id);
              }
            }}
          >
            <Popup businessId={business.id}>
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
        );
      }
      return null;
    }).filter(Boolean);
  }, [businesses, onMarkerClick, onReportIssue]);

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
          setTimeout(() => {
            invalidateMapSize();
          }, 100);
        }}
      >
        <MapController selectedBusiness={selectedBusiness} onPopupToggle={onPopupToggle} />
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
}


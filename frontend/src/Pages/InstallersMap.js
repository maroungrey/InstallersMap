import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BusinessMap from '../Components/Map/BusinessMap';
import Sidebar from '../Components/Map/Sidebar';
import useBusinessData from '../Hooks/Map/useBusinessData';

const MAP_CENTER_LAT = process.env.REACT_APP_MAP_CENTER_LAT || 39.8283;
const MAP_CENTER_LNG = process.env.REACT_APP_MAP_CENTER_LNG || -98.5795;
const MAP_INITIAL_ZOOM = process.env.REACT_APP_MAP_INITIAL_ZOOM || 4;

function InstallersMap() {
  const [mapCenter, setMapCenter] = useState([MAP_CENTER_LAT, MAP_CENTER_LNG]);
  const [mapZoom, setMapZoom] = useState(MAP_INITIAL_ZOOM);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);

  const mapRef = useRef(null);

  const { businesses, loading, error, fetchBusinesses } = useBusinessData();

  const handleViewportChanged = useCallback((newCenter, newZoom) => {
    setMapCenter([newCenter.lat, newCenter.lng]);
    setMapZoom(newZoom);
    fetchBusinesses([newCenter.lat, newCenter.lng], newZoom);
  }, [fetchBusinesses]);

  const handleBusinessClick = useCallback((businessId, lat, lng) => {
    setSelectedBusinessId(businessId);
    setMapCenter([lat, lng]);
    setMapZoom(15); // Zoom in when a business is selected
  }, []);

  useEffect(() => {
    fetchBusinesses(mapCenter, mapZoom);
  }, []);

  console.log('Rendering InstallersMap. Businesses:', businesses.length, 'Center:', mapCenter, 'Zoom:', mapZoom);

  return (
    <Container fluid className="p-0" style={{ height: '100vh' }}>
      <Row className="h-100 g-0">
        <Col md={4} className="h-100 overflow-auto">
          <Sidebar 
            businesses={businesses}
            onBusinessClick={handleBusinessClick}
            selectedBusinessId={selectedBusinessId}
          />
        </Col>
        <Col md={8} className="h-100">
          <BusinessMap 
            businesses={businesses}
            onMarkerClick={handleBusinessClick}
            center={mapCenter}
            zoom={mapZoom}
            mapRef={mapRef}
            onViewportChanged={handleViewportChanged}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default InstallersMap;
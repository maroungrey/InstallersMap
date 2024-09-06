import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BusinessMap from '../Components/Map/BusinessMap';
import Sidebar from '../Components/Map/Sidebar';
import TableSelector from '../Components/Map/TableSelector';
import useBusinessData from '../Hooks/Map/useBusinessData';

const MAP_CENTER_LAT = process.env.REACT_APP_MAP_CENTER_LAT || 39.8283;
const MAP_CENTER_LNG = process.env.REACT_APP_MAP_CENTER_LNG || -98.5795;
const MAP_INITIAL_ZOOM = 5;
const MAP_MIN_ZOOM = 5;

function InstallersMap() {
  const [mapCenter, setMapCenter] = useState([MAP_CENTER_LAT, MAP_CENTER_LNG]);
  const [mapZoom, setMapZoom] = useState(MAP_INITIAL_ZOOM);
  const [mapBounds, setMapBounds] = useState(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [currentTable, setCurrentTable] = useState('golf-cart');

  const mapRef = useRef(null);

  const { sidebarBusinesses, mapData, loading, error, fetchSidebarBusinesses, fetchMapData } = useBusinessData();

  const handleViewportChanged = useCallback((newCenter, newZoom, newBounds) => {
    setMapCenter([newCenter.lat, newCenter.lng]);
    setMapZoom(Math.max(newZoom, MAP_MIN_ZOOM));
    setMapBounds(newBounds);
    fetchMapData(newBounds, newZoom, currentTable);
    fetchSidebarBusinesses([newCenter.lat, newCenter.lng], newZoom, currentTable, 50);
  }, [fetchMapData, fetchSidebarBusinesses, currentTable]);

  const handleBusinessClick = useCallback((businessId, lat, lng) => {
    setSelectedBusinessId(businessId);
    setMapCenter([lat, lng]);
    setMapZoom(15);
  }, []);

  const handleTableChange = useCallback((newTable) => {
    setCurrentTable(newTable);
    if (mapBounds) {
      fetchMapData(mapBounds, mapZoom, newTable);
      fetchSidebarBusinesses(mapCenter, mapZoom, newTable, 50); // Added zoom, increased limit
    }
  }, [fetchMapData, fetchSidebarBusinesses, mapBounds, mapZoom, mapCenter]);

  useEffect(() => {
    if (mapRef.current && mapRef.current.leafletElement) {
      const map = mapRef.current.leafletElement;
      const center = map.getCenter();
      const zoom = Math.max(map.getZoom(), MAP_MIN_ZOOM);
      const bounds = map.getBounds();
      setMapBounds(bounds);
      fetchMapData(bounds, zoom, currentTable);
      fetchSidebarBusinesses([center.lat, center.lng], zoom, currentTable, 50);
    }
  }, [mapRef, fetchMapData, fetchSidebarBusinesses, currentTable]);

  return (
    <Container fluid className="p-0" style={{ height: '50vh' }}>
      <Row className="h-100 g-0">
        <Col md={4} className="h-100 overflow-auto">
          <TableSelector 
            currentTable={currentTable}
            onTableChange={handleTableChange}
          />
          <Sidebar 
            businesses={sidebarBusinesses}
            onBusinessClick={handleBusinessClick}
            selectedBusinessId={selectedBusinessId}
          />
        </Col>
        <Col md={8} className="h-100">
          <BusinessMap 
            mapData={mapData}
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
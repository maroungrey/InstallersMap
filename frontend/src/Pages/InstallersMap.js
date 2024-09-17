import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BusinessMap from '../Components/Map/BusinessMap';
import Sidebar from '../Components/Map/Sidebar';
import TableSelector from '../Components/Map/TableSelector';
import useBusinessData from '../Hooks/Map/useBusinessData';
import SearchBar from '../Components/Map/SearchBar';

const MAP_CENTER_LAT = process.env.REACT_APP_MAP_CENTER_LAT || 39.8283;
const MAP_CENTER_LNG = process.env.REACT_APP_MAP_CENTER_LNG || -98.5795;
const MAP_INITIAL_ZOOM = 5;
const MAP_MIN_ZOOM = 3;

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
    setMapZoom(newZoom);
    setMapBounds(newBounds);
    fetchMapData(newBounds, newZoom, currentTable);
    fetchSidebarBusinesses([newCenter.lat, newCenter.lng], newZoom, currentTable, 50);
  }, [fetchMapData, fetchSidebarBusinesses, currentTable]);

  const handleBusinessClick = useCallback((businessId, lat, lng) => {
    setSelectedBusinessId(businessId);
    setMapCenter([lat, lng]);
    setMapZoom(15);
    if (mapRef.current && mapRef.current.setView) {
      mapRef.current.setView([lat, lng], 15, { animate: true, duration: 1 });
    }
  }, []);


  const handleTableChange = useCallback((newTable) => {
    setCurrentTable(newTable);
    if (mapBounds) {
      fetchMapData(mapBounds, mapZoom, newTable);
      fetchSidebarBusinesses(mapCenter, mapZoom, newTable, 50);
    }
  }, [fetchMapData, fetchSidebarBusinesses, mapBounds, mapZoom, mapCenter]);

  useEffect(() => {
    // Initial data fetch
    // Initial data fetch
    const initialBounds = {
      _southWest: { lat: MAP_CENTER_LAT - 10, lng: MAP_CENTER_LNG - 20 },
      _northEast: { lat: MAP_CENTER_LAT + 10, lng: MAP_CENTER_LNG + 20 },
      getSouthWest: function() { return this._southWest; },
      getNorthEast: function() { return this._northEast; }
    };
    fetchMapData(initialBounds, MAP_INITIAL_ZOOM, currentTable);
    fetchSidebarBusinesses([MAP_CENTER_LAT, MAP_CENTER_LNG], MAP_INITIAL_ZOOM, currentTable, 50);
  }, [fetchMapData, fetchSidebarBusinesses, currentTable]);

  const handleSearchComplete = useCallback((lat, lng) => {
    setMapCenter([lat, lng]);
    setMapZoom(15);
    if (mapRef.current && mapRef.current.leafletElement) {
      mapRef.current.leafletElement.flyTo([lat, lng], 15);
    }
  }, []);

  return (
    <Container fluid className="p-0" style={{ height: '50vh' }}>
      <Row className="g-0">
        <Col md={4}>
          <SearchBar onSearchComplete={handleSearchComplete} />
        </Col>
        <Col md={8}>
          <TableSelector 
            currentTable={currentTable}
            onTableChange={handleTableChange}
          />
        </Col>
      </Row>
      <Row className="h-100 g-0">
        <Col md={4} className="h-100 overflow-auto">
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
            minZoom={MAP_MIN_ZOOM}
            mapRef={mapRef}
            onViewportChanged={handleViewportChanged}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default InstallersMap;
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import BusinessMap from '../Components/Map/BusinessMap';
import Sidebar from '../Components/Map/Sidebar';
import TableSelector from '../Components/Map/TableSelector';
import useBusinessData from '../Hooks/Map/useBusinessData';
import SearchBar from '../Components/Map/SearchBar';
import SuggestBusinessForm from '../Components/Map/SuggestBusinessForm';

const MAP_CENTER_LAT = Number(process.env.REACT_APP_MAP_CENTER_LAT) || 39.8283;
const MAP_CENTER_LNG = Number(process.env.REACT_APP_MAP_CENTER_LNG) || -98.5795;
const MAP_INITIAL_ZOOM = Number(process.env.REACT_APP_MAP_INITIAL_ZOOM) || 5;
const MAP_MIN_ZOOM = Number(process.env.REACT_APP_MAP_MIN_ZOOM) || 3;
const DEFAULT_TABLE = process.env.REACT_APP_DEFAULT_TABLE || 'golf-cart';
const SIDEBAR_BUSINESS_LIMIT = Number(process.env.REACT_APP_SIDEBAR_BUSINESS_LIMIT) || 50;
const MAP_BOUNDS_LAT_OFFSET = Number(process.env.REACT_APP_MAP_BOUNDS_LAT_OFFSET) || 10;
const MAP_BOUNDS_LNG_OFFSET = Number(process.env.REACT_APP_MAP_BOUNDS_LNG_OFFSET) || 20;
const BUSINESS_CLICK_ZOOM = Number(process.env.REACT_APP_BUSINESS_CLICK_ZOOM) || 15;

// Custom hook for managing tabs
const useTabs = () => {
  const [activeTab, setActiveTab] = useState('map');
  const handleTabChange = (tab) => setActiveTab(tab);
  return { activeTab, handleTabChange };
};

function InstallersMap() {
  const [mapCenter, setMapCenter] = useState([MAP_CENTER_LAT, MAP_CENTER_LNG]);
  const [mapZoom, setMapZoom] = useState(MAP_INITIAL_ZOOM);
  const [mapBounds, setMapBounds] = useState(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [currentTable, setCurrentTable] = useState(DEFAULT_TABLE);
  const { activeTab, handleTabChange } = useTabs();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSuggestForm, setShowSuggestForm] = useState(false);

  const mapRef = useRef(null);

  const { sidebarBusinesses, mapData, loading, error, fetchSidebarBusinesses, fetchMapData } = useBusinessData();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleViewportChanged = useCallback((newCenter, newZoom, newBounds) => {
    setMapCenter([newCenter.lat, newCenter.lng]);
    setMapZoom(newZoom);
    setMapBounds(newBounds);
    fetchMapData(newBounds, newZoom, currentTable).catch(console.error);
    fetchSidebarBusinesses([newCenter.lat, newCenter.lng], newZoom, currentTable, SIDEBAR_BUSINESS_LIMIT).catch(console.error);
  }, [fetchMapData, fetchSidebarBusinesses, currentTable]);

  const handleBusinessClick = useCallback((businessId, lat, lng) => {
    setSelectedBusinessId(businessId);
    setMapCenter([lat, lng]);
    setMapZoom(BUSINESS_CLICK_ZOOM);
    if (mapRef.current && mapRef.current.setView) {
      mapRef.current.setView([lat, lng], BUSINESS_CLICK_ZOOM, { animate: true, duration: 1 });
    }
    if (isMobile) {
      handleTabChange('map');
    }
  }, [handleTabChange, isMobile]);

  const handleTableChange = useCallback((newTable) => {
    setCurrentTable(newTable);
    if (mapBounds) {
      fetchMapData(mapBounds, mapZoom, newTable).catch(console.error);
      fetchSidebarBusinesses(mapCenter, mapZoom, newTable, SIDEBAR_BUSINESS_LIMIT).catch(console.error);
    }
  }, [fetchMapData, fetchSidebarBusinesses, mapBounds, mapZoom, mapCenter]);

  useEffect(() => {
    const initialBounds = {
      _southWest: { lat: MAP_CENTER_LAT - MAP_BOUNDS_LAT_OFFSET, lng: MAP_CENTER_LNG - MAP_BOUNDS_LNG_OFFSET },
      _northEast: { lat: MAP_CENTER_LAT + MAP_BOUNDS_LAT_OFFSET, lng: MAP_CENTER_LNG + MAP_BOUNDS_LNG_OFFSET },
      getSouthWest: function() { return this._southWest; },
      getNorthEast: function() { return this._northEast; }
    };
    fetchMapData(initialBounds, MAP_INITIAL_ZOOM, currentTable).catch(console.error);
    fetchSidebarBusinesses([MAP_CENTER_LAT, MAP_CENTER_LNG], MAP_INITIAL_ZOOM, currentTable, SIDEBAR_BUSINESS_LIMIT).catch(console.error);
  }, [fetchMapData, fetchSidebarBusinesses, currentTable]);

  const handleSearchComplete = useCallback((lat, lng) => {
    setMapCenter([lat, lng]);
    setMapZoom(BUSINESS_CLICK_ZOOM);
    if (mapRef.current && mapRef.current.leafletElement) {
      mapRef.current.leafletElement.flyTo([lat, lng], BUSINESS_CLICK_ZOOM);
    }
    if (isMobile) {
      handleTabChange('map');
    }
  }, [handleTabChange, isMobile]);

  const handleSuggestBusinessClick = () => {
    setShowSuggestForm(true);
  };

  const handleCloseSuggestForm = () => {
    setShowSuggestForm(false);
  };

  const handleSubmitSuggestForm = (formData) => {
    console.log('Suggested business data:', formData);
    setShowSuggestForm(false);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const renderContent = () => {
    if (isMobile) {
      return (
        <>
          <Row className="g-0">
            <Col xs={12}>
              <Nav variant="tabs" activeKey={activeTab} onSelect={handleTabChange}>
                <Nav.Item>
                  <Nav.Link eventKey="map">Map</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="list">List</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>
          <Row className="h-100 g-0">
            <Col xs={12} className="h-100">
              {activeTab === 'map' ? (
                <BusinessMap 
                  mapData={mapData}
                  onMarkerClick={handleBusinessClick}
                  center={mapCenter}
                  zoom={mapZoom}
                  minZoom={MAP_MIN_ZOOM}
                  mapRef={mapRef}
                  onViewportChanged={handleViewportChanged}
                />
              ) : (
                loading ? (
                  <div>Loading...</div>
                ) : (
                  <Sidebar 
                    businesses={sidebarBusinesses}
                    onBusinessClick={handleBusinessClick}
                    selectedBusinessId={selectedBusinessId}
                  />
                )
              )}
            </Col>
          </Row>
        </>
      );
    } else {
      return (
        <Row className="h-100 g-0">
          <Col md={4} className="h-100 overflow-auto">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <Sidebar 
                businesses={sidebarBusinesses}
                onBusinessClick={handleBusinessClick}
                selectedBusinessId={selectedBusinessId}
              />
            )}
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
      );
    }
  };

  return (
    <Container fluid className="p-0" style={{ height: '75vh' }}>
      <Row className="g-0 mt-3">
        <Col xs={12} md={4} className="p-2">
          <SearchBar onSearchComplete={handleSearchComplete} />
        </Col>
        <Col xs={12} md={8} className="p-2">
          <TableSelector 
            currentTable={currentTable}
            onTableChange={handleTableChange}
          />
        </Col>
      </Row>
      {renderContent()}
      <Row className="g-0">
        <Col xs={4}>
          <Button 
            onClick={handleSuggestBusinessClick} 
            variant="primary" 
            className="w-100 my-3"
          >
            Suggest Business
          </Button>
        </Col>
      </Row>
      <SuggestBusinessForm 
        show={showSuggestForm} 
        onClose={handleCloseSuggestForm}
        onSubmit={handleSubmitSuggestForm}
      />
    </Container>
  );
}

export default InstallersMap;
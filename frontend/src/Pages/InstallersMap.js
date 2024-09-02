import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Container, Row, Col, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';
import BusinessMap from '../Components/Map/BusinessMap';
import Sidebar from '../Components/Map/Sidebar';
import TableSelector from '../Components/Map/TableSelector';
import SearchBar from '../Components/Map/SearchBar';
import useTableData from '../Hooks/Map/useTableData';
import useBusinessData from '../Hooks/Map/useBusinessData';
import useBusinessSelection from '../Hooks/Map/useBusinessSelection';
import ReportForm from '../Components/Map/ReportForm';
import '../Styles/CustomStyles.css';

// Constants
const MAP_CENTER_LAT = process.env.REACT_APP_MAP_CENTER_LAT || 39.8283;
const MAP_CENTER_LNG = process.env.REACT_APP_MAP_CENTER_LNG || -98.5795;
const MAP_INITIAL_ZOOM = process.env.REACT_APP_MAP_INITIAL_ZOOM || 4;
const ZOOM_LEVEL = 10;
const MOBILE_BREAKPOINT = 768;

// Helper Components
const LoadingSpinner = () => (
  <Spinner animation="border" role="status">
    <span className="visually-hidden">Loading...</span>
  </Spinner>
);

const ErrorAlert = ({ message }) => (
  <Alert variant="danger">Error: {message}</Alert>
);

// Main Component
function InstallersMap() {
  // Custom Hooks
  const { tables, selectedTable, handleTableSelect, tableError } = useTableData();
  const { businesses, loading, error: businessError } = useBusinessData(selectedTable);
  const { selectedBusinessId, handleBusinessClick, handleMarkerClick } = useBusinessSelection(businesses);

  // State
  const [mapCenter, setMapCenter] = useState([MAP_CENTER_LAT, MAP_CENTER_LNG]);
  const [mapZoom, setMapZoom] = useState(MAP_INITIAL_ZOOM);
  const [businessesWithDistances, setBusinessesWithDistances] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportingBusiness, setReportingBusiness] = useState(null);
  const [openPopupId, setOpenPopupId] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);
  const [mapKey, setMapKey] = useState(0);
  

  // Refs
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  // Derived State
  const error = tableError || businessError;
  const sortedBusinesses = useMemo(() => {
    return [...businessesWithDistances].sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
  }, [businessesWithDistances]);

  // Effects
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapContainerRef.current.style.height = isMobile ? '70vh' : '100%';
    }
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
  }, [isMobile, activeTab]);

  // Callbacks
  const handleSearch = useCallback(async (query) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setMapZoom(ZOOM_LEVEL);
      }
    } catch (error) {
      console.error('Error during geocoding:', error);
    }
  }, []);

  const handleBusinessSelection = useCallback((businessId) => {
    handleBusinessClick(businessId);
    const selectedBusiness = businesses.find(b => b.id === businessId);
    if (selectedBusiness) {
      const lat = parseFloat(selectedBusiness.latitude);
      const lng = parseFloat(selectedBusiness.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter([lat, lng]);
        setMapZoom(ZOOM_LEVEL);
        setOpenPopupId(businessId);
        if (isMobile) {
          setActiveTab('map');
          setMapKey(prevKey => prevKey + 1);
        }
      } else {
        console.warn(`Invalid coordinates for business ${businessId}`);
        alert("This business doesn't have valid location data.");
      }
    }
  }, [businesses, handleBusinessClick, isMobile]);


  const handleMapMarkerClick = useCallback((businessId) => {
    handleMarkerClick(businessId);
    const selected = businesses.find(b => b.id === businessId);
    if (selected) {
      const lat = parseFloat(selected.latitude);
      const lng = parseFloat(selected.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter([lat, lng]);
        setMapZoom(ZOOM_LEVEL);
      } else {
        console.warn(`Invalid coordinates for business ${businessId}`);
      }
    }
  }, [businesses, handleMarkerClick]);

  const handleReportIssue = useCallback((business) => {
    setReportingBusiness(business);
    setShowReportForm(true);
  }, []);

  const handleCloseReportForm = useCallback(() => {
    setShowReportForm(false);
    setReportingBusiness(null);
  }, []);

  const handlePopupToggle = useCallback((businessId) => {
    setOpenPopupId(businessId);
  }, []);

  // Render Helpers
  const renderMobileContent = () => (
    <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
      <Tab eventKey="list" title="List">
        <div style={{ height: '75vh', overflowY: 'auto' }}>
          <Sidebar 
            businesses={sortedBusinesses}
            onBusinessClick={handleBusinessSelection}
            selectedBusinessId={selectedBusinessId}
            onReportIssue={handleReportIssue}
            openPopupId={openPopupId}
          />
        </div>
      </Tab>
      <Tab eventKey="map" title="Map">
        <div ref={mapContainerRef} style={{ width: '100%', height: '70vh' }}>
          <BusinessMap
            key={mapKey}
            businesses={businesses}
            onMarkerClick={handleMapMarkerClick}
            center={mapCenter}
            zoom={mapZoom}
            onBusinessesUpdate={setBusinessesWithDistances}
            selectedBusiness={businesses.find(b => b.id === selectedBusinessId)}
            onReportIssue={handleReportIssue}
            onPopupToggle={handlePopupToggle}
            mapRef={mapRef}
            isMobile={isMobile}
          />
        </div>
      </Tab>
    </Tabs>
  );

  const renderDesktopContent = () => (
    <Row className="h-100">
      <Col md={4} className="border-end h-100 overflow-auto">
        <Sidebar 
          businesses={sortedBusinesses}
          onBusinessClick={handleBusinessSelection}
          selectedBusinessId={selectedBusinessId}
          onReportIssue={handleReportIssue}
          openPopupId={openPopupId}
        />
      </Col>
      <Col md={8} className="h-100">
        <div ref={mapContainerRef} style={{ width: '100%', height: '70vh' }}>
          <BusinessMap
            businesses={businesses}
            onMarkerClick={handleMapMarkerClick}
            center={mapCenter}
            zoom={mapZoom}
            onBusinessesUpdate={setBusinessesWithDistances}
            selectedBusiness={businesses.find(b => b.id === selectedBusinessId)}
            onReportIssue={handleReportIssue}
            onPopupToggle={handlePopupToggle}
            mapRef={mapRef}
          />
        </div>
      </Col>
    </Row>
  );

  // Main Render
  return (
    <Container fluid className="p-3" style={{ height: '70vh' }}>
      {error && <ErrorAlert message={error} />}
      <Row className="mb-3">
        <Col xs={12} md={4} className="mb-2 mb-md-0">
          <SearchBar onSearch={handleSearch} />
        </Col>
        <Col xs={12} md={8}>
          <TableSelector
            tables={tables}
            selectedTable={selectedTable}
            onTableSelect={handleTableSelect}
          />
        </Col>
      </Row>
      {loading ? <LoadingSpinner /> : (isMobile ? renderMobileContent() : renderDesktopContent())}
      <ReportForm
        show={showReportForm}
        onHide={handleCloseReportForm}
        business={reportingBusiness}
      />
    </Container>
  );
}

export default InstallersMap;
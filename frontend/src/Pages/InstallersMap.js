import React, { useState, useCallback, useMemo } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import BusinessMap from '../Components/Map/BusinessMap';
import Sidebar from '../Components/Map/Sidebar';
import TableSelector from '../Components/Map/TableSelector';
import SearchBar from '../Components/Map/SearchBar';
import useTableData from '../Hooks/Map/useTableData';
import useBusinessData from '../Hooks/Map/useBusinessData';
import useBusinessSelection from '../Hooks/Map/useBusinessSelection';
import '../Styles/CustomStyles.css'

const MAP_CENTER_LAT = process.env.REACT_APP_MAP_CENTER_LAT || 39.8283;
const MAP_CENTER_LNG = process.env.REACT_APP_MAP_CENTER_LNG || -98.5795;
const MAP_INITIAL_ZOOM = process.env.REACT_APP_MAP_INITIAL_ZOOM || 4;
const ZOOM_LEVEL = 15;

function InstallersMap() {
  const { tables, selectedTable, handleTableSelect, tableError } = useTableData();
  const { businesses, loading, error: businessError } = useBusinessData(selectedTable);
  const { selectedBusinessId, handleBusinessClick, handleMarkerClick } = useBusinessSelection(businesses);
  const [mapCenter, setMapCenter] = useState([MAP_CENTER_LAT, MAP_CENTER_LNG]);
  const [mapZoom, setMapZoom] = useState(MAP_INITIAL_ZOOM);
  const [businessesWithDistances, setBusinessesWithDistances] = useState([]);

  const error = tableError || businessError;

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

  const handleBusinessSelection = useCallback((businessId, lat, lng) => {
    handleBusinessClick(businessId);
    if (lat && lng) {
      setMapCenter([lat, lng]);
      setMapZoom(ZOOM_LEVEL);
    }
  }, [handleBusinessClick]);

  const handleMapMarkerClick = useCallback((businessId) => {
    handleMarkerClick(businessId);
    const selected = businesses.find(b => b.id === businessId);
    if (selected && selected.latitude && selected.longitude) {
      setMapCenter([selected.latitude, selected.longitude]);
      setMapZoom(ZOOM_LEVEL);
    }
  }, [businesses, handleMarkerClick]);

  const sortedBusinesses = useMemo(() => {
    return [...businessesWithDistances].sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
  }, [businessesWithDistances]);

  return (
    <Container fluid className="p-3" style={{ height: '100vh' }}>
      {error && <Alert variant="danger">Error: {error}</Alert>}
      <Row className="mb-3">
        <Col>
          <SearchBar onSearch={handleSearch} />
        </Col>
      </Row>
      <Row className="h-75">
        <Col md={4} className="border-end h-100">
          {loading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <Sidebar 
              businesses={sortedBusinesses}
              onBusinessClick={handleBusinessSelection}
              selectedBusinessId={selectedBusinessId} // Pass the selected business ID
            />
          )}
        </Col>
        <Col md={8} className="h-100">
          {businesses.length > 0 && (
            <BusinessMap
              businesses={businesses}
              onMarkerClick={handleMapMarkerClick}
              center={mapCenter}
              zoom={mapZoom}
              onBusinessesUpdate={setBusinessesWithDistances}
              selectedBusiness={businesses.find(b => b.id === selectedBusinessId)}
            />
          )}
        </Col>
      </Row>
      <Row className="my-3">
        <Col>
          <TableSelector
            tables={tables}
            selectedTable={selectedTable}
            onTableSelect={handleTableSelect}
          />
        </Col>
      </Row>
    </Container>
  );
}


export default InstallersMap;
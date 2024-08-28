import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Alert, Spinner, Button, ButtonGroup } from 'react-bootstrap';
import BusinessMap from '../Components/Map/BusinessMap';
import Sidebar from '../Components/Map/Sidebar/Sidebar';

function InstallersMap() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBusinessIndex, setSelectedBusinessIndex] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('golf-cart');

  const fetchTables = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8081/installers/tables');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTables(data);
      if (data.length > 0 && !data.includes(selectedTable)) {
        setSelectedTable(data[0]);
      }
    } catch (err) {
      console.error('Error fetching tables:', err);
      setError('Failed to fetch available tables');
    }
  }, [selectedTable]);

  const fetchBusinesses = useCallback(async (table) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/installers?table=${table}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const processedData = Array.isArray(data) ? data : [data];
      const businessesWithCoordinates = processedData.map(business => ({
        ...business,
        latitude: business.pin?.lat,
        longitude: business.pin?.lng
      }));
      console.log('Processed businesses:', businessesWithCoordinates);
      setBusinesses(businessesWithCoordinates);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  useEffect(() => {
    if (selectedTable) {
      fetchBusinesses(selectedTable);
    }
  }, [fetchBusinesses, selectedTable]);

  const handleBusinessClick = useCallback((index) => {
    setSelectedBusinessIndex(index);
  }, []);

  const handleMarkerClick = useCallback((businessId) => {
    const index = businesses.findIndex(b => b.id === businessId);
    setSelectedBusinessIndex(index);
  }, [businesses]);

  const handleTableSelect = useCallback((table) => {
    setSelectedTable(table);
    setSelectedBusinessIndex(null);
  }, []);

  return (
    <Container fluid className="p-3" style={{ height: '100vh' }}>
      {error && <Alert variant="danger">Error: {error}</Alert>}
      <Row className="mb-3">
        <Col>
          <ButtonGroup>
            {tables.map(table => (
              <Button
                key={table}
                variant={selectedTable === table ? 'primary' : 'outline-primary'}
                onClick={() => handleTableSelect(table)}
              >
                {table}
              </Button>
            ))}
          </ButtonGroup>
        </Col>
      </Row>
      <Row className="h-75">
        <Col md={4} className="border-end">
          {loading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <Sidebar 
              businesses={businesses}
              onBusinessClick={handleBusinessClick}
              selectedBusinessIndex={selectedBusinessIndex}
            />
          )}
        </Col>
        <Col md={8} className="h-100">
          {businesses.length > 0 && (
            <BusinessMap
              businesses={businesses}
              onMarkerClick={handleMarkerClick}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default InstallersMap;
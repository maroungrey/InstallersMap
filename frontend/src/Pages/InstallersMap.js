import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BusinessMap from '../Components/Map/BusinessMap';
import Sidebar from '../Components/Map/Sidebar/Sidebar';

function InstallersMap() {
  const [businesses, setBusinesses] = useState([]);
  const mapRef = useRef(null);
  const [selectedBusinessIndex, setSelectedBusinessIndex] = useState(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch('http://localhost:8081/installers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const transformedData = data.map(business => ({
          ...business,
          geocode: [business.latitude, business.longitude],
        }));
        setBusinesses(transformedData);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchBusinesses();
  }, []);

  const handleBusinessClick = useCallback((geocode) => {
    if (mapRef.current) {
      mapRef.current.flyTo(geocode, 13, {
        animate: true,
        duration: 1.3,
        easeLinearity: 0.5,
      });
    }
  }, []);

  const handleMarkerClick = useCallback((index) => {
    setSelectedBusinessIndex(index);
  }, []);

  const memoizedBusinesses = useMemo(() => businesses, [businesses]);

  return (
    <Container fluid className="p-3" style={{ height: '50vh' }}>
      <Row className="h-100">
        <Col md={4} className="border-end">
          <Sidebar 
            businesses={memoizedBusinesses} 
            onBusinessClick={handleBusinessClick} 
            selectedBusinessIndex={selectedBusinessIndex}
          />
        </Col>
        <Col md={8} className="h-100">
          <BusinessMap
            mapRef={mapRef} 
            businesses={memoizedBusinesses} 
            onMarkerClick={handleMarkerClick}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default InstallersMap;

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BusinessMap from '../Components/Map/BusinessMap';
import Sidebar from '../Components/Map/Sidebar/Sidebar';

function InstallersMap() {
  const [businesses, setBusinesses] = useState([]);
  const mapRef = useRef(null);
  const [selectedBusinessIndex, setSelectedBusinessIndex] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 34.052235, lng: -118.243683 });

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

  const handleMapLoad = useCallback((map) => {
    mapRef.current = map;
    const updateCenter = () => {
      const center = map.getCenter();
      setMapCenter({ lat: center.lat, lng: center.lng });
      console.log('Map center updated:', { lat: center.lat, lng: center.lng });
    };
    map.on('moveend', updateCenter);
    updateCenter(); // Set initial center
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

  const handleCoordinatesUpdate = useCallback((latitude, longitude, country) => {
    console.log('Updating coordinates:', { latitude, longitude, country });
    
    if (mapRef.current && latitude && longitude) {
      mapRef.current.flyTo([latitude, longitude], 13, {
        animate: true,
        duration: 1.3,
        easeLinearity: 0.5,
      });
      setMapError(null);
    } else {
      setMapError("Invalid coordinates received. Please try a different search.");
      console.error('Invalid coordinates or map reference not available:', { latitude, longitude, mapRef: !!mapRef.current });
    }
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
            onCoordinatesUpdate={handleCoordinatesUpdate}
            mapCenter={mapCenter}
          />
        </Col>
        <Col md={8} className="h-100">
          <BusinessMap
            mapRef={mapRef} 
            businesses={memoizedBusinesses} 
            onMarkerClick={handleMarkerClick}
            onMapLoad={handleMapLoad}
          />
        </Col>
      </Row>
      <Row>
  <Col>
  <br></br><br></br>
    <h5>Upcoming updates:</h5>
    <ul>
      <li>Server-side optimization (server-side filtering, sorting, virtualized list / progressive loading, debounce map center update)</li>
      <li>Search clears itself after executing</li>
      <li>Add star businesses and rank them higher</li>
      <li>Add category filters and DB entries for them (marine, solar, industrial, etc.)</li>
      <li>Make the page mobile-friendly</li>
      <li>Automatically detect users' location and set map center to it</li>
      <li>Make "Report the business" form functional</li>
    </ul>
  </Col>
</Row>

    </Container>
  );
}

export default InstallersMap;

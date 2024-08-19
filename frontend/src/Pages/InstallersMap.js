import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MapWrapper from '../Components/Map/MapWrapper';
import Sidebar from '../Components/Map/Sidebar';

function InstallersMap() {
  const [businesses, setBusinesses] = useState([]);
  const mapRef = useRef(null); // Reference to the map instance
  const [selectedBusinessIndex, setSelectedBusinessIndex] = useState(null); // Track the selected business

  useEffect(() => {
    // Fetch data from the API
    fetch('http://localhost:8081/installers')
      .then(response => response.json())
      .then(data => {
        // Transform the data to include geocode as an array
        const transformedData = data.map(business => ({
          ...business,
          geocode: [business.latitude, business.longitude],
        }));
        setBusinesses(transformedData);
      })
      .catch(error => {
        console.error('Error fetching businesses:', error);
      });
  }, []); // Empty dependency array means this effect runs once on mount



  const handleBusinessClick = (geocode) => {
    // console.log("Current mapRef:", mapRef.current); // Log the current state of mapRef
    if (mapRef.current) {
      // console.log("Zooming to:", geocode); // Log the zoom action
      mapRef.current.flyTo(geocode, 15, { animate: true }); // Zoom to the selected business location
    } else {
      console.error("Map reference is not available.");
    }
  };

  const handleMarkerClick = (index) => {
    setSelectedBusinessIndex(index); // Update the selected business index
  };

  return (
    <Container fluid className="p-3" style={{ height: '50vh' }}>
      <Row className="h-100">
        <Col md={4} className="border-end">
        <Sidebar 
            businesses={businesses} 
            onBusinessClick={handleBusinessClick} 
            selectedBusinessIndex={selectedBusinessIndex} // Pass selected index to Sidebar
        />
        </Col>
        <Col md={8} className="h-100">
        <MapWrapper 
            mapRef={mapRef} 
            businesses={businesses} 
            onMarkerClick={handleMarkerClick} // Pass marker click handler to MapWrapper
          />
        </Col>
      </Row>
    </Container>
  );
}

export default InstallersMap;

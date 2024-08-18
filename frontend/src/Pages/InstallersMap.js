import React, { useState, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MapWrapper from '../Components/Map/MapWrapper';
import Sidebar from '../Components/Map/Sidebar';

function InstallersMap() {
  const [businesses, setBusinesses] = useState([
    { 
      name: 'E3 Vehicles', 
      phone: '123-456-7890', 
      email: 'e3vehicles@example.com', 
      address: '123 Main St', 
      geocode: [33.854920, -118.392130] 
    },
    { 
      name: 'Canyon Lake Mobile golf cart repair', 
      phone: '987-654-3210', 
      email: 'canyonlake@example.com', 
      address: '456 Elm St', 
      geocode: [33.671450, -117.253280] 
    },
    { 
      name: 'Apex Golf Carts', 
      phone: '543-210-9876', 
      email: 'apex@example.com', 
      address: '789 Oak St', 
      geocode: [33.624600, -117.726420] 
    },
  ]);

  const mapRef = useRef(null); // Reference to the map instance
  const [selectedBusinessIndex, setSelectedBusinessIndex] = useState(null); // Track the selected business

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

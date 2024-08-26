import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BusinessMap from '../Components/Map/BusinessMap';
import Sidebar from '../Components/Map/Sidebar/Sidebar';
import { useBusinesses } from '../Hooks/useBusinesses';
import { useMap } from '../Hooks/useMap';
import UpcomingUpdates from '../Components/Map/UpcomingUpdates';

function InstallersMap() {
  const { businesses, memoizedBusinesses } = useBusinesses();
  const { 
    mapRef, 
    mapCenter, 
    selectedBusinessIndex, 
    mapError,
    handleMapLoad, 
    handleBusinessClick, 
    handleMarkerClick, 
    handleCoordinatesUpdate 
  } = useMap();

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
      <UpcomingUpdates />
    </Container>
  );
}

export default InstallersMap;
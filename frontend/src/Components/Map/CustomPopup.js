import React, { useEffect } from 'react';
import { Popup } from 'react-leaflet';
import { Card, Button } from 'react-bootstrap';

const CustomPopup = ({ business, onClose }) => {
  useEffect(() => {
    console.log(`CustomPopup mounted for business: ${business.id}`);
    return () => {
      console.log(`CustomPopup unmounted for business: ${business.id}`);
    };
  }, [business.id]);

  return (
    <Popup closeButton={false} onClose={onClose}>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>{business.name || 'Business'}</Card.Title>
          <Card.Text>
            {business.address || 'Address not available'}
            <br />
            {business.phone || 'Phone not available'}
            {business.distance && (
              <>
                <br />
                Distance: {business.distance}
              </>
            )}
          </Card.Text>
          {business.website && (
            <Button 
              variant="primary" 
              href={business.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="me-2"
            >
              Visit Website
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </Card.Body>
      </Card>
    </Popup>
  );
};

export default CustomPopup;
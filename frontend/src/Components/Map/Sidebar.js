import React, { useState } from 'react';
import { InputGroup, Form, ListGroup, Button } from 'react-bootstrap';
import { FaFlag } from 'react-icons/fa';
import './MapComponent.css';

function Sidebar({ businesses, onBusinessClick }) {

  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX + rect.width / 2,
    });
  };

  return (
    <div>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search..."
          aria-label="Enter your zip code"
        />
        <Button variant="outline-secondary">Search</Button>
      </InputGroup>
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <ListGroup variant="flush">
          {businesses.map((business, index) => (
            <ListGroup.Item 
              key={index} 
              className="d-flex justify-content-between align-items-center list-group-item-hover"
              onClick={() => onBusinessClick(business.geocode)} // Trigger zoom on click
              style={{ cursor: 'pointer' }} // Add pointer cursor to indicate clickability
            >
              <div>
                <h5>{business.name}</h5>
                <p>Phone: {business.phone}</p>
                <p>Email: {business.email}</p>
                <p>Address: {business.address}</p>
              </div>
              <div 
                className="flag-hover-container" 
                onMouseEnter={handleMouseEnter}
              >
                <FaFlag className="flag-hover" />
                <span 
                  className="popup-text" 
                  style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }}
                >
                  Report the issue
                </span>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <Button variant="primary" className="mt-3" block>
        Suggest Business
      </Button>
    </div>
  );
}

export default Sidebar;

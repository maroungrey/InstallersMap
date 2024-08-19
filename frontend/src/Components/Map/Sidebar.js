import React, { useRef, useEffect, useState } from 'react';
import { InputGroup, Form, ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaFlag } from 'react-icons/fa';
import ReportIssueForm from './ReportIssueForm';
import './MapComponent.css';

function Sidebar({ businesses, onBusinessClick, selectedBusinessIndex }) {

  const businessRefs = useRef([]); // Array of refs to each business
  const navigate = useNavigate(); // Initialize useNavigate
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    if (selectedBusinessIndex !== null && businessRefs.current[selectedBusinessIndex]) {
      // Scroll to the selected business
      businessRefs.current[selectedBusinessIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedBusinessIndex]);

  const handleNavigate = () => {
    navigate('/contact'); // Navigate to the /contact route
  };

  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX + rect.width / 2,
    });
  };

  const handleFlagClick = (business) => {
    setSelectedBusiness(business);
    setShowReportForm(true);
  };

  const handleCloseReportForm = () => {
    setShowReportForm(false);
    setSelectedBusiness(null);
  };

  return (
    <div>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Enter your zip code"
          aria-label="Enter your zip code"
        />
        <Button variant="outline-secondary">Search</Button>
      </InputGroup>
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <ListGroup variant="flush">
          {businesses.map((business, index) => (
            <ListGroup.Item 
              key={index} 
              className={`d-flex justify-content-between align-items-center list-group-item-hover ${
                selectedBusinessIndex === index ? 'bg-light' : ''
              }`}
              onClick={() => onBusinessClick(business.geocode)} // Trigger zoom on click
              style={{ cursor: 'pointer' }} // Add pointer cursor to indicate clickability
              ref={(el) => (businessRefs.current[index] = el)} // Assign ref to each business
              >
              <div>
                <h5>{business.name}</h5>
                <p>Address: {business.address}</p>
                <p>Phone: {business.phone}</p>
                <p>Website: 
                  <a href={business.website} target="_blank" rel="noopener noreferrer">
                    {business.website.length > 30 ? `${business.website.slice(0, 30)}...` : business.website}
                  </a>
                </p>
              </div>
              <div 
                className="flag-hover-container" 
                onMouseEnter={handleMouseEnter}
                onClick={() => handleFlagClick(business)} 
                style={{ alignSelf: 'flex-end', marginTop: 'auto' }}
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
      <Button 
        variant="primary" 
        className="mt-3" 
        block 
        onClick={handleNavigate} // Handle the click to navigate
      >
        Suggest Business
      </Button>

      <ReportIssueForm 
        show={showReportForm} 
        handleClose={handleCloseReportForm} 
        business={selectedBusiness} 
      />
    </div>
  );
}

export default Sidebar;
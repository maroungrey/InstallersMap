import React, { useCallback, useRef, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { FaFlag } from 'react-icons/fa';
import ReportForm from './ReportForm';

const BusinessItemContent = React.memo(({ business }) => (
  <div className="business-details">
    <h3 className="h5 mb-2 text-dark">{business.name || 'Business'}</h3>
    <p className="mb-1 text-muted">{business.address || 'Address not available'}</p>
    <p className="mb-0 text-muted">
      <span className="visually-hidden">Phone: </span>
      {business.phone || 'Phone not available'}
    </p>
    {business.distance && (
      <p className="mb-0 text-muted">
        Distance: {business.distance}
      </p>
    )}
  </div>
));
BusinessItemContent.displayName = 'BusinessItemContent';

const BusinessItem = React.memo(({ business, onClick, isActive, onReportClick }) => {
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      onClick();
    }
  }, [onClick]);

  const handleReportClick = useCallback((e) => {
    e.stopPropagation(); // Prevent triggering the main item click
    onReportClick(business);
  }, [business, onReportClick]);

  return (
    <ListGroup.Item
      as="div"
      className={`map-sidebar-item p-3 position-relative ${isActive ? 'active' : ''}`}
      aria-selected={isActive}
      role="option"
    >
      <div 
        onClick={onClick}
        onKeyPress={handleKeyPress}
        tabIndex="0"
        role="button"
        aria-label={`Select ${business.name}`}
        className="d-flex justify-content-between"
      >
        <BusinessItemContent business={business} />
        <div 
          className="flag-hover-container ms-2 align-self-start"
          onClick={handleReportClick}
          style={{ cursor: 'pointer' }}
          aria-label="Report an issue"
          role="button"
          tabIndex="0"
        >
          <FaFlag className="flag-hover" aria-hidden="true" />
          <span className="popup-text">Report an issue</span>
        </div>
      </div>
    </ListGroup.Item>
  );
});

BusinessItem.displayName = 'BusinessItem';

const Sidebar = React.memo(({ businesses, onBusinessClick, selectedBusinessId }) => {
  const listRef = useRef(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedBusinessForReport, setSelectedBusinessForReport] = useState(null);

  const handleReportClick = useCallback((business) => {
    setSelectedBusinessForReport(business);
    setShowReportForm(true);
  }, []);

  const handleCloseReportForm = useCallback(() => {
    setShowReportForm(false);
    setSelectedBusinessForReport(null);
  }, []);

  return (
<nav className="sidebar d-flex flex-column h-100" aria-label="Business listings">
      <div className="business-list flex-grow-1 overflow-auto">
        {businesses.length > 0 ? (
          <ListGroup 
            role="listbox" 
            aria-label="Select a business"
            ref={listRef}
          >
            {businesses.map((business) => (
              <BusinessItem
                key={business.id || `${business.pin.lat}-${business.pin.lng}`}
                business={business}
                isActive={business.id === selectedBusinessId}
                onClick={() => onBusinessClick(business.id, business.pin.lat, business.pin.lng)}
                onReportClick={handleReportClick}
              />
            ))}
          </ListGroup>
        ) : (
          <p className="text-center mt-3">No businesses found in the current area. Try adjusting the map view.</p>
        )}
      </div>
      <ReportForm
        show={showReportForm}
        onHide={handleCloseReportForm}
        business={selectedBusinessForReport}
      />
    </nav>
  );
});

export default Sidebar;
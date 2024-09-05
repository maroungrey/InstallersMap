import React, { useCallback, useRef } from 'react';
import { ListGroup, Dropdown } from 'react-bootstrap';

const BusinessItemContent = React.memo(({ business }) => (
  <>
    <h3 className="h5 mb-2 text-dark">{business.name || 'Business'}</h3>
    <p className="mb-1 text-muted">{business.address || 'Address not available'}</p>
    <p className="mb-0 text-muted">
      <span className="visually-hidden">Phone: </span>
      {business.phone || 'Phone not available'}
    </p>
  </>
));
BusinessItemContent.displayName = 'BusinessItemContent';

const BusinessItem = React.memo(({ business, onClick, isActive }) => {
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      onClick();
    }
  }, [onClick]);

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
      >
        <BusinessItemContent business={business} />
      </div>
    </ListGroup.Item>
  );
});

BusinessItem.displayName = 'BusinessItem';

const Sidebar = React.memo(({ businesses, onBusinessClick, selectedBusinessId }) => {
  const listRef = useRef(null);

  return (
    <nav className="sidebar d-flex flex-column h-100" aria-label="Business listings">
      <div className="business-list flex-grow-1 overflow-auto">
        <ListGroup 
          role="listbox" 
          aria-label="Select a business"
          ref={listRef}
        >
          {businesses.map((business) => (
            <BusinessItem
              key={business.id || `${business.lat}-${business.lng}`}
              business={business}
              isActive={business.id === selectedBusinessId}
              onClick={() => onBusinessClick(business.id, business.lat, business.lng)}
            />
          ))}
        </ListGroup>
      </div>
    </nav>
  );
});

export default Sidebar;
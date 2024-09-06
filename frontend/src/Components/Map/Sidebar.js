import React, { useCallback, useRef } from 'react';
import { ListGroup } from 'react-bootstrap';

const BusinessItemContent = React.memo(({ business }) => (
  <>
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
              />
            ))}
          </ListGroup>
        ) : (
          <p className="text-center mt-3">No businesses found in the current area. Try adjusting the map view.</p>
        )}
      </div>
    </nav>
  );
});

export default Sidebar;
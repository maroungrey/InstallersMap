import React from 'react';
import { ListGroup } from 'react-bootstrap';

const BusinessItem = React.memo(({ business, isActive, onClick }) => (
  <ListGroup.Item
    as="article"
    action
    onClick={onClick}
    active={isActive}
  >
    <h5>{business.name}</h5>
    <p className="mb-1">{business.address}</p>
    <p className="mb-0">{business.phone}</p>
    {business.distance != null ? (
      <small>Distance: {business.distance.toFixed(2)} km</small>
    ) : (
      <small>Distance: N/A</small>
    )}
  </ListGroup.Item>
));

const Sidebar = React.memo(({ businesses, onBusinessClick, selectedBusinessIndex }) => {
  return (
    <div className="sidebar d-flex flex-column h-100">
      <div className="business-list flex-grow-1 overflow-auto">
        <ListGroup>
          {businesses.map((business, index) => (
            <BusinessItem
              key={business.id}
              business={business}
              isActive={index === selectedBusinessIndex}
              onClick={() => onBusinessClick(business.id)}
            />
          ))}
        </ListGroup>
      </div>
    </div>
  );
});

BusinessItem.displayName = 'BusinessItem';
Sidebar.displayName = 'Sidebar';

export default Sidebar;
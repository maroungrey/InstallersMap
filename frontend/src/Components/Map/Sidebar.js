import React from 'react';
import { ListGroup } from 'react-bootstrap';

const BusinessItem = React.memo(({ business, onClick }) => (
<ListGroup.Item
  as="article"
  action
  onClick={onClick}
  className="map-sidebar-item p-3"
  tabindex="0" 
>
  <h5 className="mb-2 text-dark">{business.name}</h5>
  <p className="mb-1 text-muted">{business.address}</p>
  <p className="mb-0 text-muted">{business.phone}</p>
  {business.distance != null ? (
    <small className="text-muted">Distance: {business.distance.toFixed(2)} km</small>
  ) : (
    <small className="text-muted">Distance: N/A</small>
  )}
  
</ListGroup.Item>
));

const Sidebar = React.memo(({ businesses, onBusinessClick, selectedBusinessId }) => {
  return (
    <div className="sidebar d-flex flex-column h-100">
      <div className="business-list flex-grow-1 overflow-auto">
        <ListGroup>
          {businesses.map((business) => (
            <BusinessItem
              key={business.id}
              business={business}
              isActive={business.id === selectedBusinessId} // Highlight based on ID
              onClick={() => onBusinessClick(business.id, business.latitude, business.longitude)}
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
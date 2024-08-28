import React from 'react';
import { ListGroup } from 'react-bootstrap';

const Sidebar = React.memo(({ businesses, onBusinessClick, selectedBusinessIndex }) => {
  return (
    <div className="sidebar d-flex flex-column h-100">
      <div className="business-list flex-grow-1 overflow-auto">
        <ListGroup>
          {businesses.map((business, index) => (
            <ListGroup.Item
              key={business.id}
              action
              onClick={() => onBusinessClick(index)}
              active={index === selectedBusinessIndex}
            >
              <h5>{business.name}</h5>
              <p className="mb-1">{business.address}</p>
              <p className="mb-0">{business.phone}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
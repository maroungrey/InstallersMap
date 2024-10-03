import React from 'react';
import { ListGroup } from 'react-bootstrap';
import BusinessItem from './BusinessItem';

function BusinessList({ businesses, selectedBusinessIndex, onBusinessClick, handleFlagClick, handleMouseEnter, popupPosition, businessRefs }) {
  return (
    <ListGroup variant="flush">
      {businesses.map((business, index) => (
        <BusinessItem 
          key={business.id || index} 
          business={business} 
          isSelected={selectedBusinessIndex === index} 
          onClick={() => onBusinessClick(business.geocode)} 
          onFlagClick={handleFlagClick}
          onMouseEnter={handleMouseEnter}
          popupPosition={popupPosition}
          ref={(el) => (businessRefs.current[index] = el)} 
        />
      ))}
    </ListGroup>
  );
}

export default BusinessList;

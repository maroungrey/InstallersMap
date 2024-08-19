import React, { forwardRef } from 'react';
import { ListGroup } from 'react-bootstrap';
import { FaFlag } from 'react-icons/fa';

const BusinessItem = forwardRef(({ business, isSelected, onClick, onFlagClick, onMouseEnter, popupPosition }, ref) => (
    <ListGroup.Item 
      className={`d-flex justify-content-between align-items-center list-group-item-hover ${
        isSelected ? 'bg-light' : ''
      }`}
      onClick={onClick}
      style={{ cursor: 'pointer' }} 
      ref={ref} 
      role="button" 
      tabIndex="0" // Make the item focusable
      onKeyDown={(e) => e.key === 'Enter' && onClick()} // Activate on Enter key
      aria-label={`Business ${business.name}`} // Screen reader label
    >
      <div>
        <h5>{business.name}</h5>
        <p>Address: {business.address}</p>
        <p>Phone: {business.phone}</p>
        <p>
          Website: 
          <a 
            href={business.website} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label={`Visit ${business.name} website`} // Screen reader label
          >
            {business.website.length > 30 ? `${business.website.slice(0, 30)}...` : business.website}
          </a>
        </p>
      </div>
      <div 
        className="flag-hover-container" 
        onMouseEnter={onMouseEnter}
        onClick={() => onFlagClick(business)} 
        style={{ alignSelf: 'flex-end', marginTop: 'auto' }}
        aria-label="Report an issue" // Screen reader label
      >
        <FaFlag className="flag-hover" aria-hidden="true" /> 
        <span 
          className="popup-text" 
          style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }}
        >
          Report the issue
        </span>
      </div>
    </ListGroup.Item>
  ));
  
  export default BusinessItem;
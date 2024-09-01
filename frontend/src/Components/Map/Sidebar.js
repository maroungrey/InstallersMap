import React, { useCallback, useRef, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { FaFlag } from 'react-icons/fa';

const BusinessItem = React.memo(({ business, onClick, onReportIssue, isActive, isPopupOpen }) => {
  const handleReportClick = useCallback((e) => {
    e.stopPropagation();
    onReportIssue(business);
  }, [onReportIssue, business]);

  return (
    <ListGroup.Item
      as="div"
      className={`map-sidebar-item p-3 position-relative ${isActive ? 'active' : ''} ${isPopupOpen ? 'popup-open' : ''}`}
      aria-selected={isActive}
      role="option"
    >
      <div 
        onClick={onClick}
        onKeyPress={(e) => e.key === 'Enter' && onClick()}
        tabIndex="0"
        role="button"
        aria-label={`Select ${business.name}`}
      >
        <h3 className="h5 mb-2 text-dark">{business.name}</h3>
        <p className="mb-1 text-muted">{business.address}</p>
        <p className="mb-0 text-muted">
          <span className="visually-hidden">Phone: </span>
          {business.phone}
        </p>
        {business.distance != null ? (
          <p className="mb-0 mt-2">
            <small className="text-muted">
              <span className="visually-hidden">Distance: </span>
              {business.distance.toFixed(2)} km
            </small>
          </p>
        ) : (
          <p className="mb-0 mt-2">
            <small className="text-muted">Distance: N/A</small>
          </p>
        )}
      </div>
      <button 
        className="btn btn-link flag-hover-container position-absolute bottom-0 end-0 m-2"
        onClick={handleReportClick}
        aria-label={`Report an issue for ${business.name}`}
      >
        <FaFlag className="flag-hover" aria-hidden="true" />
        <span className="visually-hidden">Report an issue</span>
      </button>
    </ListGroup.Item>
  );
});

const Sidebar = React.memo(({ businesses, onBusinessClick, selectedBusinessId, onReportIssue, openPopupId }) => {
  // console.log('Sidebar - openPopupId:', openPopupId);
  
  const listRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!listRef.current) return;

      const items = Array.from(listRef.current.querySelectorAll('[role="option"]'));
      const currentIndex = items.findIndex(item => item.getAttribute('aria-selected') === 'true');

      switch(e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < items.length - 1) {
            onBusinessClick(businesses[currentIndex + 1].id, businesses[currentIndex + 1].latitude, businesses[currentIndex + 1].longitude);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            onBusinessClick(businesses[currentIndex - 1].id, businesses[currentIndex - 1].latitude, businesses[currentIndex - 1].longitude);
          }
          break;
        default:
          break;
      }
    };

    listRef.current?.addEventListener('keydown', handleKeyDown);
    return () => listRef.current?.removeEventListener('keydown', handleKeyDown);
  }, [businesses, onBusinessClick]);

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
              key={business.id}
              business={business}
              isActive={business.id === selectedBusinessId}
              isPopupOpen={business.id === openPopupId}
              onClick={() => onBusinessClick(business.id, business.latitude, business.longitude)}
              onReportIssue={onReportIssue}
            />
          ))}
        </ListGroup>
      </div>
    </nav>
  );
});

BusinessItem.displayName = 'BusinessItem';
Sidebar.displayName = 'Sidebar';

export default Sidebar;
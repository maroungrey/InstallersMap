import React, { useCallback, useRef, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { FaFlag } from 'react-icons/fa';

// Extracted hook for keyboard navigation
const useKeyboardNavigation = (listRef, businesses, onBusinessClick) => {
  const handleKeyDown = useCallback((e) => {
    if (!listRef.current) return;

    const items = Array.from(listRef.current.querySelectorAll('[role="option"]'));
    const currentIndex = items.findIndex(item => item.getAttribute('aria-selected') === 'true');

    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < items.length - 1) {
          const nextBusiness = businesses[currentIndex + 1];
          onBusinessClick(nextBusiness.id, nextBusiness.latitude, nextBusiness.longitude);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          const prevBusiness = businesses[currentIndex - 1];
          onBusinessClick(prevBusiness.id, prevBusiness.latitude, prevBusiness.longitude);
        }
        break;
      default:
        break;
    }
  }, [businesses, onBusinessClick]);

  useEffect(() => {
    const currentList = listRef.current;
    currentList?.addEventListener('keydown', handleKeyDown);
    return () => currentList?.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

// Extracted BusinessItemContent component
const BusinessItemContent = React.memo(({ business }) => (
  <>
    <h3 className="h5 mb-2 text-dark">{business.name}</h3>
    <p className="mb-1 text-muted">{business.address}</p>
    <p className="mb-0 text-muted">
      <span className="visually-hidden">Phone: </span>
      {business.phone}
    </p>
    <p className="mb-0 mt-2">
      <small className="text-muted">
        <span className="visually-hidden">Distance: </span>
        {business.distance != null ? `${business.distance.toFixed(2)} km` : 'N/A'}
      </small>
    </p>
  </>
));

BusinessItemContent.displayName = 'BusinessItemContent';

// Refactored BusinessItem component
const BusinessItem = React.memo(({ business, onClick, onReportIssue, isActive, isPopupOpen }) => {
  const handleReportClick = useCallback((e) => {
    e.stopPropagation();
    onReportIssue(business);
  }, [onReportIssue, business]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      onClick();
    }
  }, [onClick]);

  return (
    <ListGroup.Item
      as="div"
      className={`map-sidebar-item p-3 position-relative ${isActive ? 'active' : ''} ${isPopupOpen ? 'popup-open' : ''}`}
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

BusinessItem.displayName = 'BusinessItem';

// Refactored Sidebar component
const Sidebar = React.memo(({ businesses, onBusinessClick, selectedBusinessId, onReportIssue, openPopupId }) => {
  const listRef = useRef(null);

  useKeyboardNavigation(listRef, businesses, onBusinessClick);

  const handleBusinessItemClick = useCallback((business) => {
    onBusinessClick(business.id, business.latitude, business.longitude);
  }, [onBusinessClick]);

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
              onClick={() => handleBusinessItemClick(business)}
              onReportIssue={onReportIssue}
            />
          ))}
        </ListGroup>
      </div>
    </nav>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
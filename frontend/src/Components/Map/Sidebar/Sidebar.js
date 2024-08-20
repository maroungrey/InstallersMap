import React, { useRef, useEffect, useState } from 'react';
import { ListGroup, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BusinessItem from './BusinessItem';
import ReportIssueForm from './ReportIssueForm';
import SearchBar from './SearchBar';
import { useGeocode } from '../../../Hooks/useGeocode';
import { usePopupPosition } from '../../../Hooks/usePopupPosition';
import { useSelectedBusiness } from '../../../Hooks/useSelectedBusiness';

function Sidebar({ businesses, onBusinessClick, selectedBusinessIndex, onCoordinatesUpdate }) {
  const businessRefs = useRef([]);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const {
    shouldGeocode,
    geocodeError,
    startGeocoding,
  } = useGeocode(searchValue, onCoordinatesUpdate);

  const { popupPosition, handleMouseEnter } = usePopupPosition();

  const {
    selectedBusiness,
    showReportForm,
    handleFlagClick,
    handleCloseReportForm
  } = useSelectedBusiness();

  useEffect(() => {
    if (selectedBusinessIndex !== null && businessRefs.current[selectedBusinessIndex]) {
      businessRefs.current[selectedBusinessIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedBusinessIndex]);

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  return (
    <div>
      <SearchBar 
        placeholder="Enter zip code or full address" 
        value={searchValue} 
        onChange={handleSearchChange} 
        onSearch={startGeocoding}
      />
      {geocodeError && <Alert variant="warning">{geocodeError}</Alert>}
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <ListGroup variant="flush">
          {businesses.map((business, index) => (
            <BusinessItem 
              key={index} 
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
      </div>
      <Button 
        variant="primary" 
        className="mt-3 w-100" 
        onClick={() => navigate('/contact')} 
      >
        Suggest Business
      </Button>

      <ReportIssueForm 
        show={showReportForm} 
        handleClose={handleCloseReportForm} 
        business={selectedBusiness} 
      />
    </div>
  );
}

export default Sidebar;

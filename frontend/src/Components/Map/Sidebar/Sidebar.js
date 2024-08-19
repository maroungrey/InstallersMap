import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BusinessItem from './BusinessItem';
import ReportIssueForm from './ReportIssueForm';
import SearchBar from './SearchBar'
import GeocodeConverter from '../GeocodeConverter';
import { calculatePopupPosition } from '../../../Utilities/calculatePopupPosition';

function Sidebar({ businesses, onBusinessClick, selectedBusinessIndex, mapRef }) {
  const businessRefs = useRef([]); 
  const navigate = useNavigate(); 
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [searchValue, setSearchValue] = useState('');
  const [shouldGeocode, setShouldGeocode] = useState(false);

  useEffect(() => {
    if (selectedBusinessIndex !== null && businessRefs.current[selectedBusinessIndex]) {
      businessRefs.current[selectedBusinessIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedBusinessIndex]);

  const navigateToContact = () => {
    navigate('/contact'); 
  };

  const handleMouseEnter = (event) => {
    setPopupPosition(calculatePopupPosition(event));
  };

  const handleFlagClick = (business) => {
    setSelectedBusiness(business);
    setShowReportForm(true);
  };

  const handleCloseReportForm = () => {
    setShowReportForm(false);
    setSelectedBusiness(null);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setShouldGeocode(false); // Reset geocoding flag when search value changes
  };

  const handleGeocode = useCallback(({ latitude, longitude }) => {
    console.log('Coordinates:', { latitude, longitude });
    // Here you can add any additional logic you want to perform with the coordinates
  }, []);

  const handleSearch = useCallback(() => {
    if (searchValue.trim()) {
      setShouldGeocode(true); // Trigger geocoding when search is initiated
    }
  }, [searchValue]);

  return (
    <div>
      <SearchBar 
        placeholder="Enter your zip code or address" 
        value={searchValue} 
        onChange={handleSearchChange} 
        onSearch={handleSearch}
      />
      {shouldGeocode && <GeocodeConverter key={searchValue} addressOrZip={searchValue} onGeocode={handleGeocode} />}
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
        onClick={navigateToContact} 
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
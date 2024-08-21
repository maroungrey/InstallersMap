import React, { useRef, useEffect, useState, useMemo } from 'react';
import { ListGroup, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BusinessItem from './BusinessItem';
import ReportIssueForm from './ReportIssueForm';
import SearchBar from './SearchBar';
import { useGeocode } from '../../../Hooks/useGeocode';
import { usePopupPosition } from '../../../Hooks/usePopupPosition';
import { useSelectedBusiness } from '../../../Hooks/useSelectedBusiness';

function Sidebar({ businesses, onBusinessClick, selectedBusinessIndex, onCoordinatesUpdate, mapCenter }) {
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

  // Calculate distances and sort businesses
  const sortedBusinesses = useMemo(() => {
    console.log('Recalculating sorted businesses');
    console.log('Map center:', mapCenter);
    console.log('Businesses:', businesses);
    
    if (!mapCenter) return businesses;

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of the Earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c; // Distance in km
    };

    const sorted = businesses.map(business => ({
      ...business,
      distance: calculateDistance(
        mapCenter.lat, 
        mapCenter.lng, 
        business.geocode[0], // Assuming geocode is an array [lat, lng]
        business.geocode[1]
      )
    })).sort((a, b) => a.distance - b.distance);

    console.log('Sorted businesses:', sorted);
    return sorted;
  }, [businesses, mapCenter]);

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
          {sortedBusinesses.map((business, index) => (
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

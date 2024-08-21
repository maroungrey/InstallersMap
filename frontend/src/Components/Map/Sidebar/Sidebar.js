import React, { useRef, useEffect, useState } from 'react';
import ReportIssueForm from './ReportIssueForm';
import BusinessList from './BusinessList';
import SidebarControls from './SidebarControls';
import { useGeocode } from '../../../Hooks/useGeocode';
import { usePopupPosition } from '../../../Hooks/usePopupPosition';
import { useSelectedBusiness } from '../../../Hooks/useSelectedBusiness';
import { useSortedBusinesses } from '../../../Hooks/useSortedBusinesses';

function Sidebar({ businesses, onBusinessClick, selectedBusinessIndex, onCoordinatesUpdate, mapCenter }) {
  const businessRefs = useRef([]);
  const [searchValue, setSearchValue] = useState('');

  const sortedBusinesses = useSortedBusinesses(businesses, mapCenter);

  const { shouldGeocode, geocodeError, startGeocoding } = useGeocode(searchValue, onCoordinatesUpdate);
  const { popupPosition, handleMouseEnter } = usePopupPosition();
  const { selectedBusiness, showReportForm, handleFlagClick, handleCloseReportForm } = useSelectedBusiness();

  useEffect(() => {
    if (selectedBusinessIndex !== null && businessRefs.current[selectedBusinessIndex]) {
      businessRefs.current[selectedBusinessIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedBusinessIndex]);

  return (
    <div>
      <SidebarControls 
        searchValue={searchValue} 
        handleSearchChange={setSearchValue} 
        startGeocoding={startGeocoding} 
        geocodeError={geocodeError} 
      />
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <BusinessList 
          businesses={sortedBusinesses} 
          selectedBusinessIndex={selectedBusinessIndex} 
          onBusinessClick={onBusinessClick}
          handleFlagClick={handleFlagClick}
          handleMouseEnter={handleMouseEnter}
          popupPosition={popupPosition}
          businessRefs={businessRefs}
        />
      </div>
      <ReportIssueForm 
        show={showReportForm} 
        handleClose={handleCloseReportForm} 
        business={selectedBusiness} 
      />
    </div>
  );
}

export default Sidebar;

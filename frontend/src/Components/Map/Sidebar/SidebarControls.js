import React from 'react';
import { Button, Alert } from 'react-bootstrap';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';

function SidebarControls({ searchValue, handleSearchChange, startGeocoding, geocodeError }) {
  const navigate = useNavigate();

  return (
    <div>
      <SearchBar 
        placeholder="Enter zip code or full address" 
        value={searchValue} 
        onChange={handleSearchChange} 
        onSearch={startGeocoding}
      />
      {geocodeError && <Alert variant="warning">{geocodeError}</Alert>}
      <Button 
        variant="primary" 
        className="mt-3 w-100" 
        onClick={() => navigate('/contact')} 
      >
        Suggest Business
      </Button>
    </div>
  );
}

export default SidebarControls;

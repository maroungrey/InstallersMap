import React from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';

function SearchBar({ placeholder, onSearch, onChange, value }) {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <InputGroup className="mb-3">
      <Form.Control
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button 
        variant="outline-secondary" 
        onClick={handleSearch}
        aria-label="Search"
      >
        Search
      </Button>
    </InputGroup>
  );
}

export default SearchBar;
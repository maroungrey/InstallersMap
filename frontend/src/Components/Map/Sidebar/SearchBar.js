import React from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';

function SearchBar({ placeholder, onSearch, onChange, value }) {
    const handleSearchClick = () => {
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
        />
        <Button 
          variant="outline-secondary" 
          onClick={handleSearchClick}
          aria-label="Search"
        >
          Search
        </Button>
      </InputGroup>
    );
  }
  
  export default SearchBar;
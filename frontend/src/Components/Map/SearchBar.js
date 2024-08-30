import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Form onSubmit={handleSubmit} className="my-1">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Enter zipcode or address"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="primary" type="submit" className="rounded-end py-1 px-4">
          Search
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBar;
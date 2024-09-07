import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const SearchBar = ({ onSearchComplete }) => {
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        onSearchComplete(parseFloat(lat), parseFloat(lon));
      } else {
        alert('Address not found');
      }
    } catch (error) {
      console.error('Error during geocoding:', error);
      alert('An error occurred while searching for the address');
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex mx-2">
      <Form.Control
        type="text"
        placeholder="Enter address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="me-2"
      />
      <Button variant="primary" type="submit">Search</Button>
    </Form>
  );
};

export default SearchBar;
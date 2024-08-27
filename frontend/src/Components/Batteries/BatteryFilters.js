import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { Search, Lightbulb } from 'lucide-react';

export const BatteryFilters = ({ 
  sortBy, 
  setSortBy, 
  searchTerm, 
  setSearchTerm, 
  allBrands = [],
  showOnlyBrands = false,
  onSuggestBattery,
  onFilterChange
}) => {
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    onFilterChange({ brands: selectedBrands });
  }, [selectedBrands, onFilterChange]);

  const handleBrandChange = (brand) => {
    setSelectedBrands(prevBrands => {
      if (prevBrands.includes(brand)) {
        return prevBrands.filter(b => b !== brand);
      } else {
        return [...prevBrands, brand];
      }
    });
  };

  const renderBrandFilters = () => (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Brands</Card.Title>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {allBrands.length > 0 ? (
            allBrands.map(brand => (
              <Form.Check
                key={brand}
                type="checkbox"
                id={`brand-${brand}`}
                label={brand}
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
              />
            ))
          ) : (
            <p>No brands available</p>
          )}
        </div>
      </Card.Body>
    </Card>
  );

  const renderOtherFilters = () => (
    <Card className="mb-4">
      <Card.Body>
        <Row className="align-items-center mb-3">
          <Col xs={12} md={6} className="mb-3 mb-md-0">
            <Form.Group className="d-flex align-items-center">
              <Search size={20} className="me-2" />
              <Form.Control
                type="text"
                placeholder="Search batteries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Row className="align-items-center">
              <Col>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="me-2 mb-0">Sort by:</Form.Label>
                  <Form.Select 
                    className="w-auto"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="capacity">Highest Capacity</option>
                    <option value="warranty">Longest Warranty</option>
                    <option value="weight">Lowest Weight</option>
                    <option value="kWh">Highest kWh</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs="auto">
                <Button variant="outline-primary" onClick={onSuggestBattery}>
                  <Lightbulb size={20} className="me-2" />
                  Suggest Battery
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  return (
    <>
      {renderBrandFilters()}
      {!showOnlyBrands && renderOtherFilters()}
    </>
  );
};
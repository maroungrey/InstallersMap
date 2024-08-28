import React from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { Search, Lightbulb, Battery } from 'lucide-react';

export const BatteryFilters = ({ 
  sortBy, 
  setSortBy, 
  searchTerm, 
  setSearchTerm, 
  allBrands = [],
  showOnlyBrands = false,
  onSuggestBattery,
  onFilterChange,
  selectedVoltage,
  setSelectedVoltage,
  selectedBrands
}) => {
  const handleBrandChange = (brand) => {
    const updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    onFilterChange(updatedBrands);
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
                    <option value="Total kWh">Highest kWh</option>
                    <option value="Full Warranty Years">Highest Warranty</option>
                    <option value="Ah Capacity">Highest Capacity</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              {/* <Col xs="auto">
                <Button variant="outline-primary" onClick={onSuggestBattery}>
                  <Lightbulb size={20} className="me-2" />
                  Suggest Battery
                </Button>
              </Col> */}
            </Row>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={12} md={6}>
            <Form.Group className="d-flex align-items-center">
              <Battery size={20} className="me-2" />
              <Form.Select
                value={selectedVoltage}
                onChange={(e) => setSelectedVoltage(e.target.value)}
              >
                <option value="All Voltages">All Voltages</option>
                <option value="48">48V</option>
                <option value="36">36V</option>
                <option value="24">24V</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  return showOnlyBrands ? renderBrandFilters() : renderOtherFilters();
};
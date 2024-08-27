import React from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';
import { Filter, ArrowUpDown, Search } from 'lucide-react';

export const BatteryFilters = ({ 
  filters, 
  setFilters, 
  sortBy, 
  setSortBy, 
  searchTerm, 
  setSearchTerm, 
  batteries,
  showOnlyBrands = false
}) => {
  const uniqueBrands = [...new Set(batteries.map(battery => battery.Brand))];

  const renderBrandFilters = () => (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Brands</Card.Title>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {uniqueBrands.map(brand => (
            <Form.Check
              key={brand}
              type="checkbox"
              id={`brand-${brand}`}
              label={brand}
              checked={filters.brands.includes(brand)}
              onChange={() => {
                const updatedBrands = filters.brands.includes(brand)
                  ? filters.brands.filter(b => b !== brand)
                  : [...filters.brands, brand];
                setFilters({ ...filters, brands: updatedBrands });
              }}
            />
          ))}
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
            <Form.Group className="d-flex align-items-center">
              <ArrowUpDown size={20} className="me-2" />
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
        </Row>
        <Row className="align-items-center">
          <Col xs={12} md={6} className="mb-3">
            <Form.Select 
              value={filters.voltage}
              onChange={(e) => setFilters({ ...filters, voltage: e.target.value })}
            >
              <option value="">All Voltages</option>
              <option value="12">12V</option>
              <option value="24">24V</option>
              <option value="36">36V</option>
              <option value="48">48V</option>
              <option value="72">72V</option>
            </Form.Select>
          </Col>
          <Col xs={12} md={6} className="mb-3">
            <Form.Select 
              value={filters.chemistry}
              onChange={(e) => setFilters({ ...filters, chemistry: e.target.value })}
            >
              <option value="">All Chemistries</option>
              <option value="LFP">LFP</option>
              <option value="NMC">NMC</option>
              {/* Add other chemistries as needed */}
            </Form.Select>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  return (
    <>
      {showOnlyBrands ? renderBrandFilters() : renderOtherFilters()}
    </>
  );
};
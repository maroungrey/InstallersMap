import React from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';
import { Filter, ArrowUpDown } from 'lucide-react';

export const BatteryFilters = ({ filters, setFilters, sortBy, setSortBy }) => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <Row className="align-items-center">
          <Col xs={12} md={6} className="mb-3 mb-md-0">
            <Form.Group className="d-flex align-items-center">
              <Filter size={20} className="me-2" />
              <Form.Label className="me-2 mb-0">Filter by:</Form.Label>
              <Form.Select 
                className="w-auto"
                value={filters.filterBy}
                onChange={(e) => setFilters({ ...filters, filterBy: e.target.value })}
              >
                <option value="">All</option>
                <option value="brand">Brand</option>
                <option value="capacity">Capacity (Ah)</option>
                <option value="price">Price Range</option>
                <option value="warranty">Warranty</option>
              </Form.Select>
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
                <option value="value">Best Value</option>
                <option value="capacity">Highest Capacity</option>
                <option value="warranty">Longest Warranty</option>
                <option value="price">Price</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
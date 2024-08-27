import React from 'react';
import { Row, Col, Table, Button, Image } from 'react-bootstrap';

export const ComparisonSection = ({ selectedBatteries, onClearSelection }) => {
  const features = [
    { key: 'Ah Capacity', label: 'Capacity', unit: 'Ah' },
    { key: 'Nominal V', label: 'Voltage', unit: 'V' },
    { key: 'Chemistry', label: 'Chemistry', unit: '' },
    { key: 'Weight(lbs)', label: 'Weight', unit: 'lbs' },
    { key: 'Full Warranty Years', label: 'Warranty', unit: 'years' },
    { key: 'Total kWh', label: 'Total kWh', unit: 'kWh' },
    { key: 'Bluetooth', label: 'Bluetooth', unit: '' },
    { key: 'Self-Heating', label: 'Self-Heating', unit: '' },
    { key: 'Protection Rating', label: 'Protection Rating', unit: '' },
    { key: 'Cycles', label: 'Cycles', unit: '' },
  ];

  return (
    <Row className="mt-5">
      <Col xs={12}>
        <h2>Comparison Table</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Brand - Model</th>
              {features.map(feature => (
                <th key={feature.key}>{feature.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedBatteries.map(battery => (
              <tr key={battery.id}>
                <td>{battery.Brand} - {battery.Name}</td>
                {features.map(feature => (
                  <td key={feature.key}>
                    {battery[feature.key]} {feature.unit}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
      <Col xs={12} md={6} className="mt-4">
        <h3>Capacity Comparison</h3>
        <Image src="/api/placeholder/400/300" alt="Capacity Comparison Chart Placeholder" fluid />
      </Col>
      <Col xs={12} md={6} className="mt-4">
        <h3>Weight vs. Capacity</h3>
        <Image src="/api/placeholder/400/300" alt="Weight vs. Capacity Chart Placeholder" fluid />
      </Col>
      <Col xs={12} className="mt-4">
        <Button variant="primary" onClick={() => {/* Implement export logic */}}>Export Comparison</Button>{' '}
        <Button variant="secondary" onClick={() => {/* Implement save favorites logic */}}>Save Favorites</Button>{' '}
        <Button variant="danger" onClick={onClearSelection}>Clear Selection</Button>
      </Col>
    </Row>
  );
};
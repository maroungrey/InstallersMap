import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { FaBatteryFull, FaBolt, FaFlag } from 'react-icons/fa';

export const BatteryGrid = ({ 
  batteries, 
  loading, 
  error, 
  onSelectBattery, 
  selectedBatteries,
  onReportIssue, // Add this prop to handle reporting
  onViewDetails // Add this prop to handle viewing details
}) => {
  if (loading && batteries.length === 0) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (batteries.length === 0) return <div>No batteries found.</div>;

  const handleReportClick = (battery, e) => {
    e.stopPropagation();
    onReportIssue(battery);
  };

  const handleCardClick = (battery) => {
    onViewDetails(battery);
  };

  const handleCompareClick = (e, battery) => {
    e.stopPropagation();
    onSelectBattery(battery);
  };

  return (
    <Row>
      {batteries.map((battery) => (
        <Col key={battery.id} xs={12} sm={6} md={4} className="mb-3">
          <Card  
            onClick={() => handleCardClick(battery)}
            className={selectedBatteries.some(b => b.id === battery.id) ? 'selected' : ''} 
            style={{ cursor: 'pointer' }}
          >
            <Card.Img variant="top" src="https://placehold.co/100x100" />
            <Card.Body className="p-2">
              <Card.Title className="fs-6">{battery.Brand} - {battery.Name}</Card.Title>
              <div className="d-flex justify-content-between align-items-center">
                <div title="Capacity">
                  <FaBatteryFull /> {battery['Ah Capacity']} Ah
                </div>
                <div title="Voltage">
                  <FaBolt /> {battery['Nominal V']} V
                </div>
              </div>
              <div className="mt-2 d-flex justify-content-between align-items-center">
                <Form.Check 
                  type="checkbox"
                  label="Compare"
                  checked={selectedBatteries.some(b => b.id === battery.id)}
                  onChange={(e) => handleCompareClick(e, battery)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div 
                  className="flag-hover-container"
                  onClick={(e) => handleReportClick(battery, e)}
                  style={{ cursor: 'pointer' }}
                  aria-label="Report an issue"
                >
                  <FaFlag className="flag-hover" aria-hidden="true" />
                  <span className="popup-text">Report the issue</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
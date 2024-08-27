import React from 'react';
import { Row, Col, Card, Spinner, Alert, Form } from 'react-bootstrap';
import { FaBatteryFull, FaBolt, FaFlag } from 'react-icons/fa';
import { BatteryDetailView } from './BatteryDetailView';
import ReportForm from './ReportForm';

export const BatteryGrid = ({ 
  batteries = [], 
  loading, 
  error, 
  onSelectBattery, 
  selectedBatteries
}) => {
  if (loading) return <Spinner animation="border" role="status" className="d-block mx-auto" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (batteries.length === 0) return <Alert variant="info">No batteries found matching your criteria.</Alert>;

  const handleReportClick = (battery, e) => {
    e.stopPropagation();
    // Trigger report form display (implementation moved to parent component or handled via props)
  };

  const handleCardClick = (battery) => {
    // Trigger detail view display (implementation moved to parent component or handled via props)
  };

  const handleCompareClick = (e, battery) => {
    e.stopPropagation();
    onSelectBattery(battery);
  };

  return (
    <>
      <Row>
        {batteries.map((battery) => (
          <Col key={battery.id} xs={12} sm={6} md={4} className="mb-3">
            <Card onClick={() => handleCardClick(battery)} style={{ cursor: 'pointer' }} className="battery-card-hover">
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
    </>
  );
};

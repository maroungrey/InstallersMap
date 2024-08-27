import React, { useState } from 'react';
import { Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { FaFlag } from 'react-icons/fa';
import ReportForm from './ReportForm';

export const BatteryGrid = ({ batteries, loading, error }) => {
  const [displayCount, setDisplayCount] = useState(20);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedBattery, setSelectedBattery] = useState(null);

  if (loading) return <Spinner animation="border" role="status" className="d-block mx-auto" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  
  if (!Array.isArray(batteries)) {
    console.error('BatteryGrid received non-array batteries:', batteries);
    return <Alert variant="danger">Invalid data received. Please try again later.</Alert>;
  }
  
  if (batteries.length === 0) return <Alert variant="info">No batteries found matching your criteria.</Alert>;

  const handleShowMore = () => {
    setDisplayCount(prevCount => prevCount + 20);
  };

  const handleReportClick = (battery) => {
    setSelectedBattery(battery);
    setShowReportForm(true);
  };

  return (
    <>
      <Row>
        {batteries.slice(0, displayCount).map((battery, index) => (
          <Col key={battery.id || index} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card>
              <Card.Body className="d-flex flex-column">
                <Card.Title>{battery.Brand} - {battery.Name}</Card.Title>
                <Card.Text>
                  <strong>Capacity:</strong> {battery['Ah Capacity']} Ah<br />
                  <strong>Voltage:</strong> {battery['Nominal V']} V<br />
                  <strong>Total kWh:</strong> {battery['Total kWh']}<br />
                  <strong>Chemistry:</strong> {battery.Chemistry}<br />
                  <strong>Warranty:</strong> {battery['Full Warranty Years']} Years<br />
                  <strong>Weight:</strong> {battery['Weight(lbs)']} lbs<br />
                  <strong>Bluetooth:</strong> {battery.Bluetooth}<br />
                  <strong>Self-Heating:</strong> {battery['Self-Heating']}<br />
                  <strong>Protection Rating:</strong> {battery['Protection Rating']}<br />
                  <strong>Cycles:</strong> {battery.Cycles}
                </Card.Text>
                <Button 
                  variant="primary" 
                  href={battery['Spec Link']} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View Specs
                </Button>
                <div 
                  className="flag-hover-container mt-2" 
                  onClick={() => handleReportClick(battery)} 
                  style={{ alignSelf: 'flex-end', marginTop: 'auto', cursor: 'pointer' }}
                  aria-label="Report an issue"
                >
                  <FaFlag className="flag-hover" aria-hidden="true" /> 
                  <span className="sr-only">Report an issue</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {displayCount < batteries.length && (
        <div className="text-center mt-4">
          <Button variant="primary" onClick={handleShowMore}>Show More...</Button>
        </div>
      )}
      <ReportForm 
        show={showReportForm} 
        onHide={() => setShowReportForm(false)} 
        battery={selectedBattery}
      />
    </>
  );
};
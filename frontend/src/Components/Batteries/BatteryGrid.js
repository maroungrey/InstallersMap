import React from 'react';
import { Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';

export const BatteryGrid = ({ batteries, loading, error }) => {
  if (loading) return <Spinner animation="border" role="status" className="d-block mx-auto" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <Row>
        {batteries.map((battery) => (
          <Col key={battery.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{`Battery ${battery.id}`}</Card.Title>
                <Card.Text>
                  <strong>Brand:</strong> {battery.brand}<br />
                  <strong>Capacity:</strong> {battery.capacity} Ah<br />
                  <strong>kWh:</strong> {battery.kWh}<br />
                  <strong>Price:</strong> ${battery.price}<br />
                  <strong>Warranty:</strong> {battery.warranty} Years
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="text-center mt-4">
        <Button variant="primary">Show More...</Button>
      </div>
    </>
  );
};
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation

export default function NoPage() {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row>
        <Col className="text-center">
          <h1>404</h1>
          <p>Oops! The page you are looking for does not exist.</p>
          <Link to="/">
            <Button variant="primary">Go Back Home</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

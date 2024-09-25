import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function AdminDashboard() {
  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h2>Admin Dashboard</h2>
          <p>Welcome to the admin dashboard. Here you can manage your site's content and settings.</p>
          {/* Add more admin functionality here */}
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;
import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

function ButtonGroup() {
  return (
    <Row className="mb-3">
      <Col><Button variant="primary" block>Button 1</Button></Col>
      <Col><Button variant="secondary" block>Button 2</Button></Col>
      <Col><Button variant="success" block>Button 3</Button></Col>
      <Col><Button variant="danger" block>Button 4</Button></Col>
    </Row>
  );
}

export default ButtonGroup;
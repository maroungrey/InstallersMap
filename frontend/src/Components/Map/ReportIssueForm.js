// ReportIssueForm.js
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function ReportIssueForm({ show, handleClose, business }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Report an Issue</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBusinessName">
            <Form.Label>Business Name</Form.Label>
            <Form.Control type="text" value={business?.name || ''} readOnly />
          </Form.Group>
          <Form.Group controlId="formIssueDescription">
            <Form.Label>Description of the Issue</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Describe the issue..." />
          </Form.Group>
          <Form.Group controlId="formContactInfo">
            <Form.Label>Your Contact Information (optional)</Form.Label>
            <Form.Control type="text" placeholder="Enter your email or phone number" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReportIssueForm;

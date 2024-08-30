import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ReportForm = ({ show, onHide, business }) => {
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement the submission logic here
    console.log('Report submitted:', { business, reportType, description });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Report an Issue</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Business</Form.Label>
            <Form.Control type="text" readOnly value={business ? business.name : ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Issue Type</Form.Label>
            <Form.Select 
              value={reportType} 
              onChange={(e) => setReportType(e.target.value)}
              required
            >
              <option value="">Select an issue type</option>
              <option value="wrong_address">Wrong Address</option>
              <option value="wrong_phone">Wrong Phone Number</option>
              <option value="closed_business">Business is Closed</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Please describe the issue in detail..."
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit Report
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ReportForm;
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ReportModal = ({ 
  showReportModal, 
  setShowReportModal, 
  reportReason, 
  setReportReason, 
  handleReport 
}) => {
  return (
    <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Report Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Reason for reporting</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Please provide details..."
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowReportModal(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleReport}>
          Submit Report
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportModal;
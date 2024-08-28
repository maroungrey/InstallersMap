import React, { useState } from 'react';
import { Modal, Button, Form, ListGroup, Accordion, Row, Col } from 'react-bootstrap';
import { FaBatteryFull, FaBolt, FaWeight, FaCalendarAlt, FaBluetooth, FaThermometerHalf, FaShieldAlt, FaRedo, FaThumbsUp, FaThumbsDown, FaLink, FaRuler, FaGlobe, FaIndustry, FaBuilding, FaFileContract, FaFlag } from 'react-icons/fa';
import ReportForm from './ReportForm';

export const BatteryDetailView = ({ show, onHide, battery }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);

  if (!battery) return null;

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([...comments, { text: comment, date: new Date() }]);
      setComment('');
    }
  };

  const handleRating = (isPositive) => {
    setRating(isPositive);
    // Here you would typically send this rating to your backend
  };

  const renderValue = (value) => value || 'Unknown';

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{battery.Brand} - {battery.Name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6} className="d-flex flex-column align-items-center">
              <img src="https://placehold.co/300x300" alt={`${battery.Brand} ${battery.Name}`} className="img-fluid mb-3" />
              <div className="text-center mb-3">
                <Button 
                  variant="outline-success" 
                  className={`me-2 rating-button ${rating === true ? 'active' : ''}`}
                  onClick={() => handleRating(true)}
                >
                  <FaThumbsUp /> Like
                </Button>
                <Button 
                  variant="outline-danger"
                  className={`me-2 rating-button ${rating === false ? 'active' : ''}`}
                  onClick={() => handleRating(false)}
                >
                  <FaThumbsDown /> Dislike
                </Button>
                <Button 
                  variant="warning" 
                  onClick={() => setShowReportForm(true)}
                >
                  <FaFlag /> Report Issue
                </Button>
              </div>
            </Col>
            <Col md={6}>
              <Accordion className="mb-3">
                <Accordion.Item eventKey="0">
                  <Accordion.Header><FaBatteryFull /> Specifications</Accordion.Header>
                  <Accordion.Body>
                    <ListGroup variant="flush" className="specs-list">
                      <ListGroup.Item><FaBatteryFull /> <strong>Capacity:</strong> {renderValue(battery['Ah Capacity'])} Ah</ListGroup.Item>
                      <ListGroup.Item><FaBolt /> <strong>Nominal Voltage:</strong> {renderValue(battery['Nominal V'])} V</ListGroup.Item>
                      <ListGroup.Item><FaBolt /> <strong>Max Continuous:</strong> {renderValue(battery['Max Continuous'])} A</ListGroup.Item>
                      <ListGroup.Item><FaBatteryFull /> <strong>Total kWh:</strong> {renderValue(battery['Total kWh'])} kWh</ListGroup.Item>
                      <ListGroup.Item><FaLink /> <strong>Connection:</strong> {renderValue(battery['Connection'])}</ListGroup.Item>
                      <ListGroup.Item><FaIndustry /> <strong>Chemistry:</strong> {renderValue(battery.Chemistry)}</ListGroup.Item>
                      <ListGroup.Item><FaRuler /> <strong>Dimensions:</strong> {renderValue(battery['Height(inch)'])}H x {renderValue(battery['Width(inch)'])}W x {renderValue(battery['Length(inch)'])}L inches</ListGroup.Item>
                      <ListGroup.Item><FaWeight /> <strong>Weight:</strong> {renderValue(battery['Weight(lbs)'])} lbs</ListGroup.Item>
                      <ListGroup.Item><FaRedo /> <strong>Cycles:</strong> {renderValue(battery.Cycles)}</ListGroup.Item>
                      <ListGroup.Item><FaShieldAlt /> <strong>Protection Rating:</strong> {renderValue(battery['Protection Rating'])}</ListGroup.Item>
                      <ListGroup.Item><FaBluetooth /> <strong>Bluetooth:</strong> {renderValue(battery.Bluetooth)}</ListGroup.Item>
                      <ListGroup.Item><FaThermometerHalf /> <strong>Self-Heating:</strong> {renderValue(battery['Self-Heating'])}</ListGroup.Item>
                      <ListGroup.Item><FaLink /> <strong>Max Connections:</strong> {renderValue(battery['Max Connections'])}</ListGroup.Item>
                      <ListGroup.Item><FaGlobe /> <strong>Assembled:</strong> {renderValue(battery.Assembled)}</ListGroup.Item>
                      <ListGroup.Item><strong>Features:</strong> {renderValue(battery.Features)}</ListGroup.Item>
                      <ListGroup.Item><FaCalendarAlt /> <strong>Full Warranty:</strong> {renderValue(battery['Full Warranty Years'])} Years</ListGroup.Item>
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header><FaBuilding /> Company Info</Accordion.Header>
                  <Accordion.Body>
                    {/* Company info will be added here in the future */}
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header><FaFileContract /> Warranty Info</Accordion.Header>
                  <Accordion.Body>
                    {/* Warranty info will be added here in the future */}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <div className="text-center">
                <a 
                  href={battery['Spec Link']} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-link"
                >
                  View Spec Sheet
                </a>
              </div>
            </Col>
          </Row>
          <h5 className="mt-4">Leave a Review</h5>
          <Form className="review-form">
            <Form.Group className="mb-3">
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this battery..."
                className="review-input"
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddComment} className="submit-review">
              Submit Review
            </Button>
          </Form>
          <h5 className="mt-4">Reviews</h5>
          <ListGroup className="mb-3 reviews-list">
            {comments.map((comment, index) => (
              <ListGroup.Item key={index} className="review-item">
                <p>{comment.text}</p>
                <small className="text-muted">{comment.date.toLocaleString()}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
      <ReportForm 
        show={showReportForm} 
        onHide={() => setShowReportForm(false)} 
        battery={battery}
      />
    </>
  );
};
import React, { useState } from 'react';
import { Modal, Button, Form, ListGroup, Accordion, Row, Col } from 'react-bootstrap';
import { FaBatteryFull, FaBolt, FaWeight, FaCalendarAlt, FaBluetooth, FaThermometerHalf, FaShieldAlt, FaRedo, FaThumbsUp, FaThumbsDown, FaLink, FaRuler, FaGlobe, FaIndustry, FaBuilding, FaFileContract } from 'react-icons/fa';

export const BatteryDetailView = ({ show, onHide, battery }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(null);

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
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{battery.Brand} - {battery.Name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
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
                className={`rating-button ${rating === false ? 'active' : ''}`}
                onClick={() => handleRating(false)}
              >
                <FaThumbsDown /> Dislike
              </Button>
            </div>
          </Col>
          <Col md={6}>
            <Accordion defaultActiveKey="0" className="mb-3">
              <Accordion.Item eventKey="0">
                <Accordion.Header><FaBatteryFull /> Specifications</Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush" className="specs-list">
                    <ListGroup.Item><FaBatteryFull /> Capacity: {renderValue(battery['Ah Capacity'])} Ah</ListGroup.Item>
                    <ListGroup.Item><FaBolt /> Nominal Voltage: {renderValue(battery['Nominal V'])} V</ListGroup.Item>
                    <ListGroup.Item><FaBolt /> Max Continuous: {renderValue(battery['Max Continuous'])} A</ListGroup.Item>
                    <ListGroup.Item><FaBatteryFull /> Total kWh: {renderValue(battery['Total kWh'])} kWh</ListGroup.Item>
                    <ListGroup.Item><FaLink /> Connection: {renderValue(battery['Connection'])}</ListGroup.Item>
                    <ListGroup.Item><FaIndustry /> Chemistry: {renderValue(battery.Chemistry)}</ListGroup.Item>
                    <ListGroup.Item><FaRuler /> Dimensions: {renderValue(battery['Height(inch)'])}H x {renderValue(battery['Width(inch)'])}W x {renderValue(battery['Length(inch)'])}L inches</ListGroup.Item>
                    <ListGroup.Item><FaWeight /> Weight: {renderValue(battery['Weight(lbs)'])} lbs</ListGroup.Item>
                    <ListGroup.Item><FaRedo /> Cycles: {renderValue(battery.Cycles)}</ListGroup.Item>
                    <ListGroup.Item><FaShieldAlt /> Protection Rating: {renderValue(battery['Protection Rating'])}</ListGroup.Item>
                    <ListGroup.Item><FaBluetooth /> Bluetooth: {renderValue(battery.Bluetooth)}</ListGroup.Item>
                    <ListGroup.Item><FaThermometerHalf /> Self-Heating: {renderValue(battery['Self-Heating'])}</ListGroup.Item>
                    <ListGroup.Item><FaLink /> Max Connections: {renderValue(battery['Max Connections'])}</ListGroup.Item>
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header><FaBuilding /> Company Info</Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush" className="specs-list">
                    <ListGroup.Item><FaGlobe /> Assembled: {renderValue(battery.Assembled)}</ListGroup.Item>
                    <ListGroup.Item>Features: {renderValue(battery.Features)}</ListGroup.Item>
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header><FaFileContract /> Warranty Info</Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush" className="specs-list">
                    <ListGroup.Item><FaCalendarAlt /> Full Warranty: {renderValue(battery['Full Warranty Years'])} Years</ListGroup.Item>
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
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
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button 
          variant="primary" 
          href={battery['Spec Link']} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          View Full Specs
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
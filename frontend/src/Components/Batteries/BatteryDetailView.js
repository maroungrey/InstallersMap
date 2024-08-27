import React, { useState } from 'react';
import { Modal, Button, Form, ListGroup, Badge } from 'react-bootstrap';
import { FaBatteryFull, FaBolt, FaWeight, FaCalendarAlt, FaBluetooth, FaThermometerHalf, FaShieldAlt, FaRedo, FaStar } from 'react-icons/fa';

export const BatteryDetailView = ({ show, onHide, battery }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(0);

  if (!battery) return null;

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([...comments, { text: comment, date: new Date() }]);
      setComment('');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{battery.Brand} - {battery.Name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex mb-3">
          <img src="https://placehold.co/200x200" alt={`${battery.Brand} ${battery.Name}`} className="me-3" />
          <div>
            <h5>Specifications</h5>
            <ListGroup variant="flush">
              <ListGroup.Item><FaBatteryFull /> Capacity: {battery['Ah Capacity']} Ah</ListGroup.Item>
              <ListGroup.Item><FaBolt /> Voltage: {battery['Nominal V']} V</ListGroup.Item>
              <ListGroup.Item><FaWeight /> Weight: {battery['Weight(lbs)']} lbs</ListGroup.Item>
              <ListGroup.Item><FaCalendarAlt /> Warranty: {battery['Full Warranty Years']} Years</ListGroup.Item>
              <ListGroup.Item>Chemistry: {battery.Chemistry}</ListGroup.Item>
              <ListGroup.Item>Total kWh: {battery['Total kWh']}</ListGroup.Item>
              <ListGroup.Item><FaBluetooth /> Bluetooth: {battery.Bluetooth}</ListGroup.Item>
              <ListGroup.Item><FaThermometerHalf /> Self-Heating: {battery['Self-Heating']}</ListGroup.Item>
              <ListGroup.Item><FaShieldAlt /> Protection Rating: {battery['Protection Rating']}</ListGroup.Item>
              <ListGroup.Item><FaRedo /> Cycles: {battery.Cycles}</ListGroup.Item>
            </ListGroup>
          </div>
        </div>
        <h5>Rating</h5>
        <div className="mb-3">
          {[...Array(5)].map((star, index) => {
            index += 1;
            return (
              <FaStar
                key={index}
                className={index <= rating ? "text-warning" : "text-muted"}
                style={{ cursor: 'pointer' }}
                onClick={() => setRating(index)}
              />
            );
          })}
        </div>
        <h5>Comments</h5>
        <ListGroup className="mb-3">
          {comments.map((comment, index) => (
            <ListGroup.Item key={index}>
              <p>{comment.text}</p>
              <small className="text-muted">{comment.date.toLocaleString()}</small>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control 
              as="textarea" 
              rows={3} 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
            />
          </Form.Group>
          <Button variant="primary" onClick={handleAddComment}>
            Add Comment
          </Button>
        </Form>
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
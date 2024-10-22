import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { 
  FaTrophy, FaMedal, FaStar, FaCrown, FaAward,
  FaGem, FaShieldAlt, FaBolt, FaHeart, FaCheckCircle 
} from 'react-icons/fa';

const Achievements = () => {
  const trophies = [
    { icon: <FaTrophy className="text-warning" size={24} />, name: "Early Adopter" },
    { icon: <FaMedal className="text-info" size={24} />, name: "Top Contributor" },
    { icon: <FaStar className="text-danger" size={24} />, name: "Rising Star" },
    { icon: <FaCrown className="text-warning" size={24} />, name: "Community Leader" },
    { icon: <FaAward className="text-primary" size={24} />, name: "Expert" },
    { icon: <FaGem className="text-info" size={24} />, name: "Valuable Member" },
    { icon: <FaShieldAlt className="text-success" size={24} />, name: "Trusted User" },
    { icon: <FaBolt className="text-warning" size={24} />, name: "Quick Responder" },
    { icon: <FaHeart className="text-danger" size={24} />, name: "Helpful Member" },
    { icon: <FaCheckCircle className="text-success" size={24} />, name: "Verified" }
  ];

  return (
    <Card className="mt-4">
      <Card.Header>
        <h5 className="mb-0">Achievements</h5>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          {trophies.map((trophy, index) => (
            <Col xs={6} key={index}>
              <div className="d-flex align-items-center p-2">
                <div className="me-2">{trophy.icon}</div>
                <small>{trophy.name}</small>
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Achievements;

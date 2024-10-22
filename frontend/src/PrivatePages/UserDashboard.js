import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Alert, Spinner, Nav } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const UserDashboard = () => {
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchComparisons = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/users/${user}/comparisons`);
        setComparisons(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchComparisons();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Failed to logout. Please try again.');
    }
  };

  const handleProfileClick = () => {
    navigate(`/user/${user}`);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Your Dashboard</h2>
            <div>
              <Button 
                variant="outline-primary" 
                className="me-2"
                onClick={handleProfileClick}
              >
                View Profile
              </Button>
              <Button 
                variant="outline-danger"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Header>Navigation</Card.Header>
            <Nav className="flex-column">
              <Nav.Link href="#comparisons" className="active">My Comparisons</Nav.Link>
              <Nav.Link href="#saved">Saved Items</Nav.Link>
              <Nav.Link href="#settings">Settings</Nav.Link>
            </Nav>
          </Card>
        </Col>

        <Col md={9}>
          <Card>
            <Card.Header>
              <h3 className="h5 mb-0">Your Comparisons</h3>
            </Card.Header>
            <Card.Body>
              {comparisons.length === 0 ? (
                <Alert variant="info">
                  You haven't made any comparisons yet.
                  <div className="mt-3">
                    <Button 
                      variant="primary"
                      onClick={() => navigate('/battery-comparison')}
                    >
                      Create Your First Comparison
                    </Button>
                  </div>
                </Alert>
              ) : (
                <ListGroup variant="flush">
                  {comparisons.map(comparison => (
                    <ListGroup.Item 
                      key={comparison._id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h6 className="mb-0">{comparison.title}</h6>
                        <small className="text-muted">
                          {new Date(comparison.date).toLocaleDateString()}
                        </small>
                      </div>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => navigate(`/comparison/${comparison._id}`)}
                      >
                        View Details
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;
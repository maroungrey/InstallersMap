import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Tab, Nav, Image } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [imagePreview, setImagePreview] = useState(null);
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if the current user is the profile owner
  const isOwner = user === userId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/users/${userId}`);
        setProfile(response.data);
        setImagePreview(response.data.photoUrl);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleEdit = () => {
    if (!user) {
      // If not logged in, redirect to login page with return URL
      navigate('/login', { state: { from: `/user/${userId}` } });
      return;
    }
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      if (!isOwner) {
        setError('You do not have permission to edit this profile');
        return;
      }

      setLoading(true);
      await axios.put(`http://localhost:8081/api/users/${userId}`, profile, {
        withCredentials: true // Important for authentication
      });
      setEditing(false);
      // Refresh profile data
      const response = await axios.get(`http://localhost:8081/api/users/${userId}`);
      setProfile(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while saving');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!isOwner) {
        setError('You do not have permission to change this profile picture');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfile(prev => ({
          ...prev,
          photoUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
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

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="py-5">
        <Alert variant="warning">User not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Body className="text-center">
              <div className="position-relative mb-4">
                <Image
                  src={imagePreview || 'https://via.placeholder.com/150'}
                  roundedCircle
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
                {editing && isOwner && (
                  <div className="position-absolute bottom-0 end-0">
                    <Form.Group>
                      <Form.Label className="btn btn-primary btn-sm rounded-circle">
                        <i className="bi bi-camera"></i>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                        />
                      </Form.Label>
                    </Form.Group>
                  </div>
                )}
              </div>
              <h3 className="mb-0">{profile.username}</h3>
              <p className="text-muted">{profile.email}</p>
              {isOwner && !editing && (
                <Button 
                  variant="outline-primary" 
                  onClick={handleEdit}
                  className="w-100"
                >
                  Edit Profile
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card>
            <Card.Header>
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'profile'}
                    onClick={() => setActiveTab('profile')}
                  >
                    Profile
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'activity'}
                    onClick={() => setActiveTab('activity')}
                  >
                    Activity
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'comparisons'}
                    onClick={() => setActiveTab('comparisons')}
                  >
                    Comparisons
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              {activeTab === 'profile' && (
                editing && isOwner ? (
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={profile.username}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleChange}
                        placeholder="Your location"
                      />
                    </Form.Group>

                    <div className="d-flex gap-2">
                      <Button variant="primary" onClick={handleSave}>
                        Save Changes
                      </Button>
                      <Button variant="outline-secondary" onClick={() => setEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <div>
                    <h5>About</h5>
                    <p>{profile.bio || 'No bio provided'}</p>
                    
                    <h5 className="mt-4">Details</h5>
                    <Row>
                      <Col sm={3} className="text-muted">Location</Col>
                      <Col sm={9}>{profile.location || 'Not specified'}</Col>
                      
                      <Col sm={3} className="text-muted">Joined</Col>
                      <Col sm={9}>
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </Col>
                    </Row>
                  </div>
                )
              )}

              {activeTab === 'activity' && (
                <div>
                  <h5>Recent Activity</h5>
                  <Alert variant="info">
                    No recent activity to display
                  </Alert>
                </div>
              )}

              {activeTab === 'comparisons' && (
                <div>
                  <h5>Comparisons</h5>
                  <Alert variant="info">
                    No comparisons created yet
                  </Alert>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
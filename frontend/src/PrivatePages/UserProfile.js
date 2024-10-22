import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Tab, Nav, Image, Modal } from 'react-bootstrap';
import { 
  FaTrophy, 
  FaMedal, 
  FaStar, 
  FaCrown, 
  FaAward, 
  FaGem,
  FaShieldAlt,
  FaBolt,
  FaHeart,
  FaCheckCircle 
} from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [imagePreview, setImagePreview] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
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
        withCredentials: true
      });
      setEditing(false);
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

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReport = async () => {
    try {
      await axios.post(`http://localhost:8081/api/users/${userId}/report`, {
        reason: reportReason
      }, {
        withCredentials: true
      });
      setShowReportModal(false);
      setReportReason('');
      // Show success message
      alert('Report submitted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    }
  };

  // Loading and error states remain the same...
  if (loading) return <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </Container>;

  if (error) return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;

  if (!profile) return <Container className="py-5"><Alert variant="warning">User not found</Alert></Container>;

  return (
    <Container className="py-5">
      <Row>
        <Col lg={4} className="mb-4">
          {/* Profile Card */}
          <Card className="mb-4">
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
                      <Form.Label className="btn btn-primary rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
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
              {profile.realName && <p className="text-muted mb-2">{profile.realName}</p>}
              
              {/* Stats Section */}
              <div className="d-flex justify-content-around mb-3">
                <div className="text-center">
                  <h6>{profile.stats?.posts || 0}</h6>
                  <small className="text-muted">Posts</small>
                </div>
                <div className="text-center">
                  <h6>{profile.stats?.comments || 0}</h6>
                  <small className="text-muted">Comments</small>
                </div>
                <div className="text-center">
                  <h6>{profile.stats?.likes || 0}</h6>
                  <small className="text-muted">Reputation</small>
                </div>
              </div>

              {/* Action Buttons */}
              {isOwner && !editing ? (
                <Button 
                  variant="outline-primary" 
                  onClick={handleEdit}
                  className="w-100 mb-2"
                >
                  Edit Profile
                </Button>
              ) : !isOwner && user && (
                <Button 
                  variant="outline-danger" 
                  onClick={() => setShowReportModal(true)}
                  className="w-100 mb-2"
                >
                  Report Profile
                </Button>
              )}
            </Card.Body>
          </Card>

          {/* Trophies Card */}
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
        </Col>

        <Col lg={8}>
          {/* About Card */}
          <Card className="mb-4">
            <Card.Body>
              {editing && isOwner ? (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Real Name (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="realName"
                      value={profile.realName || ''}
                      onChange={handleChange}
                      placeholder="Your real name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="bio"
                      value={profile.bio || ''}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={profile.location || ''}
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
                    {profile.realName && (
                      <>
                        <Col sm={3} className="text-muted">Name</Col>
                        <Col sm={9} className="mb-2">{profile.realName}</Col>
                      </>
                    )}
                    
                    <Col sm={3} className="text-muted">Location</Col>
                    <Col sm={9} className="mb-2">{profile.location || 'Not specified'}</Col>
                    
                    <Col sm={3} className="text-muted">Joined</Col>
                    <Col sm={9} className="mb-2">
                      {formatDateTime(profile.createdAt)}
                    </Col>

                    <Col sm={3} className="text-muted">Last seen</Col>
                    <Col sm={9} className="mb-2">
                      {formatDateTime(profile.lastSeen || profile.createdAt)}
                    </Col>
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Tabs Card */}
          <Card>
            <Card.Header>
              <Nav variant="tabs">
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
                    active={activeTab === 'posts'}
                    onClick={() => setActiveTab('posts')}
                  >
                    Posts
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
              {activeTab === 'activity' && (
                <div>
                  <h5>Recent Activity</h5>
                  <Alert variant="info">
                    No recent activity to display
                  </Alert>
                </div>
              )}

              {activeTab === 'posts' && (
                <div>
                  <h5>Posts</h5>
                  <Alert variant="info">
                    No posts to display
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

      {/* Report Modal remains the same */}
    </Container>
  );
};

export default UserProfile;
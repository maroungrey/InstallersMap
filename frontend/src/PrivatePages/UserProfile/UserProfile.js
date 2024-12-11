import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import ReportModal from './ReportModal';
import Achievements from './Achievements';
import ProfileDetails from './ProfileDetails';

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('activity');
  const [userPosts, setUserPosts] = useState([]);
  const [userActivities, setUserActivities] = useState([]);
  const [isLoadingTab, setIsLoadingTab] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comparisons, setComparisons] = useState([]);



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

  useEffect(() => {
    const fetchTabContent = async () => {
      setIsLoadingTab(true);
      try {
        if (activeTab === 'posts') {
          const response = await axios.get(`http://localhost:8081/api/users/${userId}/posts`);
          setUserPosts(response.data);
        } else if (activeTab === 'activity') {
          const response = await axios.get(`http://localhost:8081/api/users/${userId}/activities`);
          setUserActivities(response.data);
        }
      } catch (err) {
        console.error('Error fetching tab content:', err);
      } finally {
        setIsLoadingTab(false);
      }
    };

    fetchTabContent();
  }, [activeTab, userId]);

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

  const handleReport = async () => {
    try {
      await axios.post(`http://localhost:8081/api/users/${userId}/report`, {
        reason: reportReason
      }, {
        withCredentials: true
      });
      setShowReportModal(false);
      setReportReason('');
      alert('Report submitted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    }
  };

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );

  if (error) return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;

  if (!profile) return <Container className="py-5"><Alert variant="warning">User not found</Alert></Container>;

  return (
    <Container className="py-5">
      <Row>
        <Col lg={4} className="mb-4">
          <ProfileHeader 
            profile={profile}
            imagePreview={imagePreview}
            isOwner={isOwner}
            editing={editing}
            handleEdit={handleEdit}
            handleImageChange={handleImageChange}
            setShowReportModal={setShowReportModal}
            user={user}
          />
          <Achievements />
        </Col>

        <Col lg={8}>
          <ProfileDetails 
            profile={profile}
            editing={editing}
            isOwner={isOwner}
            handleChange={handleChange}
            handleSave={handleSave}
            setEditing={setEditing}
            formatDateTime={formatDateTime}
          />
      <ProfileTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        posts={userPosts}
        activities={userActivities}
        isLoading={isLoadingTab}
        navigate={navigate}
      />
        </Col>
      </Row>

      <ReportModal 
        showReportModal={showReportModal}
        setShowReportModal={setShowReportModal}
        reportReason={reportReason}
        setReportReason={setReportReason}
        handleReport={handleReport}
      />
    </Container>
  );
};
export default UserProfile;
import React from 'react';
import { Card, Nav, Alert, Spinner } from 'react-bootstrap';
import { FaThumbsUp, FaComment, FaClock } from 'react-icons/fa';

const ProfileTabs = ({ 
  activeTab, 
  setActiveTab, 
  posts = [], 
  activities = [],
  isLoading,
  navigate
}) => {
  const renderPosts = () => {
    if (isLoading) {
      return (
        <div className="text-center py-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }
    
    if (!posts.length) {
      return <Alert variant="info">No posts to display</Alert>;
    }

    return posts.map(post => (
      <Card key={post._id} className="mb-3 cursor-pointer" onClick={() => navigate(`/forums/post/${post._id}`)}>
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>
          <div className="text-muted small">
            <FaClock className="me-1" />
            {new Date(post.createdAt).toLocaleDateString()}
            <span className="ms-3">
              <FaThumbsUp className="me-1" />
              {post.likesCount || 0}
            </span>
            <span className="ms-3">
              <FaComment className="me-1" />
              {post.commentsCount || 0}
            </span>
          </div>
        </Card.Body>
      </Card>
    ));
  };

  const renderActivities = () => {
    if (isLoading) {
      return (
        <div className="text-center py-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }
    
    if (!activities.length) {
      return <Alert variant="info">No recent activity to display</Alert>;
    }

    return activities.map((activity, index) => (
      <Card key={`${activity.type}-${activity.post._id}-${index}`} className="mb-3">
        <Card.Body>
          <div className="d-flex align-items-center">
            {activity.type === 'comment' ? (
              <>
                <FaComment className="me-2 text-primary" />
                <div>
                  Commented on <span 
                    className="text-primary cursor-pointer" 
                    onClick={() => navigate(`/forums/post/${activity.post._id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {activity.post.title}
                  </span>
                  <div className="text-muted small">
                    <FaClock className="me-1" />
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </>
            ) : (
              <>
                <FaThumbsUp className="me-2 text-primary" />
                <div>
                  Liked <span 
                    className="text-primary cursor-pointer" 
                    onClick={() => navigate(`/forums/post/${activity.post._id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {activity.post.title}
                  </span>
                  <div className="text-muted small">
                    <FaClock className="me-1" />
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    ));
  };

  return (
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
        </Nav>
      </Card.Header>
      <Card.Body>
        {activeTab === 'activity' && (
          <div>
            <h5>Recent Activity</h5>
            {renderActivities()}
          </div>
        )}

        {activeTab === 'posts' && (
          <div>
            <h5>Posts</h5>
            {renderPosts()}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProfileTabs;
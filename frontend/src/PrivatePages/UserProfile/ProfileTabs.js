import React from 'react';
import { Card, Nav, Alert } from 'react-bootstrap';

const ProfileTabs = ({ activeTab, setActiveTab }) => {
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
  );
};

export default ProfileTabs;
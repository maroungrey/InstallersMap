import React from 'react';
import { Card, Image, Button, Form } from 'react-bootstrap';

const ProfileHeader = ({ 
  profile, 
  imagePreview, 
  isOwner, 
  editing, 
  handleEdit, 
  handleImageChange, 
  setShowReportModal, 
  user 
}) => {
  return (
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
            <h6>{profile.stats?.reputation || 0}</h6>
            <small className="text-muted">Reputation</small>
          </div>
        </div>

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
  );
};

export default ProfileHeader;
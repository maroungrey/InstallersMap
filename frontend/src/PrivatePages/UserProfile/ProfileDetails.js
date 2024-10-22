import React from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';

const ProfileDetails = ({ 
  profile, 
  editing, 
  isOwner, 
  handleChange, 
  handleSave, 
  setEditing,
  formatDateTime 
}) => {
  return (
    <Card className="mb-4">
      <Card.Body>
        {editing && isOwner ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name (Optional)</Form.Label>
              <Form.Control
                type="text"
                name="realName"
                value={profile.realName || ''}
                onChange={handleChange}
                placeholder="Your name"
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
  );
};

export default ProfileDetails;
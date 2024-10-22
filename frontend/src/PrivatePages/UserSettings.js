import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const UserSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Email change state
  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: ''
  });
  const [emailErrors, setEmailErrors] = useState({});

  // Password validation
  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    } else if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return '';
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setPasswordErrors({});

    // Validate passwords
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    const newPasswordError = validatePassword(passwordData.newPassword);
    if (newPasswordError) {
      errors.newPassword = newPasswordError;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await axios.put(`/api/users/${user}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccessMessage('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  // Handle email change
  const handleEmailChange = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setEmailErrors({});

    // Validate email
    const errors = {};
    if (!emailData.newEmail) {
      errors.newEmail = 'New email is required';
    } else if (!/\S+@\S+\.\S+/.test(emailData.newEmail)) {
      errors.newEmail = 'Please enter a valid email address';
    }
    if (!emailData.password) {
      errors.password = 'Password is required to confirm email change';
    }

    if (Object.keys(errors).length > 0) {
      setEmailErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await axios.put(`/api/users/${user}/email`, emailData);
      
      setSuccessMessage('Email updated successfully');
      setEmailData({
        newEmail: '',
        password: ''
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Account Settings</h2>
      
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </Alert>
      )}
      
      {errorMessage && (
        <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
          {errorMessage}
        </Alert>
      )}

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h4 className="mb-0">Change Password</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handlePasswordChange}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value
                    })}
                    isInvalid={!!passwordErrors.currentPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {passwordErrors.currentPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value
                    })}
                    isInvalid={!!passwordErrors.newPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {passwordErrors.newPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordData.confirmNewPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      confirmNewPassword: e.target.value
                    })}
                    isInvalid={!!passwordErrors.confirmNewPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {passwordErrors.confirmNewPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Change Email</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleEmailChange}>
                <Form.Group className="mb-3">
                  <Form.Label>New Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={emailData.newEmail}
                    onChange={(e) => setEmailData({
                      ...emailData,
                      newEmail: e.target.value
                    })}
                    isInvalid={!!emailErrors.newEmail}
                  />
                  <Form.Control.Feedback type="invalid">
                    {emailErrors.newEmail}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={emailData.password}
                    onChange={(e) => setEmailData({
                      ...emailData,
                      password: e.target.value
                    })}
                    isInvalid={!!emailErrors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {emailErrors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? 'Updating...' : 'Update Email'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserSettings;
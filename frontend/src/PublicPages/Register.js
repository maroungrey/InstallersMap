import React, { useState } from 'react';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    userType: '',
    zipcode: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { 
    username, email, password, confirmPassword, firstName, lastName, 
    dateOfBirth, userType, zipcode 
  } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    const newErrors = {};
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    if (!userType) {
      newErrors.userType = "Please select a user type";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await axios.post('http://localhost:8081/api/auth/register', formData);
        localStorage.setItem('token', res.data.token);
        navigate('/user-profile');
      } catch (err) {
        setErrors({ server: err.response.data.msg || "An error occurred during registration" });
      }
    }
  };

  return (
    <Container className="mt-5">
      <h2>Register</h2>
      {errors.server && <Alert variant="danger">{errors.server}</Alert>}
      <Form onSubmit={onSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                value={username}
                onChange={onChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
                required
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                required
                isInvalid={!!errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                name="firstName"
                value={firstName}
                onChange={onChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="lastName"
                value={lastName}
                onChange={onChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            name="dateOfBirth"
            value={dateOfBirth}
            onChange={onChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>User Type</Form.Label>
          <Form.Select
            name="userType"
            value={userType}
            onChange={onChange}
            required
            isInvalid={!!errors.userType}
          >
            <option value="">Select user type</option>
            <option value="individual">Individual</option>
            <option value="business">Business</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.userType}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            This information is for statistical purposes only.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Zipcode</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter zipcode"
            name="zipcode"
            value={zipcode}
            onChange={onChange}
            required
            isInvalid={!!errors.zipcode}
          />
          <Form.Control.Feedback type="invalid">
            {errors.zipcode}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            {/* Your zipcode helps us improve our website and provide better recommendations. We do not sell this information. */}
          </Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
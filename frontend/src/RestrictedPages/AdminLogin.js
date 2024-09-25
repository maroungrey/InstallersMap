import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
        const response = await axios.post('http://localhost:8081/api/admin-dashboard/login', { username, password });
        if (response.data.success) {
            localStorage.setItem('adminToken', response.data.token);
            onLogin();
            navigate('/admin-dashboard');
        } else {
            setError('Invalid credentials');
        }
    } catch (err) {
        console.error('Login error:', err);
        setError('An error occurred. Please try again.');
    }
};

  return (
      <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div>
              <label htmlFor="username">Username:</label>
              <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
              />
          </div>
          <div>
              <label htmlFor="password">Password:</label>
              <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
          </div>
          <button type="submit">Login</button>
      </form>
  );
}

export default AdminLogin;
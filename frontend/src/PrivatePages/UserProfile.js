import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      <h2>User Profile</h2>
      <p>User ID: {user}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserProfile;
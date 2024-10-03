import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:8081'; // Make sure this matches your backend URL

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      checkAuth();
    }, []);
  
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/check-auth`);
        setUser(res.data.userId);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          // This is an expected response when the user is not authenticated
          console.log('User is not authenticated');
        } else {
          console.error('Unexpected error during auth check:', error);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    const login = async (email, password) => {
      try {
        const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
        setUser(res.data.userId);
        // Set the token in axios defaults for subsequent requests
        axios.defaults.headers.common['x-access-token'] = res.data.token;
        return true;
      } catch (error) {
        console.error('Login error:', error.response?.data?.message || error.message);
        return false;
      }
    };

  const register = async (username, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, { username, email, password });
      setUser(res.data.userId);
      // Set the token in axios defaults for subsequent requests
      axios.defaults.headers.common['x-access-token'] = res.data.token;
      return true;
    } catch (error) {
      console.error('Registration error:', error.response?.data?.message || error.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`);
      setUser(null);
      // Remove the token from axios defaults
      delete axios.defaults.headers.common['x-access-token'];
    } catch (error) {
      console.error('Logout error:', error.response?.data?.message || error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
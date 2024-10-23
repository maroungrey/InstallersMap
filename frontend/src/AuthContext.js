import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:8081';

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      checkAuth();
    }, []);
  
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/check-auth`, {
          headers: {
            'x-auth-token': localStorage.getItem('token') // Changed to x-auth-token
          }
        });
        setUser(res.data.userId);
      } catch (error) {
        if (error.response && error.response.status === 403) {
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
        // Store token in localStorage
        localStorage.setItem('token', res.data.token);
        // Set the token in axios defaults
        axios.defaults.headers.common['x-auth-token'] = res.data.token; // Changed to x-auth-token
        return true;
      } catch (error) {
        console.error('Login error:', error.response?.data?.message || error.message);
        return false;
      }
    };

    const register = async (username, email, password) => {
      try {
        const res = await axios.post(`${API_URL}/api/auth/register`, { 
          username, 
          email, 
          password 
        });
        setUser(res.data.userId);
        // Store token in localStorage
        localStorage.setItem('token', res.data.token);
        // Set the token in axios defaults
        axios.defaults.headers.common['x-auth-token'] = res.data.token; // Changed to x-auth-token
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
        // Remove the token from localStorage
        localStorage.removeItem('token');
        // Remove the token from axios defaults
        delete axios.defaults.headers.common['x-auth-token']; // Changed to x-auth-token
      } catch (error) {
        console.error('Logout error:', error.response?.data?.message || error.message);
      }
    };

    // Set initial token from localStorage if it exists
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
      }
    }, []);

    return (
      <AuthContext.Provider value={{ user, loading, login, register, logout }}>
        {children}
      </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
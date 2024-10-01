import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

export const loginUser = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true // This is important for handling HTTPOnly cookies
      });
      return response.data.user;
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };
  
  export const logoutUser = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };
  
  export const refreshAuthToken = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
        withCredentials: true
      });
      return response.data.user;
    } catch (error) {
      console.error('Token refresh failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };
  
  export const getCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true
      });
      return response.data.user;
    } catch (error) {
      console.error('Failed to get current user:', error.response?.data?.message || error.message);
      throw error;
    }
  };
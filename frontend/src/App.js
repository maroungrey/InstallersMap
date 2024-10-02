import React, { useState } from 'react';
import './App.css';
import './Styles/CustomStyles.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Common/Navbar';
import Footer from './Components/Common/Footer';
import Home from './PublicPages/Home';
import InstallersMap from './PublicPages/InstallersMap';
import BatteryComparison from './PublicPages/BatteryComparison';
import Contact from './PublicPages/Contact';
import Login from './PublicPages/Login';
import Register from './PublicPages/Register';
import ProjectStory from './PublicPages/ProjectStory';
import NoPage from './PublicPages/NoPage';
import UserProfile from './PrivatePages/UserProfile';
import AdminLogin from './RestrictedPages/AdminLogin';
import AdminDashboard from './RestrictedPages/AdminDashboard';

// Define PrivateRoute component
const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('token') !== null; // Check if token exists
  return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar isAdminLoggedIn={isAdminLoggedIn} onAdminLogout={handleAdminLogout} />
        <main className="flex-grow-1">
          <Routes>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/installers-map" element={<InstallersMap />} />
            <Route path="/battery-comparison" element={<BatteryComparison />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/project-story" element={<ProjectStory />} />
            <Route 
              path="/user-profile" 
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              } 
            />
            <Route path="/admin-dashboard">
              <Route index element={isAdminLoggedIn ? <AdminDashboard /> : <Navigate to="/admin-dashboard/login" />} />
              <Route path="login" element={<AdminLogin onLogin={handleAdminLogin} />} />
            </Route>
            <Route path="*" element={<NoPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
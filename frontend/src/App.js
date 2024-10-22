import React, { useState } from 'react';
import './App.css';
import './Styles/CustomStyles.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './Components/Common/Navbar';
import Footer from './Components/Common/Footer';

// Public Pages
import Home from './PublicPages/Home';
import InstallersMap from './PublicPages/InstallersMap';
import BatteryComparison from './PublicPages/BatteryComparison';
import Contact from './PublicPages/Contact';
import Login from './PublicPages/Login';
import Register from './PublicPages/Register';
import ProjectStory from './PublicPages/ProjectStory';
import NoPage from './PublicPages/NoPage';

// Private Pages
import UserProfile from './PrivatePages/UserProfile';
import UserDashboard from './PrivatePages/UserDashboard';

// Admin Pages
import AdminLogin from './RestrictedPages/AdminLogin';
import AdminDashboard from './RestrictedPages/AdminDashboard';

// Protected Route Components
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!user) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (user) {
    // Redirect authenticated users away from login/register pages
    return <Navigate to={location.state?.from || "/dashboard"} replace />;
  }

  return children;
};

const AdminRoute = ({ children, isAdminLoggedIn }) => {
  const location = useLocation();

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin-dashboard/login" state={{ from: location }} replace />;
  }

  return children;
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
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Navbar isAdminLoggedIn={isAdminLoggedIn} onAdminLogout={handleAdminLogout} />
          <main className="flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route index element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/installers-map" element={<InstallersMap />} />
              <Route path="/battery-comparison" element={<BatteryComparison />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/project-story" element={<ProjectStory />} />
              <Route path="/user/:userId" element={<UserProfile />} />
              
              {/* Authentication Routes */}
              <Route 
                path="/login" 
                element={
                  <PublicOnlyRoute>
                    <Login />
                  </PublicOnlyRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicOnlyRoute>
                    <Register />
                  </PublicOnlyRoute>
                } 
              />

              {/* Protected User Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <UserDashboard />
                  </PrivateRoute>
                } 
              />

              {/* Admin Routes */}
              <Route path="/admin-dashboard">
                <Route 
                  index 
                  element={
                    <AdminRoute isAdminLoggedIn={isAdminLoggedIn}>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="login" 
                  element={<AdminLogin onLogin={handleAdminLogin} />} 
                />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NoPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
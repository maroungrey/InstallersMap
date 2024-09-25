import React, { useState } from 'react';
import './App.css';
import './Styles/CustomStyles.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Common/Navbar';
import Home from './PublicPages/Home';
import InstallersMap from './PublicPages/InstallersMap';
import BatteryComparison from './PublicPages/BatteryComparison';
import Contact from './PublicPages/Contact';
import NoPage from './PublicPages/NoPage';
import AdminLogin from './RestrictedPages/AdminLogin';
import AdminDashboard from './RestrictedPages/AdminDashboard';

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
      <Navbar isAdminLoggedIn={isAdminLoggedIn} onAdminLogout={handleAdminLogout} />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/installers-map" element={<InstallersMap />} />
          <Route path="/battery-comparison" element={<BatteryComparison />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin-dashboard">
            <Route index element={isAdminLoggedIn ? <AdminDashboard /> : <Navigate to="/admin-dashboard/login" />} />
            <Route path="login" element={<AdminLogin onLogin={handleAdminLogin} />} />
          </Route>
          <Route path="*" element={<NoPage />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
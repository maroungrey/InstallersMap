import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { FaSearch, FaUserCircle, FaChevronDown } from 'react-icons/fa';

const NavigationBar = ({ isAdminLoggedIn, onAdminLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState('');
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery('');
  };

  const handleProfileClick = () => {
    navigate(`/user/${user}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout. Please try again.');
    }
  };

  const handleDropdown = (eventKey) => {
    setOpenDropdown(openDropdown === eventKey ? '' : eventKey);
  };

  const toggleNav = () => {
    setIsNavExpanded(!isNavExpanded);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-2 sticky-top">
      <div className="container-fluid">
        <a className="navbar-brand py-0" href="/">Compare Batteries</a>
        
        <button 
          className={`navbar-toggler ${isNavExpanded ? 'expanded' : ''}`}
          type="button" 
          onClick={toggleNav}
          aria-controls="basic-navbar-nav"
          aria-expanded={isNavExpanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon">
            <span></span>
          </span>
        </button>

        <div className={`navbar-collapse collapse ${isNavExpanded ? 'show' : ''}`} id="basic-navbar-nav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link py-2" href="/">Home</a>
            </li>
            
            <li className={`nav-item dropdown nav-dropdown ${openDropdown === 'products' ? 'show' : ''}`}>
              <a
                className="nav-link dropdown-toggle py-2"
                href="#"
                role="button"
                onClick={() => handleDropdown('products')}
                aria-expanded={openDropdown === 'products'}
              >
                <span className="d-flex align-items-center">
                  Product Research
                  <FaChevronDown className={`ms-1 dropdown-arrow ${openDropdown === 'products' ? 'rotated' : ''}`} />
                </span>
              </a>
              <ul className={`dropdown-menu ${openDropdown === 'products' ? 'show' : ''}`}>
                <li><a className="dropdown-item" href="/battery-comparison">Compare Batteries</a></li>
                <li><a className="dropdown-item" href="/solar-panels-comparison">Compare Solar Panels</a></li>
                <li><a className="dropdown-item" href="/inverters-comparison">Compare Inverters</a></li>
                <li><a className="dropdown-item" href="/installers-map">Find Installers</a></li>
              </ul>
            </li>

            <li className="nav-item">
              <a className="nav-link py-2" href="/forum">Forum</a>
            </li>

            <li className={`nav-item dropdown nav-dropdown ${openDropdown === 'resources' ? 'show' : ''}`}>
              <a
                className="nav-link dropdown-toggle py-2"
                href="#"
                role="button"
                onClick={() => handleDropdown('resources')}
                aria-expanded={openDropdown === 'resources'}
              >
                <span className="d-flex align-items-center">
                  Resources
                  <FaChevronDown className={`ms-1 dropdown-arrow ${openDropdown === 'resources' ? 'rotated' : ''}`} />
                </span>
              </a>
              <ul className={`dropdown-menu ${openDropdown === 'resources' ? 'show' : ''}`}>
                <li><a className="dropdown-item" href="/help">Help Center</a></li>
                <li><a className="dropdown-item" href="/contact">Contact Us</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="/terms">Terms & Rules</a></li>
                <li><a className="dropdown-item" href="/privacy">Privacy Policy</a></li>
              </ul>
            </li>
          </ul>

          <div className="d-flex align-items-center search-container">
            <form className="d-flex flex-grow-1 me-2" onSubmit={handleSearchSubmit}>
              <input
                type="search"
                className="form-control me-2 py-1"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary px-2 py-1">
                <FaSearch size={18} />
              </button>
            </form>

            <div className={`dropdown ${openDropdown === 'user' ? 'show' : ''}`}>
              <a
                className="nav-link py-2"
                href="#"
                role="button"
                onClick={() => handleDropdown('user')}
                aria-expanded={openDropdown === 'user'}
              >
                <FaUserCircle size={25} />
              </a>
              <ul className={`dropdown-menu dropdown-menu-end ${openDropdown === 'user' ? 'show' : ''}`}>
                {user ? (
                  <>
                    <li><a className="dropdown-item" onClick={handleProfileClick}>Profile</a></li>
                    <li><a className="dropdown-item" href="/dashboard">Dashboard</a></li>
                    <li><a className="dropdown-item" href="/settings">Settings</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" onClick={handleLogout}>Logout</a></li>
                  </>
                ) : (
                  <>
                    <li><a className="dropdown-item" href="/login">Login</a></li>
                    <li><a className="dropdown-item" href="/register">Register</a></li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
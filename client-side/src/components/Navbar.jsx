import React, { useContext, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaBuilding, FaUserCircle, FaSignOutAlt, FaCaretDown } from 'react-icons/fa';
import '../Styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav id="navbar" className="navbar navbar-expand-lg fixed-top navbar-light bg-light shadow">
      <div className="container">
        <Link to="/dashboard" className="navbar-brand">
          <FaBuilding className="nav-icon" />
          <span className="brand-text">Dormitory Management</span>
        </Link>

        <div className="nav-user-section">
          <div className="dropdown" ref={dropdownRef}>
            <button
              className="user-dropdown-toggle"
              type="button"
              id="userDropdown"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FaUserCircle className="nav-icon" />
              <span className="ms-2">{user?.name || 'Guest'}</span>
              <FaCaretDown className="ms-1" />
            </button>
            {isDropdownOpen && (
              <ul
                className="dropdown-menu dropdown-menu-end shadow show"
                aria-labelledby="userDropdown"
                style={{ position: 'absolute', right: 0, top: '100%', zIndex: 1050 }}
              >
                <li>
                  <Link to="/profile" className="dropdown-item">
                    <FaUserCircle className="dropdown-icon" />
                    <span>Profile <strong style={{ color: 'red' }}>(Updating)</strong></span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <FaSignOutAlt className="dropdown-icon" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
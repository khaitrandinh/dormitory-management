import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaBuilding, FaUserCircle, FaSignOutAlt, FaCaretDown } from 'react-icons/fa';
import '../Styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    let hoverArea = document.createElement('div');
    hoverArea.style.position = 'fixed';
    hoverArea.style.top = '0';
    hoverArea.style.left = '0';
    hoverArea.style.width = '100%';
    hoverArea.style.height = '10px';
    hoverArea.style.zIndex = '9999';

    const handleMouseEnter = () => setShowNavbar(true);
    const handleMouseLeave = (e) => {
      if (!document.getElementById('navbar')?.contains(e.relatedTarget)) {
        setShowNavbar(false);
      }
    };

    hoverArea.addEventListener('mouseenter', handleMouseEnter);
    hoverArea.addEventListener('mouseleave', handleMouseLeave);
    
    document.getElementById('navbar')?.addEventListener('mouseleave', handleMouseLeave);
    document.getElementById('navbar')?.addEventListener('mouseenter', handleMouseEnter);

    document.body.appendChild(hoverArea);

    return () => {
      hoverArea.removeEventListener('mouseenter', handleMouseEnter);
      hoverArea.removeEventListener('mouseleave', handleMouseLeave);
      document.getElementById('navbar')?.removeEventListener('mouseleave', handleMouseLeave);
      document.getElementById('navbar')?.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeChild(hoverArea);
    };
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
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
    <nav id="navbar" className={`navbar navbar-expand-lg fixed-top ${showNavbar ? 'show-navbar' : ''}`}>
      <div className="container">
        <Link to="/" className="navbar-brand">
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
              <ul className="dropdown-menu dropdown-menu-end shadow show" 
                  aria-labelledby="userDropdown" 
                  style={{ position: 'absolute', right: 0, top: '100%', zIndex: 1050 }}>
                <li>
                  <Link to="/profile" className="dropdown-item">
                    <FaUserCircle className="dropdown-icon" />
                    <span>Hồ sơ</span>
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <FaSignOutAlt className="dropdown-icon" />
                    <span>Đăng xuất</span>
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

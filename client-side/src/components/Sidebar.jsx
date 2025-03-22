import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUserShield, FaUserGraduate, FaEnvelope, FaCog, FaBars } from 'react-icons/fa';
import '../Styles/Sidebar.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { role } = useContext(AuthContext);

  const isActiveRoute = (route) => {
    return location.pathname === route ? 'active' : '';
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="brand">
          <FaHome className="brand-icon" />
          <span className="brand-text">Dormitory</span>
        </div>
        <button 
          className="toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          <FaBars />
        </button>
      </div>

      <div className="sidebar-content">
      <ul className="sidebar-menu">
        {/* Dashboard - tất cả roles đều thấy */}
        <li className={isActiveRoute('/')}>
          <Link to="/">
            <FaHome className="menu-icon" />
            <span className="menu-text">Dashboard</span>
          </Link>
        </li>

        {/* Quản lý phòng - chỉ admin và staff */}
        {(role === 'admin' || role === 'staff') && (
          <li className={isActiveRoute('/room')}>
            <Link to="/room">
              <FaUserShield className="menu-icon" />
              <span className="menu-text">Phòng</span>
            </Link>
          </li>
        )}

          <li className={isActiveRoute('/student')}>
            <Link to="/student">
              <FaUserGraduate className="menu-icon" />
              <span className="menu-text">Sinh viên</span>
            </Link>
          </li>
        

        {/* Tin nhắn - tất cả roles */}
        <li className={isActiveRoute('/messages')}>
          <Link to="/messages">
            <FaEnvelope className="menu-icon" />
            <span className="menu-text">Tin nhắn</span>
          </Link>
        </li>

        {/* Admin Page - chỉ hiển thị cho admin */}
        {role === 'admin' && (
          <li className={isActiveRoute('/admin')}>
            <Link to="/admin">
              <FaCog className="menu-icon" />
              <span className="menu-text">Quản trị</span>
            </Link>
          </li>
        )}
      </ul>

      </div>

      <div className="sidebar-footer">
        <div className="footer-content">
          <img 
            src="/logo192.png" 
            alt="Logo" 
            className="footer-logo"
          />
          <div className="footer-info">
            <p className="version">Version 1.0.0</p>
            <p className="copyright">© 2024 Dormitory</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
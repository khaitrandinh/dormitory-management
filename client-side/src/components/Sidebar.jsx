import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUserShield, FaUserGraduate, FaEnvelope, FaBars, FaFileContract,FaWrench,FaHouseUser, FaMoneyCheck } from 'react-icons/fa';
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
              <span className="menu-text">Room List</span>
            </Link>
          </li>
        )}
        {(role === 'admin' || role === 'staff') && (
          <li className={isActiveRoute('/roomapproval')}>
            <Link to="/roomapproval">
              <FaUserShield className="menu-icon" />
              <span className="menu-text">Room manage</span>
            </Link>
          </li>
        )}
        {role === 'student' && (
          <li className={isActiveRoute('/roomselect')}>
            <Link to="/roomselect">
              <FaUserShield className="menu-icon" />
              <span className="menu-text">Room</span>
            </Link>
          </li>
        )}

          <li className={isActiveRoute('/student')}>
            <Link to="/student">
              <FaUserGraduate className="menu-icon" />
              <span className="menu-text">Student manage</span>
            </Link>
          </li>

          <li className={isActiveRoute('/contract')}>
            <Link to="/contract">
              <FaFileContract className="menu-icon" />
              <span className="menu-text">Contracts</span>
            </Link>
          </li>

          <li className={isActiveRoute('/payment')}>
            <Link to="/payment">
              <FaMoneyCheck className="menu-icon" />
              <span className="menu-text">Payment</span>
            </Link>
          </li>
          
          {role === 'student' && (
          <li>
            <Link to="/my-repair-requests">
              <FaWrench /> Request Repair
            </Link>
          </li>
          )}

          {(role === 'admin' || role === 'staff') && (
          <li>
            <Link to="/repair-requests">
              <FaWrench /> Repair Requests
            </Link>
          </li>
          )}

          
        {/* {(role === 'admin' || role === 'staff') && ( */}
        <li className={isActiveRoute('/notification')}>
          <Link to="/notification">
            <FaEnvelope className="menu-icon" />
            <span className="menu-text">Messages</span>
          </Link>
        </li>
        {/* )} */}

        {/* Admin Page - chỉ hiển thị cho admin */}
        {role === 'admin' && (
          <li className={isActiveRoute('/admin')}>
            <Link to="/admin">
              <FaHouseUser className="menu-icon" />
              <span className="menu-text">admin Manage</span>
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
            <p className="version">Version 2.0.0</p>
            <p className="copyright">© 2025 Dormitory</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
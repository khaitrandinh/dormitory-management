import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome,FaBuilding, FaUserShield, FaUserGraduate, FaEnvelope, FaBars, FaFileContract,FaWrench,FaHouseUser, FaMoneyCheck } from 'react-icons/fa';
import '../Styles/Sidebar.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const menuConfig = [
  {
    id: 'dashboard',
    path: '/',
    icon: FaHome,
    text: 'Dashboard',
    roles: ['admin', 'staff', 'student']
  },
  {
    id: 'roomList',
    path: '/room',
    icon: FaBuilding,
    text: 'Room List',
    roles: ['admin', 'staff']
  },
  {
    id: 'roomManage',
    path: '/roomapproval',
    icon: FaClipboardList, // Updated icon
    text: 'Room Management',
    roles: ['admin', 'staff']
  },
  {
    id: 'roomSelect',
    path: '/roomselect',
    icon: FaBuilding,
    text: 'Room Selection',
    roles: ['student']
  },
  {
    id: 'student',
    path: '/student',
    icon: FaUserGraduate,
    text: 'Student Management',
    roles: ['admin', 'staff']
  },
  {
    id: 'contract',
    path: '/contract',
    icon: FaFileContract,
    text: 'Contracts',
    roles: ['admin', 'staff', 'student']
  },
  {
    id: 'payment',
    path: '/payment',
    icon: FaMoneyCheck,
    text: 'Payment',
    roles: ['admin', 'staff', 'student']
  },
  {
    id: 'messages',
    path: '/notification',
    icon: FaEnvelope,
    text: 'Messages',
    roles: ['admin', 'staff', 'student']
  },
  {
    id: 'admin',
    path: '/admin',
    icon: FaUserShield,
    text: 'Admin Management',
    roles: ['admin']
  }
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const { role } = useContext(AuthContext);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const isActiveRoute = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleToggle = () => {
    setIsCollapsed(prev => !prev);
  };

  const filteredMenu = menuConfig.filter(item => item.roles.includes(role));

  return (
    <div 
      className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${mounted ? 'mounted' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="sidebar-header">
        <Link to="/" className="brand">
          <FaHome className="brand-icon" />
          <span className="brand-text">DORMITORY</span>
        </Link>
        <button 
          className={`toggle-btn ${isCollapsed ? 'collapsed' : ''}`}
          onClick={handleToggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          <FaChevronLeft />
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

        <li className={isActiveRoute('/notification')}>
          <Link to="/notification">
            <FaEnvelope className="menu-icon" />
            <span className="menu-text">Messages</span>
          </Link>
        </li>
        

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
            alt="Dormitory Logo" 
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
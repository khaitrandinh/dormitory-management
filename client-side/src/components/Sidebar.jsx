import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaBuilding,
  FaUserShield,
  FaUserGraduate,
  FaEnvelope,
  FaChevronLeft,
  FaFileContract,
  FaHouseUser,
  FaMoneyCheck,
  FaClipboardList,
  FaWrench 
} from 'react-icons/fa';
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
    id: 'repairRequests',
    path: '/repair-requests',
    icon: FaWrench,
    text: 'repairRequests',
    roles: ['admin', 'staff']
  },
  {
    id: 'RequestRepair',
    path: '/my-repair-requests',
    icon: FaWrench,
    text: 'RequestRepair',
    roles: ['student']
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
        <ul className="sidebar-menu" role="menu">
          {filteredMenu.map(({ id, path, icon: Icon, text }) => (
            <li 
              key={id}
              className={`menu-item ${isActiveRoute(path)}`}
              role="menuitem"
            >
              <Link to={path}>
                <span className="menu-icon">
                  <Icon />
                </span>
                <span className="menu-text">{text}</span>
              </Link>
            </li>
          ))}
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
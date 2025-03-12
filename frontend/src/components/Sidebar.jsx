import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserShield, FaUserGraduate, FaEnvelope, FaCog } from 'react-icons/fa';
import '../Styles/Sidebar.css'; // File CSS custom

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h4>🏠 Dormitory</h4>
      </div>
      <ul className="sidebar-menu">
        <li><Link to="/"><FaHome /> Dashboard</Link></li>
        <li><Link to="/room"><FaUserShield /> Room</Link></li>
        <li><Link to="/student"><FaUserGraduate /> Student</Link></li>
        <li><Link to="/messages"><FaEnvelope /> Messages</Link></li>
        <li><Link to="/settings"><FaCog /> Settings</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;

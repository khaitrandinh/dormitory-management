import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar bg-light p-3">
      <h4 className="text-center mb-4">Dormitory</h4>
      <ul className="nav flex-column">
        <li className="nav-item"><a className="nav-link" href="#">Home</a></li>
        <li className="nav-item"><a className="nav-link" href="#">Dashboard</a></li>
        <li className="nav-item"><a className="nav-link" href="#">Admin</a></li>
        <li className="nav-item"><a className="nav-link" href="#">Messages</a></li>
        <li className="nav-item"><a className="nav-link" href="#">Settings</a></li>
        <li className="nav-item mt-5"><a className="nav-link text-danger" href="#">Logout</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;

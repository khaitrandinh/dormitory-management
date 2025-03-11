import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar navbar-light bg-white justify-content-between p-3 shadow-sm">
      <span className="navbar-brand mb-0 h4">Dashboard</span>
      <div className="d-flex align-items-center">
        <span className="mr-3">Welcome, {user?.name || 'Guest'}</span>
        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;

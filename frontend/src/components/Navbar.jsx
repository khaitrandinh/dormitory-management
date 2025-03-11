import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-light bg-white justify-content-between p-3 shadow-sm">
      <span className="navbar-brand mb-0 h4">Dashboard</span>
      <div className="d-flex align-items-center">
        <span className="mr-3">Welcome, User</span>
        <button className="btn btn-outline-danger btn-sm">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;

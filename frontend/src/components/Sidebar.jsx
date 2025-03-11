import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { role } = useContext(AuthContext);

  return (
    <div className="sidebar bg-light p-3 vh-100">
      <ul className="list-unstyled">
        <li><a href="/dashboard">Dashboard</a></li>
        {role === 'admin' && <li><a href="/admin">Admin Page</a></li>}
        {role === 'manager' && <li><a href="/manager">Manager Page</a></li>}
        {role === 'student' && <li><a href="/student">Student Page</a></li>}
      </ul>
    </div>
  );
};

export default Sidebar;

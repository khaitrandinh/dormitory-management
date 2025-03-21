import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { role, loading } = useContext(AuthContext);
  if (loading) return <p>Loading...</p>;
  return allowedRoles.includes(role) ? children : <Navigate to="/" />;
};

export default RoleBasedRoute;

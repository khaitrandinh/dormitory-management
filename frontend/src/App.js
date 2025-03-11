import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
import ManagerPage from './pages/ManagerPage';
import StudentPage from './pages/StudentPage';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <AuthProvider>
      
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/admin" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <AdminPage />
            </RoleBasedRoute>
          } />
          <Route path="/manager" element={
            <RoleBasedRoute allowedRoles={['manager']}>
              <ManagerPage />
            </RoleBasedRoute>
          } />
          <Route path="/student" element={
            <RoleBasedRoute allowedRoles={['student']}>
              <StudentPage />
            </RoleBasedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

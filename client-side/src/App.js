
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RoomPage from './pages/RoomPage';
import AdminPage from './pages/AdminPage';
// import ManagerPage from './pages/ManagerPage';
import StudentPage from './pages/StudentPage';
import ContractPage from './pages/ContractPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import NotificationPage from './pages/NotificationPage';
import RoomSelectPage from './pages/RoomselectionPage';
import RoomApprovalPage from './pages/RoomApprovalPage';
import RepairResPage from './pages/RepairRequestPage';
import MyRepairRequests from './pages/MyRepairRequests';
import ProfilePage from './pages/ProfilePage';


function App() {
  return (
    <AuthProvider>
      
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/room" element={<RoomPage  allowedRoles={['admin' || 'staff']}/>} />      
          <Route path="/student" element={<StudentPage />} />      
          <Route path="/contract" element={<ContractPage />} />      
          <Route path="/payment" element={<PaymentPage />} />      
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/roomselect" element={<RoomSelectPage />} />
          <Route path="/roomapproval" element={<RoomApprovalPage  allowedRoles={['admin' || 'staff']}/>} />
          <Route path="/repair-requests" element={<RepairResPage allowedRoles={['admin' || 'staff']} />}  />
          <Route path="/my-repair-requests" element={<MyRepairRequests />} />
          <Route path="/profile" element={<ProfilePage />} />


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
          {/* <Route path="/manager" element={
            <RoleBasedRoute allowedRoles={['staff']}>
              <ManagerPage />
            </RoleBasedRoute>
          } />
          <Route path="/student" element={
            <RoleBasedRoute allowedRoles={['student']}>
              <StudentPage />
            </RoleBasedRoute>
          } /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


export default App;

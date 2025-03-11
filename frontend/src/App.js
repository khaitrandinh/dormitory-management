
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoomPage from './pages/RoomPage';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/" />;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/rooms" element={<RoomPage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;

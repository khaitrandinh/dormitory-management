// src/layouts/MainLayout.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = ({ onLogout }) => {
    return (
        <div className="d-flex">
            <Sidebar onLogout={onLogout} />
            <div className="flex-grow-1" style={{ marginLeft: '250px', padding: '20px' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;

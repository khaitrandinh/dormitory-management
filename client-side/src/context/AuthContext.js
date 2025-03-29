import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authServices';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setLoading(false); // Không gọi API nếu chưa có token
          return;
        }
  
        const data = await getCurrentUser();
        if (data) {
          setUser(data);
          setRole(data.role);
        }
      } catch (error) {
        // Nếu token sai → clear và không set user
        localStorage.removeItem('access_token');
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);
  
  

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setRole(null);
    window.location.href = '/login'; //Điều hướng về trang login
  };
  

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

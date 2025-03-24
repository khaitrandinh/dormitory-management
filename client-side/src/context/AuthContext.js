import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authServices';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getCurrentUser();
      if (data) {
        setUser(data);
        setRole(data.role);
      }
      setLoading(false); // ✅ Luôn set loading, nhưng chỉ sau khi kiểm tra token
    };
  
    fetchUser();
  }, []);
  

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setRole(null);
    window.location.href = '/login'; // 👉 Điều hướng về trang login
  };
  

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

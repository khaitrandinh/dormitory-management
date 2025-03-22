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
        setRole(data.role); // Assuming API returns role
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('access_token'); // ✅ Đúng với key bạn đang lưu khi login
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

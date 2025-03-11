import { createContext, useContext } from "react";

const AuthContext = createContext(null); // Đảm bảo có giá trị mặc định

export const AuthProvider = ({ children }) => {
  const role = "manager"; // Gán cố định role

  return (
    <AuthContext.Provider value={{ role }}>
      {children}
    </AuthContext.Provider>
  );
};

// Kiểm tra xem context có tồn tại không trước khi sử dụng
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

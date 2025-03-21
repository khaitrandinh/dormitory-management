import api from './axios';

// ✅ Lấy token từ localStorage
export const getToken = () => {
  return localStorage.getItem('access_token');
};

// ✅ Gọi API để lấy thông tin user
export async function getCurrentUser() {
  try {
    const response = await api.get('/me'); // Laravel route `/api/me`
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

export const register = async (data) => api.post('/register', data);

// ✅ Đăng nhập
export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// ✅ Đăng xuất
export const logout = async () => {
  try {
    await api.post('/logout');
    localStorage.removeItem('access_token');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

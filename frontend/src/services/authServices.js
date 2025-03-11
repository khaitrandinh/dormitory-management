import api from './api';

export const login = async (data) => api.post('/auth/login', data);
export const register = async (data) => api.post('/auth/register', data);
export const getUser = async () => api.get('/auth/user');
export const refreshToken = async () => api.post('/auth/refresh');
export const logout = async () => api.post('/auth/logout');

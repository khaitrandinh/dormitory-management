import React, { useState } from 'react';
import { login } from '../services/authServices';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await login({ email, password });
    if (data && data.access_token) {
      localStorage.setItem('token', data.access_token);
      // Fetch user to get role, or use returned token to decode
      window.location.href = '/'; // Quay về dashboard
    } else {
      alert('Sai thông tin đăng nhập');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Đăng nhập</h3>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" className="form-control mb-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="form-control mb-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="btn btn-primary">Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;

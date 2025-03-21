import React, { useState } from 'react';
import { login } from '../services/authServices';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import '../Styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });
      if (data && data.access_token) {
        localStorage.setItem('token', data.access_token);
        window.location.href = '/';
      }
    } catch (err) {
      setError('Email hoặc mật khẩu không chính xác');
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-banner">
          <div className="banner-content">
            <h2>Chào mừng trở lại!</h2>
            <p>Hệ thống quản lý ký túc xá thông minh</p>
          </div>
        </div>
        
        <div className="login-form-container">
          <div className="login-form-wrapper">
            <div className="login-header">
              <h1>Đăng nhập</h1>
              <p>Vui lòng đăng nhập để tiếp tục</p>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                <FaSignInAlt className="alert-icon" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-text">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-text">
                    <FaLock />
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary login-btn">
                <FaSignInAlt className="btn-icon" />
                Đăng nhập
              </button>

              <div className="form-footer">
                <p>
                  Chưa có tài khoản?{' '}
                  <Link to="/register" className="register-link">
                    <FaUserPlus className="register-icon" />
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
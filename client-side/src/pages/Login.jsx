import React, { useState } from 'react';
import axios from '../services/axios';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import '../Styles/Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/login', { email, password });
      localStorage.setItem('access_token', res.data.token);
      navigate('/');
      window.location.reload(); // Force reload to trigger AuthContext
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-banner">
          <div className="banner-content">
            <h2>Welcome back!</h2>
            <p>Smart Dormitory Management System</p>
          </div>
        </div>
        
        <div className="login-form-container">
          <div className="login-form-wrapper">
            <div className="login-header">
              <h1>Login</h1>
              <p>Please sign in to continue</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-text">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your email"
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
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary login-btn">
                <FaSignInAlt className="btn-icon" />
                Login
              </button>

              <div className="form-footer">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="register-link">
                    <FaUserPlus className="register-icon" />
                    Register now
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
 
import React, { useState, useEffect } from 'react';
import axios from '../services/axios';
import { Link } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaLock, 
  FaSignInAlt, 
  FaUserPlus, 
  FaEye, 
  FaEyeSlash 
} from 'react-icons/fa';
import '../Styles/Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/login', { email, password });
      localStorage.setItem('access_token', res.data.token);
      navigate('/');
      window.location.reload();
    } catch (error) {
      alert('Login failed');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`login-container ${mounted ? 'mounted' : ''}`}>
      <div className="login-wrapper">
        <div className="login-banner">
          <div className="banner-content">
            <h2 className="animate-slide-down">Welcome back!</h2>
            <p className="animate-slide-up">Smart dormitory management system</p>
          </div>
        </div>
        
        <div className="login-form-container">
          <div className="login-form-wrapper">
            <div className="login-header">
              <h1 className="animate-fade-in">Log in</h1>
              <p className="animate-fade-in delay-1">Please login to continue</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group animate-fade-in delay-2">
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

              <div className="form-group animate-fade-in delay-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <FaLock />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary login-btn animate-fade-in delay-4">
                <FaSignInAlt className="btn-icon" />
                Login
              </button>

              <div className="form-footer animate-fade-in delay-5">
                <p>
                Don't have an account?{' '}
                  <Link to="/register" className="register-link">
                    <FaUserPlus className="register-icon" />
                    Sign up now
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
import React, { useState } from 'react';
import { register } from '../services/authServices';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import '../Styles/Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            setSuccess('Sign up successfull! please login your account.');
            setError('');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra!');
        }
    };

    return (
        <div className="register-container">
            <div className="register-wrapper">
                <div className="register-banner">
                    <div className="banner-content">
                        <h2>Tạo tài khoản mới</h2>
                        <p>Tham gia hệ thống quản lý ký túc xá thông minh</p>
                    </div>
                </div>

                <div className="register-form-container">
                    <div className="register-form-wrapper">
                        <div className="register-header">
                            <h1>Đăng ký</h1>
                            <p>Điền thông tin để tạo tài khoản mới</p>
                        </div>

                        {error && (
                            <div className="alert alert-danger">
                                <FaUserPlus className="alert-icon" />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success">
                                <FaSignInAlt className="alert-icon" />
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="register-form">
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <FaUser />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        placeholder="Họ và tên"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <FaEnvelope />
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="Email"
                                        onChange={handleChange}
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
                                        name="password"
                                        placeholder="Mật khẩu"
                                        onChange={handleChange}
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
                                        name="password_confirmation"
                                        placeholder="Xác nhận mật khẩu"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary register-btn">
                                <FaUserPlus className="btn-icon" />
                                Đăng ký
                            </button>

                            <div className="form-footer">
                                <p>
                                    Đã có tài khoản?{' '}
                                    <Link to="/" className="login-link">
                                        <FaSignInAlt className="login-icon" />
                                        Đăng nhập
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

export default Register;
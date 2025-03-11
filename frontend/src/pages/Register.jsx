import React, { useState } from 'react';
import { register } from '../services/authServices';
import { useNavigate } from 'react-router-dom';

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
            setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
            setError('');
            setTimeout(() => navigate('/'), 2000); // Chuyển hướng về login sau 2s
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Có lỗi xảy ra!');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Đăng ký tài khoản</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Họ và tên</label>
                    <input type="text" name="name" className="form-control" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" className="form-control" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Mật khẩu</label>
                    <input type="password" name="password" className="form-control" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Nhập lại mật khẩu</label>
                    <input type="password" name="password_confirmation" className="form-control" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Đăng ký</button>
            </form>
            <p className="mt-3">Đã có tài khoản? <a href="/">Đăng nhập</a></p>
        </div>
    );
};

export default Register;

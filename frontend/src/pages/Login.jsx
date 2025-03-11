import React, { useState } from 'react';
import { login } from '../services/authServices';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password });
            localStorage.setItem('token', res.data.access_token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login Failed:', error);
            alert('Sai thông tin đăng nhập');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Đăng nhập</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
                </div>
                <button type="submit" className="btn btn-primary">Đăng nhập</button>
            </form>
        </div>
    );
};

export default Login;

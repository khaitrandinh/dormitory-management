import React, { useState } from 'react';
import { register } from '../services/authServices';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaBuilding, FaTransgender, FaCalendar, FaUniversity } from 'react-icons/fa';
import '../Styles/Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        student_code: '',
        gender: '',
        birth_date: '',
        class: '',
        faculty: '',
        phone: '',
        room_code: '',
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
            setSuccess('Registration successful! Please login your account.');
            setError('');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred!');
        }
    };

    return (
        <div className="register-container">
            <div className="register-wrapper">
                <div className="register-banner">
                    <div className="banner-content">
                        <h2>Create New Account</h2>
                        <p>Join the smart dormitory management system</p>
                    </div>
                </div>

                <div className="register-form-container">
                    <div className="register-form-wrapper">
                        <div className="register-header">
                            <h1>Register</h1>
                            <p>Fill the form to create your account</p>
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        <form onSubmit={handleSubmit} className="register-form">

                            {/* Basic Info */}
                            <InputField icon={<FaUser />} name="name" placeholder="Full Name" handleChange={handleChange} />
                            <InputField icon={<FaEnvelope />} type="email" name="email" placeholder="Email" handleChange={handleChange} />
                            <InputField icon={<FaLock />} type="password" name="password" placeholder="Password" handleChange={handleChange} />
                            <InputField icon={<FaLock />} type="password" name="password_confirmation" placeholder="Confirm Password" handleChange={handleChange} />

                            {/* Student Info */}
                            <InputField icon={<FaUser />} name="student_code" placeholder="Student Code" handleChange={handleChange} />
                            <InputField icon={<FaTransgender />} name="gender" placeholder="Gender (Male/Female)" handleChange={handleChange} />
                            <InputField icon={<FaCalendar />} type="date" name="birth_date" placeholder="Birth Date" handleChange={handleChange} />
                            <InputField icon={<FaBuilding />} name="class" placeholder="Class" handleChange={handleChange} />
                            <InputField icon={<FaUniversity />} name="faculty" placeholder="Faculty" handleChange={handleChange} />
                            <InputField icon={<FaPhone />} name="phone" placeholder="Phone" handleChange={handleChange} />
                            <InputField icon={<FaBuilding />} name="room_code" placeholder="Room Code (optional)" handleChange={handleChange} />

                            <button type="submit" className="btn btn-primary register-btn">Register</button>

                            <div className="form-footer">
                                <p>
                                    Already have an account? <Link to="/" className="login-link">Login</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Input field component for reuse
const InputField = ({ icon, type = 'text', name, placeholder, handleChange }) => (
    <div className="form-group">
        <div className="input-group">
            <span className="input-group-text">{icon}</span>
            <input
                type={type}
                className="form-control"
                name={name}
                placeholder={placeholder}
                onChange={handleChange}
                required={name !== 'room_code'}
            />
        </div>
    </div>
);

export default Register;

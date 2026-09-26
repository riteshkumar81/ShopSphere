import React, { useState } from 'react';
import authService from '../../services/authService';
import './auth.css';

const Register = ({ onRegisterSuccess, onLoginClick }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const response = await authService.register(formData);
if (response.success) {
  setSuccess(true);

  if (onRegisterSuccess) {
    onRegisterSuccess();
  }
}
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* Left Side */}
        <div className="auth-brand">

          <div className="brand-logo">
            ShopSphere
          </div>

          <div className="brand-content">
            <h1>
              Start your<br />
              journey.
            </h1>

            <p>
              Create your ShopSphere account and
              discover a smarter way to shop online.
            </p>
          </div>

          <div className="brand-features">

            <div className="brand-feature">
              <span className="feature-icon">✓</span>
              Create your personal account
            </div>

            <div className="brand-feature">
              <span className="feature-icon">✓</span>
              Save your favorite products
            </div>

            <div className="brand-feature">
              <span className="feature-icon">✓</span>
              Easy and secure shopping
            </div>

          </div>

        </div>

        {/* Right Side */}
        <div className="auth-form-section">

          <div className="auth-header">
            <h2>Create account</h2>
            <p>Fill in your details to get started.</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              Registration successful! You can now log in.
            </div>
          )}

          <form onSubmit={onSubmit} className="auth-form">

            <div className="form-group">
              <label htmlFor="name">
                Full name
              </label>

              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email address
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Create a password"
                minLength="6"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
            >
              Create account
            </button>

          </form>

          <div className="auth-switch">
  Already have an account?{' '}
  <button
    type="button"
    onClick={onLoginClick}
  >
    Sign in
  </button>
</div>
        </div>

      </div>

    </div>
  );
};

export default Register;
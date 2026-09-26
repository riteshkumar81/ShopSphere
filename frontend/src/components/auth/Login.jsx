import React, { useState } from 'react';
import authService from '../../services/authService';
import './auth.css';

const Login = ({ onLoginSuccess, onRegisterClick }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { email, password } = formData;

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
      const response = await authService.login(formData);

    if (response.success) {
  setSuccess(true);

  if (onLoginSuccess) {
    onLoginSuccess(response.user);
  }
}
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
              Welcome<br />
              back.
            </h1>

            <p>
              Sign in to your ShopSphere account and
              continue exploring products you'll love.
            </p>
          </div>

          <div className="brand-features">

            <div className="brand-feature">
              <span className="feature-icon">✓</span>
              Secure account access
            </div>

            <div className="brand-feature">
              <span className="feature-icon">✓</span>
              Personalized shopping
            </div>

            <div className="brand-feature">
              <span className="feature-icon">✓</span>
              Fast & easy checkout
            </div>

          </div>

        </div>

        {/* Right Side */}
        <div className="auth-form-section">

          <div className="auth-header">
            <h2>Sign in</h2>
            <p>Enter your details to access your account.</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              Login successful! Welcome back.
            </div>
          )}

          <form onSubmit={onSubmit} className="auth-form">

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
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
            >
              Sign in
            </button>

          </form>

          <div className="auth-switch">
  Don't have an account?{' '}
  <button
    type="button"
    onClick={onRegisterClick}
  >
    Create one
  </button>
</div>

        </div>

      </div>

    </div>
  );
};

export default Login;
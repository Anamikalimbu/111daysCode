import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: location.state?.registeredEmail || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error('Email and password are required.');
    }

    setLoading(true);
    setUnverifiedEmail(null);

    try {
      const { data } = await authAPI.login(formData);
      if (data.success) {
        login(data.user, data.token);
        toast.success(`Welcome back, ${data.user.name}! 🎉`);
        navigate(from, { replace: true });
      }
    } catch (error) {
      const resData = error.response?.data;
      if (resData?.needsVerification) {
        setUnverifiedEmail(resData.email);
        toast.error('Email not verified. Please check your inbox.');
      } else {
        toast.error(resData?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!unverifiedEmail) return;
    setResendLoading(true);
    try {
      const { data } = await authAPI.resendVerification(unverifiedEmail);
      if (data.success) {
        toast.success('Verification email sent! Check your inbox.', { duration: 5000 });
        setUnverifiedEmail(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">👋</div>
          <h1>Welcome Back</h1>
          <p>Sign in to access your dashboard</p>
        </div>

        {unverifiedEmail && (
          <div className="alert alert-warning">
            <span>⚠️ Email not verified.</span>
            <button
              className="btn btn-sm btn-warning-outline"
              onClick={handleResend}
              disabled={resendLoading}
            >
              {resendLoading ? 'Sending…' : 'Resend Email'}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="input-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <><span className="spinner-sm" /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="link">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
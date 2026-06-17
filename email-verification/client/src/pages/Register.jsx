import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    if (!name.trim() || !email.trim() || !password.trim()) {
      return toast.error('All fields are required.');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      const { data } = await authAPI.register({ name: name.trim(), email: email.trim(), password });
      if (data.success) {
        toast.success(data.message, { duration: 5000 });
        navigate('/login', { state: { registeredEmail: email.trim() } });
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🚀</div>
          <h1>Create Account</h1>
          <p>Join us and verify your email to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                disabled={loading}
              />
            </div>
          </div>

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
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
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
            {formData.password && (
              <div className={`password-strength strength-${getStrength(formData.password)}`}>
                <div className="strength-bar" />
                <span>{getStrengthLabel(formData.password)}</span>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <><span className="spinner-sm" /> Creating account…</> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const getStrength = (password) => {
  if (password.length < 6) return 'weak';
  if (password.length < 10) return 'fair';
  if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) return 'strong';
  return 'fair';
};

const getStrengthLabel = (password) => {
  const s = getStrength(password);
  return { weak: '⚡ Weak', fair: '🟡 Fair', strong: '✅ Strong' }[s];
};

export default Register;
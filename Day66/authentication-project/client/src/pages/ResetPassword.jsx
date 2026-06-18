import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import AlertMessage from '../components/AlertMessage';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
  };

  const validate = () => {
    const errors = {};
    if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await authService.resetPassword(token, form.password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      // Token expiration is the most common failure mode here — surface
      // the backend's message directly since it's already user-facing.
      setFormError(err.response?.data?.message || 'Could not reset your password. The link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <AuthLayout eyebrow="Password updated" title="You're good to go">
        <p className="text-center text-sm text-slate-300">
          Your password has been reset. Redirecting you to login…
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      eyebrow="New password"
      title="Reset your password"
      subtitle="Choose a strong, unique password."
      footer={
        <Link to="/login" className="text-signal-400 hover:text-signal-300">
          Back to login
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && <AlertMessage variant="error">{formError}</AlertMessage>}

        <div>
          <FormInput
            id="password"
            label="New password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a new password"
            autoComplete="new-password"
            error={fieldErrors.password}
          />
          <PasswordStrengthIndicator password={form.password} />
        </div>
        <FormInput
          id="confirmPassword"
          label="Confirm new password"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your new password"
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-signal-500 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-signal-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Resetting…' : 'Reset password'}
        </button>
      </form>
    </AuthLayout>
  );
}
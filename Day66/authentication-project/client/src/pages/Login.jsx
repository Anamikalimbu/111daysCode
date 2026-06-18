import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import AlertMessage from '../components/AlertMessage';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setNeedsVerification(false);
    setIsSubmitting(true);
    try {
      await login({ ...form, rememberMe });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      // The backend returns a distinct message when login is blocked
      // because the email isn't verified yet — surface a path forward.
      if (err.message.toLowerCase().includes('verify')) {
        setNeedsVerification(true);
      }
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Log in to your account"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-signal-400 hover:text-signal-300">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && (
          <AlertMessage variant="error">
            {formError}
            {needsVerification && (
              <>
                {' '}
                <Link to="/verify-email" state={{ email: form.email }} className="underline">
                  Resend verification email
                </Link>
              </>
            )}
          </AlertMessage>
        )}

        <FormInput
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <FormInput
          id="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Your password"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-ink-700 bg-ink-800 text-signal-500 focus:ring-signal-400/50"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-signal-400 hover:text-signal-300">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-signal-500 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-signal-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  );
}
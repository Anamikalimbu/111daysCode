import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { MailCheck, BadgeCheck, BadgeX } from 'lucide-react';
import authService from '../services/authService';
import AuthLayout from '../components/AuthLayout';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * This page serves two purposes depending on the route:
 *  - /verify-email           → "we sent you a link, here's your inbox state" + resend option
 *  - /verify-email/:token    → actually calls the API to verify the token
 */
export default function VerifyEmailPage() {
  const { token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || '';
  const justRegistered = location.state?.justRegistered || false;

  const [status, setStatus] = useState(token ? 'verifying' : 'pending'); // pending | verifying | success | error
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState(emailFromState);
  const [isResending, setIsResending] = useState(false);
  const [resendNotice, setResendNotice] = useState('');

  const verifyToken = useCallback(async () => {
    try {
      const data = await authService.verifyEmail(token);
      setStatus('success');
      setMessage(data.message || 'Your email has been verified.');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'This verification link is invalid or has expired.');
    }
  }, [token]);

  useEffect(() => {
    if (token) verifyToken();
  }, [token, verifyToken]);

  const handleResend = async (e) => {
    e.preventDefault();
    setResendNotice('');
    setIsResending(true);
    try {
      await authService.resendVerification(resendEmail);
      setResendNotice('Verification email sent. Check your inbox.');
    } catch (err) {
      setResendNotice(err.response?.data?.message || 'Could not resend the email. Try again shortly.');
    } finally {
      setIsResending(false);
    }
  };

  if (status === 'verifying') {
    return <LoadingSpinner fullPage label="Verifying your email…" />;
  }

  if (status === 'success') {
    return (
      <AuthLayout eyebrow="Email verified" title="You're all set">
        <div className="flex flex-col items-center text-center">
          <BadgeCheck size={36} className="mb-3 text-signal-400" />
          <p className="mb-5 text-sm text-slate-300">{message}</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full rounded-lg bg-signal-500 py-2.5 text-sm font-medium text-ink-950 hover:bg-signal-400"
          >
            Continue to login
          </button>
        </div>
      </AuthLayout>
    );
  }

  if (status === 'error') {
    return (
      <AuthLayout eyebrow="Verification failed" title="That link didn't work">
        <div className="flex flex-col items-center text-center">
          <BadgeX size={36} className="mb-3 text-danger-400" />
          <p className="mb-5 text-sm text-slate-300">{message}</p>
          <form onSubmit={handleResend} className="w-full space-y-3">
            <input
              type="email"
              required
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-ink-700 bg-ink-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-signal-500 focus:outline-none focus:ring-2 focus:ring-signal-400/50"
            />
            {resendNotice && <AlertMessage variant="info">{resendNotice}</AlertMessage>}
            <button
              type="submit"
              disabled={isResending}
              className="w-full rounded-lg border border-ink-700 py-2.5 text-sm font-medium text-slate-200 hover:border-signal-500/50 disabled:opacity-60"
            >
              {isResending ? 'Sending…' : 'Send a new verification link'}
            </button>
          </form>
        </div>
      </AuthLayout>
    );
  }

  // status === 'pending': just registered (or arrived here manually), waiting on email
  return (
    <AuthLayout
      eyebrow="One more step"
      title="Verify your email"
      subtitle={justRegistered ? 'We sent a verification link to your inbox.' : undefined}
      footer={
        <Link to="/login" className="text-signal-400 hover:text-signal-300">
          Back to login
        </Link>
      }
    >
      <div className="flex flex-col items-center text-center">
        <MailCheck size={36} className="mb-3 text-signal-400" />
        <p className="mb-5 text-sm text-slate-300">
          {emailFromState ? (
            <>
              We sent a link to <span className="font-medium text-slate-100">{emailFromState}</span>.
              Click it to activate your account. Didn&apos;t get it?
            </>
          ) : (
            'Enter your email below and we\u2019ll resend the verification link.'
          )}
        </p>
        <form onSubmit={handleResend} className="w-full space-y-3">
          <input
            type="email"
            required
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-ink-700 bg-ink-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-signal-500 focus:outline-none focus:ring-2 focus:ring-signal-400/50"
          />
          {resendNotice && <AlertMessage variant="info">{resendNotice}</AlertMessage>}
          <button
            type="submit"
            disabled={isResending}
            className="w-full rounded-lg border border-ink-700 py-2.5 text-sm font-medium text-slate-200 hover:border-signal-500/50 disabled:opacity-60"
          >
            {isResending ? 'Sending…' : 'Resend verification email'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
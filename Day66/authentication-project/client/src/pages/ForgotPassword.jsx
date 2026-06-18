import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import authService from '../services/authService';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import AlertMessage from '../components/AlertMessage';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await authService.forgotPassword(email);
      // Always show the same confirmation regardless of whether the email
      // exists, so the form can't be used to enumerate registered accounts.
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <AuthLayout eyebrow="Check your inbox" title="Reset link sent">
        <div className="flex flex-col items-center text-center">
          <MailCheck size={36} className="mb-3 text-signal-400" />
          <p className="mb-5 text-sm text-slate-300">
            If an account exists for <span className="font-medium text-slate-100">{email}</span>, a password
            reset link is on its way. It expires in 1 hour.
          </p>
          <Link
            to="/login"
            className="w-full rounded-lg border border-ink-700 py-2.5 text-center text-sm font-medium text-slate-200 hover:border-signal-500/50"
          >
            Back to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Forgot your password?"
      subtitle="We'll email you a secure link to reset it."
      footer={
        <Link to="/login" className="text-signal-400 hover:text-signal-300">
          Back to login
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <AlertMessage variant="error">{error}</AlertMessage>}
        <FormInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-signal-500 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-signal-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
    </AuthLayout>
  );
}
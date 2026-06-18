import { useState } from 'react';
import { ShieldCheck, ShieldAlert, Calendar, Mail, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardPage() {
  const { user, refreshProfile } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [notice, setNotice] = useState('');

  const handleResend = async () => {
    setNotice('');
    setIsResending(true);
    try {
      await authService.resendVerification(user.email);
      setNotice('Verification email sent — check your inbox.');
    } catch (err) {
      setNotice(err.response?.data?.message || 'Could not send the email. Try again shortly.');
    } finally {
      setIsResending(false);
    }
  };

  if (!user) {
    return <LoadingSpinner fullPage label="Loading your profile…" />;
  }

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-7">
        <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-signal-500">Dashboard</p>
        <h1 className="text-2xl font-semibold text-slate-50">Welcome back, {user.name.split(' ')[0]}</h1>
      </div>

      {!user.isVerified && (
        <div className="mb-6">
          <AlertMessage variant="warning">
            Your email isn&apos;t verified yet.{' '}
            <button onClick={handleResend} disabled={isResending} className="underline disabled:opacity-60">
              {isResending ? 'Sending…' : 'Resend verification email'}
            </button>
          </AlertMessage>
        </div>
      )}
      {notice && (
        <div className="mb-6">
          <AlertMessage variant="info" onDismiss={() => setNotice('')}>
            {notice}
          </AlertMessage>
        </div>
      )}

      <div className="rounded-xl border border-ink-700 bg-ink-900 p-6">
        <h2 className="mb-5 text-sm font-medium uppercase tracking-wide text-slate-500">Profile</h2>

        <dl className="space-y-4">
          <div className="flex items-center gap-3">
            <UserIcon size={16} className="text-slate-500" />
            <dt className="w-28 text-sm text-slate-400">Name</dt>
            <dd className="text-sm text-slate-100">{user.name}</dd>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-slate-500" />
            <dt className="w-28 text-sm text-slate-400">Email</dt>
            <dd className="text-sm text-slate-100">{user.email}</dd>
          </div>
          <div className="flex items-center gap-3">
            {user.isVerified ? (
              <ShieldCheck size={16} className="text-signal-400" />
            ) : (
              <ShieldAlert size={16} className="text-warn-400" />
            )}
            <dt className="w-28 text-sm text-slate-400">Status</dt>
            <dd className="text-sm">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  user.isVerified ? 'bg-signal-500/10 text-signal-400' : 'bg-warn-500/10 text-warn-400'
                }`}
              >
                {user.isVerified ? 'Verified' : 'Unverified'}
              </span>
            </dd>
          </div>
          {joinedDate && (
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-slate-500" />
              <dt className="w-28 text-sm text-slate-400">Joined</dt>
              <dd className="text-sm text-slate-100">{joinedDate}</dd>
            </div>
          )}
        </dl>
      </div>

      <button
        onClick={refreshProfile}
        className="mt-4 text-xs text-slate-500 underline hover:text-slate-400"
      >
        Refresh profile data
      </button>
    </div>
  );
}
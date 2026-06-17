import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const STATUS = { LOADING: 'loading', SUCCESS: 'success', ERROR: 'error' };

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [status, setStatus] = useState(STATUS.LOADING);
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const calledRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus(STATUS.ERROR);
      setMessage('No verification token found in the URL.');
      return;
    }

    if (calledRef.current) return;
    calledRef.current = true;

    const verify = async () => {
      try {
        const { data } = await authAPI.verifyEmail(token);
        if (data.success) {
          setStatus(STATUS.SUCCESS);
          setMessage(data.message);
          toast.success('Email verified! 🎉');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        const msg = error.response?.data?.message || 'Verification failed.';
        setStatus(STATUS.ERROR);
        setMessage(msg);
        toast.error(msg);
      }
    };

    verify();
  }, [token, navigate]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) return toast.error('Please enter your email.');
    setResendLoading(true);
    try {
      const { data } = await authAPI.resendVerification(resendEmail);
      if (data.success) {
        setResendSent(true);
        toast.success('Verification email sent!', { duration: 5000 });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-card">
        {status === STATUS.LOADING && (
          <>
            <div className="verify-icon spin">⏳</div>
            <h2>Verifying Your Email…</h2>
            <p>Please wait while we confirm your email address.</p>
            <div className="spinner-lg" />
          </>
        )}

        {status === STATUS.SUCCESS && (
          <>
            <div className="verify-icon success-icon">✅</div>
            <h2>Email Verified!</h2>
            <p>{message}</p>
            <p className="redirect-note">Redirecting to login in 3 seconds…</p>
            <Link to="/login" className="btn btn-primary">Go to Login</Link>
          </>
        )}

        {status === STATUS.ERROR && (
          <>
            <div className="verify-icon error-icon">❌</div>
            <h2>Verification Failed</h2>
            <p>{message}</p>

            {!resendSent ? (
              <div className="resend-section">
                <p className="resend-label">Need a new verification link?</p>
                <form onSubmit={handleResend} className="resend-form">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    disabled={resendLoading}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={resendLoading}
                  >
                    {resendLoading ? 'Sending…' : 'Resend Email'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="alert alert-success">
                ✅ Verification email sent! Check your inbox.
              </div>
            )}

            <Link to="/login" className="link mt-16">Back to Login</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
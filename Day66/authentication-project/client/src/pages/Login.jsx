import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";
import * as authService from "../services/authService";

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "", rememberMe: false });
  const [alert, setAlert] = useState(
    location.state?.notice ? { type: "success", message: location.state.notice } : null
  );
  const [submitting, setSubmitting] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resending, setResending] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setShowResend(false);
    setSubmitting(true);

    try {
      await loginUser(form);
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      setAlert({ type: "error", message: data?.message || "Login failed. Try again." });
      if (data?.unverified) setShowResend(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.resendVerification(form.email);
      setAlert({ type: "success", message: "Verification email resent. Check your inbox." });
      setShowResend(false);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Could not resend email." });
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout eyebrow="Welcome back" title="Log in to SecureAuth" subtitle="Access your protected dashboard.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
        {showResend && (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-sm font-medium text-teal-400 hover:text-teal-300"
          >
            {resending ? "Sending…" : "Resend verification email"}
          </button>
        )}

        <FormInput
          label="Email address"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Your password"
          required
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-400">
            <input
              type="checkbox"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 rounded border-ink-700 bg-ink-800 text-teal-500 focus:ring-teal-500/60"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="font-medium text-teal-400 hover:text-teal-300">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-teal-500 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-teal-400 disabled:opacity-60"
        >
          {submitting ? "Logging in…" : "Log in"}
        </button>

        <p className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-teal-400 hover:text-teal-300">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

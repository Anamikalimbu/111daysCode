import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import Alert from "../components/Alert";
import * as authService from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setSubmitting(true);
    try {
      const data = await authService.forgotPassword(email);
      setSent(true);
      setAlert({ type: "success", message: data.message });
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Forgot your password?"
      subtitle="Enter the email on your account and we'll send a reset link."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

        <FormInput
          label="Email address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <button
          type="submit"
          disabled={submitting || sent}
          className="w-full rounded-lg bg-teal-500 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-teal-400 disabled:opacity-60"
        >
          {submitting ? "Sending…" : sent ? "Link sent" : "Send reset link"}
        </button>

        <p className="text-center text-sm text-slate-400">
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-teal-400 hover:text-teal-300">
            Back to log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

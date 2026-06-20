import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import Alert from "../components/Alert";
import PasswordStrength from "../components/PasswordStrength";
import * as authService from "../services/authService";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (password.length < 8) {
      setAlert({ type: "error", message: "Password must be at least 8 characters" });
      return;
    }
    if (password !== confirmPassword) {
      setAlert({ type: "error", message: "Passwords do not match" });
      return;
    }

    setSubmitting(true);
    try {
      const data = await authService.resetPassword(token, password);
      navigate("/login", { state: { notice: data.message } });
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Reset failed. Try requesting a new link." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout eyebrow="Account recovery" title="Choose a new password" subtitle="Make it something you haven't used before.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

        <div>
          <FormInput
            label="New password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
          />
          <PasswordStrength password={password} />
        </div>

        <FormInput
          label="Confirm new password"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your new password"
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-teal-500 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-teal-400 disabled:opacity-60"
        >
          {submitting ? "Resetting…" : "Reset password"}
        </button>

        <p className="text-center text-sm text-slate-400">
          <Link to="/login" className="font-medium text-teal-400 hover:text-teal-300">
            Back to log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

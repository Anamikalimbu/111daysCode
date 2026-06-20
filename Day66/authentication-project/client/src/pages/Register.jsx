import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import Alert from "../components/Alert";
import PasswordStrength from "../components/PasswordStrength";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address";
    if (form.password.length < 8) next.password = "Use at least 8 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await registerUser(form);
      navigate("/login", {
        state: { notice: "Account created. Check your inbox to verify your email before logging in." },
      });
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Registration failed. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Set up SecureAuth"
      subtitle="Takes less than a minute. We'll send a verification link to your inbox."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

        <FormInput
          label="Full name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Anamika Limbu"
          error={errors.name}
          required
        />
        <FormInput
          label="Email address"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          error={errors.email}
          required
        />
        <div>
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
            error={errors.password}
            required
          />
          <PasswordStrength password={form.password} />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-teal-500 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-teal-400 disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-teal-400 hover:text-teal-300">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

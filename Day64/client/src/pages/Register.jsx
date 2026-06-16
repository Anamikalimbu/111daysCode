import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../utils/api";
import { useAuth } from "../utils/AuthContext";
import { AuthCard } from "../components/AuthCard";
import { InputField, PasswordInput, PasswordStrengthMeter, Spinner } from "../components/UIComponents";

const btnStyle = (loading) => ({
  width: "100%",
  padding: "13px",
  background: loading ? "#1e3a8a" : "linear-gradient(135deg, #1d4ed8, #1e40af)",
  border: "none",
  borderRadius: "8px",
  color: "#fff",
  fontFamily: "Space Grotesk, sans-serif",
  fontWeight: 600,
  fontSize: "15px",
  cursor: loading ? "not-allowed" : "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  transition: "opacity 0.2s",
  letterSpacing: "0.02em",
});

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      return toast.error("All fields are required");
    }
    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    try {
      setLoading(true);
      const { data } = await authAPI.register(form);
      login(data.data);
      toast.success("Account created! Welcome 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle="Join SecureAuth today"
      footer={
        <>Already have an account? <Link to="/login">Sign in</Link></>
      }
    >
      <InputField
        label="Full Name"
        id="name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Anu Sharma"
        disabled={loading}
        autoComplete="name"
      />
      <InputField
        label="Email"
        id="email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="you@example.com"
        disabled={loading}
        autoComplete="email"
      />
      <div>
        <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "#64748b", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Password
        </label>
        <PasswordInput
          id="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Min. 6 characters"
          disabled={loading}
        />
        <PasswordStrengthMeter password={form.password} />
      </div>

      <button
        style={btnStyle(loading)}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <><Spinner size={18} /> Creating account…</> : "Create Account"}
      </button>
    </AuthCard>
  );
}
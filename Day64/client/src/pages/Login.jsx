import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../utils/api";
import { useAuth } from "../utils/AuthContext";
import { AuthCard } from "../components/AuthCard";
import { InputField, PasswordInput, Spinner } from "../components/UIComponents";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.email || !form.password) return toast.error("All fields required");
    try {
      setLoading(true);
      const { data } = await authAPI.login(form);
      login(data.data);
      toast.success(`Welcome back, ${data.data.name.split(" ")[0]}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <AuthCard
      title="Sign In"
      subtitle="Access your secure dashboard"
      footer={
        <>
          <div>No account? <Link to="/register">Create one</Link></div>
          <div style={{ marginTop: "8px" }}>
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>
        </>
      }
    >
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <label style={{ fontSize: "12px", color: "#64748b", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Password
          </label>
          <Link to="/forgot-password" style={{ fontSize: "12px" }}>Forgot?</Link>
        </div>
        <PasswordInput
          id="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Your password"
          disabled={loading}
        />
      </div>

      <button
        style={{
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
          marginTop: "4px",
        }}
        onClick={handleSubmit}
        disabled={loading}
        onKeyDown={handleKeyDown}
      >
        {loading ? <><Spinner size={18} /> Signing in…</> : "Sign In"}
      </button>
    </AuthCard>
  );
}
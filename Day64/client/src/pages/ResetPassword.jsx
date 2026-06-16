import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../utils/api";
import { useAuth } from "../utils/AuthContext";
import { AuthCard } from "../components/AuthCard";
import { PasswordInput, PasswordStrengthMeter, Spinner } from "../components/UIComponents";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirm) return toast.error("Both fields are required");
    if (password !== confirm) return toast.error("Passwords do not match");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");

    try {
      setLoading(true);
      const { data } = await authAPI.resetPassword(token, { password });
      setSuccess(true);
      login(data.data);
      toast.success("Password reset! Redirecting…");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed. Link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard title="Password Reset!" subtitle="You're being redirected">
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
          <p style={{ color: "#6ee7b7", fontWeight: 600 }}>All done!</p>
          <p style={{ color: "#4b5563", fontSize: "13px" }}>Your password has been updated. Redirecting to your dashboard…</p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Enter your new password below"
      footer={<><Link to="/login">← Back to Login</Link></>}
    >
      {/* Token indicator */}
      <div
        style={{
          background: "rgba(30,64,175,0.08)",
          border: "1px solid #1e3a8a",
          borderRadius: "8px",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ fontSize: "12px" }}>🔗</span>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#4b5563", wordBreak: "break-all" }}>
          Token: {token?.slice(0, 16)}…
        </span>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "#64748b", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          New Password
        </label>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 6 characters"
          disabled={loading}
        />
        <PasswordStrengthMeter password={password} />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "#64748b", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Confirm Password
        </label>
        <PasswordInput
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat your password"
          disabled={loading}
        />
        {confirm && password !== confirm && (
          <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", fontFamily: "JetBrains Mono, monospace" }}>
            Passwords do not match
          </p>
        )}
        {confirm && password === confirm && (
          <p style={{ color: "#10b981", fontSize: "12px", marginTop: "4px", fontFamily: "JetBrains Mono, monospace" }}>
            ✓ Passwords match
          </p>
        )}
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
        }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <><Spinner size={18} /> Resetting password…</> : "Set New Password"}
      </button>
    </AuthCard>
  );
}
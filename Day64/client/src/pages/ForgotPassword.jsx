import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../utils/api";
import { AuthCard } from "../components/AuthCard";
import { InputField, Spinner } from "../components/UIComponents";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devToken, setDevToken] = useState(null);

  const handleSubmit = async () => {
    if (!email) return toast.error("Please enter your email");
    try {
      setLoading(true);
      const { data } = await authAPI.forgotPassword({ email });
      setSent(true);
      toast.success("Reset instructions sent!");
      // Dev mode: show the token for easy testing
      if (data.devToken) setDevToken(data.devToken);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthCard title="Check Your Email" subtitle="Reset instructions sent">
        <div
          style={{
            background: "rgba(16,185,129,0.08)",
            border: "1px solid #065f46",
            borderRadius: "10px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>📧</div>
          <p style={{ color: "#6ee7b7", marginBottom: "8px", fontWeight: 600 }}>Email sent!</p>
          <p style={{ color: "#4b5563", fontSize: "13px" }}>
            Check your inbox for the reset link. It expires in <strong style={{ color: "#e2e8f0" }}>10 minutes</strong>.
          </p>
        </div>

        {devToken && (
          <div
            style={{
              background: "rgba(245,158,11,0.08)",
              border: "1px solid #92400e",
              borderRadius: "10px",
              padding: "16px",
            }}
          >
            <p style={{ color: "#f59e0b", fontSize: "11px", fontFamily: "JetBrains Mono, monospace", marginBottom: "8px" }}>
              ⚡ DEV MODE — Reset Token
            </p>
            <Link
              to={`/reset-password/${devToken}`}
              style={{
                display: "block",
                wordBreak: "break-all",
                fontSize: "11px",
                fontFamily: "JetBrains Mono, monospace",
                color: "#fbbf24",
              }}
            >
              Click here to reset password →
            </Link>
          </div>
        )}

        <Link
          to="/login"
          style={{
            display: "block",
            textAlign: "center",
            padding: "12px",
            background: "#111827",
            borderRadius: "8px",
            color: "#3b82f6",
            fontWeight: 600,
          }}
        >
          ← Back to Login
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot Password"
      subtitle="Enter your email to receive a reset link"
      footer={<><Link to="/login">← Back to Login</Link></>}
    >
      <InputField
        label="Email Address"
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        disabled={loading}
        autoComplete="email"
      />

      <p style={{ color: "#4b5563", fontSize: "12px", margin: "0" }}>
        We'll send a secure reset link to this address. The link expires in 10 minutes.
      </p>

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
        {loading ? <><Spinner size={18} /> Sending link…</> : "Send Reset Link"}
      </button>
    </AuthCard>
  );
}
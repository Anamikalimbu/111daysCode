import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../utils/api";
import { useAuth } from "../utils/AuthContext";

const StatCard = ({ label, value, color }) => (
  <div
    style={{
      background: "rgba(13,17,23,0.8)",
      border: `1px solid ${color}30`,
      borderRadius: "12px",
      padding: "20px",
      borderTop: `2px solid ${color}`,
    }}
  >
    <p style={{ color: "#4b5563", fontSize: "11px", fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>
      {label}
    </p>
    <p style={{ color: "#f1f5f9", fontSize: "20px", fontWeight: 700, margin: 0 }}>{value}</p>
  </div>
);

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await authAPI.getProfile();
        setProfile(data.data);
      } catch {
        toast.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const memberSince = profile
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "—";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080c14",
        fontFamily: "Space Grotesk, sans-serif",
        color: "#e2e8f0",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(30,64,175,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,64,175,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Navbar */}
      <nav
        style={{
          background: "rgba(13,17,23,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #1e3a8a",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "60px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>🔐</span>
          <span style={{ fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.01em" }}>SecureAuth</span>
          <span
            style={{
              background: "rgba(30,64,175,0.2)",
              border: "1px solid #1e40af",
              borderRadius: "4px",
              padding: "2px 8px",
              fontSize: "10px",
              color: "#60a5fa",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            DAY 63
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#4b5563", fontSize: "13px" }}>
            {profile?.email || user?.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: "7px 16px",
              background: "transparent",
              border: "1px solid #374151",
              borderRadius: "6px",
              color: "#9ca3af",
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>
        {/* Welcome */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ color: "#4b5563", fontFamily: "JetBrains Mono, monospace", fontSize: "12px", marginBottom: "6px", letterSpacing: "0.1em" }}>
            WELCOME BACK
          </p>
          <h1 style={{ fontSize: "32px", fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            {loading ? "Loading…" : `Hello, ${profile?.name || user?.name} 👋`}
          </h1>
          <p style={{ color: "#4b5563", margin: 0 }}>
            Your account is active and secure.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "40px" }}>
          <StatCard label="Account Status" value="✅ Active" color="#10b981" />
          <StatCard label="Auth Method" value="JWT + bcrypt" color="#3b82f6" />
          <StatCard label="Member Since" value={loading ? "…" : memberSince} color="#8b5cf6" />
          <StatCard label="Password Hash" value="bcrypt · 12 rounds" color="#f59e0b" />
        </div>

        {/* Security Info */}
        <div
          style={{
            background: "rgba(13,17,23,0.8)",
            border: "1px solid #1e3a8a",
            borderRadius: "12px",
            padding: "28px",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 20px", color: "#f1f5f9" }}>
            🛡️ Security Features Active
          </h2>
          {[
            ["JWT Authentication", "Token-based auth with 7-day expiry", "#10b981"],
            ["bcrypt Password Hashing", "12 salt rounds — industry standard", "#10b981"],
            ["Reset Token Hashing", "SHA-256 hashed before storage", "#10b981"],
            ["Token Expiry", "Reset links expire after 10 minutes", "#10b981"],
            ["Rate Limiting", "Max 5 reset requests/hour per IP", "#10b981"],
            ["Email Enumeration Protection", "Consistent response regardless of email existence", "#10b981"],
          ].map(([feature, detail, color]) => (
            <div
              key={feature}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "10px 0",
                borderBottom: "1px solid #111827",
              }}
            >
              <span style={{ color, fontSize: "14px", marginTop: "1px" }}>●</span>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: 600, color: "#e2e8f0" }}>{feature}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#4b5563", fontFamily: "JetBrains Mono, monospace" }}>{detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reset Password Flow diagram */}
        <div
          style={{
            background: "rgba(13,17,23,0.8)",
            border: "1px solid #1e3a8a",
            borderRadius: "12px",
            padding: "28px",
          }}
        >
          <h2 style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 20px", color: "#f1f5f9" }}>
            🔄 Password Reset Flow
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {[
              ["01", "User submits email", "POST /api/auth/forgot-password"],
              ["02", "Server generates crypto.randomBytes(32) token", "Raw token → sent in email URL"],
              ["03", "SHA-256 hash stored in MongoDB", "resetPasswordToken + resetPasswordExpire"],
              ["04", "User clicks link with raw token", "GET /reset-password/:rawToken"],
              ["05", "Server hashes incoming token, queries DB", "Checks expiry — must be < 10 min"],
              ["06", "New password hashed (bcrypt) + saved", "Reset token fields cleared from DB"],
            ].map(([num, step, detail]) => (
              <div
                key={num}
                style={{
                  display: "flex",
                  gap: "16px",
                  padding: "12px 0",
                  borderBottom: "1px solid #111827",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "11px",
                    color: "#1e40af",
                    background: "rgba(30,64,175,0.1)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  {num}
                </span>
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: 600, color: "#e2e8f0" }}>{step}</p>
                  <p style={{ margin: 0, fontSize: "11px", color: "#4b5563", fontFamily: "JetBrains Mono, monospace" }}>{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
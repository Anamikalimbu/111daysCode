import { useState } from "react";

// ── Eye Icon (show/hide password) ──────────────────────────────────────────
const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeClosed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ── Password Input with show/hide toggle ───────────────────────────────────
export const PasswordInput = ({ value, onChange, placeholder = "Password", id, disabled }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "12px 44px 12px 14px",
          background: "#0d1117",
          border: "1px solid #1e40af",
          borderRadius: "8px",
          color: "#e2e8f0",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "14px",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
        onBlur={(e) => (e.target.style.borderColor = "#1e40af")}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          color: "#4b5563",
          cursor: "pointer",
          padding: "0",
          display: "flex",
          alignItems: "center",
        }}
      >
        {show ? <EyeClosed /> : <EyeOpen />}
      </button>
    </div>
  );
};

// ── Password Strength Meter ────────────────────────────────────────────────
const getStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "#1f2937" };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "", color: "#1f2937" },
    { label: "Weak", color: "#ef4444" },
    { label: "Fair", color: "#f59e0b" },
    { label: "Good", color: "#3b82f6" },
    { label: "Strong", color: "#10b981" },
    { label: "Very Strong", color: "#059669" },
  ];
  return { score, ...levels[score] };
};

export const PasswordStrengthMeter = ({ password }) => {
  const { score, label, color } = getStrength(password);
  if (!password) return null;
  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "3px",
              borderRadius: "2px",
              background: i <= score ? color : "#1f2937",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: "11px", color, fontFamily: "JetBrains Mono, monospace" }}>
        {label && `Strength: ${label}`}
      </span>
    </div>
  );
};

// ── Loading Spinner ─────────────────────────────────────────────────────────
export const Spinner = ({ size = 20 }) => (
  <span
    style={{
      display: "inline-block",
      width: size,
      height: size,
      border: `2px solid rgba(255,255,255,0.2)`,
      borderTopColor: "#fff",
      borderRadius: "50%",
      animation: "spin 0.6s linear infinite",
    }}
  />
);

// ── Input Field ──────────────────────────────────────────────────────────────
export const InputField = ({ label, id, type = "text", value, onChange, placeholder, disabled, autoComplete }) => (
  <div>
    {label && (
      <label htmlFor={id} style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "#64748b", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}
      </label>
    )}
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autoComplete}
      style={{
        width: "100%",
        padding: "12px 14px",
        background: "#0d1117",
        border: "1px solid #1e40af",
        borderRadius: "8px",
        color: "#e2e8f0",
        fontFamily: "Space Grotesk, sans-serif",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
      onBlur={(e) => (e.target.style.borderColor = "#1e40af")}
    />
  </div>
);
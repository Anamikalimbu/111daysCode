import { useState } from "react";

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "nodemailer", label: "Nodemailer Setup" },
  { id: "token", label: "Verification Token" },
  { id: "flow", label: "Full Flow" },
  { id: "routes", label: "Routes & API" },
  { id: "frontend", label: "Frontend" },
  { id: "quiz", label: "Quiz" },exi
];

const C = {
  install: "npm install nodemailer",
  env: "# .env\nEMAIL_USER=your_gmail@gmail.com\nEMAIL_PASS=your_app_password\nCLIENT_URL=http://localhost:5173",
  transporter: `// utils/emailService.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (toEmail, token) => {
  const verifyURL = process.env.CLIENT_URL + "/verify-email?token=" + token;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Verify Your Email Address",
    html: "<h2>Verify your email</h2><a href='" + verifyURL + "'>Click to verify</a><p>Expires in 24 hours.</p>",
  });
};`,
  userModel: `// models/User.js — add these fields
const userSchema = new mongoose.Schema({
  name:              { type: String, required: true },
  email:             { type: String, required: true, unique: true },
  password:          { type: String, required: true },
  isEmailVerified:   { type: Boolean, default: false },
  emailVerifyToken:  { type: String },
  emailVerifyExpiry: { type: Date },
}, { timestamps: true });`,
  generateToken: `// utils/generateToken.js
import crypto from "crypto";

export const generateVerifyToken = () => {
  // 1. Raw token — sent in the email URL
  const rawToken = crypto.randomBytes(32).toString("hex");

  // 2. Hashed token — stored in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  // 3. Expires in 24 hours
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return { rawToken, hashedToken, expiry };
};`,
  register: `export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const { rawToken, hashedToken, expiry } = generateVerifyToken();

    await User.create({
      name, email,
      password: hashed,
      emailVerifyToken:  hashedToken,   // store HASHED
      emailVerifyExpiry: expiry,
    });

    await sendVerificationEmail(email, rawToken); // send RAW

    res.status(201).json({ message: "Registered! Check your email to verify." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};`,
  verify: `export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;  // raw token from email URL

    // Hash it to compare with DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      emailVerifyToken:  hashedToken,
      emailVerifyExpiry: { $gt: Date.now() },  // not expired
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.isEmailVerified   = true;
    user.emailVerifyToken  = undefined;
    user.emailVerifyExpiry = undefined;
    await user.save();

    res.json({ message: "Email verified! You can now log in." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};`,
  loginGuard: `export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Block unverified users
  if (!user.isEmailVerified) {
    return res.status(403).json({
      message: "Please verify your email before logging in.",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
};`,
  routes: `// routes/authRoutes.js
import express from "express";
import { register, verifyEmail, login, resendVerification } from "../controllers/authController.js";

const router = express.Router();
router.post("/register",            register);
router.get("/verify-email",         verifyEmail);  // ?token=...
router.post("/login",               login);
router.post("/resend-verification", resendVerification);

export default router;`,
  resend: `export const resendVerification = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isEmailVerified) return res.status(400).json({ message: "Already verified" });

  const { rawToken, hashedToken, expiry } = generateVerifyToken();
  user.emailVerifyToken  = hashedToken;
  user.emailVerifyExpiry = expiry;
  await user.save();

  await sendVerificationEmail(email, rawToken);
  res.json({ message: "Verification email resent!" });
};`,
  frontend: `// pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) { setStatus("error"); return; }

    axios.get("/api/auth/verify-email?token=" + token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") return <p>Verifying your email...</p>;
  if (status === "success") return <p>Email verified! You can now log in.</p>;
  return <p>Invalid or expired link. Please request a new one.</p>;
}`,
};

const QUIZ = [
  {
    q: "Why store the HASHED token in DB instead of the raw token?",
    opts: ["To save storage space","If DB is compromised, attackers cannot use the hash directly","MongoDB only supports hashed strings","Raw tokens are too long"],
    ans: 1,
    exp: "If an attacker dumps your DB they get hashed tokens — useless without the raw version that was only ever sent by email.",
  },
  {
    q: "What HTTP method handles email verification via a link?",
    opts: ["POST /verify-email with body { token }","GET /verify-email?token=... (link in email)","PUT /verify-email/:token","PATCH /auth/verify"],
    ans: 1,
    exp: "GET is correct — the user clicks a link in their email. The raw token is passed as a query param.",
  },
  {
    q: "Which Node.js built-in module is used to hash the token?",
    opts: ["bcrypt","jsonwebtoken","crypto","nodemailer"],
    ans: 2,
    exp: "The built-in crypto module's createHash('sha256') is used to hash the raw token before storing or comparing.",
  },
  {
    q: "What should happen when an unverified user tries to log in?",
    opts: ["Allow login but show a banner","Return 403 Forbidden and block access","Auto-resend the verification email","Delete the unverified account"],
    ans: 1,
    exp: "Return 403 with a clear message. This enforces the verification requirement before granting access.",
  },
  {
    q: "What does emailVerifyExpiry: { $gt: Date.now() } check?",
    opts: ["Token was created before now","Token expiry is GREATER than current time (not expired)","Token has already been used","User verified more than 24 hours ago"],
    ans: 1,
    exp: "$gt: Date.now() means the stored expiry date is GREATER THAN now — token is still valid.",
  },
];

function CodeBlock({ code, label }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ marginBottom: 24 }}>
      {label && <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>}
      <div style={{ position: "relative", background: "#0f0f1a", borderRadius: 10, border: "1px solid #2a2a3d" }}>
        <button
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          style={{ position: "absolute", top: 10, right: 12, background: copied ? "#22c55e22" : "#ffffff11", border: "1px solid " + (copied ? "#22c55e55" : "#ffffff22"), color: copied ? "#22c55e" : "#888", borderRadius: 6, padding: "3px 10px", fontSize: 11, cursor: "pointer" }}
        >{copied ? "✓ Copied" : "Copy"}</button>
        <pre style={{ margin: 0, padding: "16px 20px", overflowX: "auto", fontSize: 12.5, lineHeight: 1.75, color: "#e2e8f0", fontFamily: "monospace" }}>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

function InfoBox({ type, children }) {
  const map = { tip: { bg: "#1e1b4b", border: "#6366f1", icon: "💡", label: "TIP" }, warning: { bg: "#1c1400", border: "#f59e0b", icon: "⚠️", label: "IMPORTANT" }, security: { bg: "#0f1f0f", border: "#22c55e", icon: "🔒", label: "SECURITY" } };
  const s = map[type] || map.tip;
  return (
    <div style={{ background: s.bg, borderLeft: "4px solid " + s.border, borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: s.border, letterSpacing: 1, marginBottom: 4 }}>{s.icon} {s.label}</div>
      <div style={{ color: "#cbd5e1", fontSize: 13.5, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function FlowDiagram() {
  const steps = [
    { icon: "📝", title: "User Registers", desc: "POST /api/auth/register", color: "#6366f1" },
    { icon: "🔑", title: "Token Generated", desc: "crypto.randomBytes(32) — hash stored in DB", color: "#8b5cf6" },
    { icon: "📧", title: "Email Sent", desc: "Nodemailer sends link with raw token", color: "#06b6d4" },
    { icon: "🖱️", title: "User Clicks Link", desc: "GET /api/auth/verify-email?token=...", color: "#10b981" },
    { icon: "✅", title: "DB Updated", desc: "isEmailVerified = true, token cleared", color: "#22c55e" },
    { icon: "🔐", title: "Login Allowed", desc: "Only verified users can log in", color: "#f59e0b" },
  ];
  return (
    <div style={{ marginBottom: 28 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 4 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 44 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: s.color + "22", border: "2px solid " + s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
            {i < steps.length - 1 && <div style={{ width: 2, height: 18, background: "#2a2a3d", marginTop: 2 }} />}
          </div>
          <div style={{ paddingTop: 10 }}>
            <div style={{ fontWeight: 700, color: s.color, fontSize: 14 }}>{s.title}</div>
            <div style={{ color: "#94a3b8", fontSize: 12.5 }}>{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Quiz() {
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = QUIZ[cur];
  const pick = (i) => { if (sel !== null) return; setSel(i); if (i === q.ans) setScore(s => s + 1); };
  const next = () => { if (cur + 1 >= QUIZ.length) { setDone(true); return; } setCur(c => c + 1); setSel(null); };

  if (done) {
    const pct = Math.round((score / QUIZ.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>{pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "📚"}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#e2e8f0", marginBottom: 8 }}>{score}/{QUIZ.length}</div>
        <div style={{ color: "#94a3b8", marginBottom: 24 }}>{pct >= 80 ? "Email verification mastered!" : pct >= 60 ? "Good — review what you missed." : "Keep studying!"}</div>
        <button onClick={() => { setCur(0); setSel(null); setScore(0); setDone(false); }} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", cursor: "pointer", fontWeight: 700 }}>Retry Quiz</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>
        <span>Question {cur + 1} of {QUIZ.length}</span><span>Score: {score}</span>
      </div>
      <div style={{ background: "#12121f", borderRadius: 10, padding: "20px 24px", marginBottom: 16, border: "1px solid #2a2a3d" }}>
        <p style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 600, margin: 0 }}>{q.q}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {q.opts.map((opt, i) => {
          let bg = "#12121f", border = "#2a2a3d", color = "#cbd5e1";
          if (sel !== null) {
            if (i === q.ans) { bg = "#0f2f1a"; border = "#22c55e"; color = "#4ade80"; }
            else if (i === sel) { bg = "#2f0f0f"; border = "#ef4444"; color = "#f87171"; }
          }
          return (
            <button key={i} onClick={() => pick(i)} style={{ background: bg, border: "1px solid " + border, color, borderRadius: 8, padding: "12px 16px", textAlign: "left", cursor: sel !== null ? "default" : "pointer", fontSize: 13.5, fontWeight: 500 }}>
              <span style={{ marginRight: 10, opacity: .5 }}>{["A","B","C","D"][i]}.</span>{opt}
            </button>
          );
        })}
      </div>
      {sel !== null && (
        <>
          <div style={{ background: "#1e1b4b", border: "1px solid #6366f1", borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
            <span style={{ color: "#818cf8", fontWeight: 700, fontSize: 12 }}>📖 EXPLANATION  </span>
            <span style={{ color: "#cbd5e1", fontSize: 13 }}>{q.exp}</span>
          </div>
          <button onClick={next} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", cursor: "pointer", fontWeight: 700, width: "100%" }}>
            {cur + 1 >= QUIZ.length ? "See Results" : "Next Question →"}
          </button>
        </>
      )}
    </div>
  );
}

export default function Day64() {
  const [active, setActive] = useState("overview");

  const sections = {
    overview: (
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#e2e8f0", margin: "0 0 20px", borderLeft: "4px solid #6366f1", paddingLeft: 14 }}>📧 Email Verification with Nodemailer</h2>
        <p style={{ color: "#94a3b8", lineHeight: 1.8, marginBottom: 20 }}>
          Email verification ensures users own the email they register with. Without it, anyone can sign up with fake or someone else's email. Today you'll build a complete email verification system integrated into your JWT auth flow.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { icon: "📦", title: "Nodemailer", desc: "Send emails from Node.js via SMTP/Gmail" },
            { icon: "🔑", title: "Crypto Tokens", desc: "Generate & hash secure random tokens" },
            { icon: "⏱️", title: "Token Expiry", desc: "Tokens expire in 24 hours for security" },
            { icon: "🔒", title: "Login Guard", desc: "Block unverified users from logging in" },
          ].map((c, i) => (
            <div key={i} style={{ background: "#12121f", border: "1px solid #2a2a3d", borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>{c.title}</div>
              <div style={{ color: "#64748b", fontSize: 12.5 }}>{c.desc}</div>
            </div>
          ))}
        </div>
        <InfoBox type="warning">For Gmail, you MUST use an <strong>App Password</strong> — not your real Gmail password. Go to: Google Account → Security → 2-Step Verification → App passwords.</InfoBox>
        <InfoBox type="security">Always store the <strong>hashed</strong> token in MongoDB and send only the <strong>raw</strong> token in the email URL. If your DB is compromised, attackers cannot use the stored hash.</InfoBox>
      </div>
    ),
    nodemailer: (
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#e2e8f0", margin: "0 0 20px", borderLeft: "4px solid #6366f1", paddingLeft: 14 }}>📦 Nodemailer Setup</h2>
        <CodeBlock code={C.install} label="Install" />
        <CodeBlock code={C.env} label=".env — environment variables" />
        <CodeBlock code={C.transporter} label="utils/emailService.js — transporter + send function" />
        <InfoBox type="tip">Nodemailer transporter is like a configured email client — create it once, reuse it for all emails. Always await transporter.sendMail() since it is async.</InfoBox>
      </div>
    ),
    token: (
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#e2e8f0", margin: "0 0 20px", borderLeft: "4px solid #6366f1", paddingLeft: 14 }}>🔑 Verification Token System</h2>
        <CodeBlock code={C.generateToken} label="utils/generateToken.js" />
        <CodeBlock code={C.userModel} label="models/User.js — add verification fields" />
        <InfoBox type="security">Raw token goes in email URL (never stored by user). Hashed token is stored in MongoDB and compared at verification time. Same pattern as password reset (Day 63).</InfoBox>
        <div style={{ background: "#12121f", border: "1px solid #2a2a3d", borderRadius: 10, padding: 20 }}>
          <div style={{ fontWeight: 700, color: "#6366f1", marginBottom: 12 }}>Token Lifecycle</div>
          {["Register → generate rawToken + hashedToken","Store hashedToken + expiry in User document","Email rawToken as query param in verification URL","User clicks link → server hashes incoming rawToken","Find user where storedHash matches AND expiry > now","Set isEmailVerified = true, clear token fields"].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <span style={{ background: "#6366f1", color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ color: "#cbd5e1", fontSize: 13.5 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    flow: (
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#e2e8f0", margin: "0 0 20px", borderLeft: "4px solid #6366f1", paddingLeft: 14 }}>🔄 Complete Verification Flow</h2>
        <FlowDiagram />
        <CodeBlock code={C.register} label="controllers/authController.js — register()" />
        <CodeBlock code={C.verify} label="controllers/authController.js — verifyEmail()" />
        <CodeBlock code={C.loginGuard} label="controllers/authController.js — login() guard" />
      </div>
    ),
    routes: (
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#e2e8f0", margin: "0 0 20px", borderLeft: "4px solid #6366f1", paddingLeft: 14 }}>🛣️ Routes & Resend</h2>
        <CodeBlock code={C.routes} label="routes/authRoutes.js" />
        <CodeBlock code={C.resend} label="controllers/authController.js — resendVerification()" />
        <InfoBox type="tip">The resend endpoint is essential UX — users may miss or delete the email. Rate-limit this in production (e.g. 1 resend per 60 seconds per IP).</InfoBox>
        <div style={{ background: "#12121f", border: "1px solid #2a2a3d", borderRadius: 10, padding: 20 }}>
          <div style={{ fontWeight: 700, color: "#6366f1", marginBottom: 12 }}>API Reference</div>
          {[
            { method: "POST", route: "/api/auth/register", desc: "Register + send verification email" },
            { method: "GET",  route: "/api/auth/verify-email?token=…", desc: "Verify email from link" },
            { method: "POST", route: "/api/auth/login", desc: "Login (requires verified email)" },
            { method: "POST", route: "/api/auth/resend-verification", desc: "Resend verification email" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ background: r.method === "GET" ? "#0e3a2f" : "#1e1b4b", color: r.method === "GET" ? "#4ade80" : "#818cf8", border: "1px solid " + (r.method === "GET" ? "#22c55e44" : "#6366f144"), borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{r.method}</span>
              <code style={{ color: "#e2e8f0", fontSize: 12 }}>{r.route}</code>
              <span style={{ color: "#64748b", fontSize: 12.5 }}>— {r.desc}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    frontend: (
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#e2e8f0", margin: "0 0 20px", borderLeft: "4px solid #6366f1", paddingLeft: 14 }}>⚛️ Frontend: VerifyEmail Page</h2>
        <CodeBlock code={C.frontend} label="pages/VerifyEmail.jsx" />
        <InfoBox type="tip">Add this route in App.jsx: {"<Route path='/verify-email' element={<VerifyEmail />} />"} — this matches the CLIENT_URL/verify-email?token=... link sent in the email.</InfoBox>
        <div style={{ background: "#12121f", border: "1px solid #2a2a3d", borderRadius: 10, padding: 20 }}>
          <div style={{ fontWeight: 700, color: "#6366f1", marginBottom: 12 }}>Manual Test Steps</div>
          {["Register a new user via Postman or your register form","Check email inbox for the verification link","Click the link → browser hits GET /api/auth/verify-email?token=...","Should see 'Email verified successfully!'","Try logging in BEFORE verifying → should get 403","Try logging in AFTER verifying → should get JWT token"].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <span style={{ color: "#6366f1", fontWeight: 700 }}>{i + 1}.</span>
              <span style={{ color: "#cbd5e1", fontSize: 13 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    quiz: (
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#e2e8f0", margin: "0 0 20px", borderLeft: "4px solid #6366f1", paddingLeft: 14 }}>🧠 Day 64 Quiz</h2>
        <Quiz />
      </div>
    ),
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a14", fontFamily: "'Inter', 'Segoe UI', sans-serif", color: "#e2e8f0", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", padding: "28px 32px 20px", borderBottom: "1px solid #2a2a3d" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ background: "#6366f144", border: "1px solid #6366f188", borderRadius: 8, padding: "4px 12px", fontSize: 12, color: "#818cf8", fontWeight: 700 }}>DAY 64</span>
          <span style={{ color: "#475569", fontSize: 12 }}>111 Days of Learning for Change</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900 }}>
          {"📧 Email Verification & "}
          <span style={{ background: "linear-gradient(90deg, #6366f1, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Nodemailer</span>
        </h1>
        <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: 13.5 }}>Send verification emails · Secure token hashing · Guard login routes</p>
      </div>

      <div style={{ display: "flex", gap: 4, padding: "12px 32px", background: "#0d0d1a", borderBottom: "1px solid #1e1e2e", overflowX: "auto" }}>
        {NAV.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{ background: active === s.id ? "#6366f1" : "transparent", color: active === s.id ? "#fff" : "#64748b", border: active === s.id ? "none" : "1px solid #2a2a3d", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap" }}>{s.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 860, width: "100%", margin: "0 auto", padding: "32px 24px", flex: 1 }}>
        {sections[active]}
      </div>

      <div style={{ textAlign: "center", padding: 16, borderTop: "1px solid #1e1e2e", color: "#334155", fontSize: 12 }}>
        Day 64 / 111 — Code for Change Nepal · Next: Day 65 Authentication Mini Project
      </div>
    </div>
  );
}
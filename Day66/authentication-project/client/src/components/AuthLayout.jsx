import { Link } from "react-router-dom";

const FEATURES = [
  "AES-grade password hashing with bcrypt",
  "Short-lived JWT sessions, httpOnly cookies",
  "Time-boxed email verification & reset tokens",
];

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-2">
      {/* Brand panel — dot-grid pattern evokes an encrypted/keyed surface, kept quiet */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink-900 px-12 py-14 lg:flex">
        <div className="dot-grid-bg absolute inset-0 opacity-60" />
        <div className="relative z-10">
          <Link to="/" className="font-display text-xl font-semibold text-slate-100">
            SecureAuth
          </Link>
          <p className="mt-16 max-w-sm font-display text-3xl leading-tight text-slate-100">
            One verified identity.
            <br />
            Every protected route.
          </p>
        </div>

        <ul className="relative z-10 space-y-3">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-400">
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-400" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-ink-950 px-6 py-12">
        <div className="w-full max-w-sm">
          {eyebrow && (
            <p className="token-text mb-2 text-xs uppercase tracking-widest text-teal-500">{eyebrow}</p>
          )}
          <h1 className="font-display text-2xl font-semibold text-slate-100">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-slate-400">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

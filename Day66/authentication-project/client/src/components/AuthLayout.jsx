import { ShieldCheck } from 'lucide-react';

/**
 * Centers a card on the screen with a consistent header. Used by every
 * standalone auth page (login, register, forgot/reset password, verify).
 */
export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-ink-700 bg-ink-900">
            <ShieldCheck size={20} className="text-signal-400" />
          </div>
          {eyebrow && (
            <p className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-signal-500">
              {eyebrow}
            </p>
          )}
          <h1 className="text-xl font-semibold text-slate-50">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-slate-400">{subtitle}</p>}
        </div>

        <div className="rounded-xl border border-ink-700 bg-ink-900 p-6 shadow-xl shadow-black/20">
          {children}
        </div>

        {footer && <div className="mt-5 text-center text-sm text-slate-400">{footer}</div>}
      </div>
    </div>
  );
}
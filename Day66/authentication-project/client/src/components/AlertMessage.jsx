import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    classes: 'bg-signal-500/10 border-signal-500/30 text-signal-400',
  },
  error: {
    icon: XCircle,
    classes: 'bg-danger-500/10 border-danger-500/30 text-danger-400',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'bg-warn-500/10 border-warn-500/30 text-warn-400',
  },
  info: {
    icon: Info,
    classes: 'bg-slate-500/10 border-slate-500/30 text-slate-300',
  },
};

/**
 * Inline alert banner. Use for form-level errors, success confirmations,
 * and informational notices (e.g. "check your email").
 */
export default function AlertMessage({ variant = 'info', children, onDismiss }) {
  if (!children) return null;
  const { icon: Icon, classes } = VARIANTS[variant] || VARIANTS.info;

  return (
    <div role="alert" className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm ${classes}`}>
      <Icon size={18} className="mt-0.5 flex-shrink-0" />
      <p className="flex-1 leading-snug">{children}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="flex-shrink-0 opacity-70 hover:opacity-100"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
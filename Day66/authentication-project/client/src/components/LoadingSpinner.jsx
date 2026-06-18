/**
 * Loading spinner. `size="sm"` for inline button use,
 * `fullPage` for the initial auth-bootstrap screen.
 */
export default function LoadingSpinner({ size = 'md', fullPage = false, label = 'Loading…' }) {
  const dimensions = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-[3px]' };

  const spinner = (
    <span
      role="status"
      aria-label={label}
      className={`inline-block animate-spin rounded-full border-ink-700 border-t-signal-400 ${dimensions[size]}`}
    />
  );

  if (!fullPage) return spinner;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950">
      {spinner}
      <p className="font-mono text-xs uppercase tracking-widest text-slate-500">{label}</p>
    </div>
  );
}
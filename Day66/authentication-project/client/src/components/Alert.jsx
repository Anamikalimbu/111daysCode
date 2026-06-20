const STYLES = {
  success: "bg-success/10 border-success/40 text-success",
  error: "bg-danger/10 border-danger/40 text-danger",
  info: "bg-teal-500/10 border-teal-500/40 text-teal-400",
  warning: "bg-amber-500/10 border-amber-500/40 text-amber-400",
};

export default function Alert({ type = "info", message, onClose }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${STYLES[type] || STYLES.info}`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss message"
          className="text-current opacity-60 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
}

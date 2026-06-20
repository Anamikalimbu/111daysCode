export default function LoadingSpinner({ size = "md", label = "Loading" }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-[3px]",
  };

  return (
    <div className="flex items-center justify-center gap-2" role="status" aria-live="polite">
      <span
        className={`inline-block animate-spin rounded-full border-teal-500 border-t-transparent ${sizes[size]}`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

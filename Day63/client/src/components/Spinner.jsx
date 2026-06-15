/**
 * Spinner — loading indicator with configurable size and color
 */
export default function Spinner({ size = "md", color = "brand" }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-[3px]",
    xl: "w-16 h-16 border-4",
  };

  const colors = {
    brand: "border-brand-200 border-t-brand-600 dark:border-brand-800 dark:border-t-brand-400",
    white: "border-white/30 border-t-white",
    slate: "border-slate-200 border-t-slate-600",
  };

  return (
    <div
      className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}
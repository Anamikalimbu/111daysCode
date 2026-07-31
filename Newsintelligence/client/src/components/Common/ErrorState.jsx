import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import { cn } from '../../utils/cn';

export default function ErrorState({
  title = "This didn't load",
  message = 'The server did not respond. Check your connection and try again.',
  onRetry,
  className,
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border',
        'border-negative/30 bg-negative-soft px-6 py-16 text-center',
        'dark:border-negative/40 dark:bg-negative/10',
        className
      )}
    >
      <FiAlertTriangle className="h-8 w-8 text-negative" aria-hidden="true" />
      <h3 className="font-display text-lg font-medium">{title}</h3>
      <p className="max-w-sm text-sm text-ink-soft dark:text-paper/60">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            'mt-1 inline-flex items-center gap-2 rounded-full border border-void-line',
            'px-4 py-2 text-sm font-medium transition-colors hover:border-wire hover:text-wire'
          )}
        >
          <FiRefreshCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}

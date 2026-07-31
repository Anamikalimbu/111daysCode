import { cn } from '../../utils/cn';

const SIZES = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-[3px]',
};

export default function LoadingSpinner({ size = 'md', label = 'Loading', className }) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn('inline-flex items-center justify-center', className)}
    >
      <span
        className={cn(
          SIZES[size],
          'animate-spin rounded-full border-void-line dark:border-void-line',
          'border-t-wire'
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

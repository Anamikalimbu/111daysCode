import { cn } from '../../utils/cn';

export default function KeywordChip({ children, onClick, active = false }) {
  const Tag = onClick ? 'button' : 'span';

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-mono transition-colors',
        active
          ? 'border-wire bg-wire text-white'
          : 'border-void-line text-ink-soft hover:border-wire hover:text-wire dark:text-paper/60'
      )}
    >
      {children}
    </Tag>
  );
}

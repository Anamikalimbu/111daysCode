import { FiInbox } from 'react-icons/fi';
import { cn } from '../../utils/cn';

export default function EmptyState({
  icon: Icon = FiInbox,
  title = 'Nothing here yet',
  message = 'Once new items come in, they will show up here.',
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed',
        'border-void-line px-6 py-16 text-center',
        className
      )}
    >
      <Icon className="h-8 w-8 text-ink-soft dark:text-paper/50" aria-hidden="true" />
      <h3 className="font-display text-lg font-medium">{title}</h3>
      <p className="max-w-sm text-sm text-ink-soft dark:text-paper/60">{message}</p>
      {action}
    </div>
  );
}

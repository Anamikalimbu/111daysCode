import { getSentimentConfig } from '../../utils/sentiment';
import { cn } from '../../utils/cn';

export default function SentimentBadge({ sentiment, score, className }) {
  const config = getSentimentConfig(sentiment);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        config.bgClass,
        config.textClass,
        className
      )}
    >
      <span
        className={cn('h-1.5 w-1.5 rounded-full', config.dotClass)}
        aria-hidden="true"
      />
      {config.label}
      {typeof score === 'number' && (
        <span className="font-mono text-[10px] opacity-70">
          {score > 0 ? '+' : ''}
          {score.toFixed(2)}
        </span>
      )}
    </span>
  );
}

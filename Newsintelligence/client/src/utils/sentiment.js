/**
 * Central mapping from a sentiment label to its display config.
 * Keeps color choices consistent across SentimentBadge, charts, and cards.
 */
export const SENTIMENT_CONFIG = {
  positive: {
    label: 'Positive',
    textClass: 'text-positive',
    bgClass: 'bg-positive-soft dark:bg-positive/15',
    dotClass: 'bg-positive',
    hex: '#1F9D6B',
  },
  neutral: {
    label: 'Neutral',
    textClass: 'text-neutral-sent',
    bgClass: 'bg-neutral-sent-soft dark:bg-neutral-sent/15',
    dotClass: 'bg-neutral-sent',
    hex: '#8B8D98',
  },
  negative: {
    label: 'Negative',
    textClass: 'text-negative',
    bgClass: 'bg-negative-soft dark:bg-negative/15',
    dotClass: 'bg-negative',
    hex: '#D64545',
  },
};

export function getSentimentConfig(sentiment) {
  return SENTIMENT_CONFIG[sentiment] || SENTIMENT_CONFIG.neutral;
}

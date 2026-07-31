import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrendingUp } from 'react-icons/fi';
import { cn } from '../../utils/cn';
import { formatSignedPercent } from '../../utils/formatters';

function TopicCard({ topic: topicData }) {
  const {
    cluster_id,
    topic_name,
    topic: topicLabel,
    articles,
    average_sentiment,
    trending_score,
  } = topicData;

  const name = topic_name || topicLabel;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Link
        to={`/topics/${cluster_id}`}
        className={cn(
          'flex h-full flex-col justify-between gap-4 rounded-2xl border border-void-line bg-white p-5',
          'dark:bg-void-raised hover:border-wire transition-colors'
        )}
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-paper/50">
            Topic
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold leading-snug">
            {name}
          </h3>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="font-display text-2xl font-semibold tabular-nums">
              {articles}
            </p>
            <p className="text-xs text-ink-soft dark:text-paper/50">
              {articles === 1 ? 'article' : 'articles'}
            </p>
          </div>

          {typeof average_sentiment === 'number' && (
            <p className="text-xs font-mono text-ink-soft dark:text-paper/50">
              sentiment {formatSignedPercent(average_sentiment)}
            </p>
          )}

          {typeof trending_score === 'number' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-wire-soft px-2 py-1 text-xs font-medium text-wire dark:bg-wire/15">
              <FiTrendingUp className="h-3.5 w-3.5" />
              {Math.round(trending_score * 100)}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default memo(TopicCard);

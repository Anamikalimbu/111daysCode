import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowUpRight, FiClock } from 'react-icons/fi';
import SentimentBadge from './SentimentBadge';
import KeywordChip from './KeywordChip';
import { formatDate, formatReadingTime } from '../../utils/formatters';
import { cn } from '../../utils/cn';

function NewsCard({ article, featured = false }) {
  const {
    _id,
    title,
    summary,
    description,
    source,
    published_date,
    reading_time,
    sentiment,
    keywords,
    image_url,
    topic_name,
  } = article;

  const excerpt = summary || description || '';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-void-line bg-white',
        'dark:bg-void-raised',
        featured && 'md:col-span-2 md:flex-row'
      )}
    >
      <Link
        to={`/article/${_id}`}
        className={cn(
          'block overflow-hidden bg-paper-dim dark:bg-void',
          featured ? 'md:w-2/5 aspect-[16/10] md:aspect-auto' : 'aspect-[16/9]'
        )}
      >
        {image_url ? (
          <img
            src={image_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-3xl text-ink-soft/30">
            {source?.[0] || '?'}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wide text-ink-soft dark:text-paper/50">
          <span className="text-wire">{source}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(published_date)}</span>
          {topic_name && (
            <>
              <span aria-hidden="true">·</span>
              <Link
                to={`/topics/${article.cluster_id}`}
                className="hover:text-wire hover:underline"
              >
                {topic_name}
              </Link>
            </>
          )}
        </div>

        <Link to={`/article/${_id}`}>
          <h3 className="text-balance font-display text-lg font-semibold leading-snug group-hover:text-wire">
            {title}
          </h3>
        </Link>

        {excerpt && (
          <p className="line-clamp-3 text-sm text-ink-soft dark:text-paper/60">
            {excerpt}
          </p>
        )}

        {keywords?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {keywords.slice(0, 4).map((kw) => (
              <KeywordChip key={kw}>{kw}</KeywordChip>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <SentimentBadge sentiment={sentiment} />
            <span className="inline-flex items-center gap-1 text-xs text-ink-soft dark:text-paper/50">
              <FiClock className="h-3.5 w-3.5" />
              {formatReadingTime(reading_time)}
            </span>
          </div>
          <Link
            to={`/article/${_id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-wire hover:underline"
          >
            Read more
            <FiArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default memo(NewsCard);

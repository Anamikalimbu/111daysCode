import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiExternalLink, FiClock, FiArrowLeft } from 'react-icons/fi';
import SentimentBadge from '../components/Cards/SentimentBadge';
import KeywordChip from '../components/Cards/KeywordChip';
import LoadingSpinner from '../components/Loader/LoadingSpinner';
import ErrorState from '../components/Common/ErrorState';
import { useArticle } from '../hooks/useArticles';
import { formatDate, formatReadingTime } from '../utils/formatters';

const ENTITY_LABELS = {
  PERSON: 'People',
  ORG: 'Organisations',
  GPE: 'Places',
  PRODUCT: 'Products',
  EVENT: 'Events',
  DATE: 'Dates',
};

export default function ArticleDetails() {
  const { id } = useParams();
  const { data: article, isLoading, isError, error, refetch } = useArticle(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" label="Loading article" />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <ErrorState
        title={error?.status === 404 ? 'Article not found' : "This didn't load"}
        message={
          error?.status === 404
            ? "This article doesn't exist or may have been removed."
            : 'The server did not respond. Check your connection and try again.'
        }
        onRetry={error?.status === 404 ? undefined : refetch}
      />
    );
  }

  const entityEntries = Object.entries(article.entities || {}).filter(
    ([, values]) => values?.length > 0
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex max-w-3xl flex-col gap-6"
    >
      <Link
        to="/"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-ink-soft hover:text-wire dark:text-paper/50"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      {article.image_url && (
        <img
          src={article.image_url}
          alt=""
          className="aspect-[16/9] w-full rounded-2xl object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wide text-ink-soft dark:text-paper/50">
          <span className="text-wire">{article.source}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(article.published_date)}</span>
          {article.author && (
            <>
              <span aria-hidden="true">·</span>
              <span>{article.author}</span>
            </>
          )}
        </div>

        <h1 className="text-balance font-display text-3xl font-semibold leading-tight md:text-4xl">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <SentimentBadge sentiment={article.sentiment} score={article.sentiment_score} />
          <span className="inline-flex items-center gap-1 text-xs text-ink-soft dark:text-paper/50">
            <FiClock className="h-3.5 w-3.5" />
            {formatReadingTime(article.reading_time)}
          </span>
          {article.topic_name && (
            <Link
              to={`/topics/${article.cluster_id}`}
              className="text-xs font-medium text-wire hover:underline"
            >
              {article.topic_name}
            </Link>
          )}
        </div>
      </header>

      {article.summary && (
        <div className="rounded-2xl border border-wire/30 bg-wire-soft p-5 dark:border-wire/30 dark:bg-wire/10">
          <p className="mb-1.5 font-mono text-[11px] uppercase tracking-wide text-wire">
            AI summary
          </p>
          <p className="text-sm leading-relaxed">{article.summary}</p>
        </div>
      )}

      {(article.clean_content || article.content) && (
        <div className="prose-wire whitespace-pre-line text-[15px] leading-relaxed text-ink dark:text-paper/90">
          {article.clean_content || article.content}
        </div>
      )}

      {article.keywords?.length > 0 && (
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-paper/50">
            Keywords
          </p>
          <div className="flex flex-wrap gap-2">
            {article.keywords.map((kw) => (
              <KeywordChip key={kw}>{kw}</KeywordChip>
            ))}
          </div>
        </div>
      )}

      {entityEntries.length > 0 && (
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-paper/50">
            Named entities
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {entityEntries.map(([type, values]) => (
              <div
                key={type}
                className="rounded-xl border border-void-line p-3"
              >
                <p className="mb-1.5 text-xs font-medium text-ink-soft dark:text-paper/50">
                  {ENTITY_LABELS[type] || type}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {values.map((v) => (
                    <KeywordChip key={v}>{v}</KeywordChip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {article.related_articles?.length > 0 && (
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-paper/50">
            Related stories
          </p>
          <div className="flex flex-col gap-2">
            {article.related_articles.map((related) => (
              <Link
                key={related.article_id}
                to={`/article/${related.article_id}`}
                className="flex items-center justify-between rounded-xl border border-void-line p-3 text-sm hover:border-wire hover:text-wire"
              >
                <span className="truncate pr-4">{related.title}</span>
                <span className="shrink-0 font-mono text-xs text-ink-soft dark:text-paper/40">
                  {Math.round((related.similarity_score || 0) * 100)}% match
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {article.article_url && (
        <a
          href={article.article_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-void-line px-4 py-2 text-sm font-medium hover:border-wire hover:text-wire"
        >
          Read the original article
          <FiExternalLink className="h-4 w-4" />
        </a>
      )}
    </motion.article>
  );
}

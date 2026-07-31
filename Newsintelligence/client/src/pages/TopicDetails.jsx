import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import SentimentBadge from '../components/Cards/SentimentBadge';
import LoadingSpinner from '../components/Loader/LoadingSpinner';
import ErrorState from '../components/Common/ErrorState';
import { useTopicDetail } from '../hooks/useTopics';
import { formatDate, formatSignedPercent } from '../utils/formatters';

function sentimentFromScore(score) {
  if (score === null || score === undefined) return 'neutral';
  if (score >= 0.05) return 'positive';
  if (score <= -0.05) return 'negative';
  return 'neutral';
}

export default function TopicDetails() {
  const { clusterId } = useParams();
  const { data: topic, isLoading, isError, error, refetch } = useTopicDetail(clusterId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" label="Loading topic" />
      </div>
    );
  }

  if (isError || !topic) {
    return (
      <ErrorState
        title={error?.status === 404 ? 'Topic not found' : "This didn't load"}
        message={
          error?.status === 404
            ? "This topic doesn't exist or may have merged with another."
            : 'The server did not respond. Check your connection and try again.'
        }
        onRetry={error?.status === 404 ? undefined : refetch}
      />
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link
        to="/topics"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-ink-soft hover:text-wire dark:text-paper/50"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to topics
      </Link>

      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-paper/50">
          Topic
        </p>
        <h1 className="font-display text-3xl font-semibold">{topic.topic_name}</h1>

        <div className="flex flex-wrap items-center gap-3">
          <SentimentBadge sentiment={sentimentFromScore(topic.average_sentiment)} />
          <span className="text-xs font-mono text-ink-soft dark:text-paper/50">
            avg sentiment {formatSignedPercent(topic.average_sentiment)}
          </span>
          <span className="text-xs text-ink-soft dark:text-paper/50">
            {topic.article_count} {topic.article_count === 1 ? 'article' : 'articles'}
          </span>
        </div>
      </header>

      {topic.topic_summary && (
        <div className="rounded-2xl border border-wire/30 bg-wire-soft p-5 dark:border-wire/30 dark:bg-wire/10">
          <p className="mb-1.5 font-mono text-[11px] uppercase tracking-wide text-wire">
            Topic summary
          </p>
          <p className="text-sm leading-relaxed">{topic.topic_summary}</p>
        </div>
      )}

      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-paper/50">
          Articles in this topic
        </p>
        <div className="flex flex-col gap-2">
          {topic.articles.map((article) => (
            <Link
              key={article.article_id}
              to={`/article/${article.article_id}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-void-line p-4 hover:border-wire"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{article.title}</p>
                <p className="text-xs text-ink-soft dark:text-paper/50">
                  {article.source} · {formatDate(article.published_date)}
                </p>
              </div>
              <SentimentBadge sentiment={article.sentiment} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

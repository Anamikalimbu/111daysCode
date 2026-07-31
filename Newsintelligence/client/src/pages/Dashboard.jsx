import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiFileText,
  FiHash,
  FiGlobe,
  FiSmile,
  FiMeh,
  FiFrown,
} from 'react-icons/fi';
import SearchBar from '../components/Search/SearchBar';
import StatisticCard from '../components/Cards/StatisticCard';
import TopicCard from '../components/Cards/TopicCard';
import NewsCard from '../components/Cards/NewsCard';
import { NewsCardSkeleton } from '../components/Common/Skeleton';
import EmptyState from '../components/Common/EmptyState';
import ErrorState from '../components/Common/ErrorState';
import Pagination from '../components/Common/Pagination';
import { useProcessedArticles } from '../hooks/useArticles';
import { useTrending } from '../hooks/useTopics';
import { useAnalytics } from '../hooks/useAnalytics';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination } from '../hooks/usePagination';
import { formatRelativeTime } from '../utils/formatters';

const PAGE_SIZE = 9;

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 250);

  const {
    data: articlesData,
    isLoading: articlesLoading,
    isError: articlesError,
    refetch: refetchArticles,
  } = useProcessedArticles({ limit: 60 });

  const { data: trendingData, isLoading: trendingLoading } = useTrending({
    top_n: 4,
  });

  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();

  const articles = useMemo(() => articlesData?.articles || [], [articlesData]);

  const filtered = useMemo(() => {
    if (!debouncedQuery.trim()) return articles;
    const q = debouncedQuery.toLowerCase();
    return articles.filter((a) =>
      `${a.title} ${a.source} ${a.topic_name}`.toLowerCase().includes(q)
    );
  }, [articles, debouncedQuery]);

  const suggestions = debouncedQuery ? filtered.slice(0, 6) : [];

  const { page, setPage, totalPages, pageItems, nextPage, prevPage } =
    usePagination(filtered, PAGE_SIZE);

  const sentimentDist = analytics?.sentiment_distribution;
  const trendingTopics = trendingData?.trending_topics || [];
  const topTrending = trendingTopics[0];

  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-void-line bg-void px-6 py-10 text-paper md:px-12 md:py-14"
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-wire-dark">
          Live intelligence desk
        </p>
        <h1 className="mt-3 max-w-2xl text-balance font-display text-4xl font-semibold leading-tight md:text-5xl">
          The news, read and understood by AI before you get to it.
        </h1>
        <p className="mt-4 max-w-xl text-sm text-paper/60">
          Every story cleaned, summarized, scored for sentiment, and grouped
          into topics automatically — so you can scan what matters in
          seconds.
        </p>

        <div className="mt-6 max-w-lg">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            suggestions={suggestions}
            placeholder="Search the wire…"
            className="[&_input]:bg-void-raised [&_input]:border-void-line [&_input]:text-paper [&_input]:placeholder:text-paper/30"
          />
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:max-w-lg">
          <div>
            <p className="font-display text-2xl font-semibold tabular-nums">
              {analytics?.total_articles ?? '—'}
            </p>
            <p className="text-xs text-paper/50">Total articles</p>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold tabular-nums">
              {analytics?.total_clusters ?? '—'}
            </p>
            <p className="text-xs text-paper/50">Topics found</p>
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-semibold">
              {topTrending?.topic || '—'}
            </p>
            <p className="text-xs text-paper/50">Trending now</p>
          </div>
        </div>
      </motion.section>

      {/* Statistics cards */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Platform statistics
        </h2>
        {analyticsLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-2xl bg-paper-dim dark:bg-void-raised"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <StatisticCard
              label="Total articles"
              value={analytics?.total_articles ?? 0}
              icon={FiFileText}
            />
            <StatisticCard
              label="Positive"
              value={sentimentDist?.positive ?? 0}
              icon={FiSmile}
              accentClass="text-positive"
            />
            <StatisticCard
              label="Neutral"
              value={sentimentDist?.neutral ?? 0}
              icon={FiMeh}
              accentClass="text-neutral-sent"
            />
            <StatisticCard
              label="Negative"
              value={sentimentDist?.negative ?? 0}
              icon={FiFrown}
              accentClass="text-negative"
            />
            <StatisticCard
              label="Topics"
              value={analytics?.total_clusters ?? 0}
              icon={FiHash}
            />
            <StatisticCard
              label="Sources"
              value={
                Object.keys(analytics?.source_distribution?.articles_per_source || {})
                  .length
              }
              icon={FiGlobe}
            />
          </div>
        )}
      </section>

      {/* Trending topics */}
      <section aria-labelledby="trending-heading">
        <div className="mb-4 flex items-end justify-between">
          <h2 id="trending-heading" className="font-display text-xl font-semibold">
            Trending topics
          </h2>
          <a href="/topics" className="text-sm text-wire hover:underline">
            View all
          </a>
        </div>

        {trendingLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl bg-paper-dim dark:bg-void-raised"
              />
            ))}
          </div>
        ) : trendingTopics.length === 0 ? (
          <EmptyState
            title="No trending topics yet"
            message="Run the clustering pipeline on the backend to populate topics."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trendingTopics.map((topic) => (
              <div key={topic.cluster_id}>
                <TopicCard topic={topic} />
                <p className="mt-1 px-1 text-xs text-ink-soft dark:text-paper/40">
                  Updated {formatRelativeTime(new Date())}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Latest articles */}
      <section aria-labelledby="latest-heading">
        <div className="mb-4 flex items-end justify-between">
          <h2 id="latest-heading" className="font-display text-xl font-semibold">
            Latest articles
          </h2>
          <span className="text-xs text-ink-soft dark:text-paper/40">
            {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}
          </span>
        </div>

        {articlesError ? (
          <ErrorState onRetry={refetchArticles} />
        ) : articlesLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No articles found"
            message="Try a different search, or check back once the scraper has run."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((article) => (
                <NewsCard key={article._id} article={article} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={prevPage}
              onNext={nextPage}
              onPage={setPage}
            />
          </>
        )}
      </section>
    </div>
  );
}

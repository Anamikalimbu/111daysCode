import { useMemo, useState } from 'react';
import { useProcessedArticles } from './useArticles';
import { READING_TIME_OPTIONS } from '../utils/constants';

const SEARCH_FETCH_LIMIT = 200;

/**
 * Search + multi-filter over the processed-article set.
 *
 * The backend doesn't expose a dedicated search/filter query endpoint,
 * so this fetches a bounded, recent batch of processed articles once
 * (cached by React Query) and filters/searches it client-side. That's
 * appropriate at the "hundreds of visible articles" scale a dashboard
 * shows; a true full-text search endpoint would be the next backend
 * addition if the catalog grows much larger.
 */
export function useSearchAndFilter() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    sentiment: [],
    source: [],
    topic: [],
    readingTime: [],
  });

  const { data, isLoading, isError, error } = useProcessedArticles({
    limit: SEARCH_FETCH_LIMIT,
  });

  const articles = useMemo(() => data?.articles || [], [data]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    return articles.filter((article) => {
      if (q) {
        const haystack = [
          article.title,
          article.topic_name,
          article.source,
          ...(article.keywords || []),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (filters.sentiment.length && !filters.sentiment.includes(article.sentiment)) {
        return false;
      }

      if (filters.source.length && !filters.source.includes(article.source)) {
        return false;
      }

      if (filters.topic.length && !filters.topic.includes(article.topic_name)) {
        return false;
      }

      if (filters.readingTime.length) {
        const minutes = article.reading_time || 0;
        const matchesAny = filters.readingTime.some((key) => {
          const option = READING_TIME_OPTIONS.find((o) => o.value === key);
          if (!option) return false;
          if (option.min && minutes < option.min) return false;
          if (option.max && minutes >= option.max) return false;
          return true;
        });
        if (!matchesAny) return false;
      }

      return true;
    });
  }, [articles, query, filters]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return results.slice(0, 6);
  }, [results, query]);

  const availableSources = useMemo(
    () => [...new Set(articles.map((a) => a.source).filter(Boolean))].sort(),
    [articles]
  );

  const availableTopics = useMemo(
    () => [...new Set(articles.map((a) => a.topic_name).filter(Boolean))].sort(),
    [articles]
  );

  function toggleFilter(category, value) {
    setFilters((prev) => {
      const current = prev[category];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: next };
    });
  }

  function clearFilters() {
    setFilters({ sentiment: [], source: [], topic: [], readingTime: [] });
  }

  const activeFilterCount = Object.values(filters).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return {
    query,
    setQuery,
    filters,
    toggleFilter,
    clearFilters,
    activeFilterCount,
    results,
    suggestions,
    availableSources,
    availableTopics,
    isLoading,
    isError,
    error,
  };
}

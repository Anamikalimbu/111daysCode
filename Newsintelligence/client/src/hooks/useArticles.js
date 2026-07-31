import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { QUERY_KEYS } from '../utils/constants';

/** Processed, AI-enriched articles (summary, sentiment, keywords, etc). */
export function useProcessedArticles(params = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.processedArticles(params),
    queryFn: () => api.getProcessedArticles(params),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });
}

/** Raw stored articles (used sparingly — prefer processed articles). */
export function useArticles(params = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.articles(params),
    queryFn: () => api.getArticles(params),
    staleTime: 60_000,
  });
}

/** One full processed article by MongoDB id, for the Article Details page. */
export function useArticle(id) {
  return useQuery({
    queryKey: QUERY_KEYS.article(id),
    queryFn: () => api.getArticle(id),
    enabled: Boolean(id),
    retry: 1,
  });
}

/** Related-story lookup for an article, backing the "Related Stories" panel. */
export function useRelatedArticles(id) {
  return useQuery({
    queryKey: QUERY_KEYS.related(id),
    queryFn: () => api.getRelatedArticles(id),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}

export function useSentimentStats() {
  return useQuery({
    queryKey: QUERY_KEYS.sentiment,
    queryFn: api.getSentimentStats,
    staleTime: 60_000,
  });
}

export function useKeywords(params = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.keywords(params),
    queryFn: () => api.getKeywords(params),
    staleTime: 60_000,
  });
}

export function useEntities(params = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.entities(params),
    queryFn: () => api.getEntities(params),
    staleTime: 60_000,
  });
}

export function useHealth() {
  return useQuery({
    queryKey: QUERY_KEYS.health,
    queryFn: api.getHealth,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

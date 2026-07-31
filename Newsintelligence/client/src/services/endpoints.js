/**
 * Centralized REST endpoint paths for the News Intelligence backend.
 * Keeping these in one place means a backend route rename only needs
 * to change here, not in every component that calls it.
 */
export const ENDPOINTS = {
  health: '/health',
  articles: '/articles',
  processed: '/processed',
  article: (id) => `/article/${id}`,
  summary: (id) => `/summary/${id}`,
  sentiment: '/sentiment',
  keywords: '/keywords',
  entities: '/entities',
  topics: '/topics',
  topicDetail: (clusterId) => `/topics/${clusterId}`,
  trending: '/trending',
  related: (articleId) => `/related/${articleId}`,
  analytics: '/analytics',
};

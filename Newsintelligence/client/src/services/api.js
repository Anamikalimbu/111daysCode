import axios from 'axios';
import { ENDPOINTS } from './endpoints';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Normalize axios errors into a consistent shape components can rely on.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? null;
    const message =
      error.response?.data?.detail ||
      error.message ||
      'Something went wrong talking to the server.';
    return Promise.reject({ status, message, raw: error });
  }
);

/**
 * Reusable API functions. Every hook in `src/hooks` calls through here —
 * no component should import axios or call apiClient directly.
 */
export const api = {
  getHealth: () => apiClient.get(ENDPOINTS.health).then((r) => r.data),

  getArticles: (params = {}) =>
    apiClient.get(ENDPOINTS.articles, { params }).then((r) => r.data),

  getProcessedArticles: (params = {}) =>
    apiClient.get(ENDPOINTS.processed, { params }).then((r) => r.data),

  getArticle: (id) => apiClient.get(ENDPOINTS.article(id)).then((r) => r.data),

  getArticleSummary: (id) =>
    apiClient.get(ENDPOINTS.summary(id)).then((r) => r.data),

  getSentimentStats: () =>
    apiClient.get(ENDPOINTS.sentiment).then((r) => r.data),

  getKeywords: (params = {}) =>
    apiClient.get(ENDPOINTS.keywords, { params }).then((r) => r.data),

  getEntities: (params = {}) =>
    apiClient.get(ENDPOINTS.entities, { params }).then((r) => r.data),

  getTopics: () => apiClient.get(ENDPOINTS.topics).then((r) => r.data),

  getTopicDetail: (clusterId) =>
    apiClient.get(ENDPOINTS.topicDetail(clusterId)).then((r) => r.data),

  getTrending: (params = {}) =>
    apiClient.get(ENDPOINTS.trending, { params }).then((r) => r.data),

  getRelatedArticles: (articleId) =>
    apiClient.get(ENDPOINTS.related(articleId)).then((r) => r.data),

  getAnalytics: () => apiClient.get(ENDPOINTS.analytics).then((r) => r.data),
};

export default api;

/** React Query cache keys, centralized to avoid typos causing cache misses. */
export const QUERY_KEYS = {
  health: ['health'],
  articles: (params) => ['articles', params],
  processedArticles: (params) => ['processed-articles', params],
  article: (id) => ['article', id],
  sentiment: ['sentiment'],
  keywords: (params) => ['keywords', params],
  entities: (params) => ['entities', params],
  topics: ['topics'],
  topicDetail: (id) => ['topic', id],
  trending: (params) => ['trending', params],
  related: (id) => ['related', id],
  analytics: ['analytics'],
};

export const SENTIMENT_OPTIONS = [
  { value: 'positive', label: 'Positive' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'negative', label: 'Negative' },
];

export const READING_TIME_OPTIONS = [
  { value: 'short', label: 'Under 3 min', max: 3 },
  { value: 'medium', label: '3–7 min', min: 3, max: 7 },
  { value: 'long', label: '7+ min', min: 7 },
];

export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' },
  { to: '/topics', label: 'Topics', icon: 'topics' },
  { to: '/analytics', label: 'Analytics', icon: 'analytics' },
  { to: '/search', label: 'Search', icon: 'search' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

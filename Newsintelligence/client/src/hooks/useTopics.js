import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { QUERY_KEYS } from '../utils/constants';

export function useTopics() {
  return useQuery({
    queryKey: QUERY_KEYS.topics,
    queryFn: api.getTopics,
    staleTime: 60_000,
  });
}

export function useTopicDetail(clusterId) {
  return useQuery({
    queryKey: QUERY_KEYS.topicDetail(clusterId),
    queryFn: () => api.getTopicDetail(clusterId),
    enabled: Boolean(clusterId),
    retry: 1,
  });
}

export function useTrending(params = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.trending(params),
    queryFn: () => api.getTrending(params),
    staleTime: 60_000,
  });
}

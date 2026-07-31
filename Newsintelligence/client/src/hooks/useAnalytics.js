import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { QUERY_KEYS } from '../utils/constants';

export function useAnalytics() {
  return useQuery({
    queryKey: QUERY_KEYS.analytics,
    queryFn: api.getAnalytics,
    staleTime: 60_000,
  });
}

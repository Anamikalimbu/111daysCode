import ErrorState from '../components/Common/ErrorState';
import LoadingSpinner from '../components/Loader/LoadingSpinner';
import SentimentPieChart from '../components/Charts/SentimentPieChart';
import SourceBarChart from '../components/Charts/SourceBarChart';
import TrendingBarChart from '../components/Charts/TrendingBarChart';
import KeywordBarChart from '../components/Charts/KeywordBarChart';
import ArticleActivityLineChart from '../components/Charts/ArticleActivityLineChart';
import EntityDoughnutChart from '../components/Charts/EntityDoughnutChart';
import StatisticCard from '../components/Cards/StatisticCard';
import { FiFileText, FiHash, FiTrendingUp } from 'react-icons/fi';
import { useAnalytics } from '../hooks/useAnalytics';
import { useProcessedArticles } from '../hooks/useArticles';

export default function Analytics() {
  const { data: analytics, isLoading, isError, refetch } = useAnalytics();
  const { data: articlesData } = useProcessedArticles({ limit: 150 });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" label="Loading analytics" />
      </div>
    );
  }

  if (isError || !analytics) {
    return <ErrorState onRetry={refetch} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-ink-soft dark:text-paper/50">
          A full snapshot of what the platform has learned from the news so
          far.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatisticCard
          label="Total articles"
          value={analytics.total_articles}
          icon={FiFileText}
        />
        <StatisticCard
          label="Total clusters"
          value={analytics.total_clusters}
          icon={FiHash}
        />
        <StatisticCard
          label="Most active topic"
          value={analytics.topic_analytics?.most_active_topic?.topic_name || '—'}
          icon={FiTrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SentimentPieChart data={analytics.sentiment_distribution} />
        <SourceBarChart data={analytics.source_distribution} />
        <TrendingBarChart data={analytics.trending_topics} />
        <EntityDoughnutChart data={analytics.top_entities} />
        <KeywordBarChart data={analytics.top_keywords} />
        <ArticleActivityLineChart articles={articlesData?.articles || []} />
      </div>
    </div>
  );
}

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS, tooltipContentStyle } from './chartTheme';
import ChartCard from './ChartCard';
import EmptyState from '../Common/EmptyState';

export default function TrendingBarChart({ data = [] }) {
  const chartData = data
    .map((t) => ({
      topic: t.topic || t.topic_name,
      score: Math.round((t.trending_score || 0) * 100),
    }))
    .slice(0, 10);

  return (
    <ChartCard title="Trending topics" subtitle="Score out of 100">
      {chartData.length === 0 ? (
        <EmptyState title="No trending topics yet" message="Run the clustering pipeline to populate this chart." />
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(260, chartData.length * 34)}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-void-line)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} />
            <YAxis
              type="category"
              dataKey="topic"
              tick={{ fontSize: 11 }}
              width={120}
            />
            <Tooltip contentStyle={tooltipContentStyle} cursor={{ fill: 'var(--color-wire)', opacity: 0.08 }} />
            <Bar
              dataKey="score"
              fill={CHART_COLORS.wireDark}
              radius={[0, 6, 6, 0]}
              animationDuration={600}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

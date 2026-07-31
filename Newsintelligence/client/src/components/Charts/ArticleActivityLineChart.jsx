import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO, isValid } from 'date-fns';
import { CHART_COLORS, tooltipContentStyle } from './chartTheme';
import ChartCard from './ChartCard';
import EmptyState from '../Common/EmptyState';

/** Buckets articles by publication day for a simple activity trend line. */
function bucketByDay(articles) {
  const counts = new Map();

  for (const article of articles) {
    const raw = article.published_date || article.scraped_at;
    if (!raw) continue;
    const date = typeof raw === 'string' ? parseISO(raw) : new Date(raw);
    if (!isValid(date)) continue;
    const key = format(date, 'MMM d');
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  return Array.from(counts.entries()).map(([day, count]) => ({ day, count }));
}

export default function ArticleActivityLineChart({ articles = [] }) {
  const chartData = useMemo(() => bucketByDay(articles), [articles]);

  return (
    <ChartCard title="Article activity" subtitle="Articles published per day">
      {chartData.length === 0 ? (
        <EmptyState title="No activity yet" message="Publication dates will appear here once articles are scraped." />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-void-line)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip contentStyle={tooltipContentStyle} />
            <Line
              type="monotone"
              dataKey="count"
              stroke={CHART_COLORS.wire}
              strokeWidth={2}
              dot={{ r: 3, fill: CHART_COLORS.wire }}
              animationDuration={700}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

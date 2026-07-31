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

export default function SourceBarChart({ data }) {
  const entries = Object.entries(data?.articles_per_source || {}).map(
    ([source, count]) => ({ source, count })
  );

  return (
    <ChartCard title="News by source" subtitle="Article volume per publisher">
      {entries.length === 0 ? (
        <EmptyState title="No source data yet" message="Scrape some articles to see this chart." />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={entries} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-void-line)" vertical={false} />
            <XAxis dataKey="source" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip contentStyle={tooltipContentStyle} cursor={{ fill: 'var(--color-wire)', opacity: 0.08 }} />
            <Bar
              dataKey="count"
              fill={CHART_COLORS.wire}
              radius={[6, 6, 0, 0]}
              animationDuration={600}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

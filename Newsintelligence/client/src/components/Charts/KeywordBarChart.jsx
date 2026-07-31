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

export default function KeywordBarChart({ data = [] }) {
  const chartData = data.slice(0, 12);

  return (
    <ChartCard title="Keyword frequency" subtitle="Most common terms across processed articles">
      {chartData.length === 0 ? (
        <EmptyState title="No keywords yet" message="Process some articles to see this chart." />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ left: -20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-void-line)" vertical={false} />
            <XAxis
              dataKey="keyword"
              tick={{ fontSize: 10 }}
              angle={-40}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip contentStyle={tooltipContentStyle} cursor={{ fill: 'var(--color-wire)', opacity: 0.08 }} />
            <Bar
              dataKey="count"
              fill={CHART_COLORS.positive}
              radius={[6, 6, 0, 0]}
              animationDuration={600}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

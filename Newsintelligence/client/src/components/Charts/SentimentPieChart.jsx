import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS, tooltipContentStyle } from './chartTheme';
import ChartCard from './ChartCard';
import EmptyState from '../Common/EmptyState';

export default function SentimentPieChart({ data }) {
  const chartData = [
    { name: 'Positive', value: data?.positive ?? 0, color: CHART_COLORS.positive },
    { name: 'Neutral', value: data?.neutral ?? 0, color: CHART_COLORS.neutral },
    { name: 'Negative', value: data?.negative ?? 0, color: CHART_COLORS.negative },
  ];

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <ChartCard title="Sentiment distribution" subtitle="Share of processed articles">
      {total === 0 ? (
        <EmptyState title="No sentiment data yet" message="Process some articles to see this chart." />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              animationDuration={600}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipContentStyle} formatter={(v) => `${v}%`} />
            <Legend
              iconType="circle"
              formatter={(value) => <span className="text-xs">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

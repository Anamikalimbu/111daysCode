import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS, tooltipContentStyle } from './chartTheme';
import ChartCard from './ChartCard';
import EmptyState from '../Common/EmptyState';

export default function EntityDoughnutChart({ data }) {
  const chartData = [
    { name: 'People', value: data?.people?.length ?? 0 },
    { name: 'Organisations', value: data?.organisations?.length ?? 0 },
    { name: 'Countries', value: data?.countries?.length ?? 0 },
    { name: 'Cities', value: data?.cities?.length ?? 0 },
  ].filter((d) => d.value > 0);

  return (
    <ChartCard title="Entity distribution" subtitle="Distinct named entities mentioned">
      {chartData.length === 0 ? (
        <EmptyState title="No entities yet" message="Process some articles to see this chart." />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              animationDuration={600}
            >
              {chartData.map((entry, i) => (
                <Cell
                  key={entry.name}
                  fill={CHART_COLORS.series[i % CHART_COLORS.series.length]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipContentStyle} />
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

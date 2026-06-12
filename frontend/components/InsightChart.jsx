'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

/**
 * Custom tooltip for the chart.
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 text-sm border border-white/10">
        <p className="font-semibold text-white mb-1">{label}</p>
        <p className="text-[#00D4AA]">
          PKR {Number(payload[0].value).toLocaleString('en-PK')}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * InsightChart — Recharts bar chart showing user income vs tax threshold.
 * @param {{ simulationResult: object | null }} props
 */
export default function InsightChart({ simulationResult }) {
  // Default demo data when no simulation has been run
  const defaultData = [
    { name: 'Tax-Free Limit', value: 600000, color: '#00D4AA' },
    { name: 'Your Income', value: 0, color: '#6C63FF' },
    { name: '2.5% Bracket Limit', value: 1200000, color: '#FFB347' },
  ];

  const chartData = simulationResult
    ? [
        { name: 'Tax-Free Limit', value: 600000, color: '#00D4AA' },
        { name: 'Your Income', value: simulationResult.annualIncome, color: simulationResult.status === 'No Tax Applicable' ? '#00D4AA' : '#6C63FF' },
        { name: '2.5% Bracket', value: 1200000, color: '#FFB347' },
        { name: '12.5% Bracket', value: 2400000, color: '#FF9F43' },
      ]
    : defaultData;

  const formatYAxis = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value;
  };

  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFB347] to-[#6C63FF] flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-white text-sm">User Financial Insight</h2>
            <p className="text-[#8888aa] text-xs">Income vs FBR Tax Thresholds (Annual PKR)</p>
          </div>
        </div>

        {simulationResult && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/8">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: simulationResult.status === 'No Tax Applicable' ? '#00D4AA' : '#6C63FF' }}
            />
            <span className="text-xs text-[#F0F0F5] font-medium">{simulationResult.status}</span>
          </div>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: '#8888aa', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fill: '#8888aa', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          {simulationResult && (
            <ReferenceLine
              y={simulationResult.annualIncome}
              stroke={simulationResult.status === 'No Tax Applicable' ? '#00D4AA' : '#6C63FF'}
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
          )}
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={80}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/6">
        <div className="flex items-center gap-2 text-xs text-[#8888aa]">
          <div className="w-3 h-3 rounded-sm bg-[#00D4AA]" />
          Tax-free zone
        </div>
        <div className="flex items-center gap-2 text-xs text-[#8888aa]">
          <div className="w-3 h-3 rounded-sm bg-[#6C63FF]" />
          Your income
        </div>
        <div className="flex items-center gap-2 text-xs text-[#8888aa]">
          <div className="w-3 h-3 rounded-sm bg-[#FFB347]" />
          Higher bracket
        </div>
        {!simulationResult && (
          <span className="ml-auto text-xs text-[#8888aa] italic">
            Run a simulation to see your income on this chart
          </span>
        )}
      </div>
    </div>
  );
}

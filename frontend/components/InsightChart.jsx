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
import { useTheme } from './ThemeProvider';

/* ─── Custom Tooltip ─────────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-4 py-3 rounded-2xl text-sm shadow-xl"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-hover)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <p className="font-semibold text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p
          className="font-black text-base"
          style={{ color: payload[0].payload.color }}
        >
          PKR {Number(payload[0].value).toLocaleString('en-PK')}
        </p>
      </div>
    );
  }
  return null;
};

/* ─── Legend Item ────────────────────────────────────────────────────────── */
function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
      <div
        className="w-3 h-3 rounded-sm flex-shrink-0"
        style={{
          background: color,
          boxShadow: `0 0 8px ${color}60`,
        }}
      />
      {label}
    </div>
  );
}

/* ─── InsightChart ───────────────────────────────────────────────────────── */
export default function InsightChart({ simulationResult }) {
  const { theme } = useTheme();

  const axisColor    = theme === 'dark' ? '#7C8DB5' : '#64748B';
  const gridColor    = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';

  const defaultData = [
    { name: 'Tax-Free Limit', value: 600000,  color: '#10E89A' },
    { name: 'Your Income',    value: 0,        color: '#4F8EF7' },
    { name: '1% Bracket',    value: 1200000,  color: '#F59E0B' },
  ];

  const chartData = simulationResult
    ? [
        { name: 'Tax-Free Limit', value: 600000,                       color: '#10E89A' },
        { name: 'Your Income',    value: simulationResult.annualIncome, color: simulationResult.status === 'No Tax Applicable' ? '#10E89A' : '#4F8EF7' },
        { name: '1% Bracket',    value: 1200000,                       color: '#F59E0B' },
        { name: '11% Bracket',   value: 2200000,                       color: '#F97316' },
      ]
    : defaultData;

  const formatYAxis = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000)    return `${(value / 1000).toFixed(0)}K`;
    return value;
  };

  const legendItems = [
    { color: '#10E89A', label: 'Tax-free zone (≤ PKR 600K)' },
    { color: '#4F8EF7', label: 'Your annual income' },
    { color: '#F59E0B', label: '1% tax bracket threshold' },
    ...(simulationResult ? [{ color: '#F97316', label: '11% bracket threshold' }] : []),
  ];

  return (
    <div
      className="card p-5 sm:p-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(79,142,247,0.03) 0%, var(--card-bg) 60%, rgba(16,232,154,0.02) 100%)',
        borderColor: 'var(--border-hover)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-60 h-60 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(79,142,247,0.05), transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="icon-badge"
            style={{
              background: 'linear-gradient(135deg, #F59E0B, #4F8EF7)',
              boxShadow: '0 4px 12px rgba(245,158,11,0.25)',
            }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-sm leading-none" style={{ color: 'var(--text)' }}>Financial Insight Chart</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Income vs FBR Tax Thresholds (Annual PKR)
            </p>
          </div>
        </div>

        {/* Status pill */}
        {simulationResult ? (
          <div
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold flex-shrink-0"
            style={{
              background: simulationResult.status === 'No Tax Applicable' ? 'var(--accent-dim)' : 'var(--primary-dim)',
              border: simulationResult.status === 'No Tax Applicable' ? '1px solid var(--accent-border)' : '1px solid var(--primary-border)',
              color: simulationResult.status === 'No Tax Applicable' ? 'var(--accent)' : 'var(--primary)',
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: simulationResult.status === 'No Tax Applicable' ? 'var(--accent)' : 'var(--primary)',
                boxShadow: simulationResult.status === 'No Tax Applicable' ? '0 0 6px var(--accent)' : '0 0 6px var(--primary)',
              }}
            />
            {simulationResult.status}
          </div>
        ) : (
          <div
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-faint)',
            }}
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Run a simulation to see your data
          </div>
        )}
      </div>

      {/* ── Chart ── */}
      <div className="relative z-10">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 16, left: 8, bottom: 0 }}
            barCategoryGap="28%"
          >
            <defs>
              {chartData.map((entry, i) => (
                <linearGradient key={i} id={`bar-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.55} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: axisColor, fontSize: 10, fontWeight: 500 }}
              axisLine={{ stroke: gridColor }}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fill: axisColor, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(79,142,247,0.04)', radius: 8 }}
            />

            {simulationResult && (
              <ReferenceLine
                y={simulationResult.annualIncome}
                stroke={simulationResult.status === 'No Tax Applicable' ? '#10E89A' : '#4F8EF7'}
                strokeDasharray="6 4"
                strokeWidth={1.5}
                strokeOpacity={0.7}
                label={{
                  value: `Your Income: ${formatYAxis(simulationResult.annualIncome)}`,
                  fill: axisColor,
                  fontSize: 10,
                  position: 'insideTopRight',
                  fontWeight: 500,
                }}
              />
            )}

            <Bar dataKey="value" radius={[10, 10, 0, 0]} maxBarSize={88}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#bar-grad-${index})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Legend ── */}
      <div
        className="flex flex-wrap items-center gap-4 sm:gap-6 mt-5 pt-5 relative z-10"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        {legendItems.map((item) => (
          <LegendItem key={item.label} {...item} />
        ))}
      </div>

      {/* ── Empty state hint ── */}
      {!simulationResult && (
        <div
          className="mt-4 p-3.5 rounded-xl flex items-center gap-2.5 relative z-10"
          style={{
            background: 'var(--primary-dim)',
            border: '1px solid var(--primary-border)',
          }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)', flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p className="text-xs" style={{ color: 'var(--primary)' }}>
            Run a simulation in the Financial Simulator above to see your income plotted against FBR tax thresholds.
          </p>
        </div>
      )}
    </div>
  );
}

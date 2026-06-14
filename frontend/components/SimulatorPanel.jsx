'use client';

import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const PROFESSIONS = [
  { value: 'salaried',   label: '💼 Salaried Employee' },
  { value: 'freelancer', label: '💻 Freelancer / IT Export' },
  { value: 'business',   label: '🏪 Business Owner' },
];

const SALARIED_BRACKETS = [
  { min: 0,       max: 600000,   rate: '0%',  label: 'Exempt',  color: 'var(--accent)' },
  { min: 600001,  max: 1200000,  rate: '1%',  label: '1%',      color: 'var(--primary)' },
  { min: 1200001, max: 2200000,  rate: '11%', label: '11%',     color: '#F59E0B' },
  { min: 2200001, max: 3200000,  rate: '23%', label: '23%',     color: '#F97316' },
  { min: 3200001, max: 4100000,  rate: '30%', label: '30%',     color: '#F43F5E' },
  { min: 4100001, max: Infinity, rate: '35%', label: '35%',     color: '#DC2626' },
];

const NONSALARIED_BRACKETS = [
  { min: 0,       max: 600000,   rate: '0%',  label: 'Exempt',  color: 'var(--accent)' },
  { min: 600001,  max: 1200000,  rate: '15%', label: '15%',     color: 'var(--primary)' },
  { min: 1200001, max: 1600000,  rate: '20%', label: '20%',     color: '#F59E0B' },
  { min: 1600001, max: 3200000,  rate: '30%', label: '30%',     color: '#F97316' },
  { min: 3200001, max: 5600000,  rate: '40%', label: '40%',     color: '#F43F5E' },
  { min: 5600001, max: Infinity, rate: '45%', label: '45%',     color: '#DC2626' },
];

/* ─── Metric Card ────────────────────────────────────────────────────────── */
function MetricCard({ label, value, sub, color }) {
  return (
    <div
      className="rounded-2xl p-4 relative overflow-hidden transition-transform duration-200 hover:scale-[1.02] cursor-default"
      style={{
        background: `linear-gradient(135deg, ${color}10, transparent)`,
        border: `1px solid ${color}25`,
      }}
    >
      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-10 h-10 rounded-bl-2xl"
        style={{ background: `${color}08` }}
      />
      <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="font-black text-base leading-none" style={{ color }}>{value}</p>
      {sub && <p className="text-xs mt-1.5 font-medium" style={{ color: 'var(--text-faint)' }}>{sub}</p>}
    </div>
  );
}

/* ─── Checklist Item ─────────────────────────────────────────────────────── */
function CheckItem({ text }) {
  return (
    <div className="flex items-start gap-2.5">
      <div
        className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}
      >
        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <span className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{text}</span>
    </div>
  );
}

/* ─── Bracket Bar ────────────────────────────────────────────────────────── */
function BracketBar({ bracket, index, total }) {
  const width = Math.max(20, 100 - index * (100 / total));
  return (
    <div className="flex items-center gap-3 group">
      <div className="flex-1 flex items-center gap-2">
        {/* Bar */}
        <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--surface-hover)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${width}%`, background: bracket.color }}
          />
        </div>
        {/* Range */}
        <span className="text-[10px] w-44 text-right" style={{ color: 'var(--text-faint)' }}>
          {bracket.max === Infinity
            ? `Above PKR ${(bracket.min - 1).toLocaleString()}`
            : `PKR ${bracket.min.toLocaleString()} – ${bracket.max.toLocaleString()}`}
        </span>
      </div>
      {/* Rate badge */}
      <span
        className="text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 w-12 text-center"
        style={{
          color: bracket.color,
          background: `${bracket.color}14`,
          border: `1px solid ${bracket.color}25`,
        }}
      >
        {bracket.rate}
      </span>
    </div>
  );
}

/* ─── SimulatorPanel ─────────────────────────────────────────────────────── */
export default function SimulatorPanel({ onResult }) {
  const [form, setForm] = useState({ income: '', profession: 'salaried' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    const incomeNum = parseFloat(form.income);
    if (!form.income || isNaN(incomeNum) || incomeNum <= 0) {
      return setError('Please enter a valid positive monthly income.');
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/api/simulate', {
        income: incomeNum,
        profession: form.profession,
      });
      setResult(data);
      if (onResult) onResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Simulation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPKR = (num) => `PKR ${Number(num).toLocaleString('en-PK')}`;
  const brackets = form.profession === 'salaried' ? SALARIED_BRACKETS : NONSALARIED_BRACKETS;
  const isExempt = result?.status === 'No Tax Applicable';

  const extractActionLines = (text) => {
    if (!text) return [];
    return text
      .split('\n')
      .filter((l) => l.match(/^[-*•]\s+/) || l.match(/^\d+\.\s+/))
      .slice(0, 4)
      .map((l) => l.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, ''));
  };

  return (
    <div className="card flex flex-col chat-panel-height" style={{ overflow: 'hidden' }}>

      {/* ── Header ── */}
      <div
        className="flex items-center gap-3 px-5 sm:px-6 py-4 flex-shrink-0"
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(135deg, rgba(16,232,154,0.04), transparent)',
        }}
      >
        <div className="icon-badge-primary" style={{ background: 'linear-gradient(135deg, var(--accent), var(--primary))' }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-sm leading-none" style={{ color: 'var(--text)' }}>Financial Simulator</h2>
          <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>Pakistan FBR Tax Rules · FY2025-26 Budget</p>
        </div>
        <span className="tag tag-accent text-[10px] flex-shrink-0">⭐ FY2025-26</span>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 px-5 sm:px-6 py-5 space-y-5 overflow-y-auto">

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Error */}
          {error && (
            <div
              className="rounded-xl p-3.5 text-sm animate-fade-in flex items-start gap-2.5"
              style={{
                background: 'rgba(244,63,94,0.08)',
                border: '1px solid rgba(244,63,94,0.22)',
                color: '#FDA4AF',
              }}
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          {/* Income input */}
          <div>
            <label htmlFor="sim-income" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Monthly Income (PKR)
            </label>
            <input
              id="sim-income" name="income" type="number" min="1" step="1000"
              value={form.income} onChange={handleChange}
              placeholder="e.g. 150,000"
              className="input-field"
            />
          </div>

          {/* Profession select */}
          <div>
            <label htmlFor="sim-profession" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Profession Type
            </label>
            <select
              id="sim-profession" name="profession"
              value={form.profession} onChange={handleChange}
              className="input-field cursor-pointer"
            >
              {PROFESSIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>

          {/* Submit */}
          <button
            id="simulate-btn"
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3.5"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--primary))' }}
          >
            {loading ? (
              <>
                <span
                  className="w-4 h-4 rounded-full border-2 border-t-transparent"
                  style={{ borderColor: 'rgba(255,255,255,0.35)', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }}
                />
                Calculating your taxes...
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Run FY2025-26 Simulation
              </>
            )}
          </button>
        </form>

        {/* ── Result ── */}
        {result && (
          <div className="space-y-4 animate-fade-in-up">
            {/* Status Banner */}
            <div
              className="flex items-center justify-between p-4 rounded-2xl relative overflow-hidden"
              style={{
                background: isExempt
                  ? 'linear-gradient(135deg, var(--accent-dim), transparent)'
                  : 'linear-gradient(135deg, var(--primary-dim), transparent)',
                border: isExempt ? '1px solid var(--accent-border)' : '1px solid var(--primary-border)',
              }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Tax Status</p>
                <p className="font-black text-lg leading-none" style={{ color: isExempt ? 'var(--accent)' : 'var(--primary)' }}>
                  {result.status}
                </p>
                <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>{result.bracketLabel}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Effective Rate</p>
                <p
                  className="font-black text-4xl leading-none"
                  style={{
                    background: isExempt
                      ? 'linear-gradient(135deg, var(--accent), #10E89A)'
                      : 'linear-gradient(135deg, var(--primary), var(--accent))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {result.effectiveRate}%
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>{result.fiscalYear}</p>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
              <MetricCard label="Annual Tax" value={formatPKR(result.taxAmount)} sub={`${formatPKR(result.monthlyTax)}/mo`} color="#F43F5E" />
              <MetricCard label="Net Take-Home" value={formatPKR(result.netAnnual)} sub={`${formatPKR(result.netMonthly)}/mo`} color="var(--accent)" />
              <MetricCard label="Annual Income" value={formatPKR(result.annualIncome)} color="var(--text-secondary)" />
              <MetricCard label="Top Bracket" value={result.bracketRate} color="var(--primary)" />
            </div>

            {/* Freelancer note */}
            {result.note && (
              <div
                className="rounded-xl p-3.5 text-xs flex items-start gap-2"
                style={{
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.20)',
                  color: '#FCD34D',
                }}
              >
                <span className="flex-shrink-0">💡</span>
                {result.note}
              </div>
            )}

            {/* AI Insight */}
            <div
              className="rounded-2xl p-4"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-black flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
                >
                  AI
                </div>
                <span className="section-label">AI Insight</span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>

              {extractActionLines(result.explanation).length > 0 && (
                <div className="space-y-2.5 mb-3">
                  {extractActionLines(result.explanation).map((item, i) => (
                    <CheckItem key={i} text={item} />
                  ))}
                </div>
              )}

              <p
                className="text-xs leading-relaxed"
                style={{ color: 'var(--text-muted)', whiteSpace: 'pre-line' }}
              >
                {result.explanation}
              </p>
            </div>
          </div>
        )}

        {/* ── Bracket Reference ── */}
        {!result && !loading && (
          <div
            className="rounded-2xl p-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="section-label">FBR Tax Brackets · FY2025-26</p>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                {form.profession === 'salaried' ? '💼 Salaried' : form.profession === 'freelancer' ? '💻 IT Export' : '🏪 Business'}
              </span>
            </div>
            <div className="space-y-2.5">
              {brackets.map((b, i) => (
                <BracketBar key={i} bracket={b} index={i} total={brackets.length} />
              ))}
            </div>
            <p className="text-[10px] mt-3 text-center" style={{ color: 'var(--text-faint)' }}>
              Based on Federal Budget FY2025-26 · Pakistan FBR
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const PROFESSIONS = [
  { value: 'salaried', label: '💼 Salaried Employee' },
  { value: 'freelancer', label: '💻 Freelancer' },
  { value: 'business', label: '🏪 Business Owner' },
];

const TAX_BRACKETS = [
  { min: 0, max: 600000, rate: '0%', label: 'No Tax', color: '#00D4AA' },
  { min: 600001, max: 1200000, rate: '2.5%', label: '2.5%', color: '#6C63FF' },
  { min: 1200001, max: 2400000, rate: '12.5%', label: '12.5%', color: '#FFB347' },
  { min: 2400001, max: 3600000, rate: '22.5%', label: '22.5%', color: '#FF7B7B' },
  { min: 3600001, max: Infinity, rate: '35%', label: '35%', color: '#FF4B4B' },
];

/**
 * SimulatorPanel — Financial scenario simulator with rule-based tax logic + AI explanation.
 * Accepts an optional onResult callback to pass chart data to the parent.
 * @param {{ onResult: function }} props
 */
export default function SimulatorPanel({ onResult }) {
  const [form, setForm] = useState({ income: '', profession: 'salaried' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
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

  const getTaxBracket = (annualIncome) => {
    return TAX_BRACKETS.find((b) => annualIncome >= b.min && annualIncome <= b.max) || TAX_BRACKETS[0];
  };

  const formatPKR = (num) => `PKR ${Number(num).toLocaleString('en-PK')}`;

  return (
    <div className="glass-card flex flex-col h-[600px] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D4AA] to-[#6C63FF] flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="font-semibold text-white text-sm">Financial Simulator</h2>
          <p className="text-[#8888aa] text-xs">Pakistan FBR Tax Rules · FY2024-25</p>
        </div>
        <div className="ml-auto">
          <span className="text-xs px-2 py-1 rounded-lg bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA] font-medium">⭐ Key Feature</span>
        </div>
      </div>

      <div className="flex-1 px-5 py-4 space-y-5">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm animate-[fadeIn_0.3s_ease-out]">
              ⚠️ {error}
            </div>
          )}

          <div>
            <label htmlFor="sim-income" className="block text-sm font-medium text-[#8888aa] mb-2">
              Monthly Income (PKR)
            </label>
            <input
              id="sim-income"
              name="income"
              type="number"
              min="1"
              step="1000"
              value={form.income}
              onChange={handleChange}
              placeholder="e.g. 150000"
              className="input-field"
              aria-label="Monthly income in Pakistani Rupees"
            />
          </div>

          <div>
            <label htmlFor="sim-profession" className="block text-sm font-medium text-[#8888aa] mb-2">
              Profession Type
            </label>
            <select
              id="sim-profession"
              name="profession"
              value={form.profession}
              onChange={handleChange}
              className="input-field cursor-pointer appearance-none"
              aria-label="Profession type"
            >
              {PROFESSIONS.map((p) => (
                <option key={p.value} value={p.value} style={{ background: '#1a1a2e' }}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <button
            id="simulate-btn"
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Run Simulation
              </>
            )}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="space-y-3 animate-[slideUp_0.4s_ease-out]">
            {/* Status Badge */}
            <div className="flex items-center justify-between p-4 rounded-xl border"
              style={{
                background: result.status === 'No Tax Applicable' ? 'rgba(0,212,170,0.08)' : 'rgba(108,99,255,0.08)',
                borderColor: result.status === 'No Tax Applicable' ? 'rgba(0,212,170,0.25)' : 'rgba(108,99,255,0.25)',
              }}
            >
              <div>
                <p className="text-xs text-[#8888aa] font-medium mb-1">Tax Status</p>
                <p className="font-bold text-base" style={{ color: result.status === 'No Tax Applicable' ? '#00D4AA' : '#6C63FF' }}>
                  {result.status}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#8888aa] font-medium mb-1">Tax Rate</p>
                <p className="font-bold text-base text-white">{result.taxRate}</p>
              </div>
            </div>

            {/* Income Breakdown */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/4 rounded-xl p-3 border border-white/6">
                <p className="text-xs text-[#8888aa] mb-1">Annual Income</p>
                <p className="font-semibold text-white text-sm">{formatPKR(result.annualIncome)}</p>
              </div>
              <div className="bg-white/4 rounded-xl p-3 border border-white/6">
                <p className="text-xs text-[#8888aa] mb-1">Exempt Threshold</p>
                <p className="font-semibold text-white text-sm">{formatPKR(result.threshold)}</p>
              </div>
            </div>

            {/* AI Explanation */}
            <div className="bg-white/3 rounded-xl p-4 border border-white/8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-[#6C63FF] uppercase tracking-wider">AI Insight</span>
                <div className="flex-1 h-px bg-[#6C63FF]/20" />
              </div>
              <p className="text-sm text-[#F0F0F5] leading-relaxed opacity-90">{result.explanation}</p>
            </div>
          </div>
        )}

        {/* Tax Bracket Reference */}
        {!result && !loading && (
          <div className="bg-white/3 rounded-xl p-4 border border-white/6">
            <p className="text-xs font-semibold text-[#8888aa] uppercase tracking-wider mb-3">FBR Tax Brackets FY2024-25</p>
            <div className="space-y-2">
              {TAX_BRACKETS.map((b, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-[#8888aa]">
                    {b.max === Infinity ? `Above PKR ${(b.min - 1).toLocaleString()}` : `PKR ${b.min.toLocaleString()} – ${b.max.toLocaleString()}`}
                  </span>
                  <span className="font-semibold px-2 py-0.5 rounded-md" style={{ color: b.color, background: `${b.color}18` }}>
                    {b.rate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

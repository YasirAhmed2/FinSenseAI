'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import ChatPanel from '../../components/ChatPanel';
import SimulatorPanel from '../../components/SimulatorPanel';
import InsightChart from '../../components/InsightChart';

/* ─── Quick Stat Card ────────────────────────────────────────────────────── */
function QuickStat({ label, value, sub, color, bg, border, icon }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl flex-shrink-0 transition-all duration-200 hover:scale-105 cursor-default"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}20`, color }}
      >
        {icon}
      </div>
      <div>
        <p className="font-black text-sm leading-none" style={{ color }}>{value}</p>
        <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
        {sub && <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-faint)' }}>{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Section Header ─────────────────────────────────────────────────────── */
function PanelHeader({ icon, title, sub, badge, badgeColor }) {
  return (
    <div className="flex items-center gap-3 px-5 sm:px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="icon-badge-primary flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <h2 className="font-bold text-sm leading-none" style={{ color: 'var(--text)' }}>{title}</h2>
        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{sub}</p>
      </div>
      {badge && (
        <span className="tag tag-accent text-[10px] flex-shrink-0">{badge}</span>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('finsense_token');
    const userData = localStorage.getItem('finsense_user');

    if (!token) {
      router.replace('/login');
      return;
    }

    if (userData) {
      try { setUser(JSON.parse(userData)); }
      catch { setUser(null); }
    }

    setMounted(true);
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="relative w-12 h-12">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: '2px solid var(--surface-hover)',
              }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: '2px solid transparent',
                borderTopColor: 'var(--primary)',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <div
              className="absolute inset-2 rounded-full"
              style={{
                border: '2px solid transparent',
                borderTopColor: 'var(--accent)',
                animation: 'spin 1.2s linear infinite reverse',
              }}
            />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  const username = user?.email ? user.email.split('@')[0] : '';
  const initials = username ? username[0].toUpperCase() : '?';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar userEmail={user?.email} />

      <main className="container-page py-6 sm:py-8">

        {/* ── Welcome Banner ───────────────────────────────────────────────── */}
        <div className="mb-6 animate-fade-in">
          <div
            className="card p-5 sm:p-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(79,142,247,0.06) 0%, var(--card-bg) 50%, rgba(16,232,154,0.04) 100%)',
              borderColor: 'var(--border-hover)',
            }}
          >
            {/* Ambient glows */}
            <div
              className="absolute -top-20 -right-20 w-56 h-56 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(79,142,247,0.10), transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
            <div
              className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(16,232,154,0.08), transparent 70%)',
                filter: 'blur(20px)',
              }}
            />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              {/* User info */}
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl font-black flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    boxShadow: 'var(--shadow-primary)',
                  }}
                >
                  {initials}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h1 className="text-xl sm:text-2xl font-black" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
                      {username ? `Hey, ${username}! 👋` : 'Welcome back! 👋'}
                    </h1>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Your AI-powered financial assistant is ready.
                  </p>
                  {/* Online dot */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="status-dot" style={{ width: '6px', height: '6px' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>AI Online · FY2025-26 rules loaded</span>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-2 flex-shrink-0">
                <QuickStat
                  label="Tax-Free Limit"
                  value="PKR 600K"
                  sub="Annual"
                  color="var(--accent)"
                  bg="var(--accent-dim)"
                  border="var(--accent-border)"
                  icon={
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
                <QuickStat
                  label="Current Budget"
                  value="FY 2025-26"
                  sub="Pakistan FBR"
                  color="var(--primary)"
                  bg="var(--primary-dim)"
                  border="var(--primary-border)"
                  icon={
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Section label ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-4 animate-fade-in delay-100">
          <p className="section-label">Your Workspace</p>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, var(--border), transparent)' }} />
        </div>

        {/* ── Panels Grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5 animate-fade-in-up delay-100">
          <ChatPanel />
          <SimulatorPanel onResult={setSimulationResult} />
        </div>

        {/* ── Insights label ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-4 animate-fade-in delay-200">
          <p className="section-label">Financial Insights</p>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, var(--border), transparent)' }} />
        </div>

        {/* ── Chart ──────────────────────────────────────────────────────── */}
        <div className="animate-fade-in-up delay-200">
          <InsightChart simulationResult={simulationResult} />
        </div>

        {/* ── Footer disclaimer ─────────────────────────────────────────── */}
        <div
          className="mt-10 text-center py-6"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            FinSense AI provides general financial information based on Pakistan FBR rules.{' '}
            <span style={{ color: 'var(--primary)' }}>Not a substitute for professional tax advice.</span>{' '}
            Always consult a certified tax advisor for personal filings.
          </p>
        </div>
      </main>
    </div>
  );
}

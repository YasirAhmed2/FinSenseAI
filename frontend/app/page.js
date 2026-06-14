'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '../components/ThemeProvider';

/* ─── Static Data ────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'AI Financial Advisor',
    desc: 'Ask anything about Pakistani taxes, FBR regulations, NTN registration, or savings strategies — instant, personalized answers powered by Groq.',
    color: 'var(--primary)',
    bg: 'var(--primary-dim)',
    border: 'var(--primary-border)',
    label: 'AI Powered',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Tax Scenario Simulator',
    desc: 'Simulate your exact FY2025-26 tax liability in seconds. See annual tax, effective rate, and net take-home — before filing.',
    color: 'var(--accent)',
    bg: 'var(--accent-dim)',
    border: 'var(--accent-border)',
    label: 'Instant',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Visual Insights',
    desc: 'Interactive charts mapping your income against FBR tax brackets. Understand exactly where you stand and how to legally optimize.',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.10)',
    border: 'rgba(245,158,11,0.22)',
    label: 'Visual',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'FBR Compliant 2025-26',
    desc: 'Built for Pakistan — covers salaried persons, freelancers, and business owners with the latest Budget FY2025-26 tax rules.',
    color: '#A855F7',
    bg: 'rgba(168,85,247,0.10)',
    border: 'rgba(168,85,247,0.22)',
    label: 'Compliant',
  },
];

const STEPS = [
  {
    num: '01',
    icon: '👤',
    title: 'Create Your Profile',
    desc: 'Enter your profession, monthly income, and FBR filing status. Takes under 30 seconds.',
    color: 'var(--primary)',
  },
  {
    num: '02',
    icon: '💬',
    title: 'Ask or Simulate',
    desc: 'Chat with the AI advisor or run a tax simulation to see your exact FY2025-26 liability.',
    color: 'var(--accent)',
  },
  {
    num: '03',
    icon: '📊',
    title: 'Get Actionable Insights',
    desc: 'Receive a personalized financial report with recommended next steps — structured and clear.',
    color: '#A855F7',
  },
];

const STATS = [
  { value: 'PKR 600K', label: 'Tax-Free Limit', color: 'var(--accent)' },
  { value: 'FY25-26', label: 'Latest Budget Rules', color: 'var(--primary)' },
  { value: '3 Types', label: 'Salaried · Freelancer · Business', color: '#F59E0B' },
  { value: 'Groq AI', label: 'Ultrafast LLM', color: '#A855F7' },
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function FeatureCard({ icon, title, desc, color, bg, border, label, delay }) {
  return (
    <div
      className="card-hover p-6 group animate-fade-in-up cursor-default"
      style={{ animationDelay: delay }}
    >
      {/* Top badge */}
      <div className="flex items-start justify-between mb-5">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{ background: bg, color, border: `1px solid ${border}` }}
        >
          {icon}
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: bg, color, border: `1px solid ${border}` }}
        >
          {label}
        </span>
      </div>

      <h3 className="font-bold text-base mb-2.5" style={{ color: 'var(--text)' }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>

      {/* Bottom accent line */}
      <div
        className="mt-5 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
    </div>
  );
}

function StepCard({ num, icon, title, desc, color, isLast, delay }) {
  return (
    <div className="flex gap-5 items-start animate-fade-in-up" style={{ animationDelay: delay }}>
      {/* Timeline */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm text-white relative z-10"
          style={{
            background: `linear-gradient(135deg, ${color}, rgba(79,142,247,0.5))`,
            boxShadow: `0 4px 16px ${color}40`,
          }}
        >
          {icon}
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 mt-2 min-h-[40px]"
            style={{ background: `linear-gradient(180deg, ${color}50, transparent)` }}
          />
        )}
      </div>

      {/* Content */}
      <div className="pb-8 pt-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold" style={{ color }}>{num}</span>
          <div className="w-4 h-px" style={{ background: color }} />
        </div>
        <h3 className="font-bold text-base mb-1.5" style={{ color: 'var(--text)' }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
      </div>
    </div>
  );
}

function StatBadge({ value, label, color, delay }) {
  return (
    <div
      className="animate-fade-in-up flex flex-col items-center px-5 py-3.5 rounded-2xl cursor-default"
      style={{
        background: `linear-gradient(135deg, ${color}12, transparent)`,
        border: `1px solid ${color}30`,
        animationDelay: delay,
        backdropFilter: 'blur(10px)',
      }}
    >
      <span className="text-xl font-black leading-none" style={{ color }}>{value}</span>
      <span className="text-xs mt-1.5 text-center leading-tight" style={{ color: 'var(--text-muted)' }}>{label}</span>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div
      className="card animate-float relative overflow-hidden"
      style={{ maxWidth: '500px', margin: '0 auto' }}
    >
      {/* Glow overlay */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(79,142,247,0.15), transparent 70%)', filter: 'blur(20px)' }}
      />

      <div className="p-5">
        {/* Mock nav bar */}
        <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
            >
              ₨
            </div>
            <div>
              <span className="font-bold text-xs" style={{ color: 'var(--text)' }}>FinSense AI</span>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="status-dot" style={{ width: '5px', height: '5px' }} />
                <span className="text-[9px]" style={{ color: 'var(--accent)' }}>Live</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F43F5E' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F59E0B' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#10E89A' }} />
          </div>
        </div>

        {/* Mock stats */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {[
            { label: 'Annual Tax', val: 'PKR 84K', col: '#F43F5E' },
            { label: 'Net Salary', val: 'PKR 1.7M', col: 'var(--accent)' },
            { label: 'Effective', val: '4.7%', col: 'var(--primary)' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-3 text-center"
              style={{
                background: `linear-gradient(135deg, ${s.col}12, var(--surface))`,
                border: `1px solid ${s.col}25`,
              }}
            >
              <p className="text-sm font-black leading-none" style={{ color: s.col }}>{s.val}</p>
              <p className="text-[9px] mt-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Mock AI message */}
        <div
          className="rounded-xl p-3.5 mb-3"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex gap-2.5 mb-3">
            <div
              className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center text-white text-[9px] font-bold"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
            >
              AI
            </div>
            <div className="space-y-2 flex-1">
              <div className="h-2 rounded-full" style={{ background: 'var(--border)', width: '88%' }} />
              <div className="h-2 rounded-full" style={{ background: 'var(--border)', width: '65%' }} />
              <div className="h-2 rounded-full" style={{ background: 'var(--border)', width: '76%' }} />
            </div>
          </div>
          <div className="flex justify-end">
            <div
              className="h-6 w-28 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                opacity: 0.75,
              }}
            />
          </div>
        </div>

        {/* Mock bar chart */}
        <div className="flex items-end gap-1.5 h-14 px-1">
          {[30, 55, 40, 95, 50, 75, 45, 85].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-lg transition-all duration-300"
              style={{
                height: `${h}%`,
                background: i === 3 || i === 7
                  ? 'linear-gradient(to top, var(--primary), var(--accent))'
                  : 'var(--surface-hover)',
                opacity: i === 3 || i === 7 ? 1 : 0.55,
              }}
            />
          ))}
        </div>
        <p className="text-[10px] text-center mt-2" style={{ color: 'var(--text-faint)' }}>
          Income vs Tax Thresholds · FY2025-26
        </p>
      </div>
    </div>
  );
}

/* ─── Particle Background ─────────────────────────────────────────────────── */
function ParticleField() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    opacity: 0.15 + Math.random() * 0.35,
    delay: Math.random() * 6,
    duration: 4 + Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.id % 2 === 0 ? 'var(--primary)' : 'var(--accent)',
            opacity: p.opacity,
            animation: `floatY ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Theme Toggle Button ─────────────────────────────────────────────────── */
function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className="btn-ghost w-9 h-9 p-0 rounded-xl justify-center"
      style={{ border: '1px solid var(--border)' }}
    >
      {theme === 'dark' ? (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

/* ─── Landing Page ───────────────────────────────────────────────────────── */
export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [isAuthed, setIsAuthed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('finsense_token');
    if (token) setIsAuthed(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav
        className="nav-bg sticky top-0 z-50 animate-fade-in"
        style={{ boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.25)' : undefined }}
      >
        <div className="container-page h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white"
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                boxShadow: '0 4px 12px rgba(79,142,247,0.35)',
              }}
            >
              ₨
            </div>
            <span
              className="text-base font-bold"
              style={{
                background: 'linear-gradient(135deg, var(--grad-start), var(--grad-end))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              FinSense AI
            </span>
          </Link>

          {/* Nav actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            {isAuthed ? (
              <Link href="/dashboard" className="btn-primary text-sm py-2 px-4">
                Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-ghost text-sm hidden sm:flex">
                  Sign In
                </Link>
                <Link href="/signup" className="btn-primary text-sm py-2 px-4">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <ParticleField />

        {/* Hero glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% -5%, rgba(79,142,247,0.12), transparent),
              radial-gradient(ellipse 60% 40% at 80% 60%, rgba(16,232,154,0.06), transparent)
            `,
          }}
        />

        <div className="container-page relative z-10 pt-24 pb-24 text-center">

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 mb-7 animate-fade-in">
            <span className="tag">
              <span className="status-dot" style={{ width: '5px', height: '5px' }} />
              Pakistan FBR · Budget FY2025-26
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-fluid-xl mb-6 animate-fade-in-up delay-100">
            Your AI-Powered
            <br />
            <span className="gradient-text">Financial Advisor</span>
            <br />
            <span style={{ color: 'var(--text-secondary)' }}>for Pakistan</span>
          </h1>

          {/* Sub */}
          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200"
            style={{ color: 'var(--text-muted)' }}
          >
            Instantly understand your tax obligations, simulate your FY2025-26 liability,
            and get personalized financial guidance — built for salaried, freelancers & businesses.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-fade-in-up delay-300">
            <Link
              href="/signup"
              className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto justify-center"
            >
              Get Started Free
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto justify-center"
            >
              Sign In
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in-up delay-400">
            {STATS.map((s, i) => (
              <StatBadge key={s.label} {...s} delay={`${0.4 + i * 0.06}s`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────────────────────── */}
      <section
        className="py-24 relative"
        style={{ background: 'var(--bg-secondary)' }}
      >
        {/* Top border gradient */}
        <div
          className="absolute top-0 inset-x-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--border-hover), transparent)' }}
        />

        <div className="container-page">
          <div className="text-center mb-14">
            <p className="section-label mb-4">What You Get</p>
            <h2 className="text-fluid-lg">
              Everything you need to master
              <br />
              <span className="gradient-text-static">Pakistani finances</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={`${i * 0.08}s`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Steps side */}
            <div>
              <p className="section-label mb-4">How It Works</p>
              <h2 className="text-fluid-md mb-10" style={{ color: 'var(--text)' }}>
                Go from confused to{' '}
                <span className="gradient-text-static">confident</span>{' '}
                in minutes
              </h2>
              <div>
                {STEPS.map((step, i) => (
                  <StepCard
                    key={step.num}
                    {...step}
                    isLast={i === STEPS.length - 1}
                    delay={`${i * 0.12}s`}
                  />
                ))}
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <DashboardPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container-page">
          <div className="max-w-3xl mx-auto">
            <div
              className="card p-10 sm:p-14 relative overflow-hidden text-center"
              style={{
                background: `linear-gradient(135deg, rgba(79,142,247,0.08) 0%, var(--card-bg) 50%, rgba(16,232,154,0.06) 100%)`,
                borderColor: 'var(--border-hover)',
              }}
            >
              {/* Glows */}
              <div
                className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(79,142,247,0.12), transparent 70%)', filter: 'blur(30px)' }}
              />
              <div
                className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(16,232,154,0.10), transparent 70%)', filter: 'blur(30px)' }}
              />

              <div className="relative z-10">
                {/* Logo */}
                <div
                  className="inline-flex w-16 h-16 rounded-3xl items-center justify-center text-white text-2xl font-black mb-6 mx-auto"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    boxShadow: 'var(--shadow-primary)',
                  }}
                >
                  ₨
                </div>

                <h2 className="text-fluid-md mb-4" style={{ color: 'var(--text)' }}>
                  Start using FinSense AI{' '}
                  <span className="gradient-text-static">today</span>
                </h2>
                <p
                  className="text-base mb-8 max-w-lg mx-auto leading-relaxed"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Join smart Pakistanis managing their taxes and finances with AI.
                  Free to get started — no credit card required.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/signup"
                    className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto justify-center"
                  >
                    Create Free Account
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/login"
                    className="btn-ghost text-base px-6 py-3.5 w-full sm:w-auto justify-center"
                    style={{ border: '1px solid var(--border-hover)' }}
                  >
                    Already have an account?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        className="py-10"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
            >
              ₨
            </div>
            <span
              className="font-bold"
              style={{
                background: 'linear-gradient(135deg, var(--grad-start), var(--grad-end))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              FinSense AI
            </span>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            General financial information only · Not a substitute for professional tax advice ·{' '}
            <span style={{ color: 'var(--primary)' }}>Always consult a certified tax advisor</span>
          </p>

          {/* Copyright */}
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>© 2025 FinSense AI</p>
        </div>
      </footer>
    </div>
  );
}

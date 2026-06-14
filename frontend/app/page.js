'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '../components/ThemeProvider';
import { motion, useScroll, useSpring } from 'framer-motion';

/* ─── Static Data ────────────────────────────────────────────────────────── */

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

const SALARIED_SLABS = [
  { min: 0, max: 600000, rate: '0%', label: 'Exempt' },
  { min: 600001, max: 1200000, rate: '1%', label: '1%' },
  { min: 1200001, max: 2200000, rate: '11%', label: '11%' },
  { min: 2200001, max: 3200000, rate: '23%', label: '23%' },
  { min: 3200001, max: 4100000, rate: '30%', label: '30%' },
  { min: 4100001, max: Infinity, rate: '35%', label: '35%' },
];

const NONSALARIED_SLABS = [
  { min: 0, max: 600000, rate: '0%', label: 'Exempt' },
  { min: 600001, max: 1200000, rate: '15%', label: '15%' },
  { min: 1200001, max: 1600000, rate: '20%', label: '20%' },
  { min: 1600001, max: 3200000, rate: '30%', label: '30%' },
  { min: 3200001, max: 5600000, rate: '40%', label: '40%' },
  { min: 5600001, max: Infinity, rate: '45%', label: '45%' },
];

const CHAT_PROMPTS = [
  {
    q: 'Do I need NTN for freelancing?',
    a: 'Yes, if you earn taxable income in Pakistan, obtaining a National Tax Number (NTN) is highly recommended. It enables you to register as an active filer and get a reduced 1% withholding tax rate on IT exports remitted through bank channels, rather than the default 30% filer/non-filer penalties.'
  },
  {
    q: 'How to legally save on FBR tax?',
    a: 'You can legally reduce tax by: 1. Remitting foreign export earnings directly through bank channels as IT export (tax capped at 1%). 2. Investing in voluntary pension schemes (VPS) or mutual funds to claim tax credits. 3. Adjusting legitimate business expenses.'
  },
  {
    q: 'What is the tax-exempt limit?',
    a: 'For both salaried individuals and freelancers in FY2025-26, the tax-free threshold is PKR 600,000 annually. This means if you earn less than PKR 50,000 per month, your tax liability is PKR 0.'
  }
];

/* ─── Client-side Tax Calculation FY2025-26 ───────────────────────────────── */

const calculateTaxFY26 = (monthlyIncome, profession) => {
  const annualIncome = monthlyIncome * 12;
  let taxAmount = 0;
  let bracketRate = '0%';
  let bracketLabel = 'Exempt';
  let color = 'var(--accent)';

  if (profession === 'salaried') {
    if (annualIncome <= 600000) {
      taxAmount = 0;
      bracketRate = '0%';
      bracketLabel = 'Exempt (Up to Rs. 600K)';
      color = 'var(--accent)';
    } else if (annualIncome <= 1200000) {
      taxAmount = (annualIncome - 600000) * 0.01;
      bracketRate = '1%';
      bracketLabel = 'Rs. 600K – 1.2M @ 1%';
      color = 'var(--primary)';
    } else if (annualIncome <= 2200000) {
      taxAmount = 6000 + (annualIncome - 1200000) * 0.11;
      bracketRate = '11%';
      bracketLabel = 'Rs. 1.2M – 2.2M @ 11%';
      color = '#F59E0B';
    } else if (annualIncome <= 3200000) {
      taxAmount = 116000 + (annualIncome - 2200000) * 0.23;
      bracketRate = '23%';
      bracketLabel = 'Rs. 2.2M – 3.2M @ 23%';
      color = '#F97316';
    } else if (annualIncome <= 4100000) {
      taxAmount = 346000 + (annualIncome - 3200000) * 0.30;
      bracketRate = '30%';
      bracketLabel = 'Rs. 3.2M – 4.1M @ 30%';
      color = '#F43F5E';
    } else {
      taxAmount = 616000 + (annualIncome - 4100000) * 0.35;
      bracketRate = '35%';
      bracketLabel = 'Above Rs. 4.1M @ 35%';
      color = '#DC2626';
    }
    if (annualIncome > 10000000) {
      taxAmount = taxAmount * 1.09;
    }
  } else {
    // freelancer or business
    if (annualIncome <= 600000) {
      taxAmount = 0;
      bracketRate = '0%';
      bracketLabel = 'Exempt (Up to Rs. 600K)';
      color = 'var(--accent)';
    } else if (annualIncome <= 1200000) {
      taxAmount = (annualIncome - 600000) * 0.15;
      bracketRate = '15%';
      bracketLabel = 'Rs. 600K – 1.2M @ 15%';
      color = 'var(--primary)';
    } else if (annualIncome <= 1600000) {
      taxAmount = 90000 + (annualIncome - 1200000) * 0.20;
      bracketRate = '20%';
      bracketLabel = 'Rs. 1.2M – 1.6M @ 20%';
      color = '#F59E0B';
    } else if (annualIncome <= 3200000) {
      taxAmount = 170000 + (annualIncome - 1600000) * 0.30;
      bracketRate = '30%';
      bracketLabel = 'Rs. 1.6M – 3.2M @ 30%';
      color = '#F97316';
    } else if (annualIncome <= 5600000) {
      taxAmount = 650000 + (annualIncome - 3200000) * 0.40;
      bracketRate = '40%';
      bracketLabel = 'Rs. 3.2M – 5.6M @ 40%';
      color = '#F43F5E';
    } else {
      taxAmount = 1610000 + (annualIncome - 5600000) * 0.45;
      bracketRate = '45%';
      bracketLabel = 'Above Rs. 5.6M @ 45%';
      color = '#DC2626';
    }
    if (annualIncome > 10000000) {
      taxAmount = taxAmount * 1.10;
    }
  }

  taxAmount = Math.round(taxAmount);
  const monthlyTax = Math.round(taxAmount / 12);
  const netMonthly = monthlyIncome - monthlyTax;
  const effectiveRate = annualIncome > 0 ? ((taxAmount / annualIncome) * 100).toFixed(1) : '0.0';

  return {
    annualIncome,
    taxAmount,
    monthlyTax,
    netMonthly,
    effectiveRate,
    bracketRate,
    bracketLabel,
    color,
  };
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function BentoCard({ children, className = '', style = {}, delay = '0s' }) {
  const cardRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`bento-glow-container card p-6 cursor-default transition-all duration-300 ${className}`}
      style={{ ...style, animationDelay: delay }}
    >
      <div className="bento-glow-overlay" />
      <div className="relative z-10 h-full flex flex-col justify-between space-y-4">
        {children}
      </div>
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
      className="animate-fade-in-up flex flex-col items-center px-5 py-3.5 rounded-2xl cursor-default flex-1 min-w-[140px]"
      style={{
        background: `linear-gradient(135deg, ${color}12, transparent)`,
        border: `1px solid ${color}30`,
        animationDelay: delay,
        backdropFilter: 'blur(10px)',
      }}
    >
      <span className="text-xl font-black leading-none" style={{ color }}>{value}</span>
      <span className="text-xs mt-1.5 text-center leading-tight font-medium" style={{ color: 'var(--text-muted)' }}>{label}</span>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div
      className="crystal-panel animate-float w-full"
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
              <p className="text-xs font-black leading-none" style={{ color: s.col }}>{s.val}</p>
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

/* ─── Particle Background (Hydration-Safe Client Only) ─────────────────────── */
function ParticleField() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Render static coordinates but animate them with random offsets on client to eliminate hydration errors
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: (i * 7.7) % 100,
    y: (i * 13.3) % 100,
    size: 2 + (i % 3),
    opacity: 0.15 + (i % 4) * 0.08,
    delay: i % 4,
    duration: 5 + (i % 5),
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

  // Bento state coordinates
  const [income, setIncome] = useState(150000);
  const [profession, setProfession] = useState('salaried');

  // Typewriter chatbot simulation coordinates
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const token = localStorage.getItem('finsense_token');
    if (token) setIsAuthed(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial typewriter simulation trigger
    let timer;
    let fullText = CHAT_PROMPTS[0].a;
    let idx = 0;
    setIsTyping(true);
    timer = setInterval(() => {
      if (idx < fullText.length) {
        setTypedText(fullText.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 12);

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearInterval(timer);
    };
  }, []);

  const triggerTypewriter = (idx) => {
    if (isTyping) return;
    setSelectedPrompt(idx);
    setTypedText('');
    setIsTyping(true);
    let fullText = CHAT_PROMPTS[idx].a;
    let curIdx = 0;
    const interval = setInterval(() => {
      if (curIdx < fullText.length) {
        setTypedText(fullText.slice(0, curIdx + 1));
        curIdx++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 12);
  };

  const calc = calculateTaxFY26(income, profession);
  const currentSlabs = profession === 'salaried' ? SALARIED_SLABS : NONSALARIED_SLABS;

  const sectionVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Scroll Progress Bar indicator */}
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav
        className="nav-bg sticky top-0 z-50 transition-all duration-300"
        style={{ boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.3)' : undefined }}
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

        {/* Hero glow effects */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% -5%, rgba(99,102,241,0.14), transparent),
              radial-gradient(ellipse 60% 40% at 85% 55%, rgba(45,212,191,0.08), transparent)
            `,
          }}
        />

        <div className="container-page relative z-10 pt-20 pb-20 text-center">
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
            className="text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200"
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
          <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto animate-fade-in-up delay-400">
            {STATS.map((s, i) => (
              <StatBadge key={s.label} {...s} delay={`${0.4 + i * 0.06}s`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Bento Grid Section ───────────────────────────────────── */}
      <motion.section
        className="py-24 relative"
        style={{ background: 'var(--bg-secondary)' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={sectionVariants}
      >
        {/* Top border gradient */}
        <div
          className="absolute top-0 inset-x-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--border-hover), transparent)' }}
        />

        <div className="container-page">
          <div className="text-center mb-16">
            <p className="section-label mb-4">Interactive Platform</p>
            <h2 className="text-fluid-lg">
              Everything you need to master
              <br />
              <span className="gradient-text-static">Pakistani finances</span>
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Bento Card 1: Interactive Tax Estimator (spans 2 cols on md/xl) */}
            <BentoCard className="md:col-span-2 xl:col-span-2 min-h-[420px]">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: calc.color, boxShadow: `0 0 10px ${calc.color}` }} />
                    <span className="text-xs uppercase tracking-wider font-bold text-text-muted">Live Tax Estimator</span>
                  </div>
                  <span className="tag text-[9px]">FY2025-26</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center my-4">
                  {/* Controls side */}
                  <div className="space-y-5">
                    {/* Profession Toggle */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-text-faint tracking-wider block">Profession Type</span>
                      <div className="flex gap-2 p-1 rounded-xl bg-surface border border-border">
                        <button
                          type="button"
                          onClick={() => setProfession('salaried')}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                            profession === 'salaried'
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-text-muted hover:text-text'
                          }`}
                        >
                          💼 Salaried
                        </button>
                        <button
                          type="button"
                          onClick={() => setProfession('freelancer')}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                            profession === 'freelancer'
                              ? 'bg-accent text-white shadow-sm'
                              : 'text-text-muted hover:text-text'
                          }`}
                        >
                          💻 IT / Business
                        </button>
                      </div>
                    </div>

                    {/* Monthly Income Slider & Inputs */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-text-faint tracking-wider block">Monthly Income (PKR)</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-text-faint">Rs.</span>
                          <input
                            type="number"
                            value={income}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (val >= 0) setIncome(val);
                            }}
                            className="w-28 text-right bg-transparent text-sm font-bold border-b border-border focus:border-accent outline-none text-text"
                          />
                        </div>
                      </div>
                      <input
                        type="range"
                        min="30000"
                        max="1000000"
                        step="5000"
                        value={income}
                        onChange={(e) => setIncome(Number(e.target.value))}
                        className="w-full accent-accent custom-slider h-1.5 rounded-lg appearance-none bg-surface"
                      />
                      <div className="flex items-center justify-between text-[9px] text-text-faint font-semibold">
                        <span>₨ 30,000</span>
                        <span>₨ 1,000,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Calculations side */}
                  <div className="space-y-3 p-4 rounded-2xl bg-surface/30 border border-border/40">
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-text-faint">Monthly Income</span>
                      <p className="text-xl font-black text-text">₨ {income.toLocaleString()}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-2.5 rounded-xl bg-surface/50 border border-border/40">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-text-faint">Monthly Tax</span>
                        <p className="text-sm font-black text-rose mt-0.5">
                          {calc.monthlyTax > 0 ? `₨ ${calc.monthlyTax.toLocaleString()}` : 'Exempt'}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-surface/50 border border-border/40">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-text-faint">Take-Home</span>
                        <p className="text-sm font-black text-accent mt-0.5">₨ {calc.netMonthly.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/30 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-text-muted">Effective Rate</span>
                      <span className="text-xs font-black text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                        {calc.effectiveRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Slabs Advisory Note */}
              <p className="text-[11px] text-text-muted leading-relaxed italic bg-surface/50 p-3 rounded-xl border border-border/50">
                {profession === 'salaried'
                  ? '💡 Salaried individuals enjoy lower progressive tax slabs compared to business structures. Any income below Rs. 50,000 per month is 100% tax-free under current FBR rules.'
                  : '💡 Foreign IT export earnings? Remit bank channel funds directly using proper purpose codes to qualify for a flat 1% cap rate instead of standard progressive tax slabs!'}
              </p>
            </BentoCard>

            {/* Bento Card 2: AI Advisor Quick Chat (Spans 1 col wide, 2 rows high) */}
            <BentoCard className="md:col-span-1 xl:col-span-1 xl:row-span-2 min-h-[380px] md:min-h-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg flex items-center justify-center text-white text-[9px] font-black" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
                      AI
                    </span>
                    <span className="text-xs uppercase tracking-wider font-bold text-text-muted">FBR Advisor Q&A</span>
                  </div>
                  <span className="status-dot w-2 h-2" />
                </div>

                <div className="rounded-xl p-3 bg-surface/50 border border-border/40 min-h-[160px] flex flex-col justify-between mb-4">
                  <div className="text-[10px] font-bold text-accent mb-2">
                    Response
                  </div>
                  <div className="flex-1 text-xs text-text-secondary leading-relaxed typewriter-cursor whitespace-pre-wrap font-medium">
                    {typedText || 'Select one of the quick questions below to see how our AI advisor streams responses...'}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-[9px] uppercase font-bold text-text-faint tracking-wider block">Frequently Asked Questions:</span>
                <div className="flex flex-col gap-2">
                  {CHAT_PROMPTS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isTyping}
                      onClick={() => triggerTypewriter(idx)}
                      className={`text-left text-[11px] font-medium p-2.5 rounded-xl border transition-all ${
                        selectedPrompt === idx
                          ? 'bg-primary/10 border-primary text-text shadow-[0_0_12px_rgba(99,102,241,0.06)]'
                          : 'bg-surface border-border text-text-muted hover:border-border-hover hover:text-text'
                      }`}
                    >
                      {p.q}
                    </button>
                  ))}
                </div>
              </div>
            </BentoCard>

            {/* Bento Card 3: Progressive Brackets Reference List */}
            <BentoCard className="md:col-span-1 xl:col-span-1 min-h-[340px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-text-muted">Interactive Slabs</span>
                  </div>
                  <span className="text-[10px] font-bold text-primary capitalize">{profession} mode</span>
                </div>

                <div className="space-y-1.5">
                  {currentSlabs.map((slab, i) => {
                    const annualIncome = income * 12;
                    const isActive = annualIncome >= slab.min && annualIncome <= slab.max;
                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-2.5 rounded-xl transition-all border ${
                          isActive
                            ? 'bg-accent/10 border-accent text-text shadow-[0_0_12px_rgba(45,212,191,0.12)] font-semibold scale-[1.02]'
                            : 'bg-surface/30 border-transparent text-text-muted opacity-40'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {isActive && <span className="status-dot w-1.5 h-1.5 bg-accent" />}
                          <span className="text-[10px] font-medium">
                            {slab.max === Infinity
                              ? `Above ₨ ${(slab.min - 1).toLocaleString()}`
                              : `₨ ${slab.min.toLocaleString()} – ${slab.max.toLocaleString()}`}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                          isActive ? 'bg-accent/20 text-accent' : 'bg-surface text-text-faint'
                        }`}>
                          {slab.rate}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-[9px] text-text-faint text-center">
                Highlighted bracket corresponds to your slider setting
              </div>
            </BentoCard>

            {/* Bento Card 4: FBR Compliance Checklist */}
            <BentoCard className="md:col-span-2 xl:col-span-1 min-h-[340px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
                  <span className="text-xs uppercase tracking-wider font-bold text-text-muted">Compliance Engine</span>
                  <span className="tag tag-accent text-[9px]">Live audit</span>
                </div>

                <div className="space-y-3">
                  {[
                    'FBR Budget FY2025-26 Slab Matrix',
                    'High-Income Surcharge Calculations (>10M)',
                    'IT Export flat 1% Bank cap logic',
                    'Zero-leak privacy & SSL encrypted data'
                  ].map((text, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center text-[10px] text-accent font-bold flex-shrink-0">
                        ✓
                      </div>
                      <span className="text-xs text-text-secondary font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border/30 flex items-center gap-4">
                <div className="relative w-11 h-11 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-border"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-accent animate-pulse"
                      strokeDasharray="100, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-text">
                    100%
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-text">FBR Audit Standard</p>
                  <p className="text-[10px] text-text-faint mt-0.5">Budget compliant calculations</p>
                </div>
              </div>
            </BentoCard>

          </div>
        </div>
      </motion.section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <motion.section
        className="py-24 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={sectionVariants}
      >
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
              <div className="space-y-4">
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
              <DashboardPreview />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <motion.section
        className="py-24"
        style={{ background: 'var(--bg-secondary)' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={sectionVariants}
      >
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
      </motion.section>

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
          <p className="text-xs text-center max-w-md" style={{ color: 'var(--text-muted)' }}>
            General financial information only · Not a substitute for professional tax advice ·{' '}
            <span style={{ color: 'var(--primary)' }}>Always consult a certified tax advisor</span>
          </p>

          {/* Copyright */}
          <p className="text-xs text-text-faint" style={{ color: 'var(--text-faint)' }}>© 2025 FinSense AI</p>
        </div>
      </footer>
    </div>
  );
}

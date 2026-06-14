'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';

function SunIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

export default function Navbar({ userEmail }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('finsense_token');
    localStorage.removeItem('finsense_user');
    router.push('/login');
  };

  const initials = userEmail ? userEmail[0].toUpperCase() : '?';
  const displayName = userEmail ? userEmail.split('@')[0] : '';

  return (
    <nav
      className="nav-bg sticky top-0 z-50 animate-fade-in"
      style={{
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.25)' : undefined,
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <div className="container-page h-16 flex items-center justify-between gap-4">

        {/* ── Brand ─────────────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
          {/* Logo mark */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base shadow-lg flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              boxShadow: '0 4px 12px rgba(79,142,247,0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            ₨
          </div>
          <div className="flex flex-col">
            <span
              className="text-base font-bold leading-none"
              style={{
                background: 'linear-gradient(135deg, var(--grad-start), var(--grad-end))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              FinSense AI
            </span>
            <span
              className="hidden sm:block text-[10px] font-medium mt-0.5"
              style={{ color: 'var(--text-faint)', letterSpacing: '0.04em' }}
            >
              Pakistan Financial Assistant
            </span>
          </div>
        </Link>

        {/* ── Right side ────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">

          {/* User chip */}
          {userEmail && (
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Avatar */}
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  boxShadow: '0 2px 6px rgba(79,142,247,0.3)',
                }}
              >
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold leading-none" style={{ color: 'var(--text)' }}>
                  {displayName.length > 12 ? displayName.slice(0, 12) + '…' : displayName}
                </span>
                <span className="text-[10px] leading-none mt-0.5" style={{ color: 'var(--text-faint)' }}>
                  Active
                </span>
              </div>
            </div>
          )}

          {/* Theme toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="btn-ghost w-9 h-9 p-0 justify-center rounded-xl flex-shrink-0"
            style={{ border: '1px solid var(--border)' }}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Logout */}
          <button
            id="logout-btn"
            onClick={handleLogout}
            aria-label="Logout"
            className="btn-ghost rounded-xl px-2.5 py-2 sm:px-3.5 flex items-center gap-1.5 flex-shrink-0"
            style={{ border: '1px solid var(--border)' }}
          >
            <LogoutIcon />
            <span className="hidden sm:inline text-xs font-medium">Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

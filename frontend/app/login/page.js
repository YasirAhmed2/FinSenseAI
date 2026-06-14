'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '../../utils/axiosInstance';
import { useTheme } from '../../components/ThemeProvider';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="btn-ghost w-9 h-9 p-0 justify-center rounded-xl absolute top-4 right-4"
      style={{ border: '1px solid var(--border)' }}
    >
      {theme === 'dark' ? (
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

function InputGroup({ id, name, label, type, value, onChange, placeholder, autoComplete }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="input-field pr-4"
        />
        {/* Left accent bar */}
        <div
          className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full transition-all duration-300"
          style={{
            background: focused ? 'linear-gradient(180deg, var(--primary), var(--accent))' : 'transparent',
          }}
        />
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.post('/api/auth/login', form);
      localStorage.setItem('finsense_token', data.token);
      localStorage.setItem('finsense_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Multi-layer background blobs */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(79,142,247,0.08) 0%, transparent 65%)',
          filter: 'blur(40px)',
          transform: 'translate(-30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(16,232,154,0.07) 0%, transparent 65%)',
          filter: 'blur(40px)',
          transform: 'translate(30%, 30%)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 65%)',
          filter: 'blur(60px)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div className="w-full max-w-[420px] relative z-10">

        {/* ── Branding ── */}
        <div className="text-center mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg"
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                boxShadow: 'var(--shadow-primary)',
              }}
            >
              ₨
            </div>
            <span
              className="text-2xl font-black"
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

          <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Sign in to your financial assistant
          </p>
        </div>

        {/* ── Card ── */}
        <div className="card p-8 relative animate-scale-in">
          <ThemeToggle />

          {/* Subtle inner glow */}
          <div
            className="absolute top-0 inset-x-0 h-px rounded-t-3xl"
            style={{ background: 'linear-gradient(90deg, transparent, var(--primary-border), transparent)' }}
          />

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Error message */}
            {error && (
              <div
                className="rounded-xl p-3.5 text-sm animate-fade-in flex items-start gap-2.5"
                style={{
                  background: 'rgba(244,63,94,0.08)',
                  border: '1px solid rgba(244,63,94,0.25)',
                  color: '#FDA4AF',
                }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            <InputGroup
              id="email" name="email" label="Email Address" type="email"
              value={form.email} onChange={handleChange}
              placeholder="you@example.com" autoComplete="email"
            />

            <InputGroup
              id="password" name="password" label="Password" type="password"
              value={form.password} onChange={handleChange}
              placeholder="••••••••" autoComplete="current-password"
            />

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-base py-3.5 mt-2"
            >
              {loading ? (
                <>
                  <span
                    className="w-4 h-4 rounded-full border-2 border-t-transparent"
                    style={{
                      borderColor: 'rgba(255,255,255,0.35)',
                      borderTopColor: 'transparent',
                      animation: 'spin 0.7s linear infinite',
                    }}
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-faint)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Footer links */}
          <div className="space-y-2.5 text-center">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-semibold transition-colors"
                style={{ color: 'var(--primary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--primary)')}
              >
                Create one free →
              </Link>
            </p>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
              <Link
                href="/"
                className="hover:underline transition-colors"
                style={{ color: 'var(--text-faint)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-faint)')}
              >
                ← Back to home
              </Link>
            </p>
          </div>
        </div>

        {/* Security note */}
        <p className="text-center text-xs mt-4 animate-fade-in delay-300" style={{ color: 'var(--text-faint)' }}>
          🔒 Your data is encrypted and secure
        </p>
      </div>
    </div>
  );
}

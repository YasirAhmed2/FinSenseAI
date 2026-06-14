'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';

const SUGGESTED_QUESTIONS = [
  'What are the new income tax slabs for salaried persons in Pakistan Budget 2025-26?',
  'Do I need to file taxes as a freelancer with IT export income?',
  'How can I reduce my tax liability legally this year?',
  'What documents do I need to register as an NTN holder with FBR?',
];

const PROFESSIONS = [
  { value: '', label: 'Select Profession' },
  { value: 'salaried', label: '💼 Salaried' },
  { value: 'freelancer', label: '💻 Freelancer' },
  { value: 'business', label: '🏪 Business Owner' },
];

const TAX_STATUSES = [
  { value: '', label: 'Select Status' },
  { value: 'Filer', label: '✅ Active Filer' },
  { value: 'Non-Filer', label: '⚠️ Non-Filer' },
];

/* ─── Markdown Inline Bold ───────────────────────────────────────────────── */
function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold" style={{ color: 'var(--text)' }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

/* ─── Markdown Renderer ──────────────────────────────────────────────────── */
function MarkdownMessage({ content }) {
  const lines = content.split('\n');
  const rendered = lines.map((line, i) => {
    if (line.startsWith('### ')) {
      return (
        <p key={i} className="font-bold text-sm mt-3 mb-1.5 first:mt-0" style={{ color: 'var(--primary)' }}>
          {line.replace('### ', '')}
        </p>
      );
    }
    if (line.startsWith('## ')) {
      return (
        <p key={i} className="font-semibold text-sm mt-2 mb-1" style={{ color: 'var(--text)' }}>
          {line.replace('## ', '')}
        </p>
      );
    }
    if (line.match(/^[-*]\s+/)) {
      return (
        <div key={i} className="flex items-start gap-2 mb-1.5">
          <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)' }} />
          <span className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {renderInline(line.replace(/^[-*]\s+/, ''))}
          </span>
        </div>
      );
    }
    if (line.match(/^\d+\.\s+/)) {
      const num = line.match(/^(\d+)\./)[1];
      return (
        <div key={i} className="flex items-start gap-2 mb-1.5">
          <span
            className="font-bold text-xs flex-shrink-0 mt-0.5 w-5 h-5 rounded-md flex items-center justify-center"
            style={{ background: 'var(--accent-dim)', color: 'var(--accent)', fontSize: '10px' }}
          >
            {num}
          </span>
          <span className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {renderInline(line.replace(/^\d+\.\s+/, ''))}
          </span>
        </div>
      );
    }
    if (line.trim() === '') return <div key={i} className="h-1.5" />;
    return (
      <p key={i} className="text-xs leading-relaxed mb-0.5" style={{ color: 'var(--text-muted)' }}>
        {renderInline(line)}
      </p>
    );
  });
  return <div className="space-y-0.5">{rendered}</div>;
}

/* ─── ChatPanel ──────────────────────────────────────────────────────────── */
export default function ChatPanel() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "### 👋 Salam! I'm FinSense AI\n\nI'm your **personal financial advisor** for Pakistan. Fill in your profile above for personalized advice, then ask me anything about taxes, savings, FBR regulations, or investments.\n\n💡 The more profile info you provide, the smarter my answers become!",
      id: 'welcome',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(true);
  const [profile, setProfile] = useState({ income: '', profession: '', tax_status: '', mode: 'simple' });
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleProfileChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendQuestion = useCallback(async (q) => {
    const trimmed = (q || question).trim();
    if (!trimmed || loading) return;
    const userMsg = { role: 'user', content: trimmed, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);
    try {
      const payload = { question: trimmed, mode: profile.mode || 'simple' };
      if (profile.income) payload.income = parseFloat(profile.income);
      if (profile.profession) payload.profession = profile.profession;
      if (profile.tax_status) payload.tax_status = profile.tax_status;
      const { data } = await axiosInstance.post('/api/ask', payload);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer, id: Date.now() + 1 }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `### ⚠️ Error\n\n- ${err.response?.data?.error || 'Please try again.'}`,
          id: Date.now() + 1,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [question, loading, profile]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendQuestion(); }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e) => {
    setQuestion(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  };

  const profileFilled = profile.income || profile.profession || profile.tax_status;

  return (
    <div
      className="card flex flex-col chat-panel-height"
      style={{ overflow: 'hidden' }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center gap-3 px-5 sm:px-6 py-4 flex-shrink-0"
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(135deg, rgba(79,142,247,0.04), transparent)',
        }}
      >
        <div className="icon-badge-primary flex-shrink-0">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-sm leading-none" style={{ color: 'var(--text)' }}>AI Financial Advisor</h2>
          <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>Powered by Groq · Pakistan Budget FY2025-26</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="status-dot" />
          <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>Live</span>
        </div>
      </div>

      {/* ── Profile Bar ── */}
      <div className="flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 sm:px-6 py-2.5 transition-colors duration-150"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <div className="flex items-center gap-2">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Your Profile
            </span>
            {profileFilled && (
              <span className="tag text-[10px]">✓ Set</span>
            )}
          </div>
          <svg
            width="13" height="13" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth="2.5"
            style={{ color: 'var(--text-faint)' }}
            className={`transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {profileOpen && (
          <div className="px-4 sm:px-5 pb-4 pt-1 grid grid-cols-2 gap-3 animate-fade-in">
            {/* Monthly Income */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-faint)' }}>
                Income (PKR/mo)
              </label>
              <input
                id="profile-income" name="income" type="number" min="1"
                value={profile.income} onChange={handleProfileChange}
                placeholder="e.g. 150000"
                className="input-field text-xs py-2"
              />
            </div>

            {/* Profession */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-faint)' }}>
                Profession
              </label>
              <select
                id="profile-profession" name="profession"
                value={profile.profession} onChange={handleProfileChange}
                className="input-field text-xs py-2 cursor-pointer"
              >
                {PROFESSIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            {/* FBR Status */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-faint)' }}>
                FBR Status
              </label>
              <select
                id="profile-tax-status" name="tax_status"
                value={profile.tax_status} onChange={handleProfileChange}
                className="input-field text-xs py-2 cursor-pointer"
              >
                {TAX_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {/* Mode Toggle */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-faint)' }}>
                Response Mode
              </label>
              <div
                className="flex rounded-xl overflow-hidden h-[38px]"
                style={{ border: '1px solid var(--border)' }}
              >
                {['simple', 'detailed'].map((mode) => (
                  <button
                    key={mode}
                    id={`mode-${mode}`}
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, mode }))}
                    className="flex-1 text-xs font-semibold capitalize transition-all duration-200"
                    style={{
                      background: profile.mode === mode
                        ? (mode === 'simple' ? 'var(--primary)' : 'var(--accent)')
                        : 'transparent',
                      color: profile.mode === mode ? '#fff' : 'var(--text-muted)',
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3.5" style={{ scrollBehavior: 'smooth' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            {/* AI avatar */}
            {msg.role === 'assistant' && (
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mr-2.5 mt-1 text-white text-[10px] font-black"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', boxShadow: '0 2px 8px rgba(79,142,247,0.3)' }}
              >
                AI
              </div>
            )}

            <div
              className="max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
              style={
                msg.role === 'user'
                  ? {
                      background: 'linear-gradient(135deg, var(--primary), var(--primary-hover, #3A7BEF))',
                      color: '#fff',
                      borderBottomRightRadius: '6px',
                      boxShadow: '0 2px 12px rgba(79,142,247,0.25)',
                    }
                  : msg.isError
                  ? {
                      background: 'rgba(244,63,94,0.08)',
                      border: '1px solid rgba(244,63,94,0.20)',
                      color: '#FDA4AF',
                      borderBottomLeftRadius: '6px',
                    }
                  : {
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      borderBottomLeftRadius: '6px',
                    }
              }
            >
              {msg.role === 'assistant'
                ? <MarkdownMessage content={msg.content} />
                : <span className="text-xs leading-relaxed">{msg.content}</span>
              }
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mr-2.5 text-white text-[10px] font-black"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
            >
              AI
            </div>
            <div
              className="px-4 py-3 rounded-2xl flex items-center gap-3"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderBottomLeftRadius: '6px',
              }}
            >
              <div className="flex gap-1">
                {[0, 0.15, 0.3].map((delay, i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: i === 0 ? 'var(--primary)' : i === 1 ? 'var(--purple)' : 'var(--accent)',
                      animation: `floatY 0.8s ease-in-out ${delay}s infinite`,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {profile.mode === 'detailed' ? 'Building detailed analysis...' : 'Analyzing...'}
              </span>
            </div>
          </div>
        )}

        {/* Empty state */}
        {messages.length === 1 && !loading && (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: 'var(--primary-dim)', border: '1px solid var(--primary-border)' }}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" style={{ color: 'var(--primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text)' }}>Ask a financial question</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>or tap one of the suggestions below</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Suggested Questions ── */}
      {messages.length <= 1 && !loading && (
        <div className="px-4 sm:px-5 pb-3 flex-shrink-0">
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--text-faint)' }}>
            💡 Try asking
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.slice(0, 3).map((q, i) => (
              <button
                key={i}
                onClick={() => sendQuestion(q)}
                className="text-[11px] px-3 py-1.5 rounded-lg transition-all duration-150 text-left leading-tight"
                style={{
                  border: '1px solid var(--primary-border)',
                  color: 'var(--primary)',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-dim)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input ── */}
      <div
        className="px-4 sm:px-5 pb-4 pt-2 flex-shrink-0"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            id="chat-input"
            value={question}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={
              profileFilled
                ? 'Ask your personalized financial question... (↵ to send)'
                : 'Ask a financial question... (↵ to send)'
            }
            rows={1}
            className="input-field resize-none text-sm flex-1 py-2.5"
            style={{ minHeight: '42px', maxHeight: '120px' }}
            aria-label="Financial question input"
            disabled={loading}
          />
          <button
            id="chat-send-btn"
            onClick={() => sendQuestion()}
            disabled={loading || !question.trim()}
            aria-label="Send question"
            className="btn-primary px-3.5 py-2.5 rounded-xl flex-shrink-0"
            style={{ minWidth: '42px', aspectRatio: '1' }}
          >
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] mt-1.5 text-right" style={{ color: 'var(--text-faint)' }}>
          Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

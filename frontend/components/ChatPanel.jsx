'use client';

import { useState, useRef, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const SUGGESTED_QUESTIONS = [
  'Do I need to file taxes as a freelancer in Pakistan?',
  'What is the tax exemption threshold in Pakistan for FY2024-25?',
  'How does the FBR define taxable income?',
  'What documents do I need to register as an NTN holder?',
  'How much tax does a salaried person pay on PKR 1,200,000 per year?',
];

/**
 * ChatPanel — AI-powered financial Q&A chat interface.
 */
export default function ChatPanel() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Salam! 👋 I\'m FinSense AI. Ask me anything about Pakistani taxes, FBR regulations, or your financial situation — I\'ll explain it in simple terms!',
      id: 'welcome',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendQuestion = async (q) => {
    const trimmed = (q || question).trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', content: trimmed, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const { data } = await axiosInstance.post('/api/ask', { question: trimmed });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.answer, id: Date.now() + 1 },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I couldn't process that request. ${err.response?.data?.error || 'Please try again.'}`,
          id: Date.now() + 1,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  };

  return (
    <div className="glass-card flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <h2 className="font-semibold text-white text-sm">AI Financial Q&amp;A</h2>
          <p className="text-[#8888aa] text-xs">Powered by Groq · Pakistan Tax Expert</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
          <span className="text-xs text-[#00D4AA] font-medium">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s_ease-out]`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-[#6C63FF] to-[#5a52d5] text-white rounded-br-sm'
                  : msg.isError
                  ? 'bg-red-500/10 border border-red-500/20 text-red-300 rounded-bl-sm'
                  : 'bg-white/5 border border-white/8 text-[#F0F0F5] rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading bubble */}
        {loading && (
          <div className="flex justify-start animate-[fadeIn_0.3s_ease-out]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center flex-shrink-0 mr-2 mt-1">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div className="bg-white/5 border border-white/8 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#6C63FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-[#6C63FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-[#6C63FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && !loading && (
        <div className="px-4 pb-3">
          <p className="text-xs text-[#8888aa] mb-2 font-medium">💡 Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.slice(0, 3).map((q, i) => (
              <button
                key={i}
                onClick={() => sendQuestion(q)}
                className="text-xs px-3 py-1.5 rounded-lg border border-[#6C63FF]/30 text-[#6C63FF] hover:bg-[#6C63FF]/10 transition-colors duration-150 text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 pb-4">
        <div className="flex items-end gap-2">
          <textarea
            id="chat-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a financial question... (Enter to send)"
            rows={2}
            className="input-field resize-none text-sm flex-1 py-3"
            aria-label="Financial question input"
            disabled={loading}
          />
          <button
            id="chat-send-btn"
            onClick={() => sendQuestion()}
            disabled={loading || !question.trim()}
            aria-label="Send question"
            className="btn-primary px-4 py-3 rounded-xl flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import ChatPanel from '../../components/ChatPanel';
import SimulatorPanel from '../../components/SimulatorPanel';
import InsightChart from '../../components/InsightChart';

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
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }

    setMounted(true);
  }, [router]);

  // Guard render until auth is confirmed
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#6C63FF] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#8888aa] text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar userEmail={user?.email} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 animate-[fadeIn_0.5s_ease-out]">
          <div className="glass-card p-6 relative overflow-hidden">
            {/* Glow accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#6C63FF]/15 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! 👋
                </h1>
                <p className="text-[#8888aa] text-sm sm:text-base">
                  Your AI-powered financial assistant is ready. Ask a question or simulate your tax situation.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-center px-4 py-2 rounded-xl bg-white/5 border border-white/8">
                  <p className="text-[#00D4AA] font-bold text-lg">600K</p>
                  <p className="text-[#8888aa] text-xs">PKR Tax Free</p>
                </div>
                <div className="text-center px-4 py-2 rounded-xl bg-white/5 border border-white/8">
                  <p className="text-[#6C63FF] font-bold text-lg">FY25</p>
                  <p className="text-[#8888aa] text-xs">Current Rules</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 animate-[slideUp_0.5s_ease-out]">
          {/* Left: AI Chat */}
          <div>
            <ChatPanel />
          </div>

          {/* Right: Simulator */}
          <div>
            <SimulatorPanel onResult={setSimulationResult} />
          </div>
        </div>

        {/* Chart Section */}
        <div className="animate-[slideUp_0.6s_ease-out]">
          <InsightChart simulationResult={simulationResult} />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[#8888aa] text-xs">
            FinSense AI provides general financial information based on Pakistan FBR rules.{' '}
            <span className="text-[#6C63FF]">Not a substitute for professional tax advice.</span>{' '}
            Always consult a certified tax advisor for personal filings.
          </p>
        </div>
      </main>
    </div>
  );
}

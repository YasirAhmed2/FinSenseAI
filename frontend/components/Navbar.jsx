'use client';

import { useRouter } from 'next/navigation';

/**
 * Navbar component — shows branding and logout button.
 * @param {{ userEmail: string }} props
 */
export default function Navbar({ userEmail }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('finsense_token');
    localStorage.removeItem('finsense_user');
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full" style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', background: 'rgba(15,15,26,0.85)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center shadow-lg shadow-[#6C63FF]/20">
            <span className="text-white font-bold text-base">₨</span>
          </div>
          <div>
            <span className="text-lg font-bold gradient-text">FinSense AI</span>
            <span className="hidden sm:inline text-xs text-[#8888aa] ml-2">Pakistan Financial Assistant</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {userEmail && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center">
                <span className="text-white text-xs font-bold">{userEmail[0].toUpperCase()}</span>
              </div>
              <span className="text-[#8888aa] text-sm truncate max-w-[160px]">{userEmail}</span>
            </div>
          )}

          <button
            id="logout-btn"
            onClick={handleLogout}
            aria-label="Logout"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#8888aa] hover:text-white transition-all duration-200 hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Root page — redirects to /dashboard if authenticated, else /login.
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('finsense_token');
    if (token) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#6C63FF] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#8888aa] text-sm">Loading FinSense AI...</p>
      </div>
    </div>
  );
}

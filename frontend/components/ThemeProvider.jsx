'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

/**
 * ThemeProvider — wraps the app and manages dark/light theme.
 * Persists preference in localStorage and applies `data-theme` to <html>.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  // On mount, read persisted preference
  useEffect(() => {
    const stored = localStorage.getItem('finsense_theme');
    const resolved = stored === 'light' ? 'light' : 'dark';
    setTheme(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('finsense_theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  };

  // Prevent flash: render children only after mount
  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme — access current theme and toggle function.
 * @returns {{ theme: 'dark' | 'light', toggleTheme: () => void }}
 */
export function useTheme() {
  return useContext(ThemeContext);
}

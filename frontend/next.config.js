/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ── Compiler optimizations ──────────────────────────────────────────────
  compiler: {
    // Strip console.log calls in production builds
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ── Package import optimization (works with both Turbopack & Webpack) ───
  // Pre-analyses these heavy packages once so every route loads them instantly
  experimental: {
    optimizePackageImports: [
      'recharts',
      'framer-motion',
    ],
  },

  // ── Turbopack config (Next.js 15 — top-level, not inside experimental) ──
  turbopack: {
    // No extra aliases needed — kept here for future extension
    resolveAlias: {},
  },
};

module.exports = nextConfig;

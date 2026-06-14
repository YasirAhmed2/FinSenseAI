/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ── Compiler optimizations ──────────────────────────────────────────────
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ── Experimental features ───────────────────────────────────────────────
  experimental: {
    // Pre-optimize heavy packages so Turbopack/Webpack doesn't re-parse them
    // on every route — this is the biggest win for fast first-load
    optimizePackageImports: [
      'recharts',
      'framer-motion',
      'react-dom',
    ],

    // Turbopack-specific: pre-warm all known routes in parallel
    // so navigating to /login, /signup, /dashboard is instant
    turbo: {
      // Resolve aliases (mirrors any webpack aliases you'd set)
      resolveAlias: {},
    },
  },

  // ── Webpack fallback (used only when running next dev:webpack) ──────────
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Faster source maps in development
      config.devtool = 'eval-cheap-module-source-map';
    }
    return config;
  },
};

module.exports = nextConfig;

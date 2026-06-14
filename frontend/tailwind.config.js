/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          /* Dark palette */
          bg:          '#060B18',
          surface:     'rgba(255,255,255,0.03)',
          primary:     '#4F8EF7',
          accent:      '#10E89A',
          purple:      '#A855F7',
          amber:       '#F59E0B',
          rose:        '#F43F5E',
          muted:       '#7C8DB5',
          border:      'rgba(255,255,255,0.07)',
          /* Light palette */
          'light-bg':      '#F0F4FF',
          'light-primary': '#2563EB',
          'light-accent':  '#059669',
          'light-text':    '#0F172A',
        },
      },
      backgroundImage: {
        'gradient-brand':    'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
        'gradient-hero':     'linear-gradient(135deg, #0D1B3E 0%, #060B18 100%)',
        'gradient-card':     'linear-gradient(135deg, rgba(79,142,247,0.06) 0%, rgba(16,232,154,0.03) 100%)',
        'gradient-radial-primary': 'radial-gradient(circle, rgba(79,142,247,0.15), transparent 70%)',
        'gradient-radial-accent':  'radial-gradient(circle, rgba(16,232,154,0.12), transparent 70%)',
      },
      backdropBlur: {
        xs:   '2px',
        sm:   '8px',
        md:   '16px',
        lg:   '24px',
        xl:   '40px',
        '2xl':'60px',
      },
      borderRadius: {
        'xl':  '0.875rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      spacing: {
        '4.5':  '1.125rem',
        '5.5':  '1.375rem',
        '13':   '3.25rem',
        '15':   '3.75rem',
        '18':   '4.5rem',
        '22':   '5.5rem',
        '88':   '22rem',
        '96':   '24rem',
        '128':  '32rem',
      },
      fontSize: {
        'xxs': ['0.625rem', { lineHeight: '1rem' }],
      },
      animation: {
        'fade-in':      'fadeIn 0.4s ease-out both',
        'fade-in-up':   'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'slide-up':     'slideUp 0.4s ease-out both',
        'scale-in':     'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'float':        'floatY 4s ease-in-out infinite',
        'float-slow':   'floatY 6s ease-in-out infinite',
        'pulse-glow':   'pulseGlow 2s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'spin-slow':    'spin 3s linear infinite',
        'gradient':     'gradientShift 6s ease infinite',
        'bounce-dot':   'bounceDot 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.94) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          'from': { backgroundPosition: '-200% 0' },
          'to':   { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
      },
      boxShadow: {
        'glow-blue':    '0 0 24px rgba(79, 142, 247, 0.30)',
        'glow-green':   '0 0 24px rgba(16, 232, 154, 0.25)',
        'glow-purple':  '0 0 24px rgba(168, 85, 247, 0.25)',
        'inner-glow':   'inset 0 1px 0 rgba(255,255,255,0.07)',
        'card':         '0 4px 20px rgba(0,0,0,0.08)',
        'card-dark':    '0 4px 32px rgba(0,0,0,0.45)',
        'premium':      '0 8px 32px rgba(79,142,247,0.20), 0 2px 8px rgba(0,0,0,0.3)',
      },
      maxWidth: {
        'page': '1280px',
      },
    },
  },
  plugins: [],
};

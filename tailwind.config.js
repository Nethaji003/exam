/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Black & Gold Design System ──────────────────
        gold: {
          DEFAULT: '#D4AF37',
          50:  '#FDF8E6',
          100: '#F9EDB6',
          200: '#F5E084',
          300: '#F3E5AB',
          400: '#E6C66D',
          500: '#D4AF37',
          600: '#B8961E',
          700: '#9A7D12',
          800: '#7A620A',
          900: '#5A4705',
        },
        onyx: {
          DEFAULT: '#0B0B0D',
          50:  '#3A3A3F',
          100: '#2C2C31',
          200: '#222226',
          300: '#19191C',
          400: '#121214',
          500: '#0B0B0D',
          600: '#080809',
          700: '#050506',
        },
        // Keep existing tokens for backward compat
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        exam: {
          banking: '#6366f1',
          railway: '#f59e0b',
          ssc: '#06b6d4',
          expert: '#ec4899',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        tamil: ['Noto Sans Tamil', 'Latha', 'Vijaya', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #E6C66D 50%, #D4AF37 100%)',
        'gold-shine':    'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 50%, transparent 100%)',
        'dark-card':     'linear-gradient(145deg, #19191C 0%, #121214 100%)',
      },
      boxShadow: {
        'gold':     '0 0 20px -4px rgba(212,175,55,0.35)',
        'gold-sm':  '0 0 10px -3px rgba(212,175,55,0.25)',
        'gold-lg':  '0 0 40px -6px rgba(212,175,55,0.45)',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'gold-shimmer': {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-subtle':  'pulse-subtle 3s ease-in-out infinite',
        'float':         'float 4s ease-in-out infinite',
        'gold-shimmer':  'gold-shimmer 2.5s linear infinite',
        'fade-in':       'fade-in 0.4s ease-out both',
        'slide-up':      'slide-up 0.5s ease-out both',
      }
    },
  },
  plugins: [],
}

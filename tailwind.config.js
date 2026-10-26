/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mocha: {
          DEFAULT: '#6F4E37',
          50:  '#fdf8f5',
          100: '#f5ede4',
          200: '#e8d3c0',
          300: '#d4a882',
          400: '#b8855a',
          500: '#6F4E37',
          600: '#5a3e2b',
          700: '#3d2a1c',
          800: '#2a1e13',
          900: '#1a130c',
          950: '#0d0804',
        },
        platinum: {
          DEFAULT: '#E5E4E2',
          50:  '#fafafa',
          100: '#E5E4E2',
          200: '#c8c7c5',
          300: '#a8a7a5',
          400: '#888785',
          500: '#686765',
          600: '#505050',
          700: '#3a3a3a',
          800: '#242424',
          900: '#141414',
        },
        lavender: {
          DEFAULT: '#E6E0F0',
          50:  '#f8f5ff',
          100: '#E6E0F0',
          200: '#cdc4e6',
          300: '#b3a8d8',
          400: '#9b8ecc',
          500: '#8474bc',
          600: '#6d5cac',
          700: '#57489a',
          800: '#3d3270',
          900: '#261f47',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float':          'float 6s ease-in-out infinite',
        'float-slow':     'float 9s ease-in-out infinite',
        'float-slower':   'float 12s ease-in-out infinite',
        'pulse-glow':     'pulse-glow 2s ease-in-out infinite',
        'slide-up':       'slide-up 0.4s ease-out',
        'fade-in':        'fade-in 0.3s ease-out',
        'spin-slow':      'spin 20s linear infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-18px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(110,78,55,0.4)' },
          '50%':      { boxShadow: '0 0 40px rgba(110,78,55,0.7), 0 0 80px rgba(230,224,240,0.2)' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        'mocha-glow':    '0 0 30px rgba(110,78,55,0.35)',
        'mocha-glow-lg': '0 0 60px rgba(110,78,55,0.5)',
        'lavender-glow': '0 0 30px rgba(230,224,240,0.2)',
        'panel':         '0 4px 24px rgba(13,8,4,0.7), inset 0 1px 0 rgba(229,228,226,0.06)',
        'card-hover':    '0 8px 40px rgba(13,8,4,0.8), 0 0 0 1px rgba(110,78,55,0.3)',
      },
      backgroundImage: {
        'mocha-gradient':   'linear-gradient(135deg, #6F4E37, #3d2a1c)',
        'hero-gradient':    'radial-gradient(ellipse at center, #2a1e13 0%, #0d0804 70%)',
        'card-gradient':    'linear-gradient(145deg, rgba(110,78,55,0.12), rgba(13,8,4,0.8))',
        'lavender-gradient':'linear-gradient(135deg, #E6E0F0, #cdc4e6)',
      },
    },
  },
  plugins: [],
}

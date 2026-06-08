/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#1A1B23',
          parchment: '#F7F5F0',
          indigo: '#1E293B',
          gold: '#C5943A',
          'gold-dark': '#8B6914',
          clay: '#8B6F4E',
          red: '#B33A3A',
          'red-hover': '#992E2E',
          'red-active': '#7A2323',
          green: '#3A7D5C',
          blue: '#4A8DB7',
          border: '#E2DCD3',
          muted: '#8B8980',
          highlight: '#FFF8E7',
        },
      },
      fontFamily: {
        serif: ['EB Garamond', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      fontSize: {
        'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700', fontFamily: 'EB Garamond, serif' }],
        'h2': ['2rem', { lineHeight: '1.3', fontWeight: '600', fontFamily: 'EB Garamond, serif' }],
        'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600', fontFamily: 'EB Garamond, serif' }],
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'verse': ['0.875rem', { lineHeight: '1.5', fontFamily: 'JetBrains Mono, monospace' }],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06)',
        'modal': '0 10px 30px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)',
        'gold': '0 4px 16px rgba(197, 148, 58, 0.25)',
      },
      borderRadius: {
        'chat-user': '16px 16px 4px 16px',
        'chat-veritas': '16px 16px 16px 4px',
      },
    },
  },
  plugins: [],
}
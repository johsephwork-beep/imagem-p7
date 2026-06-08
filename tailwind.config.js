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
          dark:    '#0A0E1A',
          surface: '#111827',
          border:  '#1F2937',
          accent:  '#6366F1',
          accent2: '#EC4899',
          teal:    '#14B8A6',
          amber:   '#F59E0B',
          red:     '#EF4444',
          text:    '#F9FAFB',
          muted:   '#9CA3AF',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body:    ['"Inter"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

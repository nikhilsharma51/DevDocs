/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          base: '#0e0e0f',
          sidebar: '#131315',
          main: '#19191b',
          hover: '#1f1f22',
          text: '#e7e5e8',
          muted: '#a7a4ab',
          accent: '#bdc2ff',
          border: 'rgba(72, 72, 75, 0.3)',
        },
      },
      fontFamily: {
        ui: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
      },
      transitionDuration: {
        150: '150ms',
      },
      transitionTimingFunction: {
        linear: 'linear',
      },
      boxShadow: {
        none: 'none',
      },
    },
  },
  plugins: [],
}
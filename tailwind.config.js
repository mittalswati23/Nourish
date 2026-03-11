/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--nourish-text)',
        paper: 'var(--nourish-bg)',
        cream: 'var(--nourish-cream)',
        warm: 'var(--nourish-warm)',
        muted: 'var(--nourish-muted)',
        border: 'var(--nourish-border)',
        accent: '#2D6A4F',
        'header-bg': 'var(--nourish-header)',
        accent2: '#52B788',
        gold: '#52B788',
        // Dark mode (fallbacks when using dark: variant)
        'dark-ink': '#E8F5E9',
        'dark-paper': '#0F1F14',
        'dark-cream': '#1A2E1F',
        'dark-warm': '#243B28',
        'dark-accent': '#52B788',
        'dark-muted': '#8BAB8F',
        'dark-border': '#2D4A3A',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(27, 43, 31, 0.06)',
        'card-hover': '0 4px 16px rgba(27, 43, 31, 0.1)',
        'card-hover-lg': '0 8px 24px rgba(27, 43, 31, 0.12)',
        'dark-card': '0 2px 8px rgba(0, 0, 0, 0.2)',
        'dark-card-hover': '0 4px 16px rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}

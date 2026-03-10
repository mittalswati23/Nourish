/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1B2B1F',
        paper: '#F7FAF7',
        cream: '#EEF5EE',
        warm: '#E3EDE3',
        accent: '#2D6A4F',
        accent2: '#52B788',
        gold: '#52B788',
        muted: '#6B8F71',
        border: '#C8DEC8',
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

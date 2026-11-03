/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        paper: '#FBF6E9',
        surface: '#FFFDF7',
        ink: '#1F2A24',
        muted: '#5C685F',
        line: '#E6DEC9',
        herb: { DEFAULT: '#14573A', dark: '#0E4029', soft: '#E3F0AF' },
        tomato: { DEFAULT: '#BF3B25', soft: '#F8E3DA' },
        saffron: '#D9940F',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 18px 40px -22px rgba(31, 42, 36, 0.45)',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B0E14', // app background
          900: '#11151D', // card surface
          800: '#1A1F2B', // raised surface / inputs
          700: '#262C3B', // borders
          600: '#3A4254', // hover borders
        },
        signal: {
          // single confident accent — used sparingly for primary actions & focus
          400: '#5EEAD4',
          500: '#2DD4BF',
          600: '#0D9488',
        },
        warn: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
        danger: {
          400: '#FB7185',
          500: '#F43F5E',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
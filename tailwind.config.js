/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f1f8f9',
          100: '#dbeef1',
          200: '#bddeE4',
          300: '#91c7d0',
          400: '#69abb8',
          500: '#47a0ac', // base
          600: '#3a828d',
          700: '#326b74',
          800: '#2d5860',
          900: '#294a51',
        },
        brand: {
          light: '#f1f8f9',
          DEFAULT: '#47a0ac',
          dark: '#326b74',
        }
      }
    },
  },
  plugins: [],
}

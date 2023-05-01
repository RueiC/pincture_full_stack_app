/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './HoC/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'text-1': '#584F4B',
        'text-2': '#45403E',
      },
    },

    fontFamily: {
      sans: ['Noto Sans TC'],
    },

    fontWeight: {
      thin: '100',
      light: '300',
      regular: '400',
      medium: '500',
      bold: '700',
      black: '900',
    },

    screens: {
      ss: '420px',
      sm: '580px',
      md: '768px',
      lg: '990px',
      xl: '1200px',
    },
  },
  plugins: [],
};

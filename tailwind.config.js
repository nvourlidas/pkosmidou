/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pk: {
          purple:        '#7C3AED',
          'purple-hover':'#6D28D9',
          'purple-mid':  '#9B6FEA',
          'purple-pale': '#F3EEFF',
          'purple-border':'#E8DAFF',
          dark:          '#1E1E2E',
          'dark-deeper': '#18182A',
          'dark-input':  '#252538',
          'dark-border': '#35354F',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Lato', '"Segoe UI"', 'Helvetica', 'sans-serif'],
      },
      transitionDuration: {
        400: '400ms',
      },
    },
  },
  plugins: [],
}

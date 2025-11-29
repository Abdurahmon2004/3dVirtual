/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          600: '#4b5563',
          800: '#1f2937',
        },
        red: {
          600: '#dc2626',
        },
        yellow: {
          500: '#f59e0b',
        },
      },
      spacing: {
        50: '200px',
      },
      borderWidth: {
        3: '3px',
      },
      zIndex: {
        10: '10',
        1000: '1000',
        2000: '2000',
        2001: '2001',
        3000: '3000',
        9999: '9999',
      },
    },
  },
  plugins: [],
};

import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f8ff',
          100: '#ddeefe',
          200: '#c1e2fe',
          300: '#94d2fd',
          400: '#61b8fa',
          500: '#3d9aef',
          600: '#2c7ed4',
          700: '#2664aa',
          800: '#24568d',
          900: '#224975'
        }
      }
    }
  },
  plugins: []
} satisfies Config;

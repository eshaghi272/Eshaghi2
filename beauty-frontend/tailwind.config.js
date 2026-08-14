/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#C9A96E',
        'gold-light': '#E8D5A3',
        'gold-dark': '#A8894E',
        darkblue: '#2C3E50',
        cream: '#F8F5F0',
        'cream-dark': '#EDE8E0',
        danger: '#E74C3C',
        success: '#27AE60',
        warning: '#F39C12',
        info: '#3498DB'
      },
      fontFamily: {
        sans: ['Vazir', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0,0,0,0.06)',
        'medium': '0 8px 30px rgba(0,0,0,0.10)',
        'hard': '0 10px 40px rgba(0,0,0,0.15)'
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px'
      },
      spacing: {
        'sidebar': '16rem',
      }
    },
  },
  plugins: [],
}
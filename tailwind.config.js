/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0F6E56',
          dark: '#0a5040',
          light: '#E1F5EE',
        },
        risk: {
          high: '#E24B4A',
          highBg: '#FCEBEB',
          med: '#EF9F27',
          medBg: '#FAEEDA',
          low: '#1D9E75',
          lowBg: '#E1F5EE',
        },
        gauge: {
          green: '#1D9E75',
          amber: '#EF9F27',
          orange: '#E85D24',
          red: '#E24B4A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fill-bar': 'fillBar 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        fillBar: {
          from: { width: '0%' },
          to: { width: 'var(--bar-width)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

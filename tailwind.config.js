/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f2f8',
          100: '#c5dded',
          200: '#9fc8e1',
          300: '#78b2d6',
          400: '#57a2ce',
          500: '#2C5F8C',
          600: '#275683',
          700: '#204974',
          800: '#193c65',
          900: '#0f2948',
        },
        secondary: {
          50: '#e8f6f4',
          100: '#c5e8e3',
          200: '#9fd9d1',
          300: '#78cabe',
          400: '#5ebfb0',
          500: '#4A9B8E',
          600: '#428e82',
          700: '#387c71',
          800: '#2e6a60',
          900: '#1f4943',
        },
        accent: {
          50: '#fef5e8',
          100: '#fce4c3',
          200: '#fad39c',
          300: '#f8c274',
          400: '#f6b556',
          500: '#F39C3F',
          600: '#f08d38',
          700: '#ec7a2f',
          800: '#e86726',
          900: '#e14617',
        },
        gray: {
          50: '#F5F7FA',
          100: '#e8ecf0',
          200: '#d9dfe5',
          300: '#c4d0d9',
          400: '#9fb0bd',
          500: '#7a90a0',
          600: '#5f7584',
          700: '#4a5b68',
          800: '#37434d',
          900: '#1f2937',
        }
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSoft: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
          '40%, 43%': { transform: 'translateY(-8px)' },
          '70%': { transform: 'translateY(-4px)' },
          '90%': { transform: 'translateY(-2px)' },
        },
      },
    },
  },
  plugins: [],
}
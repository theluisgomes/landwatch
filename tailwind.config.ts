/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#030a05',
          900: '#0a1a0f',
          800: '#122318',
          700: '#1b4332',
          600: '#2d6a4f',
          500: '#40916c',
          400: '#52b788',
          300: '#74c69d',
          200: '#95d5b2',
          100: '#b7e4c7',
          50: '#d8f3dc',
        },
        earth: {
          950: '#1a0e00',
          900: '#3d2200',
          800: '#6b3d00',
          700: '#8b4513',
          600: '#a0522d',
          500: '#cd853f',
        },
        alert: {
          red: '#ef4444',
          amber: '#f59e0b',
          green: '#22c55e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-right': 'slideRight 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'gauge': 'gaugeAnim 1.2s ease-out forwards',
        'count-up': 'countUp 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        gaugeAnim: {
          '0%': { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: 'var(--gauge-offset)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(52, 211, 153, 0.3)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366f1',    // Indigo
          secondary: '#a855f7',  // Purple
          success: '#10b981',    // Emerald Green
          warning: '#f59e0b',    // Amber Yellow
          danger: '#ef4444',     // Red
        },
        dark: {
          bg: '#050508',         // Deep midnight black
          card: 'rgba(13, 14, 22, 0.75)',  // Semi-transparent for glassmorphism
          border: 'rgba(255, 255, 255, 0.06)', // Cyberpunk thin border
          highlight: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(99, 102, 241, 0.15)',
        'glow-danger': '0 0 30px rgba(239, 68, 68, 0.35)',
        'glow-success': '0 0 25px rgba(16, 185, 129, 0.25)',
      }
    },
  },
  plugins: [],
}

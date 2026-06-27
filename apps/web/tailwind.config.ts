import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateX(calc(100% + 1.5rem)) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        'toast-out': {
          '0%': { opacity: '1', transform: 'translateX(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateX(calc(100% + 1.5rem)) scale(0.95)' },
        },
      },
      animation: {
        'toast-in': 'toast-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'toast-out': 'toast-out 0.2s ease-in forwards',
      },
    },
  },
  plugins: [],
}
export default config

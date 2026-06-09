import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#060816',
        foreground: '#ffffff',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'glass-bg': 'rgba(255, 255, 255, 0.05)',
        cyan: '#06b6d4',
        'electric-blue': '#3b82f6',
        purple: '#8b5cf6',
        'soft-pink': '#ec4899',
        'dark-bg': '#060816',
        'navy-dark': '#0b1020',
        'text-secondary': '#94a3b8',
        'text-muted': '#64748b',
      },
      backgroundColor: {
        'dark-bg': '#0f0f1e',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '24px',
        xl: '40px',
        '2xl': '60px',
      },
      boxShadow: {
        glow: '0 0 30px rgba(6, 182, 212, 0.4)',
        'glow-purple': '0 0 30px rgba(139, 92, 246, 0.4)',
        'glow-blue': '0 0 30px rgba(59, 130, 246, 0.4)',
        'glow-pink': '0 0 30px rgba(236, 72, 153, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(6, 182, 212, 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 0.75s step-start infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        blink: {
          '50%': { borderColor: 'transparent' },
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config

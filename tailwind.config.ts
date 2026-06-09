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
        background: '#050816',
        foreground: '#ffffff',
        'glass-border': 'rgba(255, 255, 255, 0.12)',
        'glass-bg': 'rgba(255, 255, 255, 0.08)',
        cyan: '#22d3ee',
        'electric-blue': '#3b82f6',
        purple: '#8b5cf6',
        indigo: '#6366f1',
        'soft-pink': '#ec4899',
        'dark-bg': '#050816',
        'navy-dark': '#0b1120',
        'gray-900': '#111827',
        'navy-900': '#0f172a',
        'text-primary': '#ffffff',
        'text-secondary': '#cbd5e1',
        'text-muted': '#94a3b8',
      },
      backgroundColor: {
        'dark-bg': '#050816',
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
        glow: '0 0 40px rgba(34, 211, 238, 0.5)',
        'glow-purple': '0 0 40px rgba(139, 92, 246, 0.5)',
        'glow-blue': '0 0 40px rgba(59, 130, 246, 0.5)',
        'glow-pink': '0 0 40px rgba(236, 72, 153, 0.4)',
        'glow-indigo': '0 0 40px rgba(99, 102, 241, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.6)',
        'inner-glow': 'inset 0 0 30px rgba(34, 211, 238, 0.2)',
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

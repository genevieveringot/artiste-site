import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0a0a',
          light: '#111111',
        },
        surface: '#1a1a1a',
        accent: {
          DEFAULT: '#c9a86c',
          light: '#d4b87d',
          dark: '#b8944f',
        },
        muted: '#888888',
        border: '#2a2a2a',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['8rem', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'hero': ['6rem', { lineHeight: '1', letterSpacing: '-0.01em' }],
        'title': ['4rem', { lineHeight: '1.1', letterSpacing: '0' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.8) 50%, rgba(10,10,10,1) 100%)',
        'gradient-overlay': 'linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.6) 100%)',
      },
    },
  },
  plugins: [],
}
export default config

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        levion: {
          50: '#E1F5EE',
          100: '#9FE1CB',
          200: '#5DCAA5',
          400: '#1D9E75',
          600: '#0F6E56',
          800: '#085041',
          900: '#04342C',
        },
        amber: {
          50: '#FAEEDA',
          400: '#EF9F27',
          800: '#633806',
        },
        coral: {
          50: '#FCEBEB',
          400: '#E24B4A',
          800: '#791F1F',
        },
      },
      borderRadius: {
        'card': '14px',
        'btn': '10px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'card-in': 'cardIn 0.5s ease both',
        'blink': 'blink 3.5s ease-in-out infinite',
        'wiggle': 'wiggle 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
        cardIn: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 92%, 100%': { transform: 'scaleY(1)' },
          '96%': { transform: 'scaleY(0.1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(6deg)' },
          '75%': { transform: 'rotate(-6deg)' },
        },
      },
    },
  },
  plugins: [],
}

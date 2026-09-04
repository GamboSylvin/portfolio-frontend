/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        'primary-light': '#a78bfa',
        surface: '#ffffff',
        'surface-dark': '#1a1a24',
        background: '#fafafa',
        'background-dark': '#0f0f14',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

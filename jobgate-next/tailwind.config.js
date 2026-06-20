/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'midnight-blue': 'rgb(44, 62, 80)',
        'light-blue': 'rgb(1, 136, 223)',
        'yellow': '#facc15',
        'red': '#dc2626',

        // ── Palette Navy + Creamy ──────────────────────────────
        navy: {
          50:  '#eef1f6',
          100: '#d6dde8',
          200: '#aebcd1',
          300: '#8597b8',
          400: '#5c7298',
          500: '#3d527a',
          600: '#2c3e63', // navy principal (sidebar, boutons)
          700: '#22314f',
          800: '#1a253d',
          900: '#121a2c',
          950: '#0b101c',
        },
        cream: {
          50:  '#fffdf8',
          100: '#fdf8ed', // fond principal du contenu
          200: '#faf1db',
          300: '#f4e6c2',
          400: '#ecd79e',
          500: '#e0c275',
          600: '#cca94f',
          700: '#a9863a',
          800: '#876a30',
          900: '#6e5728',
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
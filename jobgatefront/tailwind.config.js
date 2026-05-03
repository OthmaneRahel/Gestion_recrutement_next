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
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
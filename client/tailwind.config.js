/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: '#800000',
        red: '#AC0303',
        yellow: '#FFDF0D',
        orange: '#DAA520',
        'light-gray': '#F6F6F8'
      },
      fontFamily: {
        'Source-Sans-Pro': ['Source Sans 3', 'sans-serif']
      }
    },
  },
  plugins: [],
}
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
        yellow: '#FFDF0D',
        orange: '#DAA520'
      },
      fontFamily: {
        'Source-Sans-Pro': ['Source Sans 3', 'sans-serif']
      }
    },
  },
  plugins: [],
}
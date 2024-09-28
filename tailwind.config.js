/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        customColor : '#11BEB7',
        backcolor : '#F8FAFC'
      }

    },
  },
  plugins: [],
}
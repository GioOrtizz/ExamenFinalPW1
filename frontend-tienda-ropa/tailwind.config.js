/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // ¡Esta línea es crucial para tus archivos React!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
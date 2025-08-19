/** @type {import('tailwindcss').Config} */
// CAMBIO CLAVE: Usa 'export default' en lugar de 'module.exports' para ESM en Vite
export default {
  content: [
    "./index.html", // Escanea el archivo HTML principal
    "./src/**/*.{js,ts,jsx,tsx}", // Escanea todos los archivos JS, TS, JSX, TSX dentro de 'src'
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'custom-blue': '#3b82f6',
        'custom-cyan': '#06b6d4',
        'custom-purple': '#a855f7',
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}

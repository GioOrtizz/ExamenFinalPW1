// postcss.config.js
// Este archivo le dice a PostCSS qué plugins usar para procesar tu CSS.
// Es crucial para que Tailwind CSS funcione correctamente.
export default { // Usa export default para compatibilidad con módulos ES en Vite
  plugins: {
    '@tailwindcss/postcss': {}, // ¡CORREGIDO: Usa el nombre completo del paquete como lo pide el error!
    autoprefixer: {}, // Habilita el plugin de Autoprefixer (para prefijos de navegador)
  },
};

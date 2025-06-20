/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FBF6E9',
        secondary: '#E3F0AF',
        tertiary: "#5DB996",
        accent: {
          light: '#118B50',
          DEFAULT: '#118B50',
          dark: '#118B50',
        },
        text: {
          base: '#1F2937',      // Gris oscuro (texto principal)
          muted: '#6B7280',     // Gris medio (texto secundario)
          light: '#9CA3AF',     // Gris claro (descripciones, placeholder)
          inverted: '#FFFFFF',  // Texto sobre fondo oscuro
          accent: '#1D4ED8',    // Azul para enlaces o énfasis
          danger: '#DC2626',    // Rojo para advertencias o errores
          success: '#16A34A',   // Verde para estados exitosos
        },
        header: {
          base: "#F1FAF3",
          primary: "#C7E8CA",
          secondary: "#4E9F72",
          text: "#1B5E3C"
        },
        footer: {
          base: "#1B3B2A",
          text: "#FBF6E9"
        }
      },

    },
  },
  plugins: [],
}


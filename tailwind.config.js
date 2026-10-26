/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          offwhite: '#FAF9F6',
          forest: '#355E46',
          forestLight: '#447859',
          forestDark: '#264432',
          sage: '#DCE8D8',
          sageLight: '#EBF2E9',
          beige: '#F1E7D7',
          beigeLight: '#F9F4EC',
          charcoal: '#292D2A',
          muted: '#636D66',
          border: '#E3DFD7',
          card: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Nunito', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(41, 45, 42, 0.05), 0 1px 2px -1px rgba(41, 45, 42, 0.05)',
        card: '0 4px 12px -2px rgba(41, 45, 42, 0.06), 0 2px 6px -2px rgba(41, 45, 42, 0.04)',
        elevated: '0 10px 25px -5px rgba(53, 94, 70, 0.12), 0 8px 10px -6px rgba(53, 94, 70, 0.08)',
      },
    },
  },
  plugins: [],
}

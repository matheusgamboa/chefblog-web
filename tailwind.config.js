/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#ee8c2b",
        "background-light": "#f8f7f6",
        "background-dark": "#221910",
        "surface-white": "#ffffff",
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "sans-serif"],
        "sans": ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "1rem", // 16px
        "lg": "2rem",      // 32px
        "xl": "3rem",      // 48px
      },
      backgroundImage: {
        'gradient-card': 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%)',
      }
    },
  },
  plugins: [],
}

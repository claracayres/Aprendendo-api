/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#29144e",
        primaryLight: "#3f2177",
        primarySoft: "#5a3fa3",

        background: "#0a0a0f",
        surface: "#1a1a26",

        accent: "#9f7cff",
        accentGreen: "#1DB954",

        textPrimary: "#ffffff",
        textSecondary: "#a1a1aa",
      },
    },
  },
  plugins: [],
};
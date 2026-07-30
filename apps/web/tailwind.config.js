/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080B12",
        surface: "#0F1623",
        surfaceLight: "#182234",
        border: "#1E2C42",
        accent: "#6366F1",
        accentCyan: "#06B6D4",
        accentPink: "#EC4899",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};

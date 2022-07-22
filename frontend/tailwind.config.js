/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      white: "#FFFFFF",
      black: "#020202",
      transparent: "transparent",
      primary: "#4A54EB",
      stroke: {
        100: "#1C1B20",
        200: "#302F37",
      },
      surface: "#DCDCFF",
    },
    extend: {
      fontFamily: ["TT Norms Pro", "sans-serif"],
    },
  },
  plugins: [],
};

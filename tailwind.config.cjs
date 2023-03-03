/** @type {import('tailwindcss').Config} */
/** @todo migrate colors name to actually make fucking sense */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#020202",
        transparent: "transparent",
        primary: "#4A54EB",
        dark: {
          DEFAULT: "#020202",
          secondary: "#090909",
          tertiary: "#0f0f0f",
        },
        light: {
          DEFAULT: "#ffffff",
        },
        gray: {
          dark: {
            DEFAULT: "#1a1b1b",
            secondary: "#1C1B20",
          },
          light: {
            DEFAULT: "#D4D4D4",
            secondary: "#e5e5e5",
          },
        },
      },
      fontFamily: { sans: ["TT Norms Pro", "sans-serif"] },
      backgroundImage: {
        gradient: "url('../../public/images/gradient.png')",
      },
      animation: {
        "ripple-effect": "0.6s linear ripple",
      },
      keyframes: {
        ripple: {
          to: { transform: "scale(25)", opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};

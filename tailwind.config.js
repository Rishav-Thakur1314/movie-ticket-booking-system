/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"', "Poppins", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#070710",
          900: "#0b0b16",
          800: "#12121f",
          700: "#1a1a2b",
          600: "#232338",
        },
        wave: {
          50: "#eefcfb",
          100: "#d3f8f5",
          200: "#a9f0ec",
          300: "#6fe3df",
          400: "#34cbc7",
          500: "#16b0ad",
          600: "#0d8b8a",
          700: "#0e6e6e",
          800: "#105757",
          900: "#114a4a",
        },
        gold: {
          400: "#ffd76a",
          500: "#f6c252",
          600: "#e0a82e",
        },
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pop: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(24px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glow: {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        pop: "pop 0.25s ease-out",
        slideUp: "slideUp 0.4s ease-out",
        glow: "glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

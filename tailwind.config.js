/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: 0,
            transform: "translateY(-100px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0px)",
          },
        },

        "fade-in-left": {
          "0%": {
            opacity: 0,
            transform: "translateX(-100px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateX(0px)",
          },
        },

        "fade-in-right": {
          "0%": {
            opacity: 0,
            transform: "translateX(100px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateX(0px)",
          },
        },
      },
    },
  },
  plugins: [],
};

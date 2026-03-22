/**@type{import('tailwindcss').Config} */

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#1a1a1a",
          surface: "#2a2a2a",
          border: "#3a3a3a",
          input: "#333333",
          hover: "#353535",
        },
        brand: {
          purple: "#7F77DD",
          light: "#EEEDFE",
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-blue": "#3498db",
        "brand-dark-blue": "#2980b9",
        "brand-orange": "#e67e22",
        "brand-red": "#c0392b",
        "brand-alert": "#ff4d00",
        "brand-warning": "#f39c12",
        "brand-neutral-bg": "#f8fafc",
        "brand-gray-light": "#f5f5f5",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      transitionDuration: {
        300: "300ms",
      },
    },
  },
  plugins: [],
};

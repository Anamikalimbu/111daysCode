/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          500: "#0f7cf0",
          600: "#0b62c2",
          700: "#0a4f9c",
        },
      },
    },
  },
  plugins: [],
};

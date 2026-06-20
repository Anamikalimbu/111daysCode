/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070B14",
          900: "#0B1220",
          800: "#121B2E",
          700: "#1B2740",
        },
        teal: {
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
        },
        amber: {
          400: "#FBBF24",
          500: "#F59E0B",
        },
        slate: {
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
        },
        danger: "#EF4444",
        success: "#22C55E",
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "dot-grid":
          "radial-gradient(circle, rgba(45, 212, 191, 0.18) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-grid": "22px 22px",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#3998E5",
          "blue-dark": "#2476BC",
          "blue-soft": "#EAF5FF",
          yellow: "#FFE98A",
          orange: "#FFB45C",
          "orange-soft": "#FFF2DE",
        },
        surface: {
          primary: "#FFFFFF",
          secondary: "#F1F5F9",
          background: "#F7F9FC",
        },
        border: {
          default: "#E2E8F0",
        },
        content: {
          primary: "#172033",
          secondary: "#64748B",
          disabled: "#94A3B8",
        },
        semantic: {
          success: "#16845B",
          "success-surface": "#E8F7EF",
          warning: "#A86408",
          "warning-surface": "#FFF4D8",
          error: "#C93636",
          "error-surface": "#FDECEC",
          info: "#2476BC",
          "info-surface": "#EAF5FF",
        },
      },
      borderRadius: {
        card: "16px",
        btn: "14px",
        input: "12px",
      },
    },
  },
  plugins: [],
};

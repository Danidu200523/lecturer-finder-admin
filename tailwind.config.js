/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
       colors: {
        primary: "#2563EB",
        primaryHover: "#1d4fd8cb",
        primaryDark: "#1E40AF",
        primaryLight: "#DBEAFE",

        secondary: "#4F46E5",
        accent: "#7C3AED",

        green: "#11E618",
        yellow: "#E6E611",
        yellowLight: "#e6e611d3",
        danger: "#EA1F22",
        dangerLight: "#f14545",
        info: "#0284C7",

        background: "#F3F4F6",
        card: "#FFFFFF",
        border: "#E5E7EB",
        textDark: "#111827",
        textLight: "#6B7280",
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
};


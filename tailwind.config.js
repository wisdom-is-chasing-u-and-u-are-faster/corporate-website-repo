/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#FFF8F9",
          300: "#FFE4E9",
          500: "#F9A8B6",
          700: "#E97188"
        },
        accent: {
          300: "#F3E4C9",
          500: "#D4AF7A",
          700: "#B88B4A"
        }
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};
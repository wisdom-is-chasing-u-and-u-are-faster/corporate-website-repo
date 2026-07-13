module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A2540',
          dark: '#081D33',
        },
        accent: {
          DEFAULT: '#00D4FF',
          dark: '#00BBE6',
        },
      },
    },
  },
  plugins: [],
}
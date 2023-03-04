/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#662e9b',
        'secondary1': '#247ba0',
        'neutral1': '#f9f9f9',
        'secondary2': '#1b98e0',
        'neutral2': '#e8f1f2',
      }
    },
  },
  plugins: [],
};

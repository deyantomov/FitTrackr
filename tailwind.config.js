/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: ["corporate", "dracula", "dark"]
  },
  theme: {
    extend: {},
  },
}
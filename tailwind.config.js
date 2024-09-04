/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
     screens: {
      'xs': '280px',
      'sm': '370px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      'max-sm': '640px',
      'max-md': '768px',
      'max-lg': '1024px',
      'max-xl': '1280px',
      'max-2xl': '1536px',
    },
    extend: {},
  },
  plugins: [],
}

   
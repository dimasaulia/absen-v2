/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{tsx,html,svg,js}',
    './node_modules/flowbite/**/*.js',
    './src/public/js/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        pjs: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};

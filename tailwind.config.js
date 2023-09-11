/** @type {import('tailwindcss').Config} */
// const plugin = require('tailwindcss/plugin')

module.exports = {
  content:["./src/**/*.{wxml,js}"],
  presets: [
    require('./ds/design-system-preset')({url: 'baidu.com',haha: '#ddeeff'})
  ],
  theme: {
    extend: {},
  },
  plugins: [
  ],
}


/** @type {import('tailwindcss').Config} */
// const plugin = require('tailwindcss/plugin')

module.exports = {
  content:["./src/**/*.{wxml,js}"],
  presets: [
    require('./ds/index')({
      themes: [{
        light: {
          ink: '#1f2937', //全局文字色
          primary: "#60a5fa",
          secondary: "#f472b6",
          neutral: "#4b5563",
        }
      },"dark"],
      appType: "wxmp",
      url: 'baidu.com',haha: '#ddeeff'
    })
  ],
  theme: {
    extend: {},
  },
  plugins: [
  ],
}


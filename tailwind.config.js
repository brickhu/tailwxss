/** @type {import('tailwindcss').Config} */
// const plugin = require('tailwindcss/plugin')

module.exports = {
  content:["./src/**/*.{wxml,js}"],
  presets: [
    require('./ds/index')({
      themes: [{
        light: {
          ink: '#1f2937', //全局文字色
          primary: {
            DEFAULT:"#60a5fa",
            ink: "#fff",
            baab:"#ddd"
          },
          secondary: "#f472b6",
          neutral: "#4b5563",
          s_0:"#333333"
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


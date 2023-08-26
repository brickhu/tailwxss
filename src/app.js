// app.js
const md5 = require('md5');

App({
  async onLaunch() {
    console.log(md5('hello world'))
    // 登录
    wx.login({
      success: res => {
        res
      }
    })
  },
  globalData: {
    userInfo: null
  }
})

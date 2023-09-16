// app.js
const md5 = require('md5');

App({
  async onLaunch() {
    // 登录
    wx.login({
      success: res => {
        res
      }
    })
  },
  globalData: {
    userInfo: null
  },
  onThemeChange(e){
    console.log('切换皮肤',e)
  }
})

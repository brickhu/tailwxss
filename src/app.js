// app.js
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
  }
})

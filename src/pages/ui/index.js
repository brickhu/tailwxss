// index.js

const app = getApp()
Page({
  data: {
    theme: 'light'
  },
  // 事件处理函数
  bindViewTap() {
  },
  onLoad() {
    const {theme,...systemInfo} = wx.getSystemInfoSync();
    this.setData({theme})
    // console.log('systemInfo: ', theme);
      
    
  },
  onReady(){
    
  },
  handleOpen(e){
    // console.log('打开',e)
    // console.log('myModal: ', this.myModal);
    const child = this.selectComponent('.mbtn');
    console.log(child)
  },
  hi(){
    console.log('say hi')
  }
})

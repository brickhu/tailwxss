Component({
  externalClasses: ['class'],
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    fixed: {
      type: Boolean,
      value: true
    },
    placeholder: {
      type: Boolean,
      value: true
    },
    title: {
      type: String,
      value: null
    },
    back: {
      type: Boolean,
      value: true
    },
    show: {
      type: Boolean,
      value: true
    },
    animated: {
      type: Boolean,
      value: false
    },
    loadding: {
      type: Boolean,
      value: false
    },
    float: {
      type: Boolean,
      value: false
    }
  },
  data: {
  },
  attached(e) {
    console.log('attached', this)
    const { safeArea } = wx.getSystemInfoSync()
    const pages = getCurrentPages()
    this.setData({
      safeTop: safeArea.top,
      height: 46 + safeArea.top,
      _isRootPage: pages.length <= 1
    })
    // 在组件实例进入页面节点树时执行
  },
  methods: {
    handleBack() {
      this.pageRouter.navigateBack({
        delta: 1 // 返回的页面数，如果 delta 大于现有页面数，则返回到首页,
      })
    }
  }
})
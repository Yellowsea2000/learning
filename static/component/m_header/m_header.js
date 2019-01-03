const app = getApp()
Component({
  properties: {
    title: { //头部标题
      type: String,
      value: ''
    },
    back: { //是否隐藏返回，默认不隐藏
      type: Boolean,
      value: true
    },
    backImg:{
      type: Boolean,
      value: true
    },
    needHiden: { //是否隐藏头部，默认不隐藏
      type: Boolean,
      value: false
    },
    url: { //是否隐藏头部，默认不隐藏
      type: String,
      value: ''
    },
    navigatetionStyle:{
      type:Object,
      value:{}
    }
  },
  data: {
    statusBarHeight: '',
  },
  attached: function() {
    // 获取是否是通过分享进入的小程序
    // 定义导航栏的高度   方便对齐
    this.setData({
      // fromShare: app.globalData.fromShare,
      statusBarHeight: app.globalData.statusBarHeight
    })
  },
  methods: {
    // 返回上一页面
    _navback() {
      wx.navigateBack()
    },
    hrefUrl(){
      wx.reLaunch({
        url: this.data.url
      })
    }
  }

})
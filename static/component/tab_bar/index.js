const app = getApp()
Component({
  properties: {
    active: { //默认选中
      type: String,
      value: '0'
    }
  },
  data: {
    tabList: null,
  },
  attached: function() {
    this.setData({
      tabList: app.tabBar
    })
    app.loginCallback=()=>{
      this.setData({
        tabList: app.tabBar
      })
    }
  },
  methods: {
    onChange(event) {
      var tempTab = this.data.tabList;
      wx.redirectTo({
        url: tempTab[event.detail].url,
      })
    }
  }
})
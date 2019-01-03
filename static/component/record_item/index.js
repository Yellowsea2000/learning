const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    chekeIndex: {
      type: Number,
      value: 1
    },
    listData: { //列表数据
      type: Array,
      value: null
    }
  },
  data: {
    statusBarHeight: '',
  },

  attached: function() {

  },
  methods: {
    _totel(e) {
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.tel //仅为示例，并非真实的电话号码
      })
    },
    _btnTap(e){
      var tempData = {
        mType: e.currentTarget.dataset.type,
        mItem: e.currentTarget.dataset.item
      }
      this.triggerEvent("btnClick", tempData)
    }
  }
})
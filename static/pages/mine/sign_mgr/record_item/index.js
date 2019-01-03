const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    type: {
      type: String,
      value: 1
    },
    listData: { //列表数据
      type: Array,
      value: null
    }
  },
  data: {
    statusBarHeight: ''
  },

  attached: function() {

  },
  methods: {
    onChange(e) {
      let item = e.currentTarget.dataset.item;
      item.checked = !item.checked;
      this.triggerEvent("checkboxChange", item);
    },
    leftClick(e) {
      let item = e.currentTarget.dataset.item;
      item.checked = !item.checked;
      this.triggerEvent("checkboxChange", item);
    },
    _totel(e) {
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.tel //仅为示例，并非真实的电话号码
      })
    },
    _btnTap(e){
      let userId = e.currentTarget.dataset.userid;
      // var tempData = {
      //   mType: e.currentTarget.dataset.type,
      //   mItem: e.currentTarget.dataset.item
      // }
      this.triggerEvent("btnClick", userId)
    }
  }
})
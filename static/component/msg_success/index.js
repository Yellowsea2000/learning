// component/msg_success/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemObj:{
      title:'',
      desc:'',
      btnTitle:'',
      clickUrl:''
    }
  },
  clickEvent:function(){
    wx.redirectTo({
      url: this.data.itemObj.clickUrl,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var msg = JSON.parse(options.msgObj)
    this.setData({
      itemObj:msg
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }
})
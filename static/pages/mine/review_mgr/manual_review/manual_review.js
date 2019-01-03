

import {manualInfoReview, manualInfoPass, judgePass,updateEntryStatusAndDate} from '../../../../utils/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData:'',
    userId:'',
    sexMap: {
      1:'男',
      2:'女',
      0:'未知'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId:options.userId
    });
    manualInfoReview(options.userId).then(res =>{
      this.setData({
        formData:res.data
      });
    });
   
  },

  submit(e) {
    let type = e.target.dataset.type;
    let params ={
      userId:this.data.userId,
      entryStatus:400
    }
    if(type == 'fail') {
      params.entryStatus = 500;
    }
    judgePass(params).then(res =>{
      if(res.code != 200) {
        wx.showToast({
          title: '提交失败 ',
          icon: 'none',
          duration: 2000
        });
      } else {
        wx.navigateBack();
        this.updateUserStatusAndDate();
      }
    })
  },

  updateUserStatusAndDate: function () {
    updateEntryStatusAndDate().then(res => {
      if(res.code != 200){
        var remark = res.remark ? res.remark : '提交数据异常';
        wx.showToast({
          title: remark,
          icon: 'none',
          duration: 2000
        })
      }
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (options) {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
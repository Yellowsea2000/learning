import {
  getCityStoreList
} from "../../../utils/api.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList:[],
    selectedAreaIndex:'',//当前选中门店的索引
  },

    //选择门店
    selectedArea(e) {
      let index = e.currentTarget.dataset.index;
      let item = e.currentTarget.dataset.item;
      this.setData({
        selectedAreaIndex:index
      });
      app.globalData.queryStoreId = item.storeId;
      app.globalData.storeName = item.storeName;
      wx.navigateBack();
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let params = {
      provinceCode:app.globalData.provinceCode,
      cityCode:app.globalData.cityCode
    }
    getCityStoreList(params)
    .then(res =>{
      this.setData({
        areaList:res.data
      })
    });
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
  onUnload: function () {

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
// pages/home/city_list/city_list.js
const app = getApp()
const utils = require('../../../utils/util.js');
import {
  getHotCityList
} from "../../../utils/api.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityArr:null,
    location:"全国"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDatas();
  },
  //热门城市
  getDatas() {
    getHotCityList().then(res => {
      this.setData({
        cityArr: res.data,
        location: app.globalData.cityName ||"全国"
      })
    })
      .catch(err => { });
  },
  chooseItem(e){
    var tempItem = e.currentTarget.dataset.item;
    app.globalData.cityName = tempItem.workAddress;
    app.globalData.cityCode = tempItem.cityCode;
    app.globalData.provinceCode = tempItem.provinceCode;

    //选择城市时清除门店信息
    app.globalData.storeName = '';
    app.globalData.queryStoreId = '';
    wx.navigateBack({})
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
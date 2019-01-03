// pages/mine/info/info.js
// const Util = require("../../../utils/util.js")
import Util from "../../../utils/util.js"
import {getIdentifyCode} from '../../../utils/api'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: null,
    tel: null,
    sex: 1,
    birthDay: null,
    imgList: [],
    isShowModal:false,  //是否显示弹框
    codeArr:[]//验证码
  },
  getData() {

  },
  toProtocol() {
    this.protocol.show();
  },
  bindPriweImg(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgList // 需要预览的图片http链接列表  
    })
  },
  

  showModal() {
    this.setData({
      isShowModal:true
    });
  },

  cancel() {
    this.setData({
      isShowModal:false,
      codeArr:[]
    });
  },

  getCode() {
    getIdentifyCode().then(res=>{
      let arr = res.data.code.split('')
      this.setData({
        codeArr:arr
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.protocol = this.selectComponent("#protocol");
    this.setData({
      name: app.globalData.userInfo.realName,
      tel: app.globalData.userInfo.phone,
      sex: app.globalData.userInfo.sex == 1 ? "男" : "女",
      birthDay: app.globalData.userInfo.birthday.substring(0, 10),
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

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

  }
})
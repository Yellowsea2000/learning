const app = getApp()
const WxParse = require('../../../utils/wxParse/wxParse.js');
import {
  getContractTemplate,
  viewSignedContract,
  getEntryInfo
} from "../../../utils/api.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contactTemp: "",
    entryStatus:'',
    contactUrl:'',
    isAndroid:false,
    contactSign: true,
    showLoading:false,
    contactSuccess: false //合同是否签署成功
  },
//将html代码解析成wxml
  htmlToWxml: function() { 
    var that = this;
    WxParse.wxParse('contactTemp', 'html', that.data.contactTemp, that, 5);
  },
  startSign: function() {
    wx.redirectTo({
      url: "/pages/mine/sign_cont/cont_msge/cont_msge",
    })
  },
  //获取合同模板
  getContractTemp: function() {
    var that = this;
    getContractTemplate().then( res => {
      if (res.code == 200 && res.data.content) {
        that.setData({
          contactTemp: res.data.content
        })
        that.htmlToWxml();
      } else {
        var err = res.remark ? res.remark : '服务异常'
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //签署成功获取合同地址
  getViewSignedContract:function(){
    var that  = this;
    viewSignedContract().then(res =>{
     if(res.code == 200 && res.data){
       that.getphonesystem(res.data);//判断手机系统
     }else{
       var err = res.remark ? res.remark : '服务异常'
       wx.showToast({
         title: err,
         icon: 'none',
         duration: 2000
       })
     }
    })
  },
  //兼容安卓机型不能直接预览PDF文件的问题
  previewFile: function (urlValue) {
    var that = this;
    wx.downloadFile({
      url: urlValue,//PDF文档存放地址
      success: function (res) {
        var Path = res.tempFilePath;//生成本地预览地址
        that.setData({
          contactUrl: Path
        })
        wx.openDocument({
          filePath: Path,
          success: function (res) {
            console.log('打开成功');
          },
          fail: function (res) {
            console.log(res)
          }
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  //判断手机系统
  getphonesystem: function (urlValue) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        if (res.system.indexOf('Android')>=0){
          that.setData({
            isAndroid:true
          })
          that.previewFile(urlValue);
        } else if (res.system.indexOf('iOS') >= 0){
          that.setData({
            isAndroid:false
          })
          that.setData({
            contactUrl: urlValue
          })
        }
      }
    })
  },
  //获取角色的入职状态
  getUserEntryInfo: function () {
    var userId = app.globalData.userId;
    var that = this;
    getEntryInfo().then(res => {
      if (res.code == 200 && res.data) {
        that.setData({
          entryStatus: res.data.entryStatus
        });
        if (that.data.entryStatus == 530) {
          that.getViewSignedContract();//签署合同成功调用
        } else {
          that.getContractTemp();//未签署合同
        }
      } else {
        that.setData({
          entryStatus: ''
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getContractTemp();
    //this.getViewSignedContract();
    this.getUserEntryInfo();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  }
})
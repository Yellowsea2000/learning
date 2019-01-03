// pages/home/home.js
const app = getApp()
import {
  getJobList,
  getCityStoreList
} from "../../utils/api.js";

import util from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    totalPage: 1,
    listData: [],
    cityName: null,
    showLoading: true,
    imgUrls: [
      'https://rst-prd-oss.oss-cn-shenzhen.aliyuncs.com/rst-business/%E9%A6%96%E9%A1%B5/banner4.jpg',
      'https://rst-prd-oss.oss-cn-shenzhen.aliyuncs.com/rst-business/%E9%A6%96%E9%A1%B5/BANNER211.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,

  
    
    areaList:[
      // {name:'福田保税区', value:'11'}
    ]
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.userId) {
      this.getDatas();
      this.setData({
        storeName:app.globalData.storeName
      })
    }
  },
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/home/jobs_info/jobs_info?jobId=' + e.currentTarget.dataset.item.jobId,
    })
  },
  
  search:function(){
    wx.navigateTo({
      url: '/pages/home/sech_list/sech_list',
    })
  },

  //跳转到门店选择页面
  toArea(){
    wx.navigateTo({
      url:'/pages/home/store_list/store_list'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu();
    app.getLocationCallBack = res => {
      this.getDatas();
    };
  },
  onHide: function() {},
  getDatas() { //获取职位列表
    let params = {
      pageNo:this.data.page,
      storeId:app.globalData.queryStoreId,
      userId:app.globalData.userId,
      provinceCode:app.globalData.provinceCode,
      cityCode:app.globalData.cityCode,
      pageSize:10
    };
   
    getJobList(params).then(res => {
       
        this.data.totalPage = res.data.pages;
        if (this.data.page == 1) {
          this.data.listData = [];
        }
        res.data.records.forEach(item => {
          if (item.jobWelfare) {
            if (item.jobWelfare) {
              item.jobWelfare = item.jobWelfare.replace(/,/g, " | ");
            }
          }
          this.data.listData.push(item);
        });
        this.setData({
          listData: this.data.listData,
          cityName: app.globalData.cityName,
          showLoading: false
        })
      })
      .catch(err => {});
  },
  toChooseCity() {
    wx.navigateTo({
      url: '/pages/home/city_list/city_list',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.data.page = 1;
    this.getDatas() //SA获取列表
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.page >= this.data.totalPage) {
      return;
    } else {
      this.data.page++;
      this.getDatas() //SA获取列表
    }
  },

  onShareAppMessage: function() {
    return {
      title: "永琪招聘, 祝你找到好工作！",
      success: (res) => {
      }
    }
  }
})
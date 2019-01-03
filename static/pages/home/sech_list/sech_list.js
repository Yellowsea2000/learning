const app = getApp()
import {
  getJobList
} from "../../../utils/api.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    totalPage: 1,
    searchValue: '',
    hisListData: [],
    searchValueArr: [], //搜索记录
    listData: []
  },

  //搜索
  search: function() {
    if(this.data.searchValue){
      var searchArr = this.data.hisListData;
      if (searchArr.indexOf(this.data.searchValue) < 0) {
        searchArr.push(this.data.searchValue);
      }
      wx.setStorage({
        key: 'homeSearchValue',
        data: searchArr
      })
      this.getDatas();
      // this.getHisSearchList();
    }
  },
  //删除历史记录
  deletHistory: function() {
    var that = this;
    wx.removeStorage({
      key: 'homeSearchValue',
      success(res) {
        that.setData({
          hisListData: res.data ? res.data : ''
        })
      }
    })
  },
  onChange: function(e) {
    var value = e.detail.value;
    this.setData({
      searchValue: value
    })
  },
  //点击历史记录list
  clickHisItem: function(e) {
    var value = e.currentTarget.dataset.item
    this.setData({
      searchValue: value
    })
  },
  //获取搜索历史
  getHisSearchList: function() {
    var that = this;
    wx.getStorage({
      key: 'homeSearchValue',
      success(res) {
        that.setData({
          hisListData: res.data
        })
      }
    })
  },
  getDatas() { //获取搜索职位列表
    if (this.data.searchValue){
      let params = {
        pageNo: this.data.page,
        storeId: app.globalData.queryStoreId,
        userId: app.globalData.userId,
        provinceCode: app.globalData.provinceCode,
        cityCode: app.globalData.cityCode,
        pageSize: 10,
        keyword: this.data.searchValue
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
        .catch(err => { });
    }else{

    }
    
  },
  //点击信息列表
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/home/jobs_info/jobs_info?jobId=' + e.currentTarget.dataset.item.jobId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getHisSearchList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.page >= this.data.totalPage) {
      return;
    } else {
      if(this.data.searchValue){
        this.data.page++;
        this.getDatas() //SA获取列表
      }
      
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
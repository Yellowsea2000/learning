import {getReviewList} from '../../../utils/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    chekeIndex: 1,
    listData1: null,
    listData2: null,
    listData3:null,
    totalPage1: 1,
    totalPage2: 1,
    totalPage3 :1,
    page1: 1,
    page2: 1,
    page3:1,
  },


  btnClick(e) {
    let userId =e.detail;
      wx.navigateTo({
        url:`./manual_review/manual_review?userId=${userId}`
      });
  },

  onChange(e) {
    this.setData({
      chekeIndex: e.detail.index + 1
    })
  },

  getDataList(page, EntryStatus) {
    getReviewList(page, EntryStatus).then(res =>{
      if( EntryStatus === 300) {
        if (this.data.page1 == 1) {
          this.data.listData1 = [];
        }
        this.data.totalPage1 = res.data.pages;
        res.data.records.forEach(item => {
          item.interviewTime = item.interviewTime.substring(0, 10);
          item.headPic = item.headImgUrl
        });
        this.setData({
          listData1:res.data.records
        });
        
      } else if (EntryStatus === 400) {
        if (this.data.page2 == 1) {
          this.data.listData2 = [];
        }
        this.data.totalPage2 = res.data.pages;
        res.data.records.forEach(item => {
          item.interviewTime = item.interviewTime.substring(0, 10);
          item.headPic = item.headImgUrl
        });
        this.setData({
          listData2:res.data.records
        });
        console.log(this.data.listData2)
      } else {
        if (this.data.page3 == 1) {
          this.data.listData3 = [];
        }
        this.data.totalPage3 = res.data.pages;
        res.data.records.forEach(item => {
          item.interviewTime = item.interviewTime.substring(0, 10);
          item.headPic = item.headImgUrl
        });
        this.setData({
          listData3:res.data.records
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.getDataList(1, 300);
    this.getDataList(1, 400);
    this.getDataList(1, 500);
    wx.hideShareMenu();
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
  onReachBottom: function() {
    switch (this.data.chekeIndex) {
      case 1:
        if (this.data.page1 >= this.data.totalPage1) {
          return;
        } else {
          this.data.page1++;
          this.getDataList(this.data.page1, 300);
        }
        break;
      case 2:
        if (this.data.page2 >= this.data.totalPage2) {
          return;
        } else {
          this.data.page2++;
          this.getDataList(this.data.page2, 400);
        }

        case 3:
        if (this.data.page3 >= this.data.totalPage3) {
          return;
        } else {
          this.data.page3++;
          this.getDataList(this.data.page3, 500);
        }
        break;
      default:
        break;
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
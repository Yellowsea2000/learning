// pages/index/jobDetail/jobDetail.js
import {
  getJobDetail,
  senLikeJob
} from "../../../utils/api.js";
import Util from "../../../utils/util.js"
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoId: null,
    title: " ",
    swiperH: 150,
    telNumber: null,
    showLoading: true,
    detailInfo: null,
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    fromShare:false
  },
  toTel(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.detailInfo.intermediaryPhone
    })
  },

  //回到首页
  back2Home() {
    wx.redirectTo({
      url:'../home'
    })
  },
  getJobDetail(e) {
    getJobDetail(e).then(res => {
      var tempData = res.data;
      if (tempData.sexNeed) {
        switch (Number(tempData.sexNeed)) {
          case 1:
            tempData.sexShow = "男";
            break;
          case 2:
            tempData.sexShow = "女";
            break;
          case 3:
            tempData.sexShow = "不限";
            break;
          default:
            tempData.sexShow = "不限";
            break;
        }
      };
      if (tempData.educationNeed) {
        switch (Number(tempData.educationNeed)) {
          case 1:
            tempData.educationNeedShow = "不限";
            break;
          case 2:
            tempData.educationNeedShow = "初中";
            break;
          case 3:
            tempData.educationNeedShow = "高中";
            break;
          case 6:
            tempData.educationNeedShow = "中专";
            break;
          case 4:
            tempData.educationNeedShow = "大专";
            break;
          case 5:
            tempData.educationNeedShow = "本科";
            break;
        }
      };
      if (tempData.jobWelfare) {
        tempData.jobWelfare = tempData.jobWelfare.replace(/,/g, " | ");
      }
      if (tempData.companyInfo.companyPictures) {
        tempData.companyInfo.companyPictures.forEach(item => {
          this.data.imgUrls.push(item.pictureUrl);
        });
      }
      if (tempData.updateTime) {
        tempData.updateTimeShow = Util.fmtDate(tempData.updateTime);
      }
      wx.setNavigationBarTitle({
        title: tempData.companyShortName,
      })
      this.setData({
        title: tempData.companyShortName,
        imgUrls: this.data.imgUrls,
        detailInfo: tempData
      })
    })
      .catch(err => { });
  },
  sendLike() {
    if (!app.globalData.userInfo.completed) {
      wx.navigateTo({
        url: '/pages/mine/info_edit/info_edit',
      })
      return;
    }
    var tempData = {
      contactName: this.data.detailInfo.intermediaryName,
      contactPhone: this.data.detailInfo.intermediaryPhone,
      interviewPlace: this.data.detailInfo.interviewAddress,
      jobId: this.data.detailInfo.jobId,
      userId: app.globalData.userId,
      videoId: this.data.videoId,
      platfrom: "miniProgram"
    };
    //投递简历
    senLikeJob(tempData)
      .then(res => {
        wx.showToast({
          title: '投递成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
        app.globalData.needRefreshHistory = true;
      })
      .catch(err => { });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu();
    this.setData({
      fromShare:app.globalData.fromShare
    })
    if (options.videoId) {
      this.data.videoId = options.videoId;
    }
    this.getJobDetail(options.jobId)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.needAutoSendJob) {
      app.globalData.needAutoSendJob = false;
      this.sendLike();
    }
  }
})
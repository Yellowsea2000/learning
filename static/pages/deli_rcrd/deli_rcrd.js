import {
  getJobHistoryMine
} from "../../utils/api.js";
import util from "../../utils/util.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    totalPage: 1,
    listData: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDatas();
  },
  totel(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel //仅为示例，并非真实的电话号码
    })
  },
  getDatas() {
    getJobHistoryMine(this.data.page).then(res => {
      this.data.totalPage = res.data.pages;
      if (this.data.page == 1) {
        this.data.listData = [];
      }
      res.data.records.forEach(item => {
        item.createTimeShow = util.fmtDate(item.createTime);
        if (item.welfare) {
          if (item.welfare) {
            item.welfare = item.welfare.replace(/,/g, " | ");
          }
        }
        if (item.workAddressList) {
          item.workAddress = ""
          item.workAddressList.forEach(item2 => {
            item.workAddress += item2 + " "
          })
        }
        switch (item.status) {
          case "P1":
            item.class = "bgyellow";
            item.statusShow = "待面试";
            break;
          case "P2":
            item.class = "bggreen";
            item.statusShow = "初面通过";
            break;
          case "P3":
            item.class = "bggreen";
            item.statusShow = "面试通过";
            break;
          case "P4":
            item.class = "";
            item.statusShow = "初面不通过";
            break;
          case "P5":
            item.class = "bgred";
            item.statusShow = "通过";
            break;
          case "P6":
            item.class = "bgred";
            item.statusShow = "通过";
            break;
          case "P7":
            item.class = "";
            item.statusShow = "复面不通过";
            break;
          case "P8":
            item.class = "bgred";
            item.statusShow = "通过";
            break;  
        }
        this.data.listData.push(item);
      });
      this.setData({
        listData: this.data.listData
      })
    })
      .catch(err => { });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.page = 1;
    this.getDatas() //SA获取列表
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.page >= this.data.totalPage) {
      return;
    } else {
      this.data.page++;
      this.getDatas() //SA获取列表
    }
  }
})
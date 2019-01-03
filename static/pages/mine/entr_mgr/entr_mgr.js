// pages/mine/records/records.js
let app = getApp()
import {
  getEmployeeListByMgr,
  getjobRecords,
  upUserJobState
} from "../../../utils/api.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    chekeIndex: 1,
    listData1: null,
    listData2: null,
    totalPage1: 1,
    totalPage2: 1,
    page1: 1,
    page2: 1
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getDatas(this.data.page1, 'P5');
    this.getDatas(this.data.page2, 'P8');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },
  onChange(e) {
    this.setData({
      chekeIndex: e.detail.index + 1
    })
  },
  // btnClick(e) {
  //   var tempStatus = "";
  //   var tempData = e.detail;
  //   switch (tempData.mType) {
  //     case 5:
  //       tempStatus = 'P5';
  //       break;
  //     default:
  //       break;
  //   }
  //   if (tempData.mType != 3) {
  //     this.upStatus(tempData.mItem.id, tempStatus)
  //   }
  // },
  // upStatus(id, statu) {
  //   upUserJobState(id, statu)
  //     .then(res => {
  //       switch (statu) {
  //         case 'P5':
  //           this.getDatas(1, this.data.page1, 'P6');
  //           this.getDatas(2, this.data.page2, 'P5');
  //           this.setData({
  //             active: 1,
  //             chekeIndex: 2,
  //           })
  //           break;
  //         default:
  //           break;
  //       }
  //     })
  //     .catch(err => {});
  // },

  //P5已入职 p8未入职
  getDatas(page, status) {
    getjobRecords(page, status)
      .then(res => {
        if (status == 'P8') {
          
          this.data.totalPage1 = res.data.pages;
          if (this.data.page1 == 1) {
            this.data.listData1 = [];
          }
          res.data.records.forEach(item => {
            // item.createTimeShow = item.createTime.substring(0, 10);
        
            item.createTimeShow = item.createTime.substring(0, 10);
            this.data.listData1.push(item);
          });
          this.setData({
            listData1: this.data.listData1
          })
        }
        if (status == 'P5') {
          this.data.totalPage2 = res.data.pages;
          if (this.data.page2 == 1) {
            this.data.listData2 = [];
          }
          res.data.records.forEach(item => {
            item.createTimeShow = item.createTime.substring(0, 10);
            this.data.listData2.push(item);
          });
          this.setData({
            listData2: this.data.listData2
          });

        }
      })
      .catch(err => {});
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log("下拉了")
    switch (this.data.chekeIndex) {
      case 1:
        this.data.page1 = 1;
        this.getDatas(this.data.page1,  'P8');
        break;
      case 2:
        this.data.page2 = 1;
        this.getDatas(this.data.page2, 'P5');
        break;
      default:
        break;
    }
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
          this.getDatas(this.data.page1, 'P8');
        }
        break;
      case 2:
        if (this.data.page2 >= this.data.totalPage2) {
          return;
        } else {
          this.data.page2++;
          this.getDatas(this.data.page2, 'P5');
        }
        break;
      default:
        break;
    }
  }
})
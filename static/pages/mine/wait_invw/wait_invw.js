// pages/mine/records/records.js
let app = getApp()
import {
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
    listData3: null,
    totalPage1: 1,
    totalPage2: 1,
    totalPage3: 1,
    page1: 1,
    page2: 1,
    page3: 1
  },
  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {
    this.getDatas(1, this.data.page1);
    this.getDatas(2, this.data.page2);
    this.getDatas(3, this.data.page3);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  onChange(e) {
    this.setData({
      chekeIndex: e.detail.index + 1
    })
  },
  btnClick(e) {
    var tempStatus = "";
    var tempData = e.detail;
    switch (tempData.mType) {
      case 1:
        tempStatus = 'P2';
        break;
      case 2:
        tempStatus = 'P4';
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/mine/wait_invw/pass_edit/pass_edit?item=' + JSON.stringify(tempData.mItem)
        })
        break;
      case 4:
        tempStatus = 'P7';
        break;
      default:
        break;
    }
    if (tempData.mType != 3) {
      this.upStatus(tempData.mItem.id, tempStatus)
    }
  },
  upStatus(id, statu) {
    upUserJobState(id, statu)
      .then(res => {
        switch (statu) {
          //初面通过
          case 'P2':
            this.getDatas(1, this.data.page1);
            this.getDatas(2, this.data.page2);
            this.setData({
              active: 1,
              chekeIndex: 2,
            })
            break;
            //初面面试失败
          case 'P4':
            this.getDatas(1, this.data.page1);
            this.getDatas(3, this.data.page3);
            this.setData({
              active: 2,
              chekeIndex: 3
            })
            break;
            //复试面试失败
          case 'P7':
            this.getDatas(2, this.data.page2);
            this.getDatas(3, this.data.page3);
            this.setData({
              active: 2,
              chekeIndex: 3
            })
            break;
          default:
            break;
        }
      })
      .catch(err => { });
  },
  getDatas(index, page) {
    getjobRecords(page, index)
      .then(res => {
        if (index == 1) {
          this.data.totalPage1 = res.data.pages;
          if (this.data.page1 == 1) {
            this.data.listData1 = [];
          }
          res.data.records.forEach(item => {
            item.createTimeShow = item.createTime.substring(0, 10);
            this.data.listData1.push(item);
          });
          this.setData({
            listData1: this.data.listData1
          })
        }
        if (index == 2) {
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
          })
        }
        if (index == 3) {
          this.data.totalPage3 = res.data.pages;
          if (this.data.page3 == 1) {
            this.data.listData3 = [];
          }
          res.data.records.forEach(item => {
            item.createTimeShow = item.createTime.substring(0, 10);
            this.data.listData3.push(item);
          });
          this.setData({
            listData3: this.data.listData3
          })
        }
      })
      .catch(err => { });
  },
 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    switch (this.data.chekeIndex) {
      case 1:
        this.data.page1 = 1;
        this.getDatas(1, this.data.page1);
        break;
      case 2:
        this.data.page2 = 1;
        this.getDatas(2, this.data.page2);
        break;
      case 3:
        this.data.page3 = 1;
        this.getDatas(3, this.data.page3);
        break;
      default:
        break;
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    switch (this.data.chekeIndex) {
      case 1:
        if (this.data.page1 >= this.data.totalPage1) {
          return;
        } else {
          this.data.page1++;
          this.getDatas(1, this.data.page1);
        }
        break;
      case 2:
        if (this.data.page2 >= this.data.totalPage2) {
          return;
        } else {
          this.data.page2++;
          this.getDatas(2, this.data.page2);
        }
        break;
      case 3:
        if (this.data.page3 >= this.data.totalPage3) {
          return;
        } else {
          this.data.page3++;
          this.getDatas(3, this.data.page3);
        }
        break;
      default:
        break;
    }
  }
})
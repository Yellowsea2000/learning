// pages/mine/records/records.js
let app = getApp()
import {
  getAdmJobRecords,
  upUserJobState
} from "../../../utils/api.js";

import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog';
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
    showModal:false,
    itemId:'',//未入职时的id
    notEntryReason:''//未入职的原因
  },
  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {
    this.getDatas(1, this.data.page1, 'P6');
    this.getDatas(2, this.data.page2, 'P5');
    this.getDatas(3, this.data.page3, 'P8');
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



  modalConfirm() {

    if(!this.data.notEntryReason) {
      wx.showToast({
        title: '未通过原因不能为空',
        icon: 'none',
        duration: 1000
      });
      this.setData({
        showModal:false
      });
      return;
    }
    this.upStatus(this.data.itemId, 'P8');
    this.setData({
      showModal:false,
      notEntryReason:''
    });
    
  },
  modalCancel() {
    this.setData({
      showModal:false,
      notEntryReason:''
    });
  },
  btnClick(e) {
    var tempStatus = "";
    var tempData = e.detail;
    if (tempData.mType === 6) {
      this.setData({
        itemId:tempData.mItem.id
      });
      this.setData({
        showModal:true
      });
      return;
    }
 
    switch (tempData.mType) {
      case 5:
        tempStatus = 'P5';
        break;
      default:
        break;
    }
    if (tempData.mType != 3) {
      this.upStatus(tempData.mItem.id, tempStatus)
    }
  },
  upStatus(id, statu) {
    upUserJobState(id, statu, this.data.notEntryReason)
      .then(res => {
        switch (statu) {
          case 'P5':
            this.getDatas(1, this.data.page1, 'P6');
            this.getDatas(2, this.data.page2, 'P5');
            this.setData({
              active: 1,
              chekeIndex: 2,
            });
            break;
          case 'P8':
          this.getDatas(1, this.data.page1, 'P6');
          this.getDatas(3, this.data.page2, 'P8');
          this.setData({
            active: 2,
            chekeIndex: 3,
          });
          break;
          default:
            break;
        }
      })
      .catch(err => { });
  },
  getRemark(e) {
    this.setData({
      notEntryReason:e.detail.value
    });
  },
  getDatas(index, page,status) {
    getAdmJobRecords(page, status)
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
          });
          console.log(this.data.listData3)
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
        this.getDatas(1, this.data.page1,'P6');
        break;
      case 2:
        this.data.page2 = 1;
        this.getDatas(2, this.data.page2, 'P5');
        break;
      case 3:
        this.data.page3 = 1;
        this.getDatas(3, this.data.page3, 'P8');
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
          this.getDatas(1, this.data.page1, 'P6');
        }
        break;
      case 2:
        if (this.data.page2 >= this.data.totalPage2) {
          return;
        } else {
          this.data.page2++;
          this.getDatas(2, this.data.page2, 'P5');
        }
        break;
        case 3:
        if (this.data.page3 >= this.data.totalPage3) {
          return;
        } else {
          this.data.page3++;
          this.getDatas(3, this.data.page3, 'P8');
        }
        break;
      default:
        break;
    }
  }
})
import {getReviewList,getContractInfo, getContractTemplateByFactory, sendContract } from '../../../utils/api';

const STATUS_PENDING = 400; //待发合同
const STATUS_DONE = 525; //已发合同
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    checkIndex: 0,

    listPending: [],  //未签约列表
    listDone: [],   //已签约列表
    
    //总页数
    totalPagePending: 1,
    totalPageDone: 1,

    //当前页数
    currentPagePending: 1,
    currentPageDone: 1,
    isShowModal:false,

    userIdArr:[] //选中的用户id
  },


  checkboxChange(e) {
    this.data.listPending.forEach( item =>{
      if (item.userId === e.detail.userId) {
        item.checked = e.detail.checked;
      }
    });

    this.setData({
      listPending:this.data.listPending
    });
     
  },

  onChange(e) {
    this.setData({
      checkIndex: e.detail.index
    })
  },
  
  //发送签约按钮
  sendSign() {
    this.data.userIdArr = [];
    this.data.listPending.forEach(item =>{
     if(item.checked) {
       this.data.userIdArr.push(item.userId)
     }
   });
   if(!this.data.userIdArr.length) {
    wx.showToast({
      title: "至少选择一项。",
      icon: 'none',
      duration: 2000
    })
    return;
   }
    this.setData({
      isShowModal:true
    });
  },

  

  submit(e) {
    let data = e.detail;
    let that = this;
    data.userId = this.data.userIdArr;
 
  sendContract(data).then( res =>{
    if (res.code == 200) {
      wx.showToast({
        title: "发送合同成功",
        icon: 'success',
        duration: 2000
      });
      that.getDataList(1, STATUS_PENDING);
      that.getDataList(1, STATUS_DONE);
    }
  })
    this.setData({
      isShowModal:false,
      active:1
    });
    
  },
  
  cancel() {
    this.setData({
      isShowModal:false
    })
  },
  getDataList(page, EntryStatus) {
    getReviewList(page, EntryStatus).then(res =>{
      if( EntryStatus === STATUS_PENDING) {
        if (this.data.currentPagePending == 1) {
          this.data.listPending = [];
        }
        this.data.totalPagePending = res.data.pages;
        res.data.records.forEach(item => {
          item.headPic = item.headImgUrl;
          item.checked = false;
          this.data.listPending.push(item);
        });
        this.setData({
          listPending:this.data.listPending
        });

      
        
      } else if (EntryStatus === STATUS_DONE) {
        if (this.data.currentPageDone == 1) {
          this.data.listDone = [];
        }
        this.data.totalPageDone = res.data.pages;
        res.data.records.forEach(item => {
          item.headPic = item.headImgUrl;
          item.checked = false;
          this.data.listDone.push(item);
        });
        this.setData({
          listDone:this.data.listDone
        });
    
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
    this.getDataList(1, STATUS_PENDING);
    this.getDataList(1, STATUS_DONE);

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
    if(!this.data.checkIndex) {
      this.data.currentPagePending = 1;
      this.getDataList(1, STATUS_PENDING);
    } else {
      this.data.currentPageDone = 1;
      this.getDataList(1, STATUS_DONE);
    }
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    switch (this.data.checkIndex) {
      case 0:
        if (this.data.currentPagePending >= this.data.totalPagePending) {
          return;
        } else {
          this.data.currentPagePending++;
          this.getDataList(this.data.currentPagePending, STATUS_PENDING);
        }
        break;
      case 1:
        if (this.data.currentPageDone >= this.data.totalPageDone) {
          return;
        } else {
          this.data.currentPageDone++;
          this.getDataList(this.data.currentPageDone, STATUS_DONE);
        }
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
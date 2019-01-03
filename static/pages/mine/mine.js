// pages/mine/mine.js
const app = getApp()
import {
  initMinePage,
  postResign,
  getIsOcrRule,
  getEntryInfo
} from "../../utils/api.js";
import util from "../../utils/util.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigatetionStyle: {
      backgroundColor: '#CF2B3F',
      color: '#FFFFFF'
    },
    entryStatus:'',
    obj: null,
    showLoading: true,
    date: "", //辞工日期
    endDate: util.getNowFormatDate(),
    isAuth: true, //是否已授权
    waitFaceCount: 0, //待面试数量
    waitIntoCount: 0, //入职待管理数量
    tabBarArr: [],
    ocrUrl: '', //OCR流程地址
    entryHand: '', //求职者入职状态 
    pengingEntryNum: 0, //审核管理数量
    waitingContractNum:0 //未签约数量
  },
  onLoad: function() {
    
    this.setData({
      tabBarArr: app.tabBar
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getDatasMine();
    this.getIsOcrRuleInfo(); //判断OCR流程
    this.getUserEntryInfo();
  },
  closeAuth() {
    this.setData({
      isAuth: true
    });
  },
  bindDateChange: function(e) { //选择辞工日期
    console.log('picker发送选择改变，携带值为', e.detail.value)
    wx.showModal({
      title: '提示',
      content: `是否确定于${e.detail.value}离职?`,
      success: (res) => {
        if (res.confirm) {
          this.setData({
            date: e.detail.value
          })
          this.postResign();
        }
      }
    })
  },
  postResign() {
    let date = this.data.date.replace(/-/g, "")
    postResign(date).then(res => {
      wx.showToast({
        title: '辞工成功',
        icon: 'none',
        duration: 2000
      })
    })
  },
  getDatasMine() { //初始化我的页面
    initMinePage().then(res => {
        var tempCount = res.data.storeRecordNum || 0;
        var tempCount2 = res.data.factoryRecordNum || 0;
        var tempCount3 = res.data.pengingEntryNum || 0;
        app.globalData.userInfo = res.data.userInfo;
        this.setData({
          showPage: true,
          waitFaceCount: tempCount,
          waitIntoCount: tempCount2,
          pengingEntryNum: tempCount3,
          waitingContractNum:res.data.waitingContractNum,
          obj: res.data,
          isAuth: res.data.userInfo.authorization, //是否已授权
          isComplete: res.data.userInfo.completed, //是否已认证
          showLoading: false
        });

      })
      .catch(err => {});
  },
  getIsOcrRuleInfo() { //判断进行OCR的流程
    var userId = app.globalData.userId
    getIsOcrRule(userId).then(res => {
      // this.setData({
      //   ocrUrl: '/pages/mine/join_hand/join_hand'
      // })
      if (res.code == 200 && res.data) {
        if (res.data.enableOcrIdcard == 1) {
          this.setData({ //允许OCR
            ocrUrl: `/pages/mine/join_hand/join_hand?enableFaceDetect=${res.data.enableFaceDetect}&enableOcrBankcard=${res.data.enableOcrBankcard}`
          });
          return;
        } else if (res.data.enableFaceDetect == 1) { //允许人脸识别
          this.setData({
            ocrUrl: '/pages/mine/join_hand/pers_face/pers_face'
          });
          return;
        } else if (res.data.enableOcrBankcard == 1) { //允许银行卡
          this.setData({
            ocrUrl: '/pages/mine/join_hand/pers_bank/pers_bank'
          });
          return;
        } else {
          this.setData({ //不允许OCR全流程
            ocrUrl: '/pages/mine/join_hand/pers_info/pers_info'
          });
          return;
        }
      } else {
        this.setData({ //默认
          ocrUrl: '/pages/mine/join_hand/pers_info/pers_info'
        })
      }
    })
  },
  //获取入角色的入职状态
  getUserEntryInfo: function() {
    var userId = app.globalData.userId;
    var that = this;
    getEntryInfo(userId).then(res => {
      if (res.code == 200 && res.data) {
        that.setData({
          entryStatus: res.data.entryStatus
        });
      } else {
        that.setData({
          entryStatus: ''
        });
      }
    })
  },
  clickCell: function() {
    wx.showModal({
      title: '审核失败',
      content: '请联系门店管理员'
    })
  }
})
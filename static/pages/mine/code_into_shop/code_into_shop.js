// pages/mine/code_into_shop/code_into_shop.js
import {
  getStoreInfo,
  submitPersonInfo,
  initMinePage
} from '../../../utils/api.js'
import util from "../../../utils/util.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChecked: true,
    realName: null,
    sex: 1,
    tel: null,
    birthDay: null,
    showLoading: true,
    shopInfo: null, //扫码获得的店铺信息
    endDate: util.getNowFormatDate(),
  },
  getName(e) {
    this.setData({
      realName: e.detail
    })
  },
  //手机号
  getPhoneNumber(e) {
    app.getPhoneNumber(e.detail.encryptedData, e.detail.iv);
    app.getPhoneNumberCallback = res => {
      if (res.data) {
        this.setData({
          tel: res.data
        })
      }
    };
  },
  bindDateChange: function(e) { //选择辞工日期
    this.setData({
      birthDay: e.detail.value
    })
  },
  submit() {
    if (this.cheackForm()) {
      this.addInfo();
    }
  },
  addInfo() {
    let tempData = {
      belongRegion: this.data.shopInfo.belongRegion,
      birthday: this.data.birthDay,
      tel: this.data.tel,
      realName: this.data.realName,
      sex: this.data.sex,
      storeId: this.data.shopInfo.storeId,
      storeName: this.data.shopInfo.storeName,
      userId: app.globalData.userId
    }
    submitPersonInfo(tempData)
      .then(res => {
        this._upDateUserInfo();
      });
  },
  _upDateUserInfo(){
    initMinePage().then(res => {
      app.globalData.userInfo = res.data.userInfo;
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 1000
      });
      setTimeout(() => {
        wx.redirectTo({
          url: "/pages/home/home"
        });
      }, 1000)
    })
      .catch(err => { });
  },
  toProtocol() {
    this.protocol.show();
  },
  chooseSex(e) {
    this.setData({
      sex: e.currentTarget.dataset.item
    })
  },
  onShow(){
    if (app.globalData.userInfo&&app.globalData.userInfo.completed) {
      wx.reLaunch({
        url: '/pages/home/home',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    this.protocol = this.selectComponent("#protocol");
    if (e.scene) {
      this._getShopInfo(e.scene)
    }
    // this._getShopInfo('s123456')
  },
  _getShopInfo(shopId) {
    app.loginCallback = res => {
      if (app.globalData.userInfo.completed) {
        wx.reLaunch({
          url: '/pages/home/home',
        })
      } else {
        getStoreInfo(shopId)
          .then(res => {
            this.setData({
              shopInfo: res.data,
              showLoading: false
            });
          })
      }
    };
  },
  checkboxChange(e) {
    if (e.detail.value.length) {
      this.setData({
        isChecked: true
      })
    } else {
      this.setData({
        isChecked: false
      })
    }
  },
  cheackForm() {
    if (!this.data.realName) {
      wx.showToast({
        title: "请输入真实姓名",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!this.data.tel) {
      wx.showToast({
        title: "未获取手机号码",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!this.data.birthDay) {
      wx.showToast({
        title: "请选择出生年月",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!this.data.isChecked) {
      wx.showToast({
        title: "未同意用户服务协议",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    return true;
  },
})
// pages/mine/storeQrcode/storeQrcode.js

const app = getApp();
let wx_service_url = app.config.wx_service_url;
import {
  getStoreId,
  getStoreQrCode
} from '../../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ''
  },
  creatQRcode(storeId) {
    this.setData({
      url: getStoreQrCode(storeId)
    })
  },
  _getStroeId() {
    getStoreId().then(res => {
      this.creatQRcode(res.data[0].storeId);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._getStroeId();
  }
})
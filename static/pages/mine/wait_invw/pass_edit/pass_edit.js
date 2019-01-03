let app = getApp()
import {
  getCompanys,
  getAdministrators,
  selectAdministrator,
  upUserJobState
} from "../../../../utils/api.js";
import util from "../../../../utils/util.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: null,
    company: null,
    companysData: null,
    companysDataShow: [],
    amd: null,
    amdsData: null,
    amdsDataShow: [],
  },
  submit() { //确认提交
    if (!this.data.company) {
      wx.showToast({
        title: "请选择公司",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!this.data.amd) {
      wx.showToast({
        title: "请选择驻厂管理员",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var params = {
      recordId: this.data.item.id,
      companyId: this.data.company.companyId,
      companyAdminId: this.data.amd.companyAdminId
    }
    selectAdministrator(params).then(res => {
      wx.navigateBack({})
    })
  },
  companyPickerChange(e) { //设置选择的公司数据
    this._getAdministrators(this.data.companysData[e.detail.value].companyId)
    this.setData({
      amd: null,
      company: this.data.companysData[e.detail.value]
    })
  },
  admPickerChange(e) { //设置管理员的数据
    this.setData({
      amd: this.data.amdsData[e.detail.value]
    })
  },
  chooseAdmin() {},
  _getCompanys(storeId) { //获取公司数据
    getCompanys(storeId).then(res => {
        this.data.companysDataShow = [];
        res.data.forEach(item => {
          this.data.companysDataShow.push(item.companyName)
        })
        this.setData({
          companysData: res.data,
          companysDataShow: this.data.companysDataShow
        })
      })
      .catch(err => {});
  },
  _getAdministrators(companyId) { //获取驻场管理员数据
    getAdministrators(companyId).then(res => {
        this.data.amdsDataShow = [];
        res.data.forEach(item => {
          this.data.amdsDataShow.push(item.companyAdminName)
        })
        this.setData({
          amdsData: res.data,
          amdsDataShow: this.data.amdsDataShow
        })

      })
      .catch(err => {});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    this.setData({
      item: JSON.parse(e.item),
      itemList: JSON.parse("[" + e.item + "]")
    })
    this._getCompanys(this.data.item.storeId)
  }
})
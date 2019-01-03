import Util from "../../../utils/util.js"
const app = getApp()
import {
  addUserInfo,
} from "../../../utils/api.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowDate:'',
    btnShow: "确定",
    name: null,
    tel: null,
    sex: 1,
    birthDay: "请选择出生年月",
    today: Util.getToday(),
    isChecked: true,
    isShowModal:false,  //是否显示弹框
  },
  submit() {
    if (this.cheackForm()) {
      this.addUserInfo();
    }
  },
  getTelNumber(e) {
    this.data.tel = e.detail.value
  },
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
  back() {
    wx.showToast({
      title: '保存成功！',
      icon: 'success',
      duration: 1000
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    }, 1000)
  },
  addUserInfo() {
    var tempData = {
      phone: this.data.tel,
      realName: this.data.name,
      sex: this.data.sex,
      birthday: this.data.birthDay,
      isAgreeAuthoize: 1
    };
    //添加个人信息
    addUserInfo(tempData)
      .then(res => {
        app.globalData.userInfo = res.data;
          this.back();
      })
      .catch(err => { });
  },
  toProtocol() {
    this.protocol.show();
  },
  getUserName(e) {
    this.data.name = e.detail.value
  },
  chooseSex(e) {
    this.setData({
      sex: e.currentTarget.dataset.item
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      birthDay: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.protocol = this.selectComponent("#protocol");
    this.setData({
      nowDate:Util.getNowFormatDate()
    })
  },

  

  showModal() {
    this.setData({
      isShowModal:true
    });
  },

  cancel() {
    this.setData({
      isShowModal:false
    });
  },

  editPhone(e) {
    this.cancel();
    this.setData({
      tel:e.detail
    });
  },
  cheackForm() {
    if (!this.data.name) {
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
    if (this.data.birthDay == "请选择出生年月") {
      wx.showToast({
        title: "请选择出生年月",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!this.data.isChecked) {
      wx.showToast({
        title: "未同意个人信息使用授权书",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    return true;
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
  }
})
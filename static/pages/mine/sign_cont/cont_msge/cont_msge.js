const app = getApp()
import {
  getIdentifyingCode,
  signSendPhoneMsg,
  checkSignAndSeal
} from "../../../../utils/api.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nextBtn:true,
    countdown: -1,
    isSend: false,
    phoneNum: '',
    realName: '',
    challengeCode: '',
    isSign: false,
    msgCode: '', //验证码
    msgObj: { //成功页面的显示配置
      title: '签署成功',
      desc: '您现在可以在线查看合同',
      btnTitle: '查看合同',
      clickUrl: '/pages/mine/sign_cont/sign_cont'
    }
  },
  //60秒倒计时
  setTime60s: function() {
    var that = this;
    if (this.data.countdown < 0) {

    } else {
      this.setData({
        countdown: this.data.countdown - 1
      })
      setTimeout(function() {
        that.setTime60s();
      }, 1000)
    }
  },
  //验证码输入
  onChange: function(e) {
    var value = e.detail.value;
    this.setData({
      msgCode: value
    })
  },
  //校验
  isRule: function() {
    if (this.data.msgCode == '') {
      return '验证码不能为空';
    } else if (!(this.data.msgCode === this.data.challengeCode)){
      return "验证码错误"
    }else {
      return true;
    }
  },
  //下一步
  next: function() {
    var rule = this.isRule();
    this.setData({
      nextBtn:false
    })
    if (rule === true) {
      var msgObj = JSON.stringify(this.data.msgObj); //生成成功页面的配置信息
      this.checkchallengeCode(this.data.msgCode, msgObj); //校验挑战码
    } else {
      wx.showToast({
        title: rule,
        icon: 'none',
        duration: 2000
      })
    }

  },
  //点击获取
  getChallengeCode: function() {
    var that = this;
    this.setData({
      countdown: 60,
      isSend: true
    })
    this.setTime60s();
    //获取挑战码
    getIdentifyingCode(this.data.phoneNum).then(res => {
      if (res.code == 200 && res.data) {
        that.setData({
          challengeCode: res.data
        })
        that.sendMsgCode();
      } else {
        var err = res.remark ? res.remark : '服务异常'
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //获取短信验证码
  sendMsgCode: function() {
    var that = this;
    var params = {
      "paramsMap": {
        "value0": this.data.realName,
        "value1": this.data.challengeCode,
        "value2": this.data.company,
        "value3": "劳动合同"
      },
      "phoneNums": [
        this.data.phoneNum
      ],
      "sendCode": "CHALLENGE_CODE"
    }
    //获取验证码
    signSendPhoneMsg(params).then(res => {
      if (res.code == 200 && res.data) {

      } else {
        var err = res.remark ? res.remark : '服务异常'
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  checkchallengeCode: function(code, obj) {
    var that = this;
    checkSignAndSeal(code).then(res => {
      if (res.code == 200 && res.data == true) { //合同签署成功
        //成功！跳转成功页面
        that.setData({
          nextBtn: true
        })
        wx.redirectTo({
          url: '/component/msg_success/index?msgObj=' + obj,
        })
      } else {
        var err = res.remark ? res.remark : '服务异常'
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
        that.setData({
          nextBtn: true
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      realName: app.globalData.userInfo.realName,
      phoneNum: app.globalData.userInfo.phone,
      company: app.globalData.company
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  }
})
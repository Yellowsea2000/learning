// pages/mine/join_hand/pers_bank/pers_bank.js
const app = getApp()
import {
  bankUpload,
  getUserExtraInfo,
  nextUserExtraInfo
} from "../../../../utils/api.js";
import util from "../../utils/util.js"; //mine页面下的方法库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    bankcardNo: '',
    bankCardDeposit: '',
    isBankUrl: false,
    isLoading: false,
    bankUrl: '',
    inputSetting: [{
      type: 'number',
      selfType: 'input',
      title: '银行卡号',
      placeholder: '请输入银行卡号',
      name: 'bankCard'
    }, {
        type: 'text',
      selfType: 'input',
      title: '开户银行',
      placeholder: '请输入开户银行',
      name: 'bankCardDeposit'
    }],
    persInfo:{
      bankCard:'',
      bankUrl:'',
      bankCardDeposit:''
    },
    submit: {
      userId: '',
      bankCard: '',
      bankCardDeposit: '',
      bankUrl: '',
      resultFlag: 0, //ocr成功否'0'成功，非'0'失败
      changeFlag: 0, //照片是否改变'0'不变，非'0'改变
      stepType: 'bank' //进行到哪一步'idcard','face','bank'
    }
  },
  //页面数据初始化
  initData: function() {
    this.setData({
      userId: app.globalData.userId
    })
    this.getBankData();
  },
  //获取银行卡的数据
  getBankData: function() {
    var that = this;
    getUserExtraInfo(this.data.userId).then(res => {
      if (res.code == 200) {
        if (Object.keys(res.data).length) {
          res.data.bankUrl = res.data.bankUrl ? res.data.bankUrl + '?' + Math.random() / 9999:'';
          // that.setData({
          //   ['submit.bankUrl']: res.data.bankUrl ? res.data.bankUrl : '',
          //   bankcardNo: res.data.bankCard ? res.data.bankCard : '',
          //   bankUrl: res.data.bankUrl ? res.data.bankUrl : '',
          //   bankCardDeposit: res.data.bankCardDeposit ? res.data.bankCardDeposit : '',
          // })
          that.setData({
            ['submit.bankUrl']: res.data.bankUrl ? res.data.bankUrl : '',
            persInfo:res.data
          })
        } else {
          wx.showToast({
            title: '请填写数据',
            icon: 'none',
            duration: 1000
          })
        }
      } else {
        wx.showToast({
          title: res.remark ? res.remark : '服务异常',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //银行卡号码，开户银行输入
  onChange: function(e) {
    var persInfoKey = 'persInfo.' + e.currentTarget.dataset.name
    var value = e.detail.value;
    this.setData({
      [persInfoKey]: value
    })
  },
  //点击上传银行卡
  cameraMethods: function(e) {
    var that = this;
    var userId = app.globalData.userId;
    if(this.data.submit.resultFlag<3){
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], //图片质量
        sourceType: ['album', 'camera'], //图片来源
        success(res) {
          that.picUpload(userId, res.tempFilePaths[0])
          that.setData({
            isLoading: true
          })
          wx.showLoading({
            title: '银行卡上传中',
            mask: true
          })
          that.setData({
            ['persInfo.bankUrl']: res.tempFilePaths[0],
            isBankUrl: true
          })
        },
        fail(err) {
          console.log(err, "上传银行卡照片错误")
        }
      })
    }else{
      wx.showToast({
        title: '银行卡扫描失败，请手动填写信息后点击下一步',
        icon: 'none',
        duration: 2000
      })
    }
    
  },
  //上传银行卡图片
  picUpload: function(userId, picUrl) {
    var that = this
    wx.uploadFile({
      url: bankUpload(userId), //服务器地址
      filePath: picUrl,
      header: {
        "Content-Type": "multipart/form-data"
      },
      name: 'file',
      formData: {},
      success(res) {
        var data = JSON.parse(res.data)
        if (data.code == 200) {
          that.setData({
            ['submit.bankUrl']: data.data.fileUrl,
            ['submit.changeFlag']: 1,
            isLoading: false
          })
          if (data.data.ocrInfo.code == 0 && data.data.ocrInfo.result) {
            //成功，重置页面数据
            that.setData({
              ['persInfo.bankCard']: data.data.ocrInfo.result.bankcardNo,
              ['submit.resultFlag']: 0,    
            });
            wx.hideLoading();
            wx.showToast({
              title: '银行卡识别成功 ',
              icon: 'success',
              duration: 2000
            });
          } else {
            that.setData({
              ['submit.resultFlag']: that.data.submit.resultFlag + 1
            });
            var errInfo = that.data.submit.resultFlag < 3 ? '识别失败' : '银行卡扫描失败，请手动填写信息后点击下一步';
            wx.hideLoading();
            wx.showToast({
              title: errInfo,
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          that.setData({
            isLoading: false,
            ['submit.resultFlag']: that.data.submit.resultFlag + 1
          })
          var errInfo = that.data.submit.resultFlag < 3 ? '识别失败' : '银行卡扫描失败，请手动填写信息后点击下一步';
          wx.hideLoading();
          wx.showToast({
            title: errInfo,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail(err) {
        that.setData({
          isLoading: false,
        })
        wx.hideLoading();
        wx.showToast({
          title: '识别失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //校验提交数据是否合法
  isRule: function() {
    var isbank = util.isBankCard(this.data.persInfo.bankCard);
    var regBankName = /^[\u4e00-\u9fa5]+$/;
    if (!this.data.persInfo.bankUrl) {
      return '请上传银行卡照片';
    } else if (!regBankName.test(this.data.persInfo.bankCardDeposit)) {
      return '开户银行输入非法';
    } else if (0 < this.data.submit.resultFlag && this.data.submit.resultFlag < 3) {
      return '银行卡照片上传失败，请重新上传';
    } else if (isbank != '验证通过') {
      return '银行卡号输入非法'
    } else if (this.data.submit.resultFlag == 3) {
      wx.showToast({
        title: ' 银行卡扫描失败，请手动填写信息后点击下一步',
        icon: 'none',
        duration: 2000
      });
      return true;
    }else {
      return true;
    }
  },
  //下一步
  next: function() {
    var isErr = this.isRule();
    if (isErr === true) {
      this.submit();
    } else {
      wx.showToast({
        title: isErr,
        icon: 'none',
        duration: 2000
      })
    }
  },
  submit: function() {
    this.setData({
      ['submit.bankCard']: this.data.persInfo.bankCard,
      ['submit.bankCardDeposit']: this.data.persInfo.bankCardDeposit,
      ['submit.userId']: this.data.userId
    })
    nextUserExtraInfo(this.data.submit).then(res => {
      if (res.code == 200) {
        wx.redirectTo({
          url: '/pages/mine/join_hand/pers_info/pers_info',
        })
      } else {
        var remark = remark ? remark : '提交数据异常';
        wx.showToast({
          title: remark,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData();
  }
})
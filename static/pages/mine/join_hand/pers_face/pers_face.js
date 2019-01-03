// pages/mine/join_hand/pers_face/pers_face.js
const app = getApp()
import {
  faceUpload,
  getUserExtraInfo,
  nextUserExtraInfo
} from "../../../../utils/api.js";
const ctx = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    faceUrl: '',
    enableOcrBankcard: '',
    userId: '',
    sourceFiles: '',
    neme: '',
    idcard: '',
    ocrStadus: '0', //记录ocr是否成功(成功才可以调人脸识别)
    isLoading: false,
    isFaceUrl: false, //是否有图片
    isCamera: false, //是否授权摄像头
    isFace: '', //是否进行人脸识别
    submit: {
      userId: '',
      faceUrl: '',
      resultFlag: 0, //人脸识别成功否'0'成功，非'0'失败
      changeFlag: 0, //身份证照片是否改变'0'不变，非'0'改变
      stepType: 'face' //进行到哪一步'idcard','face','bank'
    }
  },
  //页面数据初始化
  initData: function(options) {
    this.setData({
      userId: app.globalData.userId,
      enableOcrBankcard: options.enableOcrBankcard ? options.enableOcrBankcard : ''
    })
    this.getFaceData();
  },
  //获取人脸识别的数据
  getFaceData: function() {
    var that = this;
    getUserExtraInfo(this.data.userId).then(res => {
      if (res.code == 200) {
        that.setData({
          sourceFiles: res.data.idCard0Url || '',
          name: res.data.realName,
          idcard: res.data.identityCard,
          ocrStadus: res.data.vlidateIdCard ? res.data.vlidateIdCard : ''
        })
        if (res.data.vlidateFace) {
          //解决图片缓存
          res.data.faceUrl = res.data.faceUrl ? res.data.faceUrl + '?' + Math.random() / 9999 : '';
          that.setData({
            isFaceUrl: true,
            ['submit.faceUrl']: res.data.faceUrl ? res.data.faceUrl : '',
            faceUrl: res.data.faceUrl ? res.data.faceUrl : ''

          })
        } else {
          wx.showToast({
            title: '请进行人脸识别',
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
  error(e) {
    wx.showToast({
      title: '识别失败',
      icon: 'none',
      duration: 2000
    })
  },
  takePhoto: function() {
    if (this.data.submit.resultFlag < 3) {
      var that = this;
      var userId = app.globalData.userId;
      var ctx = wx.createCameraContext();
      ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          wx.showLoading({
            title: '人脸识别中',
            mask: true
          })
          that.picUpload(userId, res.tempImagePath)
          that.setData({
            faceUrl: res.tempImagePath,
            isCamera: false,
            isLoading: true,
            isFaceUrl: true
          })
        }
      })
    } else {
      that.setData({
        isFaceUrl: false,
        isLoading: false
      })
      wx.hideLoading();
      wx.showToast({
        title: '识别失败，请点击下一步',
        icon: 'none',
        duration: 2000
      })
    }

  },
  //重拍
  reTakePhoto: function() {
    if (this.data.submit.resultFlag < 3) {
      this.setData({
        faceUrl: '',
        isCamera: true,
        isFaceUrl: false
      })
    } else {
      wx.showToast({
        title: '识别失败，请点击下一步',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //上传人脸识别图片
  picUpload: function(userId, picUrl) {
    var that = this
    wx.uploadFile({
      url: faceUpload(this.data.sourceFiles, this.data.name, this.data.idcard, userId), //服务器地址
      filePath: picUrl,
      header: {
        "Content-Type": "multipart/form-data"
      },
      name: 'file',
      formData: {},
      success(res) {
        var data = JSON.parse(res.data)
        if (data.code == 200) {
          // OCR识别无论成功或失败，changeFlag都需要改变 by qinxi
          that.setData({
            ['submit.faceUrl']: data.data.fileUrl,
            ['submit.changeFlag']: 1,
            isLoading: false
          })
          if (data.data.ocrInfo.code == 0) {
            that.setData({
              ['submit.resultFlag']: 0
            })
            wx.hideLoading();
            wx.showToast({
              title: '识别成功 ',
              icon: 'success',
              duration: 2000
            })
          } else {
            that.setData({
              ['submit.resultFlag']: that.data.submit.resultFlag + 1 //失败次数不可以超过三次
            })
            var errInfo = that.data.submit.resultFlag < 3 ? '识别失败' : '识别失败，请点击下一步';
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
          var errInfo = that.data.submit.resultFlag < 3 ? '服务异常' : '识别失败，请点击下一步';
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
          isLoading: false
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
  //授权打开摄像头
  getSetting: function() {
    var that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.camera'] && res.authSetting.hasOwnProperty('scope.camera')) {
          var authSetting = res.authSetting
          wx.showModal({
            content: '“永祺招聘”要获取您的摄像头',
            confirmText: '开启授权',
            cancelText: '仍然拒绝',
            success: function(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    that.getSetting();
                    that.setData({
                      isCamera: true
                    })
                  }
                })
              } else if (res.cancel) {
                authSetting['scope.camera'] = false;
              }
            }
          })
        } else {
          that.setData({
            isCamera: true
          })
        }
      }
    })
  },
  //是否进行OCR流程
  isOcrRoad: function() {
    if (this.data.enableOcrBankcard == 1) {
      return '/pages/mine/join_hand/pers_bank/pers_bank'; //允许银行卡校验
    } else {
      return '/pages/mine/join_hand/pers_info/pers_info'; //银行卡识别
    }
  },
  submit: function() {
    var path = this.isOcrRoad();
    this.setData({
      ['submit.userId']: this.data.userId
    })
    nextUserExtraInfo(this.data.submit).then(res => {
      if (res.code == 200) {
        wx.redirectTo({
          url: path,
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
  isRule: function() {
    if (!this.data.faceUrl) {
      return '请进行人脸识别'
    } else if (0 < this.data.submit.resultFlag && this.data.submit.resultFlag < 3) {
      return '人脸识别失败，请重新识别'
    } else {
      return true;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData(options); //页面数据初始化 
  },
  onShow: function() {
    this.getSetting();
  }
})
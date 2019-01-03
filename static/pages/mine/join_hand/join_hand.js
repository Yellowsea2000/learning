const app = getApp()
import {
  idcardUpload,
  getUserExtraInfo,
  nextUserExtraInfo
} from "../../../utils/api.js";
import util from "../utils/util.js"; //mine页面下的方法
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //初始数据
    inputSetting: [{
        type:'idcard',
        selfType: 'input',
        title: '身份证号码',
        placeholder: '请输入身份证号',
        name: 'identityCard'
      }, {
        type: 'text',
        selfType: 'input',
        title: '真实姓名',
        placeholder: '请输入真实姓名',
        name: 'realName'
      },

      {
        selfType: 'picker',
        title: '性别',
        name: 'sex',
        mode: 'selector',
        range: [{
            label: '男',
            value: 1
          },
          {
            label: '女',
            value: 2
          }
        ]
      },
      {
        selfType: 'picker',
        title: '出生年月',
        name: 'birthday',
        mode: 'date',
        start: '',
        end: ''
      },
      {
        type: 'text',
        selfType: 'input',
        title: '户籍地址',
        placeholder: '请输入户籍地址',
        name: 'address'
      }
    ],
    isFrontUrl: false,
    isBackUrl: false,
    frontUrl: '',
    backUrl: '',
    date: '',
    sexShow: '',
    sexArr: [{
        label: '男',
        value: 1
      },
      {
        label: '女',
        value: 2
      }
    ],
    sexIndex: 0,
    ocrStadus: '', //ocr成功失败的状态
    isLoading: false,
    enableFaceDetect: '', //允许人脸识别
    enableOcrBankcard: '', //允许银行卡识别
    persInfo: {
      userId: '',
      identityCard: '',
      realName: '',
      sex: '', //0：男；1：女
      idCard0Url: '',
      idCard1Url: '',
      birthday: '',
      address: ''
    },
    submit: {
      userId: '',
      identityCard: '',
      realName: '',
      sex: '1', //1：男；2：女
      idCard0Url: '',
      idCard1Url: '',
      birthday: '',
      address: '',
      resultFlag: 0, //ocr成功否'0'成功，非'0'失败
      changeFlag: 0, //身份证照片是否改变'0'不变，非'0'改变
      stepType: 'idcard' //进行到哪一步'idcard','face','bank'
    }
  },
  //页面数据初始化
  initData: function(options) {
    this.setData({
      enableFaceDetect: options.enableFaceDetect ? options.enableFaceDetect : '',
      enableOcrBankcard: options.enableOcrBankcard ? options.enableOcrBankcard : '',
      ['submit.userId']: app.globalData.userId,
      ['persInfo.userId']: app.globalData.userId
    })
    this.getIdcardData(); //获取个人信息数据
  },
  //获取身份证的数据
  getIdcardData: function() {
    var that = this;
    getUserExtraInfo(this.data.persInfo.userId).then(res => {
      if (res.code == 200) {
        if (Object.keys(res.data).length) { //如果有数据
          res.data.birthday = res.data.birthday.substring(0, 10);
          //解决图片缓存
          res.data.idCard0Url = res.data.idCard0Url ? res.data.idCard0Url + '?' + Math.random() / 9999 : '';
          res.data.idCard1Url = res.data.idCard1Url ? res.data.idCard1Url + '?' + Math.random() / 9999 : '';
          if (res.data.sex) { //处理性别
            res.data.sex = Number(res.data.sex) - 1;
          }
          that.setData({
            persInfo: res.data,
            ocrStadus: res.data.vlidateIdCard ? res.data.vlidateIdCard : ''
          })
        } else { //初始化没有数据
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
  //点击下一步
  next: function() {
    var isErr = this.isRule();
    if (isErr === true) {
      this.submit(this.data.persInfo);
    } else {
      wx.showToast({
        title: isErr + '',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //设置照片回显
  setIdcardImg: function(type, picUrl) {
    if (type == '0') {
      this.setData({
        frontUrl: picUrl,
        isFrontUrl: true
      })
    } else {
      this.setData({
        backUrl: picUrl,
        isBackUrl: true
      })
    }
  },
  //刷新数据
  forInObject: function(type, obj) {
    var persInfo = this.data.persInfo;
    if (type == '0') { //上传是正面照时，更新数据
      if (Object.keys(obj).length) {
        var birthday = util.dateRule(obj.birth);
        var tempSex = 0;
        if (obj.sex) {
          this.data.sexShow = obj.sex;
          if (obj.sex == '男') {
            tempSex = 0;
          } else if (obj.sex == '女') {
            tempSex = 1;
          }
        }
        this.setData({
          sexShow: this.data.sexShow,
          ['persInfo.identityCard']: obj.idcard,
          ['persInfo.realName']: obj.name,
          ['persInfo.sex']: tempSex,
          ['persInfo.birthday']: birthday,
          ['persInfo.address']: obj.address
        })
      }

    }
  },
  //性别和日期的更改
  bindPickerChange: function(e) {
    var key = e.currentTarget.dataset.name
    var value = e.detail.value;
    var persInfoKey = "persInfo." + key;
    this.setData({
      [persInfoKey]: value
    })

  },
  //身份证号，真实姓名，户籍地址的输入
  onChange: function(e) {
    var persInfoKey = 'persInfo.' + e.currentTarget.dataset.name
    var value = e.detail.value;
    this.setData({
      [persInfoKey]: value
    })
  },
  //预览照片（暂未使用）
  imgPre: function(e) {
    var src = e.currentTarget.dataset.src
    wx.previewImage({
      current: src[0],
      urls: src
    });
  },
  //是否进行OCR流程
  isOcrRoad: function() {
    // return '/pages/mine/join_hand/pers_face/pers_face?enableOcrBankcard='+this.data.enableOcrBankcard;
    if (this.data.enableFaceDetect == 1) { //允许人脸识别
      return '/pages/mine/join_hand/pers_face/pers_face?enableOcrBankcard=' + this.data.enableOcrBankcard;
    } else if (this.data.enableOcrBankcard == 1) { //允许银行卡校验
      return '/pages/mine/join_hand/pers_bank/pers_bank';
    } else {
      return '/pages/mine/join_hand/pers_info/pers_info'; //不允许人脸识别和银行卡识别
    }
  },
  //校验信息是否符合规定
  isRule: function() {
    //校验身份证
    var idcardStatus = util.checkIdcard(this.data.persInfo.identityCard);
    //校验人名
    var isNameRule = util.isName(this.data.persInfo.realName);
    if (!this.data.isFrontUrl && !this.data.persInfo.idCard0Url) {
      return '请上传身份证正面照片';
    } else if (!this.data.isBackUrl && !this.data.persInfo.idCard1Url) {
      return '请上传身份证背面照片';
    } else if (0 < this.data.submit.resultFlag && this.data.submit.resultFlag < 3) {
      return '上传身份证照片失败，请重新上传';
    } else if (idcardStatus != '验证通过') {
      return idcardStatus;
    } else if (!isNameRule) {
      return '姓名输入非法';
    } else if (this.data.persInfo.address == '') {
      return '户籍地址不能为空';
    } else {
      return true;
    }
  },
  //提交数据
  submit: function(obj) {
    var that = this;
    //对提交的数据进行处理
    var submitObj = this.data.submit
    for (let key in submitObj) {
      if (obj[key] && key != 'sex') {
        submitObj[key] = obj[key];
      }
    }
    submitObj.sex = Number(this.data.persInfo.sex) + 1;
    // submitObj.sex = this.data.persInfo.sex;
    this.setData({
      submit: submitObj
    });
    nextUserExtraInfo(this.data.submit).then(res => {
      if (res.code == 200) { //提交数据成功
        var path = that.isOcrRoad();
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
  //点击上传身份证
  cameraMethods: function(e) {
    var that = this;
    var idcard = e.currentTarget.dataset.idcard;
    if (this.data.submit.resultFlag < 3) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], //图片质量
        sourceType: ['album', 'camera'], //图片来源
        success(res) {
          that.setData({
            isLoading: true
          })
          wx.showLoading({
            title: '身份证上传中',
            mask: true
          })
          var type = idcard == 'front' ? '0' : '1';
          that.setIdcardImg(type, res.tempFilePaths[0]); //设置照片回显
          that.cameraUpload(type, that.data.persInfo.userId, res.tempFilePaths[0]); //进行人脸识别
        },
        fail(err) {
          console.log(err, "上传身份证错误");
        }
      })
    } else {
      wx.showToast({
        title: '身份证扫描失败，请手动填写信息后点击下一步',
        icon: 'none',
        duration: 2000
      })
    }

  },
  //上传身份证图片
  cameraUpload: function(type, userId, picUrl) {
    var that = this;
    wx.uploadFile({
      url: idcardUpload(type, app.globalData.userId, picUrl), //ocr服务器地址
      filePath: picUrl,
      header: {
        "Content-Type": "multipart/form-data",
        "rstTenantCode": 6000
      },
      name: 'file',
      formData: {},
      success(res) {
        var data = JSON.parse(res.data);
        if (data.code == 200) {
          //照片发生改变
          var key = 'persInfo.idCard' + type + 'Url';
          that.setData({
            [key]: data.data.fileUrl,
            ['submit.changeFlag']: 1, //照片发生改变
            isLoading: false
          });
          if (data.data.ocrInfo.code == 0 && data.data.ocrInfo.result) { //识别成功
            that.setData({
              ocrStadus: '0',
              ['submit.resultFlag']: 0
            })
            //成功，重置页面数据
            that.forInObject(type, data.data.ocrInfo.result)
            wx.hideLoading(); //隐藏加载窗口
            wx.showToast({
              title: '身份证验证成功 ',
              icon: 'success',
              duration: 2000
            })
          } else { //身份证识别失败           
            // that.forInObject(type, data.data.ocrInfo.result)
            that.setData({
              ['submit.resultFlag']: that.data.submit.resultFlag + 1,
            })
            data.data.ocrInfo.msg = that.data.submit.resultFlag < 3 ? data.data.ocrInfo.msg + '' : '身份证扫描失败，请手动填写信息后点击下一步'
            wx.hideLoading();
            wx.showToast({
              title: data.data.ocrInfo.msg, //显示错误信息
              icon: 'none',
              duration: 2000
            })
          }
        } else { //请求失败
          that.setData({
            isLoading: false,
            ['submit.resultFlag']: that.data.submit.resultFlag + 1
          })
          var errInfo = that.data.submit.resultFlag < 3 ? '服务异常' : '身份证扫描失败，请手动填写信息后点击下一步'
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
          title: '上传身份证失败 ',
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
    this.initData(options);
  }
})
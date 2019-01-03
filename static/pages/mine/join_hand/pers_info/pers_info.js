// pages/mine/join_hand/pers_info/pers_info.js
const app = getApp()
import util from "../../utils/util.js"; //mine页面下的方法库
import utils from "../../../../utils/util.js"; //全局的方法
import {
  getUserExtraInfo,
  submitUserExtraInfo,
  updateEntryStatusAndDate
} from "../../../../utils/api.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputSetting: [{
      type: 'idcard',
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
    }, {
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
    }, {
      selfType: 'picker',
      title: '出生年月',
      name: 'birthday',
      mode: 'date',
      start: '',
      end: ''
    }, {
      type: 'text',
      selfType: 'input',
      title: '户籍地址',
      placeholder: '请输入户籍地址',
      name: 'address'
    }, {
        type: 'number',
      selfType: 'input',
      title: '手机号码',
      placeholder: '请输入手机号码',
      name: 'phone'
    }, {
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
    }, {
        type: 'text',
      selfType: 'input',
      title: '紧急联系人',
      placeholder: '请输入紧急联系人',
      name: 'contactPerson'
    }, {
        type: 'number',
      selfType: 'input',
      title: '紧急联系人电话',
      placeholder: '请输入紧急联系人电话',
      name: 'contactPersonPhone'
    }],
    persInfo: {
      identityCard: '',
      realName: '',
      sex: '',
      birthday: '',
      address: '',
      phone: '',
      bankCard: '',
      bankCardDeposit: '',
      contactPerson: '',
      contactPersonPhone: ''
    },
    userId: '',
    sexArr: ['男', '女'],
    sexIndex: 0,
    idcardErr: true,
    submit: {
      userId: '',
      identityCard: '',
      realName: '',
      sex: '',
      birthday: '',
      address: '',
      phone: '',
      bankCard: '',
      bankCardDeposit: '',
      contactPerson: '',
      contactPersonPhone: ''
    }
  },
  //页面数据初始化
  initData: function() {
    this.setData({
      userId: app.globalData.userId,
    });
    this.getPersInfoData();
  },
  //获取个人信息的数据
  getPersInfoData: function() {
    var that = this;
    getUserExtraInfo(this.data.userId).then(res => {
      if (res.code == 200) {
        if (Object.keys(res.data).length) {
          if (res.data.birthday) {
            res.data.birthday = res.data.birthday.substring(0, 10);
          }
          if (res.data && res.data.sex) {
            res.data.sex = Number(res.data.sex) - 1;
          }
          that.setData({
            persInfo: res.data
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
  //选择日期和性别
  bindPickerChange: function(e) {
    var key = e.currentTarget.dataset.name
    var value = e.detail.value;
    var persInfoKey = "persInfo." + key;
    this.setData({
      [persInfoKey]: value
    })
  },
  //身份证号，姓名，电话号码，户籍地址，银行卡号，开户银行，紧急联系人，紧急联系人电话的输入
  onChange: function(e) {
    var persInfoKey = 'persInfo.' + e.currentTarget.dataset.name
    var value = e.detail.value;
    this.setData({
      [persInfoKey]: value
    })
  },
  //提交数据
  submit: function() {
    var obj = {};
    var isErr = this.isRule();
    if (isErr === true) {
      for (let key in this.data.submit) {
        if ( key != 'sex') {
          this.data.submit[key] = this.data.persInfo[key]
        }
      }
      this.data.submit.sex = Number(this.data.persInfo.sex) + 1;
      this.setData({
        ['submit.userId']: this.data.userId
      })
      submitUserExtraInfo(this.data.submit).then(res => {
        console.log(res, "提交了数据")
        if (res.code == 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1000
          })
          that.updateUserStatusAndDate();
          setTimeout(() => {
            wx.navigateBack();
          }, 1000);
        } else {
          var remark = res.remark ? res.remark : '提交数据异常';
          wx.showToast({
            title: remark,
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: isErr,
        icon: 'none',
        duration: 2000
      })
    }
  },
  //更新用户入职时间及状态
  updateUserStatusAndDate: function () {
    updateEntryStatusAndDate().then(res => {
      if(res.code != 200){
        var remark = res.remark ? res.remark : '提交数据异常';
        wx.showToast({
          title: remark,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //校验信息是否符合规定
  isRule: function() {
    //校验身份证
    var idcardStatus = util.checkIdcard(this.data.persInfo.identityCard);
    //校验人名
    var isRealNameRule = util.isName(this.data.persInfo.realName);
    var isContactPerson = util.isName(this.data.persInfo.contactPerson);
    //手机号校验
    var isRealNamePhone = utils.isTel(this.data.persInfo.phone);
    var isContactPersonPhone = utils.isTel(this.data.persInfo.contactPersonPhone);
    //银行卡号和开户银行校验
    var isbank = util.isBankCard(this.data.persInfo.bankCard);
    var regBankName = /^[\u4e00-\u9fa5]+$/;
    if (idcardStatus != '验证通过') {
      return idcardStatus;
    } else if (!isRealNameRule) {
      return '真实姓名输入非法';
    } else if (this.data.persInfo.address == '') {
      return '户籍地址不能为空'
    } else if (!isRealNamePhone) {
      return '手机号码输入非法'
    } else if (isbank != '验证通过') {
      return '银行卡号输入非法'
    } else if (!regBankName.test(this.data.persInfo.bankCardDeposit)) {
      return '开户银行输入非法'
    } else if (!isContactPerson) {
      return '紧急联系人姓名输入非法'
    } else if (!isContactPersonPhone) {
      return '紧急联系人手机号码输入非法'
    } else {
      return true;
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData();
  }
})
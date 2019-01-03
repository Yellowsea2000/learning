//app.js
const NET = require("utils/app_server.js");
App({
  onLaunch: function(options) {
    var that = this;
    // 判断进入场景
    if (options.scene == 1007 || options.scene == 1008 || options.scene == 1012 || options.scene == 1048) {
      this.globalData.fromShare = true
    } else {
      this.globalData.fromShare = false
    };
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.statusBarHeight = res.statusBarHeight;
      }
    })
    this.login();
  },
  login() {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var tempData = {
          jsCode: res.code
        }
        NET.request(this.config.server_url + "/index/login", tempData, (res, cookie) => {
            if (res.code == 200) {
              this.globalData.cookie = cookie;
              this.globalData.userInfo = res.data;
              this.globalData.userId = res.data.userId;
              this.getlocation();
              // 登录并保存用户信息回调
              if (this.loginCallback) {
                this.loginCallback()
              }
            }
          },
          function(e) {}, 'post');
      }
    })
  },
  getlocation() { //获取当前经纬度
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.getPAndCCode(res.longitude, res.latitude)
        wx.showToast({
          title: "获取位置成功",
          icon: 'none',
          duration: 1000
        })

      },
      fail: (e) => {
        // 获取用户权限信息
        if (this.getLocationCallBack) {
          this.getLocationCallBack();
        }
      }
    })
  },
  getPAndCCode(lng, lat) { //经纬度交换城市名称，省code,市code
    NET.request(`${this.config.server_url}/jobInfo/getLocation?lng=${lng}&lat=${lat}`, null, (res) => {
      this.globalData.cityName = res.data.city;
      this.globalData.cityCode = res.data.cityCode;
      this.globalData.provinceCode = res.data.provinceCode;
      if (this.getLocationCallBack) {
        this.getLocationCallBack();
      }
    }, (e) => {
      if (this.getLocationCallBack) {
        this.getLocationCallBack();
      }
    }, 'get', this.globalData.cookie);
  },
  //修改用户信息
  saveUserInfo(data) {
    var tempData = {
      headImgUrl: data.avatarUrl,
      city: data.city,
      country: data.country,
      gender: data.gender,
      language: data.language,
      nickName: data.nickName,
      province: data.province
    }
    NET.request(`${this.config.server_url}/user/updateUserInfo/${this.globalData.userId}`, tempData, (res) => {
      if (res.code == 200) {
        this.globalData.userInfo = res.data;
        if (this.saveUserInfoCallback) {
          this.saveUserInfoCallback(res)
        }
      }
    }, function(e) {}, 'put', this.globalData.cookie);
  },
  getPhoneNumber(entry, iv) { //手机号授权获取方法和回掉
    NET.request(this.config.server_url + "/index/authentication/" + this.globalData.userId + "?encryptedData=" + encodeURIComponent(entry) + "&iv=" + encodeURIComponent(iv), '', (res) => {
      if (res.code == 200) {
        if (this.getPhoneNumberCallback) {
          this.getPhoneNumberCallback(res)
        }
      }
    }, function(e) {}, 'put', this.globalData.cookie);
  },
  globalData: {
    userId: "", //用户id
    cookie: null,
    userInfo: null, //通过登录获取的用户信息
    authInfo: null, //通过微信获取的授权信息
    telNumber: null, //用户手机号
    userType: 2, //1门店管理员，2普通客户，3驻场
    fromShare: false, // 分享默认为false
    cityName: null, //当前城市
    cityCode: null, //当前城市编码
    provinceCode: null, //当前省编码
    rstWxAppId: 'wxa1a35a9a34176c12', //微信应用appid
    rstTenantCode: '6000', //租户编码
    company:'永祺科技',
    statusBarHeight: '',
    queryStoreId:'',//按照门店查询工作列表时的信息
    storeName:'', //选择的门店名称
    storeId:'' //选择的门店名称
  },
  atttendanceData: {
    checkDay: '', //当前选择日
  },
  tabBar: [{
      text: '首页',
      url: '/pages/home/home',
      img: '/images/ic_home.png',
      img2: '/images/ic_home_select.png'
    }, {
      text: '考勤',
      url: '/pages/atce/atce',
      img: '/images/record.png',
      img2: '/images/record_select.png'
    },
    {
      text: '投递记录',
      url: '/pages/deli_rcrd/deli_rcrd',
      img: '/images/record.png',
      img2: '/images/record_select.png'
    }, {
      text: '我',
      url: '/pages/mine/mine',
      img: '/images/mine.png',
      img2: '/images/mine_select.png'
    }
  ],
  config: {
    // 开发环境
     attendance_url: 'http://10.83.20.42:8080/qdp',
     wx_service_url: 'http://10.83.2.150:8081/rst-wx',
     ocr_url: 'https://osssit.jianli.tech/ocr',
     server_url: 'http://10.83.2.150:8081',

    //测试环境
    // attendance_url: 'https://rstsit.jianli.tech/qdp',
    // wx_service_url: 'https://rstsit.jianli.tech/rst-wx',
    // server_url: 'https://rstsit.jianli.tech/rst-business',
    // base_url:'https://rstsit.jianli.tech/rst-base',
    // ocr_url: 'https://osssit.jianli.tech/ocr'

    // 生产环境
    // attendance_url: 'https://rst.jianli.tech/qdp',
    // wx_service_url: 'https://rst.jianli.tech/rst-wx',
    // server_url: 'https://rst.jianli.tech/rst-business',
    // base_url:'https://rst.jianli.tech',
    // ocr_url: 'https://oss.jianli.tech/ocr'
  }
})
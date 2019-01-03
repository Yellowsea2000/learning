/*by zhongbo.zhang */
const app = getApp();
import {
  attendanceSubmit, //考勤提交
  getAttendanceDetail, //获取考勤详情
  getEntryInfo//判断角色的入职状态
  //attendanceDown
} from '../../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayArr: [],
    //请假类型
    leaveType: [{
        label: '事假',
        value: 1
      },
      {
        label: '病假',
        value: 2
      },
      {
        label: '其他',
        value: 3
      }
    ],
    //班次
    shiftType: [{
        label: '白班',
        value: 1
      },
      {
        label: '中班',
        value: 2
      },
      {
        label: '晚班',
        value: 3
      }
    ],
    //上班时长
    workingHours: '',
    workingRules: true,
    //时间参数
    year: '',
    month: '',
    day: '',
    nowDay: '', //当前最新的时间
    leaveHas: null,
    indexShiftType: 0, //正常上班班次索引
    indexLeaveType: 0, //请假类型索引
    remark: '',
    isModify: false,
    attendanceDownDate: '',

    //swiper配置
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    currentSwiperIndex: 0,


    //考勤提交的数据
    submitData: {
      id: '', //修改就传，新添加就不用
      recordDate: 2018125,
      userCode: '', //用户code
      userName: '',
      tenantCode: '6000',
      workingHours: 0, //正常工时
      shiftType: '', //班次类型
      leaveType: '', //请假类型
      remark: '', //备注
      isEntry:'',
      leaveHas: null
    },
  },
  //考勤详情初始化
  initPage: function(date) {
    var nowDate = new Date().getTime();
    this.setData({
      nowDate: nowDate,
      date: date
    })
    this.getDateInfor(date);
    this.swiperIndex(this.data.day);
    this.getDetail(date);
  },

  //是否请假
  changeLeaveStatus: function(e) {
    var isLeave = this.data.leaveHas != '1' ? isLeave = '1' : isLeave = '0';
    this.setData({
      leaveHas: isLeave
    })
    if(isLeave == '0'){
      this.setData({
        indexLeaveType: 0,
        remark:''
      });
    }
    
  },
  //请假类型
  bindPickerChangeLeaveType: function(e) {
    let submitDataLeave = 'submitData.leaveType';
    let leaveType = this.data.leaveType;
    this.setData({
      indexLeaveType: e.detail.value
    });

    this.setData({
      [submitDataLeave]: leaveType[e.detail.value].value.toString()
    })
  },

  //上班班次
  bindPickerNormalShiftType: function(e) {
    let submitDataShift = 'submitData.shiftType';
    let shiftType = this.data.shiftType;
    this.setData({
      indexShiftType: e.detail.value.toString()
    });

    this.setData({
      [submitDataShift]: shiftType[e.detail.value].value.toString()
    })
  },
  //获取备注
  getRemark(e) {
    let value = e.detail.value;
    this.setData({
      remark: value
    })
  },
  //获取考勤详情
  getDetail(date) {
    getAttendanceDetail(date).then(res => {
      let submitShiftType = 'submitData.shiftType';
      let submitLeaveType = 'submitData.leaveType';
      let workingHours = res.data.workingHours * 1 + res.data.extraHours * 1;
      this.setData({
        workingHours: workingHours,
        remark: res.data.remark,
        leaveHas: res.data.leaveHas,


      })
      //获取班次类型
      if (res.data.shiftType) {
        this.setData({
          indexShiftType: res.data.shiftType * 1 - 1,
          [submitShiftType]: res.data.shiftType
        });
      } else {
        this.setData({
          [submitShiftType]: "1",
          indexShiftType:0
        });
      }
      //获取请假类型
      if (res.data.leaveType) {
        this.setData({
          indexLeaveType: res.data.leaveType * 1 - 1,
          [submitLeaveType]: res.data.leaveType
        });
      } else {
        this.setData({
          [submitLeaveType]: "1"
        });
      }
    })
  },
  //选择上班的日期
  dateItem(e) {

    let date = e.currentTarget.dataset.date.toString(); //获取点击的具体哪天
    var tapDate = new Date(this.data.year, this.data.month - 1, date).getTime(); //获取点击日期的时间戳
    var weekDay = new Date(this.data.year, this.data.month - 1, date).getDay(); //获取点击日期是周几
    let newDate = '' + this.data.year + this.data.month + date;
    if (tapDate == this.data.nowDate || tapDate < this.data.nowDate) {
      app.atttendanceData.checkDay = this.data.year.toString() + this.data.month.toString() + date;
      this.data.date = this.data.year.toString() + (this.data.month >= 10 ? this.data.month : "0" + this.data.month).toString() + (date >= 10 ? date : "0" + date);
      this.setData({
        day: date,
      });
      this.swiperIndex(date);
      this.getDetail(this.data.date);
    } else {
      wx.showToast({
        title: '未到考勤日，不能记录 ',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //上班时长改变
  workTimeChange: function(e) {
    this.setData({
      workingHours: e.detail.value
    })
    //校验上班时长格式输入是否正确
    this.inputWorkTime(e.detail.value);
  },
  //输入上班时长的校验
  inputWorkTime: function(value) {
    var reg1 = /^[1-9]\d*\.[5]$|0\.[5]$|^[1-9]\d*$/g; //判断是不是0.5的倍数
    var reg2 = /^(0\.[0-9]|[0-9]|1[0-5](\.\d)?|16)$/g; //判断是不是大于0小于16（保留一位小数）
    if (reg1.test(value) && reg2.test(value)) {
      this.setData({
        workingRules: true
      })
    } else {
      this.setData({
        workingRules: false
      })
      if (value * 1 == 0) {
        this.setData({
          workingRules: true
        })
      }
    }
  },
  //日期的格式化
  getDateInfor: function(date) {
    var y = date.slice(0, 4) * 1;
    var m = date.slice(4, 6) * 1;
    var d = date.slice(6, 8) * 1;
    var dayCount = new Date(y, m, 0).getDate(); //获取当月的天数
    var dayArry = [];
    for (var k = 1; k <= dayCount; k++) {
      dayArry.push(k);
    }
    this.setData({
      dayArr: dayArry,
      year: y,
      month: m,
      day: d
    })
  },
  //header轮播的索引值
  swiperIndex: function(index) {
    if (index > 24) {
      this.setData({
        currentSwiperIndex: 23
      });
    } else {
      this.setData({
        currentSwiperIndex: index - 1
      });
    }
  },
  //是否在可修改考勤日的范围
  isAttendanceRange: function() {
    //获取当前最新的日期
    let nowMonth = new Date().getMonth();
    let nowYear = new Date().getFullYear();
    let nowDate = new Date(nowYear, nowMonth, new Date().getDate()).getTime();
    var rangeYear = nowYear;
    var rangeMonth = nowMonth - 1;
    var date = new Date(this.data.year, this.data.month - 1, this.data.day);
    if (nowMonth == 0) {
      rangeYear = nowYear - 1;
      rangeMonth = 11;
    }
    var dateCount = new Date(this.data.attendanceDownDate).getTime();
    //判断选择日期是否大于考勤关闭日日期
    if (nowDate > dateCount) {
      var rangeBig = new Date(nowYear, nowMonth, 1).getTime();
      var isModify = date.getTime() < rangeBig ? false : true;
      this.setData({
        isModify: isModify
      })
    } else {
      var rangeLittle = new Date(rangeYear, rangeMonth, 1).getTime();
      var isModify = date.getTime() < rangeLittle ? false : true;
      this.setData({
        isModify: isModify
      })
    }
  },
  //提交
  submit() {
    if (this.data.isEntry == 400) { //判断该职工是否离职
      this.isAttendanceRange();
      if (this.data.isModify) {
        if (this.data.workingRules) { //判断工时的输入格式是否正确
          //提交时的所传递的数据
          let submitData = this.data.submitData;
          submitData.userCode = app.globalData.userId;
          submitData.userName = app.globalData.userInfo.realName;
          submitData.remark = this.data.remark;
          submitData.workingHours = this.data.workingHours + '';
          submitData.leaveHas = this.data.leaveHas;
          submitData.recordDate = this.data.date;
          attendanceSubmit(this.data.submitData)
            .then(res => {
              if (res.isSuccess) {
                wx.showToast({
                  title: '提交考勤成功',
                  icon: 'success',
                  duration: 1000
                })
              } else{
                wx.showToast({
                  title: `${res.message}`,
                  icon: 'none',
                  duration: 1000
                })
              }
              setTimeout(() => {
                wx.navigateBack();
              }, 1000);
            })
        } else {
          wx.showToast({
            title: '请输入正确的工时(只支持0.5的倍数)',
            icon: 'none',
            duration: 1000
          })
        }
      } else {
        wx.showToast({
          title: '上月考勤已核对完毕，不能更改',
          icon: 'none',
          duration: 1000
        })
      }


    } else {
      wx.showToast({
        title: '暂未入职，不允许修改',
        icon: 'none',
        duration: 1000
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    this.initPage(option.date);
    this.setData({
      weekday: option.weekday,
      attendanceDownDate: option.attendanceDownDate,
      isEntry:option.isEntry
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //this.getDetail(this.data.date);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
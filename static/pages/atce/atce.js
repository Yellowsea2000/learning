// pages/atce/atce.js

const app = getApp();
import {
  getAttendanceTotal,
  attendanceDown,
  getEntryInfo
} from '../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    isEntry:'',
    attendanceData: {
      totalTime: 0,
      normalTime: 0,
      leaveTime: 0,
      overTime: 0,
      detail: [
      ]
    },
    attendanceDownDate:''//考勤关闭日时间戳
  },
  setToday(e) {
    if (e) {
      this.setData({
        isToday: e
      });
    }
  },
  //初始化当前显示页面的时间
  resetData() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    this.setData({
      isToday: '' + year + month + now.getDate()
    });
  },
  
  //获取考勤总览信息
  getSummaryInfo(years, months) {
    let year = this.data.year.toString();
    let month = this.data.month.toString();
    if (month.length === 1) {
      month = '0' + month;
    }
    getAttendanceTotal(year + month)
      .then(res => {
        this.setData({
          attendanceData: res.data
        });
        this.dateInit(year, month);
      });
  },
  dateInit: function (setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = []; //需要遍历的日历数组数据
    let arrLen = 0; //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth-1 || now.getMonth(); //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + '/' + (month + 1) + '/' + 1).getDay(); //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
    let obj = {};
    let num = 0;
    let attendanceDetail = this.data.attendanceData.detail;
    // let startWeek = attendanceDetail[0].weekday;

    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    //日历的遍历
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek+1;
        obj = {
          isToday: '' + year + (month + 1) + num,
          dateNum: num,
          workHours: '',
          extraHours: '',
          recordDate: '',
          weekday: '',
          leaveHas: ''
        }
      } else {
        obj = {};
      }

      //把加班和请假的时间放入日期的数据结构里面
      if (attendanceDetail[i - startWeek] && obj !== {}) {
        obj.recordDate = attendanceDetail[i - startWeek].recordDate;
        obj.weekday = attendanceDetail[i - startWeek].weekday;
        obj.workHours = attendanceDetail[i - startWeek].workHours;
        obj.extraHours = attendanceDetail[i - startWeek].extraHours;
        obj.leaveHas = attendanceDetail[i - startWeek].leaveHas;
      }
      dateArr[i] = obj;
      
    }
    this.setData({
      dateArr: dateArr
    });
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;

    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  lastMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    });
    this.getSummaryInfo(year, month);
    // this.dateInit(year,month);
  },
  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    });
    // app.atttendanceData.year = year;
    // app.atttendanceData.month = month;
    this.getSummaryInfo(year, month);
    // this.dateInit(year, month);
  },
  //点击日期
  dateItemClick(e) {
    let date = e.currentTarget.dataset.date.toString();
    let date2 = e.currentTarget.dataset.date2.toString();
    app.atttendanceData.checkDay = date2;
    let weekday = e.currentTarget.dataset.weekday;
    let y = date.slice(0, 4) * 1;
    let m = date.slice(4, 6) * 1;
    let d = date.slice(6, 8) * 1;
    
    let isToday = '' + y + m + d;
    if (!date) {
      wx.showToast({
        title: '未到考勤日，不能记录 ',
        icon: 'none',
        duration: 1000
      })
      return;
    };
    this.setData({
      isToday: isToday
    });
    wx.navigateTo({
      url: `/pages/atce/atce_edit/atce_edit?date=${date}&weekday=${weekday}&attendanceDownDate=${this.data.attendanceDownDate}&isEntry=${this.data.isEntry}` //20181207优化后的考勤信息版本
    })
  },
  //获取每个月考勤日期
  attendanceDown() {
    attendanceDown().then(res => {
      this.countAttendanceRang(res.data);
    })

  },
  //计算每个月可修改考勤范围
  countAttendanceRang: function (day) {
    let y = new Date().getFullYear()
    let m = new Date().getMonth();
    let d = new Date().getDate();
    let date = new Date(y, m, day);//考勤关闭日的时间戳
    this.setData({
      attendanceDownDate:date
    })
  },
  //获取入角色的入职状态
  getUserEntryInfo:function(){
    var userId = app.globalData.userId;
    var that = this;
   
    getEntryInfo(userId).then(res => {
      if (res.code == 200&&res.data) {
          that.setData({
            isEntry: res.data.entryStatus
          });
          if (res.data.entryStatus == 400 || res.data.entryStatus == 600) {
            that.attendanceDown();
          }
        }else{
        that.setData({
          isEntry:''
        });
        }     
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    this.setData({
      year: year,
      month: month,
      isToday: '' + year + month + now.getDate()
    });
    this.getSummaryInfo();
    this.getUserEntryInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getSummaryInfo();
    if (app.atttendanceData.checkDay){
      this.setData({
        isToday: app.atttendanceData.checkDay
      })
    }
    wx.hideShareMenu(); 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.atttendanceData.checkDay = '';
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
import util from '../../utils/util'
import {getIdentifyCode ,checkIdentifyCode} from '../../utils/api';

let app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    phone:'',
    code:'',
    count:0 //验证码倒计时
  },
  attached:function(){
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    cancel() {
      this.triggerEvent("closeCode")
    },

    submit() {

      if(!this.checkPhone()) {
        return;
      }
      if(!this.data.code){
        wx.showToast({
          title: "验证码不能为空",
          icon: "none",
          duration: 1000
        });
        return;
      }
      let obj = {
        checkCode:this.data.code,
        phone:this.data.phone,
        userId:app.globalData.userId
      }

      checkIdentifyCode(obj).then(res=>{
        if(res.data) {
          wx.showToast({
            title: "修改手机号成功",
            icon: "success",
            duration: 1000
          });

          this.triggerEvent("editPhone", this.data.phone)
          this.triggerEvent("closeCode");
  
        } else {
          wx.showToast({
            title: "验证码错误",
            icon: "none",
            duration: 1000
          });
        }
      })
    },
    getCode () {
      if(!this.checkPhone()) {
        return;
      }

      let obj= {
        phone:this.data.phone,
        userId:app.globalData.userId
      }
      getIdentifyCode(obj).then( res =>{
        console.log(res.data);
      });
     
      this.setData({
        count:60
      });
      let vm = this;
      let timer = setInterval(function () {
        vm.setData({
          count:vm.data.count - 1
        });
        if(!vm.data.count) {
          clearInterval(timer);
        }
      }, 1000);

    },
    inputChange(e) {
      let type = e.currentTarget.dataset.type;
      if(type === "phone") {
        this.setData({
          phone:e.detail.value
        })
      } else {
        this.setData({
          code:e.detail.value
        })
      }
      
    },
    checkPhone() {
      if (!this.data.phone) {
        wx.showToast({
          title: "手机号不能为空。",
          icon: 'none',
          duration: 2000
        });
        return false;
      }
      if(!util.isTel(this.data.phone)) {
        wx.showToast({
          title: "手机号格式不正确。",
          icon: 'none',
          duration: 2000
        });
        return false;
      }

      return true;
    }
  }
})

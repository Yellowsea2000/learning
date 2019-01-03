const app = getApp()
import {
  addUserInfo
} from "../../utils/api.js";
Component({
  options: {},
  properties: {},
  data: {},
  attached: function() {
  },
  methods: {
    getUserInfo(e) {
      console.log("用户信息======" + JSON.stringify(e.detail.userInfo))
      if (e.detail && e.detail.userInfo) {
        this.triggerEvent("closeAuth")
        var data = e.detail.userInfo;
        var tempData = {
          headImgUrl: data.avatarUrl,
          city: data.city,
          country: data.country,
          gender: data.gender,
          language: data.language,
          nickName: data.nickName,
          province: data.province
        };
        addUserInfo(tempData)
          .then(res => {
            var tempData = res.data;
            app.globalData.userInfo = tempData;
            app.globalData.isComplete = tempData.completed;
            app.globalData.isAuth = tempData.authorization;
            if (!tempData.completed) {
              wx.navigateTo({
                url: '/pages/mine/info_edit/info_edit',
              })
            }else{
              
            }
          })
          .catch(err => {});
      }
    }
  }
})
const app = getApp();
var canAlert = true;
export function server(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: params.url,
      data: params.data,
      header: {
        'Content-Type': 'application/json',
        'cookie': app.globalData.cookie,
        'rstWxAppId': app.globalData.rstWxAppId,
        'rstTenantCode': app.globalData.rstTenantCode
      },
      method: params.method,
      success: function(res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            resolve(res.data)
          } else if (res.data.remark) {
            wx.showToast({
              title: res.data.remark,
              icon: 'none',
              duration: 2000
            })
            resolve(res.data)
          } else if (res.data.message){
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: "请求失败",
              icon: 'none',
              duration: 2000
            })
            resolve(res.data)
          }
        } else {
          reject(res);
          if (res.data && res.data.error_description) {
            wx.showToast({
              title: res.data.error_description,
              icon: 'none',
              duration: 2000
            })
          } else if (res.statusCode && res.statusCode == 401 && canAlert) {
            canAlert = false;
            wx.showModal({
              title: '提示',
              content: `当前登录已过期，是否重新登录?`,
              success: (res) => {
                if (res.confirm) {
                  app.login();
                }
              },
              complete: (res) => {
                canAlert = true;
              }
            })
          } else {
            wx.showToast({
              title: "请求失败~",
              icon: 'none',
              duration: 2000
            })
          }
        }
      },
      fail: function(res) {
        reject(res)
      },
      complete: function(res) {
        wx.stopPullDownRefresh();
      }
    })
  })
}
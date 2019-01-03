/**app.js调用的接口请求 */
function request(url, params, success, fail, methos, mCookie) {
  wx.request({
    url: url,
    data: params,
    header: {
      'Content-Type': 'application/json',
      'cookie': mCookie ? mCookie : "",
      'rstWxAppId': 'wxa1a35a9a34176c12',
      'rstTenantCode': '6000'
    },
    method: methos,
    success: function(res) {
      var cookie = null;
      if (res.header["Set-Cookie"]) {
        cookie = res.header["Set-Cookie"].split(';')[0];
      }
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          success(res.data, cookie)
        } else if (res.data.remark) {
          fail(res.data, cookie)
          wx.showToast({
            title: res.data.remark,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: "请求失败",
            icon: 'none',
            duration: 2000
          })
        }
      } else {
        wx.showToast({
          title: "请求失败。",
          icon: 'none',
          duration: 2000
        })
        fail(res)
      }

    },
    fail: function(res) {
      wx.showToast({
        title: "请求失败。。",
        icon: 'none',
        duration: 2000
      })
      fail(res)
    },
    complete: function(res) {
      wx.hideNavigationBarLoading()
    },
  })
}
module.exports = {
  request: request
}
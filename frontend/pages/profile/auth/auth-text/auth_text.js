// pages/profile/auth/auth.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info: [],
    userState: ['','认证中','认证通过','认证未通过'],
    userRole: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userRole: app.globalData.userRole
    })
    console.log(app.globalData.userRole)
    var that = this
    console.log("auth-text")
    console.log(app.globalData.userInfo.user_id)
    wx.request({
      url: app.globalData.mainURL + 'api/getUserDetail',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        user_id: app.globalData.userInfo.user_id
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == true) {
          var user_info = res.data.result[0]
          if(user_info.role==1)
          {
            user_info.allow_pic = app.globalData.uploadURL + user_info.allow_pic
            user_info.id_pic1 = app.globalData.uploadURL + user_info.id_pic1
            user_info.id_pic2 = app.globalData.uploadURL + user_info.id_pic2
          }
          console.log(user_info)
          if(user_info.state==0){
            wx.showModal({
              title: '下载身份认证资料失败',
              showCancel: false,
              complete: function(){
                wx.redirectTo({
                  url: '../../profile',
                })
              }
            })
          }
          else{
            that.setData({
              user_info: user_info
            })
          }
        }
      }
    })

  },
  On_click_submit: function (e) {
    if(this.data.user_info.state==3)
    {
      wx.redirectTo({
        url: '../../auth/auth?method=rewrite',
      })
    }
    else{
      wx.redirectTo({
        url: '../../auth/auth?method=edit',
      })
    }
  },

})
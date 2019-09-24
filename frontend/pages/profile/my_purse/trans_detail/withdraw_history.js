//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        status_str: [
            '正在处理',
            '提现成功',
            '提现失败'
        ],
        payment: [],
    },
    onLoad: function() {
        var that = this;
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/getBindingHistory',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'user_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                console.log("asdf")
                if (res.data.status) {
                    that.setData({
                        payment: res.data.result,
                    })
                }
            }
        })
    }
})
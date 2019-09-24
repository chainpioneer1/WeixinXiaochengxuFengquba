//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        image_cancel_success_src: app.globalData.uploadURL + 'global/success@2x.png',
        kind: 0,
        cancel_sucess_text: ["提交成功，钱款将在1-3个工作日到账", "取消成功，钱款将在1-3个工作日退回", "报名成功", "报名成功", "报名成功"],
        title_text: ["提交成功", "取消成功", "活动报名", "我的订单", "赛事报名"],
    },
    onLoad: function(option) {
        var that = this;
        this.setData({
            kind: option.type
        })
        if (option.event != undefined)
            that.data.event = option.event;
        wx.setNavigationBarTitle({
            title: that.data.title_text[parseInt(option.type)]
        })
    },
    on_return: function() {
        app.onLaunch();
        var that = this;
        if (this.data.kind == 2) {
            wx.redirectTo({ // activity booking
                url: '../../index/detail_event/detail_event?id=' + that.data.event,
            })
        } else if (this.data.kind == 4) {
            wx.redirectTo({ // event booking
                url: '../../index/detail_new_event/detail_new_event?id=' + that.data.event,
            })
        } else if (this.data.kind == 3) {
            wx.switchTab({ // room booking
                url: '../../index/index'
            })
        } else {
            wx.switchTab({
                url: '../profile',
            })
        }
    }
})
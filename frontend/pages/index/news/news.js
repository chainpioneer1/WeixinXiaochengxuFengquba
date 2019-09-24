// pages/index/news/news.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: [
            '评价消息', // 0
            '提现到账消息', // 1
            '提现失败消息', // 2
            '报名蜂约消息', // 3
            '取消蜂约消息', // 4
            '收取蜂蜜消息', // 5
            '认证成功', // 6
            '认证失败', // 7
            '取消蜂约退款', // 8
            '活动提醒消息', // 9
            '取消蜂约消息', // 10
            '取消蜂约退款', // 11
            '取消订单消息', // 12
            '报名赛事消息', // 13
            '订单成功通知', // 14
            '报名活动消息', // 15
            '订单成功通知', // 16
            '取消订单退款', // 17
            '取消订单通知', // 18
            '蜂友解除通知', // 19
            '蜂友添加申请', // 20
            '团购成功通知', // 21
            '团购成功通知', // 22
            '团购取消通知', // 23
            '团购取消通知', // 24
            '取消团购退款', // 25
        ],
        eventData: [],

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        that.setData({
            eventData: app.globalData.eventType
        })
        wx.request({
            url: app.globalData.mainURL + 'api/getAlarm',
            data: {
                user_id: app.globalData.userInfo.user_id
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res)
                var newsarray = res.data.news

                var newsviewarray = new Array()
                var now = Date.now()

                var tempobject = new Object()
                var tempdate

                for (var iter = 0; iter < newsarray.length; iter++) {
                    tempobject = newsarray[iter]
                    tempdate = Date.parse(newsarray[iter].submit_time.replace(/-/g, '/'))
                    if (now - tempdate < 120000) {
                        tempobject.submit_time = "刚刚"
                    } else if (now - tempdate < 3600000) {
                        var minute = (now - tempdate) / 60000
                        minute = Math.floor(minute)
                        tempobject.submit_time = minute + "分钟前"
                    } else if (now - tempdate < 86400000) {
                        var hour = (now - tempdate) / 3600000
                        hour = Math.floor(hour)
                        tempobject.submit_time = hour + "小时前"
                    } else if (now - tempdate < 172800000) {
                        tempobject.submit_time = "昨天"
                    } else {
                        var time = newsarray[iter].submit_time.split(' ')
                        tempobject.submit_time = time[0]
                    }
                    if (tempobject.name == null) {
                        tempobject.name = tempobject.nickname
                    }
                    tempobject.type = 1 * tempobject.type
                    newsviewarray.push(tempobject)
                }
                that.setData({ newsarray: newsviewarray })
            },
        })
        app.globalData.see_news = 1;
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

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

})
// pages/backyard/transaction_detail/transaction_detail.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodnumber: '',
        sendtime: '',
        _tmr: '',
        left_day: '',
        seventime: '00:00:00'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        console.log(options.id)
        clearInterval(that.data._tmr);
        wx.request({
            url: app.globalData.mainURL + 'api/getExchangeDetail',
            data: {
                user_id: app.globalData.userInfo.user_id,
                exchange_id: options.id
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                // console.log(res.data)
                if (res.data.status == false) return;
                if (res.data.result[0].state == '1') {
                    that.data.sendtime = res.data.result[0].send_time
                    clearInterval(that.data._tmr);
                    that.data._tmr = setInterval(that.time_set, 1000)
                }
                that.data.goodnumber = res.data.result[0].no
                var idshow = '0000000000'
                idshow = idshow.slice(0, 10 - that.data.goodnumber.length) + that.data.goodnumber
                that.setData({ goodnumber: idshow })
                that.setData({ array: res.data.result[0], upload_url: app.globalData.uploadURL, productState: app.globalData.productState })
            },
            fail: function() {}
        })
    },
    time_set: function() {
        var timenow = Date.now()
        var sendnow = Date.parse(this.data.sendtime.replace(/-/g, '/'))
        var subtime = 604800000 - (timenow - sendnow)
        if (subtime <= 0) {
            var that = this
            wx.request({
                url: app.globalData.mainURL + 'api/endExchange',
                data: {
                    no: that.data.goodnumber
                },
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    clearInterval(that.data._tmr)
                },
                fail: function() {}
            })
            clearInterval(that.data._tmr)
            wx.navigateTo({
                url: '../transaction/transaction',
            })
        } else {
            var str = ""
            var day = Math.floor(subtime / 86400000)
            if (day != 0) {
                day = day
            } else {
                day = '0'
            }
            this.setData({ left_day: day })
            var hour = Math.floor((subtime - 86400000 * day) / 3600000)
            if (hour < 10) {
                str += '0' + hour
            } else {
                str += hour
            }
            str += ":"
            var minute = subtime - day * 86400000 - hour * 3600000
            minute = Math.floor(minute / 60000)
            if (minute < 10) {
                str += '0' + minute
            } else {
                str += minute
            }
            str += ":"
            var second = (subtime - day * 86400000 - hour * 3600000 - minute * 60000) / 1000
            second = Math.floor(second)
            if (second < 10) {
                str += '0' + second
            } else {
                str += second
            }
            this.setData({ seventime: str })
        }

    },
    onCancel1: function() {
        this.setData({
            showModal1: false
        });
    },
    onConfirm1: function() {
        var that = this
        this.setData({
            showModal1: false
        });
        wx.request({
            url: app.globalData.mainURL + 'api/endExchange',
            data: {
                no: that.data.goodnumber
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {},
            fail: function() {}
        })
        wx.navigateTo({
            url: '../transaction/transaction',
        })
    },
    btn_submit: function() {
        this.setData({
            showModal1: true
        })
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
        var that = this;
        clearInterval(that.data._tmr);
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        this.onHide();
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


    on_click_product: function(query) {
        wx.navigateTo({
            url: '../product_detail/product_detail?id=' + query.currentTarget.id,
        })
    }
})
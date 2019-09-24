// pages/backyard/product_order/product_order.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        comment: "",
        cost: 0,
        id: 0,
        show: 0,
        isfirstbtn: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        that.setData({
                id: options.id
            })
            // console.log(options.id)
        this.setData({ upload_url: app.globalData.uploadURL })
        wx.request({
            url: app.globalData.mainURL + 'api/orderExchange',
            data: {
                good_id: options.id,
                user_id: app.globalData.userInfo.user_id
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                // console.log(res.data)
                var show = 1
                if (res.data.address == undefined) {
                    show = 0;
                } else {
                    show = 1;
                    that.data.cost = res.data.good[0].cost
                    that.setData({ status: res.data.status, address: res.data.address[0], good: res.data.good[0] })
                }
                that.setData({ show: show })
            },
            fail: function() {}
        })
    },
    onShow: function() {
        var that = this;
        wx.request({
            url: app.globalData.mainURL + 'api/getAcceptAddress',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'user_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                if (res.data.result == null) {
                    that.setData({ show: 0 })
                }
                if (res.data.result != null) {
                    var addarray = res.data.result;
                    // console.log(addarray)
                    for (var iter = 0; iter < addarray.length; iter++) {
                        if (addarray[iter].state == '1') {
                            that.setData({ address: addarray[iter] })
                        }
                    }
                    that.setData({ show: 1 })
                }
            },
            fail: function(res) {}
        })
    },
    onBlurtextarea: function(e) {
        this.data.comment = e.detail.value
    },
    onBtnsubmit: function(e) {
        if (this.data.isfirstbtn == 1) return;
        else if (this.data.isfirstbtn == 0) {
            this.data.isfirstbtn = 1
        }
        var that = this;
        wx.request({
            url: app.globalData.mainURL + 'api/setExchange',
            data: {
                good_id: e.currentTarget.id,
                user_id: app.globalData.userInfo.user_id,
                comment: that.data.comment,
                address_no: that.data.address.no
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                app.globalData.honey_info.total_honey -= 1 * that.data.cost
                wx.setStorageSync("honey_info", app.globalData.honey_info)
                wx.redirectTo({
                    url: '../ordercomplete/ordercomplete',
                    success: function() {
                        that.data.isfirstbtn = 0
                    }
                })

            },
            fail: function() {}
        })
    },
    on_click_address: function() {
        var that = this
        if (!this.data.show) {
            wx.redirectTo({
                url: '../../profile/delivery/editdelivery?kind=' + 'edit&id=' + that.data.id
            })
        } else {
            wx.navigateTo({
                url: '../../profile/delivery/delivery?kind=beebuy&id=' + that.data.id
            })
        }
    }
})
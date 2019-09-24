// pages/booking/bookingCancel.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        pay_info: [],
        price: 0,
        showModal: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(option) {
        var that = this;
        that.data.options = option;
    },

    onShow: function(option) {
        var that = this;
        that.data.pay_info = JSON.parse(wx.getStorageSync('pay_info'));
        that.setData({
            price: that.data.pay_info.pay_cost
        });
    },

    //called when user clicked cancel booking button
    onclick_cancel_booking: function() {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '是否取消您的订单？',
            confirmText: '是',
            cancelText: '否',
            success: function(res) {
                if (res.confirm) {
                    var ordercode = that.data.pay_info.pay_online;
                    var out_refund_no = app.globalData.mch_id + Date.now()

                    if (ordercode > 0.0) {
                        wx.login({
                            success: function(res) {
                                if (res.code) {
                                    wx.request({
                                        url: app.globalData.mainURL + 'api/refund',
                                        data: {
                                            id: wx.getStorageSync('openid'), //要去换取openid的登录凭证
                                            fee: ordercode,
                                            user_id: that.data.pay_info.user_id,
                                            out_trade_no: that.data.pay_info.out_trade_no,
                                            out_refund_no: out_refund_no
                                        },
                                        method: 'POST',
                                        header: {
                                            'content-type': 'application/json'
                                        },
                                        success: function(res) {
                                            that.cancelBooking(out_refund_no);
                                        }
                                    })
                                }
                            }
                        });
                    } else {
                        that.cancelBooking(out_refund_no)
                    }
                }
            }
        })
    },
    cancelBooking: function(out_refund_no) {
        var that = this;
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/cancelRoomBooking',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                booking_id: that.data.pay_info.booking_id,
                out_refund_no: out_refund_no
            },
            success: function(res) {
                that.setData({
                    showModal: true
                })
            }
        })
    },
    onConfirm1: function() {
        this.setData({
            showModal: false
        })
        app.globalData.selected_booking_tab = 2;
        wx.navigateBack({
            delta: 1
        })
    }

})
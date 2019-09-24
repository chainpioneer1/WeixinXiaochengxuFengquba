// pages/profile/my_member_ship/my_member_ship.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        expire_time: '',
        name: '',
        cost: 0,
        state: 0,
        btn_text_sel: 0,
        btn_text: ["立即开通", "立即续费"],
        isclick: 0,
        uploadRoot: app.globalData.uploadURL
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            userInfo: app.globalData.userInfo,
            cost: app.globalData.rule[7].value
        })
        var that = this
        wx.request({
            url: app.globalData.mainURL + 'api/getMemberState',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                user_id: app.globalData.userInfo.user_id,
                role: app.globalData.userInfo.role
            },
            success: function(res) {

                if (res.data.result != null) {
                    if (res.data.result.state == null || res.data.result.state * 1 == 0) {
                        that.data.btn_text_sel = 0
                    } else {
                        that.data.btn_text_sel = 1
                    }
                    that.setData({
                        expire_time: res.data.result.expire_time,
                        state: that.data.btn_text_sel * 1
                    })
                }
                if (res.data.result1 != null) {
                    that.setData({
                        name: res.data.result1[0].name
                    })
                }
            }

        })
    },
    pay: function() {
        var ordercode = app.globalData.rule[7].value;
        if (this.data.isclick == 1) return
        this.data.isclick = 1
        var out_trade_no = app.globalData.mch_id + Date.now()
        var out_refund_no = app.globalData.mch_id + Date.now()
        var that = this
        wx.login({
            success: function(res) {
                if (res.code) {
                    wx.request({
                        url: app.globalData.mainURL + 'api/pay',
                        data: {
                            id: wx.getStorageSync('openid'), //要去换取openid的登录凭证
                            fee: ordercode,
                            user_id: app.globalData.userInfo.user_id,
                            out_trade_no: out_trade_no
                        },
                        method: 'POST',
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function(res) {
                            wx.requestPayment({
                                timeStamp: res.data.timeStamp,
                                nonceStr: res.data.nonceStr,
                                package: res.data.package,
                                signType: 'MD5',
                                paySign: res.data.paySign,
                                success: function(res) {
                                    if (res.errMsg.length <= 20) {
                                        wx.request({
                                                url: app.globalData.mainURL + 'api/setMember',
                                                method: 'POST',
                                                header: {
                                                    'content-type': 'application/json'
                                                },
                                                data: {
                                                    user_id: app.globalData.userInfo.user_id,
                                                    total_fee: ordercode,
                                                    out_trade_no: out_trade_no
                                                },
                                                success: function(res) {
                                                    that.setData({ state: 1 })
                                                    wx.request({
                                                        url: app.globalData.mainURL + 'api/getMemberState',
                                                        method: 'POST',
                                                        header: {
                                                            'content-type': 'application/json'
                                                        },
                                                        data: {
                                                            user_id: app.globalData.userInfo.user_id,
                                                            role: app.globalData.userInfo.role
                                                        },
                                                        success: function(res) {
                                                            console.log(res)
                                                            app.globalData.userInfo.isVIP = 1
                                                            if (res.data.result != null) {
                                                                that.setData({
                                                                    expire_time: res.data.result.expire_time,
                                                                })
                                                            }
                                                        }
                                                    })
                                                }
                                            })
                                            /*
                                            wx.redirectTo({
                                              url: './my_membership',
                                            })
                                            */
                                    }
                                },
                                fail: function(res) {
                                    // fail

                                },
                                complete: function(res) {
                                    // complete
                                    that.data.isclick = 0
                                }
                            })
                        }
                    })
                } else {}
            }
        });
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

    //listener for cost to be member
    btn_Clicked_Cost: function(evnet) {

    }
})
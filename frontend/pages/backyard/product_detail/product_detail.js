// pages/backyard/product_detail/product_detail.js
var WxParse = require('../../../wxParse/wxParse.js');
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        disable: 1,
        btn_text: "未开始兑换",
        comment: '',
        _tmr: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        var that = this
        that.data.options = options;
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    getUserModalHide: function() {
        this.setData({
            getUserInfoDisabled: false
        })
        this.data.isFirstInit = false;
        this.onShow();
        // setTimeout(function() {

        // }, 100);
    },
    onShow: function(option) {
        var that = app;
        var _this = this;
        that.globalData.initDisabled = false;
        wx.getSetting({
            success: function(res) {
                var perm = res;

                that.globalData.getUserInfoDisabled = !perm.authSetting['scope.userInfo'];
                that.globalData.getUserLocationDisabled = !perm.authSetting['scope.userLocation'];

                if (!that.globalData.getUserInfoDisabled && !that.globalData.getUserLocationDisabled) {
                    _this.onPrepare();
                    return;
                }

                if (perm.authSetting['scope.userInfo'] != true && that.globalData.initDisabled == false) {
                    that.globalData.initDisabled = true;
                    _this.setData({
                        getUserInfoDisabled: true
                    })
                    wx.hideTabBar({})
                } else {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        fail: function() {
                            that.globalData.initDisabled = true;
                        },
                        complete: function() {
                            if (that.globalData.initDisabled)
                                that.go2Setting();
                            else {
                                that.globalData.getUserInfoDisabled = false;
                                _this.onPrepare();
                                app.globalData.isFirstLaunch = false;
                            }
                        }
                    });
                }
            }
        });
    },
    onPrepare: function() {
        var that = this;
        var option = that.data.options;
        wx.showLoading({
            title: '加载中',
        })
        if (app.globalData.userInfo.user_id == 0)
            app.onInitialize(function() {
                that.onInitStart(option);
            })
        else
            that.onInitStart(option);
    },
    onInitStart: function(option) {
        var that = this;
        that.setData({
            user_id: app.globalData.userInfo.user_id
        })
        var options = that.data.options;
        clearInterval(that.data._tmr);
        wx.request({
            url: app.globalData.mainURL + 'api/getGoodDetail',
            data: {
                id: options.id,
                user_id: app.globalData.userInfo.user_id
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                if (!res.data.status) return;

                var curTime = Date.now();
                that.data.product = res.data.result[0];
                var item = that.data.product;

                that.data.id = item.id;
                that.data.cost = item.cost;
                var comment = item.comment;
                WxParse.wxParse('comment', 'html', comment, that);
                that.setData({ btn_text: "立即兑换", disable: 0 });
                var end_time = new Date(item.end_time.replace(/-/g, '/'));
                if (end_time > curTime) {
                    that.setData({ btn_text: "未开始兑换", disable: 1 })
                } else if (1 * item.cost > 1 * app.globalData.honey_info.total_honey) {
                    that.setData({ btn_text: "蜂蜜不足", disable: 1 })
                } else if (item.amount == 0) {
                    that.setData({ btn_text: "缺货", disable: 1 })
                }
                item.pic = app.globalData.uploadURL + item.pic;
                /*
                if (res.data.result[0].amount == '0')
                {
                  that.setData({ btn_text: "缺货", disable: 1})
                }
                */
                that.updateCounter();
                clearInterval(that.data._tmr);
                that.data._tmr = setInterval(function() {
                    that.updateCounter();
                }, 1000);
            },
            fail: function() {},
            complete: function() {
                wx.hideLoading({});
            }
        })
    },

    updateCounter: function() {
        var that = this;
        var curTime = Date.now();
        var item = that.data.product;
        if (item.end_time) {
            var end_time = Date.parse(item.end_time.replace(/-/g, '/'));
            var diff = end_time - curTime;
            if (diff < 0) diff = 0;
            item.hrs = that.make2Digit(Math.floor(diff / 3600000));
            diff = diff - item.hrs * 3600000;
            item.mins = that.make2Digit(Math.floor(diff / 60000));
            diff = diff - item.mins * 60000;
            item.secs = that.make2Digit(Math.floor(diff / 1000));
        }

        that.setData({
            product: item
        })
    },

    setFavorite: function(e) {
        var that = this;
        var status = parseInt(e.currentTarget.dataset.status);
        that.data.formId = e.detail.formId;

        var data = {
            touser: wx.getStorageSync('openid'),
            template_id: app.globalData.templateIds.event_start,
            form_id: that.data.formId,
            page: 'pages/backyard/product_detail/product_detail?id=' + that.data.options.id,

            // url: 'http://weixin.qq.com/download',
            // miniprogram: {
            //     appid: app.globalData.appid,
            //     pagepath: 'pages/backyard/product_detail/product_detail?id=' + that.data.options.id,
            // },
            data: {
                keyword1: { value: that.data.product.name, color: '#000' },
                keyword2: { value: that.data.product.end_time, color: '#000' },
                keyword3: { value: that.data.product.end_time, color: '#000' },
                keyword4: { value: that.data.product.cost + 'ml兑换', color: '#000' },
            },
            color: '#ff0000',
            emphasis_keyword: 'keyword1.DATA',
        };

        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/setFavouriteGoods',
            data: {
                goods_id: that.data.product.id,
                user_id: app.globalData.userInfo.user_id,
                open_id: wx.getStorageSync('openid'),
                msg_data: data,
                end_time: that.data.product.end_time
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                if (!res.data.status) return;

                that.data.product.isFav = res.data.result;

                that.updateCounter();
            },
            fail: function() {}
        })

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

    make2Digit: function(num) {
        num = parseInt(num);
        if (num < 10) return '0' + num;
        else return num;
    },


    On_click_order: function() {
        var that = this
        wx.redirectTo({
            url: '../product_order/product_order?id=' + that.data.id,
        })
    },
    onShareAppMessage: function(res) {
        console.log("SHARED")
        if (res.from === 'button') {
            console.log(res.target)
        }
        var that = this;

        var title = "每天采集蜂蜜，免费兑换" + that.data.product.name + "哦";

        title = '领取蜂蜜免费兑换' + that.data.product.name;
        return {
            title: title,
            path: '/pages/backyard/product_detail/product_detail?id=' + that.data.options.id,
            success: function(res) {},
            fail: function(res) {}
        }
    }
})
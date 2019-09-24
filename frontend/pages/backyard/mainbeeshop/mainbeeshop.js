// pages/backyard/mainbeeshop/mainbeeshop.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        _tmr: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        this.setData({ total_honey: app.globalData.honey_info.total_honey })
        this.setData({ upload_url: app.globalData.uploadURL })
        wx.request({
            url: app.globalData.mainURL + 'api/getGoodsList',
            data: {},
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                if (!res.data.status) return;
                var products = res.data.result;
                that.data.product_array = products;
                that.updateCounter();
            },
            fail: function() {

            }
        })
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
        app.globalData.initDisabled = false;
        this.onShow();
        // setTimeout(function() {

        // }, 100);
    },
    onShow: function(option) {
        var that = app;
        var _this = this;
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
        clearInterval(that.data._tmr);
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/getFavouriteGoods',
            data: {
                user_id: app.globalData.userInfo.user_id
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                if (!res.data.status) return;
                var favorites = res.data.result;
                var allList = that.data.product_array;
                var myList = [];
                for (var i = 0; i < allList.length; i++) {
                    var item = allList[i];
                    var favItem = favorites.find(function(a) { return (a.goods_id == item.id); });
                    if (favItem) item.isFav = 1;
                    else item.isFav = 0;
                }
                that.updateCounter();
                clearInterval(that.data._tmr);
                that.data._tmr = setInterval(function() {
                    that.updateCounter();
                }, 1000);
            },
            fail: function() {

            },
            complete: function() {
                wx.hideLoading({});
            }
        })
    },

    updateCounter: function() {
        var that = this;
        var products = that.data.product_array;
        var curTime = Date.now();
        for (var i = 0; i < products.length; i++) {
            var item = products[i];
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
        }
        that.setData({
            product_array: products
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

    On_click_product: function(query) {
        wx.navigateTo({
            url: '../product_detail/product_detail?id=' + query.currentTarget.id,
        })
    },
    onShareAppMessage: function(res) {
        console.log("SHARED")
        if (res.from === 'button') {
            // console.log(res.target)
        }
        var that = this;

        var title = "每天采集蜂蜜，免费兑换精美礼品哦"

        return {
            title: title,
            path: '/pages/backyard/mainbeeshop/mainbeeshop',
            success: function(res) {},
            fail: function(res) {}
        }
    }
})
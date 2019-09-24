// pages/booking/bookingCancel.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        book_date: '',
        img_black_start_src: '../../../image/star_n@2x.png',
        img_yellow_start_src: '../../../image/star_s@2x.png',
        count_yellowStar: 3,
        booking: {},
        eventType: [],
        site_info: [],
        userRole: [],
        options: [],
        curBossId: 0,
        curUserId: 0,
        bookList: [],
        bookingState: ["已支付", "进行中", "已完成", "已取消"],
        tmrID: 0,
        btn_text: '返回',
        pageType: '0',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(option) {
        var that = this;
        that.data.options = option;
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
        wx.showLoading({
            title: '加载中',
        })
        var option = that.data.options;
        if (true || app.globalData.userInfo.user_id == 0)
            app.onInitialize(function() {
                that.onInitStart(option);
            })
        else
            that.onInitStart(option);
    },
    onInitStart: function(options) {
        var that = this;

        var pageType = options.type;
        if (pageType == '1') {
            that.data.pageType = pageType;
            that.data.btn_text = '查看商家'
        }
        that.setData({
            btn_text: that.data.btn_text
        });
        // options = {
        //     bid: "1263",
        //     uid: "1263",
        //     sday: "1"
        // }
        that.data.curBossId = options.bid;
        that.data.curUserId = options.uid;
        if (options.uid == app.globalData.userInfo.user_id) {
            that.data.pageType = 1;
        }
        that.data.shareDay = options.sday;
        that.setData({
            id: options.bid, // applied user id
            pageType: that.data.pageType,
        })

        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/getSharedData',
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            data: {
                'boss_id': that.data.curBossId,
                'user_id': that.data.curUserId,
                'share_day': that.data.shareDay
            },
            success: function(res) {
                console.log(res.data);
                if (res.data.status) {

                    that.data.bookList = JSON.parse(res.data.result.content).book_info;
                    var book_date = JSON.parse(res.data.result.content).book_date.replace(/-/g, '/');

                    var tDate = new Date(book_date + ' 00:00:00');
                    that.data.book_date = tDate.getFullYear() + '-' + (tDate.getMonth() + 1) + '-' + tDate.getDate();

                    that.setData({
                        bookingState: that.data.bookingState,
                        book_date: that.data.book_date,
                    });
                    var id = that.data.curBossId;

                    wx.request({
                        url: app.globalData.mainURL + 'api/getSiteDetail',
                        header: {
                            'content-type': 'application/json'
                        },
                        method: 'POST',
                        data: {
                            'boss_id': id,
                            'user_id': that.data.curUserId
                        },
                        success: function(res) {
                            console.log(res.data);
                            if (res.data.status) {
                                that.data.site_info = res.data;
                                that.setData({
                                    booking: that.data.site_info.site[0]
                                })
                            }
                        }
                    })
                    wx.request({
                        url: app.globalData.mainURL + 'api/getUserDetail',
                        header: {
                            'content-type': 'application/json'
                        },
                        method: 'POST',
                        data: {
                            'user_id': that.data.curUserId
                        },
                        success: function(res) {
                            console.log(res.data);
                            if (res.data.status) {
                                that.setData({
                                    user: res.data.result[0]
                                })

                            }
                        }
                    })
                    var bookList = that.data.bookList;
                    var totalPrice = 0;
                    for (var i = 0; i < bookList.length; i++) {
                        var item = bookList[i];
                        if (parseFloat(item.cost) < 0) continue;
                        totalPrice += parseFloat(item.cost);
                    }
                    totalPrice = totalPrice.toFixed(2);
                    totalPrice = parseFloat(totalPrice);
                    that.setData({
                        bookList: bookList
                    })

                    that.prepare_payment(totalPrice, 0, 0, 2); // price, honey, wallet, pay_type(0-offline, 1-online pay)

                }
            },
            complete: function() {
                wx.hideLoading({});
            }
        })

    },

    //called when user go to detail gym page
    go_to_place: function(event) {
        // wx.navigateBack({
        //         delta: 1
        //     })
        // wx.navigateBackMiniProgram({})
        var that = this;
        if (that.data.pageType == '1')
            wx.redirectTo({
                url: '../../index/detail_gym/detail_gym?id=' + this.data.curBossId + '&type=1'
            })
        else
            wx.redirectTo({
                url: '../../index/detail_gym/detail_gym?id=' + this.data.curBossId
            })
    },

    on_clicked_share_info: function() {
        console.log('share button clicked');

    },

    ///////////////////////// pay_template processor //////////////////////////////////
    prepare_payment: function(price, honey, wallet, pay_type) {
        var that = this;
        if (price == undefined) price = 0; // total price for pay needed

        that.setData({
            total_cost: price,

        });
    },

    ////////////////////////////////////////////////////////////////////////

    onShareAppMessage: function(res) {
        console.log("SHARED")
        if (res.from === 'button') {
            console.log(res.target)
        }
        var that = this;
        var sport = parseInt(that.data.booking.site_type);
        var title = "这家" + app.globalData.eventType[sport] + "商家不错哦, 快来预定吧";
        if (sport == 28)
            title = "这家" + app.globalData.eventType[sport] + "不错哦, 快来购买吧"
        else if (sport == 31)
            title = "这家综合运动商家不错哦, 快来预定吧"
        else if (sport == 32)
            title = "这家运动商家不错哦, 快来预定吧"
        return {
            title: title,
            path: 'pages/profile/my_booking/booking_final?bid=' + that.data.curBossId + '&uid=' + that.data.curUserId + '&sday=' + that.data.shareDay + '&type=1',
            success: function(res) {},
            fail: function(res) {}
        }
    }

})
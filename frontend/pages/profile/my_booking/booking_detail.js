// pages/booking/bookingCancel.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        img_black_start_src: '../../../image/star_n@2x.png',
        img_yellow_start_src: '../../../image/star_s@2x.png',
        count_yellowStar: 3,
        booking: {
            pay_cost: 0,
            pay_honey: 0
        },
        eventType: [],
        userRole: [],
        bookingState: ["已支付", "进行中", "已完成", "已取消"],
        tmrID: 0,
        isFirstInit: true,
        user_id: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(query) {
        this.setData({
            eventType: app.globalData.eventType,
            userRole: app.globalData.userRole,
        });
        var that = this;
        that.setData({
            id: query.id
        })

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
        wx.showLoading({
            title: '加载中',
        })
        var option = that.data.options;
        if (app.globalData.userInfo.user_id == 0)
            app.onInitialize(function() {
                that.onInitStart(option);
            })
        else
            that.onInitStart(option);
    },
    onInitStart: function(option) {
        var that = this;
        var id = that.data.id;

        that.setData({
            user_id: app.globalData.userInfo.user_id
        })

        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/getRoomBookingDetail',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'booking_id': id
            },
            success: function(res) {
                console.log(res);
                var book = res.data.result[0];
                var rooms = res.data.rooms;
                if (book != null) {
                    var cur_date = new Date();
                    var start_date = new Date(book.start_time.replace(/-/g, '/'));
                    var timeDiff = start_date.getTime() - cur_date.getTime();
                    var diffhours = Math.floor(timeDiff / (1000 * 3600));
                    if (book.cancel_time > 100) {
                        that.setData({
                            cancel_state: ''
                        })
                    } else {
                        if (book.cancel_time < diffhours) {
                            that.setData({
                                cancel_state: 'enable'
                            })
                        } else {
                            that.setData({
                                cancel_state: ''
                            })
                        }
                    }

                    // if (book.site_name.length > 25) {
                    //     var site_name = book.site_name
                    //     site_name = site_name.slice(0, 25) + '...'
                    //     book.site_name = site_name
                    // }

                    if (book.is_rating == null) {
                        book.is_rating = 0;
                    }
                    book.roll_state = 0; //my room booked state
                    var book_info = JSON.parse(book.book_info);
                    book_info.sort(function(a, b) { return (parseInt(a.room_id) > parseInt(b.room_id)) ? 1 : -1; });
                    book_info.sort(function(a, b) {
                        if (parseInt(a.room_id) > parseInt(b.room_id)) return 1;
                        else if (parseInt(a.room_id) < parseInt(b.room_id)) return -1;
                        else
                            return ((new Date(a.start_time.replace(/-/g, '/'))) > (new Date(b.start_time.replace(/-/g, '/')))) ? 1 : -1;
                    });
                    for (var j = 0; j < book_info.length; j++) {
                        var tempdate;
                        tempdate = book_info[j].end_time.split(" ")
                        book_info[j].end_time = tempdate[1];

                        var time = book_info[j].start_time.split(':');
                        book_info[j].start_time = time[0] + ':' + time[1];

                        var time1 = book_info[j].end_time.split(':');
                        book_info[j].end_time = time1[0] + ':' + time1[1];

                        for (var kk = 0; kk < rooms.length; kk++) {
                            if (book_info[j].room_id == rooms[kk].id) {
                                book_info[j].room_name = rooms[kk].room_name + '';
                                if (j > 0 && book_info[j].room_id == book_info[j - 1].room_id)
                                    book_info[j].room_name = '';
                                book_info[j].pay_cost = rooms[kk].cost + '';
                                break;
                            }
                        }
                    }
                    book.book_info = book_info;

                    console.log(book);
                    that.setData({
                        booking: book
                    })
                }
            },
            complete: function() {
                wx.hideLoading({});
            }
        })
    },

    //called when user clicked cancel booking button
    onclick_cancel_booking: function() {

        var that = this;
        if (that.data.cancel_state == '') {
            return;
        }
        var pay_info = {
            pay_cost: that.data.booking.pay_cost,
            pay_online: that.data.booking.pay_online,
            user_id: app.globalData.userInfo.user_id,
            out_trade_no: that.data.booking.out_trade_no,
            booking_id: that.data.id,
        }
        wx.setStorageSync('pay_info', JSON.stringify(pay_info));
        wx.redirectTo({
            url: 'booking_cancel'
        });
    },

    goto_mapView: function() {
        //view event location in map
        var that = this;
        wx.openLocation({
                latitude: parseFloat(that.data.booking.latitude),
                longitude: parseFloat(that.data.booking.longitude)
            })
            // wx.navigateTo({
            //     url: "view_map?latitude=" + that.data.booking.latitude + "&longitude=" + that.data.booking.longitude
            // })
    },

    phone_call: function() {
        app.phoneCall(this.data.booking.user_phone)
    },

    //called when user go to detail gym page
    go_to_place: function(event) {
        wx.navigateTo({
            url: '../../index/detail_gym/detail_gym?id=' + this.data.booking.boss_id
        })
    },

    on_clicked_share_info: function() {
        console.log('share button clicked');

    },
    //called when user wants to write comment
    btn_write_comment: function(event) {
        wx.navigateTo({
            url: 'book_evaluation?id=' + this.data.booking.id + '&room_id=' + this.data.booking.room_id
        })
    },

    onShareAppMessage: function(res) {
        console.log("SHARED")
        if (res.from === 'button') {
            console.log(res.target)
        }
        var that = this;
        var sport = parseInt(that.data.booking.site_type);
        var title = "这家" + app.globalData.eventType[sport] + "商家不错哦, 快来预定吧";
        if (sport == 28)
            title = "这家" + app.globalData.eventType[sport] + "商家不错哦, 快来购买吧"
        else if (sport == 31)
            title = "这家综合运动商家不错哦, 快来预定吧"
        else if (sport == 32)
            title = "这家运动商家不错哦, 快来预定吧"

        return {
            title: title,
            path: 'pages/profile/my_booking/booking_detail?id=' + that.data.id,
            success: function(res) {},
            fail: function(res) {}
        }
    }
})
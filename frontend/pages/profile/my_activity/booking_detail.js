// pages/booking/bookingCancel.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        uploadURL: app.globalData.uploadURL,
        img_black_start_src: '../../../image/star_n@2x.png',
        img_yellow_start_src: '../../../image/star_s@2x.png',
        count_yellowStar: 3,
        booking: [],
        eventType: [],
        userRole: [],
        bookingState: [],
        limit: 0,
        bookingcanceltime: 1,
        id: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(query) {
        this.setData({
            eventType: app.globalData.eventType,
            userRole: app.globalData.userRole,
            bookingState: app.globalData.eventState,
            id: query.id
        });

    },
    onShow: function() {
        var that = this;
        var id = that.data.id;
        wx.request({
            url: app.globalData.mainURL + 'api/getBookingDetail',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'booking_id': id,
                'user_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                console.log(res)
                var book = res.data.result[0];
                if (book != null) {
                    var avatar = book.pic.split(",")[0];
                    book.picture = book.pic.split(",");
                    book.avatar = app.globalData.uploadURL + avatar;
                    book.idshow = '0000000000'
                    book.idshow = book.idshow.slice(0, 10 - book.id.length) + book.id
                    var time = book.start_time.split(':');
                    var register = res.data.register_num[0].register_num
                    if (register == null) register = 0;
                    book.start_time = time[0] + ':' + time[1];
                    time = book.end_time.split(':')
                    book.end_time = time[0] + ':' + time[1]

                    var now = Date.now()
                    var replacetdate = book.start_time
                    var tempdatenow
                    tempdatenow = Date.parse(replacetdate.replace(/-/g, '/'))

                    if ((tempdatenow - now) < 21600000) {
                        if (book.role == '1') {
                            that.setData({ bookingcanceltime: 0 })
                        } else if (tempdatenow < Date.now()) {
                            that.setData({ bookingcanceltime: 0 })
                        }
                    }

                    // if (book.name.length > 15) {
                    //     var name = book.name
                    //     name = name.slice(0, 15) + '...'
                    //     book.name = name
                    // }
                    that.setData({
                        booking: book,
                        rating: res.data.rating,
                        register_num: register
                    })
                    console.log(book.cost * book.reg_num)
                }
            }
        })
    },

    phone_call: function() {
        app.phoneCall(this.data.booking.agent_phone)
    },

    goto_mapView: function() {
        //view event location in map
        var that = this;
        wx.openLocation({
            latitude: parseFloat(that.data.booking.latitude),
            longitude: parseFloat(that.data.booking.longitude)
        })

        // wx.navigateTo({
        //     url: "../../index/detail_event/view_map?latitude=" + that.data.booking.latitude + "&longitude=" + that.data.booking.longitude
        // })


    },

    final_cancel: function(event) {
        var that = this;

        that.data.formId = event.detail.formId;


        wx.showModal({
            content: '是否取消蜂约？',
            success: function(res) {
                if (res.confirm) {

                    var curDate = new Date();
                    curDate = curDate.getFullYear() + '年' + (curDate.getMonth() + 1) + '月' + curDate.getDate() + '日 ' +
                        app.makeNDigit(curDate.getHours()) + ':' + app.makeNDigit(curDate.getMinutes()) + ':' + app.makeNDigit(curDate.getSeconds());
                    var serviceTime = that.data.event.start_time + ' ~ ' + that.data.event.end_time;
                    var data = {
                        touser: wx.getStorageSync('openid'),
                        template_id: app.globalData.templateIds.pay_cancel,
                        page: 'pages/profile/my_activity/my_activity',
                        form_id: that.data.formId,
                        data: {
                            keyword1: { value: that.data.booking.name, color: '#000' },
                            keyword2: { value: serviceTime, color: '#000' },
                            keyword3: { value: that.data.booking.detail_address, color: '#000' },
                            keyword4: { value: curDate, color: '#000' },
                            keyword5: { value: app.globalData.userInfo.nickname, color: '#000' }
                        },
                        color: '#ff0000',
                        emphasis_keyword: 'keyword1.DATA',
                    };

                    if (that.data.booking.pay_type == "1") {
                        var ordercode = that.data.booking.pay_online;
                        var out_refund_no = app.globalData.mch_id + Date.now()
                        wx.login({
                            success: function(res) {
                                if (res.code) {
                                    wx.request({
                                        url: app.globalData.mainURL + 'api/refund',
                                        data: {
                                            id: wx.getStorageSync('openid'), //要去换取openid的登录凭证
                                            fee: ordercode,
                                            user_id: app.globalData.userInfo.user_id,
                                            out_trade_no: that.data.booking.out_trade_no,
                                            out_refund_no: out_refund_no
                                        },
                                        method: 'POST',
                                        header: {
                                            'content-type': 'application/json'
                                        },
                                        success: function(res) {

                                            wx.request({
                                                url: app.globalData.mainURL + 'api/cancelBooking',
                                                method: 'POST',
                                                header: {
                                                    'content-type': 'application/json'
                                                },
                                                data: {
                                                    booking_id: that.data.booking.id,
                                                    out_refund_no: out_refund_no,
                                                    open_id: wx.getStorageSync('openid'),
                                                    msg_data: data,
                                                },
                                                success: function(res) {

                                                    if (res.data.status == true) {
                                                        wx.navigateBack({ delta: 1 })
                                                    }
                                                }
                                            })
                                        }
                                    })
                                } else {

                                }
                            }
                        });
                    } else {
                        wx.request({
                            url: app.globalData.mainURL + 'api/cancelBooking',
                            method: 'POST',
                            header: {
                                'content-type': 'application/json'
                            },
                            data: {
                                booking_id: that.data.booking.id,
                                open_id: wx.getStorageSync('openid'),
                                msg_data: data,
                            },
                            success: function(res) {

                                wx.navigateBack({ delta: 1 })
                            }
                        })
                    }
                } else if (res.cancel) {}
            }
        })
    },
    //called when user wants to write comment
    btn_write_comment: function(event) {
        wx.navigateTo({
            url: '../../other/evaluation/evaluation?id=' + event.currentTarget.id + '&event_id=' + this.data.booking.event_id
        })
    }
})
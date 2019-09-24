// pages/booking/booking.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        uploadURL: app.globalData.uploadURL,
        select_state: 0,
        select_active: "select",
        select_book: "",
        active1: "active",
        active2: "",
        active3: "",
        bookingArray: new Array(),
        events: [],
        selected_state: 0,
        userInfo: [],
        eventType: [],
        userRole: [],
        eventState: [],

        selectedtab: 0,
        book_active1: "active",
        book_active2: "",
        book_active3: "",
        bookingState: [],
        register_num: [],
        image_favs: ["../../../image/good_n@2x.png", "../../../image/good_s@2x.png"],
    },
    selectActivityTab: function() {
        var that = this;
        that.setData({
            select_state: 0,
            select_active: "select",
            select_book: ""
        })
    },
    selectBookingTab: function() {
        var that = this;
        that.setData({
            select_state: 1,
            select_active: "",
            select_book: "select"
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function(query) {
        this.setData({

            userInfo: app.globalData.userInfo,
            eventType: app.globalData.eventType,
            userRole: app.globalData.userRole,
            eventState: app.globalData.eventState,
            bookingState: app.globalData.eventState
        });
        var that = this;
        that.setData({
            image_favs: that.data.image_favs
        })
        wx.request({
            url: app.globalData.mainURL + 'api/getAllEvents',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'user_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                var event_buf = res.data.result;
                var favor = res.data.favor;
                if (event_buf != null) {
                    for (var index = 0; index < event_buf.length; index++) {
                        event_buf[index].picture = event_buf[index].pic.split(',');
                        event_buf[index].pic = event_buf[index].pic.split(",")[0];
                        event_buf[index].favor_num = favor[index];
                        var tempdate
                        tempdate = Date.parse(event_buf[index].start_time.replace(/-/g, '/'))
                        if (tempdate - Date.now() < 21600000) {
                            if (event_buf[index].role == '1') {
                                event_buf[index].isbtn = 0;
                            } else {
                                if (tempdate < Date.now()) {
                                    event_buf[index].isbtn = 0;
                                } else {
                                    event_buf[index].isbtn = 1
                                }
                            }
                        } else {
                            event_buf[index].isbtn = 1
                        }
                        event_buf[index].avatar = app.globalData.uploadURL + event_buf[index].pic;

                        var time = event_buf[index].start_time.split(':');
                        event_buf[index].start_time = time[0] + ':' + time[1];

                        var time1 = event_buf[index].end_time.split(':');
                        event_buf[index].end_time = time1[0] + ':' + time1[1];

                        if (event_buf[index].register_num == null) {
                            event_buf[index].register_num = 0;
                        }
                        if (event_buf[index].name.length > 10) {
                            var name = event_buf[index].name
                            name = name.slice(0, 10) + '...'
                            event_buf[index].name = name
                        }

                    }
                    that.setData({
                        events: event_buf
                    })
                    console.log(that.data.events);
                    that.showarray(0)
                }
            }
        })

        //get booking activity
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/getMyBooking1',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'user_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                if (res.data.status == false) return
                var book = res.data.result;
                var favor = res.data.favor;
                if (book != null) {
                    for (var index = 0; index < book.length; index++) {
                        book[index].picture = book[index].pic.split(',');
                        book[index].pic = book[index].pic.split(",")[0];
                        book[index].avatar = app.globalData.uploadURL + book[index].pic;
                        var tempdate
                        book[index].favor_num = favor[index];
                        tempdate = Date.parse(book[index].start_time.replace(/-/g, '/'))
                        if (tempdate - Date.now() < 21600000) {
                            if (book[index].role == '1') {
                                book[index].isbtn = 0;
                            } else {
                                if (tempdate < Date.now()) {
                                    book[index].isbtn = 0;
                                } else {
                                    book[index].isbtn = 1
                                }
                            }
                        } else {
                            book[index].isbtn = 1
                        }

                        if (book[index].is_rating == null) {
                            book[index].is_rating = 0;
                            book[index].idshow = '0000000000'
                            book[index].idshow = book[index].idshow.slice(0, 10 - book[index].id.length) + book[index].id
                        }
                        if (book[index].name.length > 10) {
                            var name = book[index].name
                            name = name.slice(0, 10) + '...'
                            book[index].name = name
                        }
                        var time = book[index].start_time.split(':');
                        book[index].start_time = time[0] + ':' + time[1];

                        var time1 = book[index].end_time.split(':');
                        book[index].end_time = time1[0] + ':' + time1[1];
                        that.data.booking = book.filter(item => item.owner == '1')
                        that.data.register_num = res.data.register_num
                    }
                    console.log(that.data.booking);
                    that.showevent(0)
                }
            }
        })
    },

    onLoad: function(query) {

    },
    showarray(tabtype = 0) {
        var event_buf = this.data.events

        if (event_buf == null) return
        if (event_buf.length < 2) {
            this.setData({
                events: event_buf,
            })
            return
        }
        var temp
        if (tabtype == 0) {
            for (var i = 0; i < event_buf.length - 1; i++) {
                for (var j = i + 1; j < event_buf.length; j++) {
                    if (event_buf[i].start_time < event_buf[j].start_time) {
                        temp = event_buf[i]
                        event_buf[i] = event_buf[j]
                        event_buf[j] = temp
                    }
                }
            }
        }
        if (tabtype == 1) {
            for (var i = 0; i < event_buf.length - 1; i++) {
                for (var j = i + 1; j > event_buf.length; j++) {
                    if (event_buf[i].end_time < event_buf[j].end_time) {
                        temp = event_buf[i]
                        event_buf[i] = event_buf[j]
                        event_buf[j] = temp
                    }
                }
            }
        }
        this.setData({
            events: event_buf,
        })
    },
    /**
     * This function is called after user select one of the tabs
     */

    selectTab: function(event) {
        this.setData({ active1: " " });
        this.setData({ active2: " " });
        this.setData({ active3: " " });
        switch (event.currentTarget.id) {
            case "btn1":
                this.setData({ active1: "active" });
                this.setData({ selected_state: 0 });
                this.showarray(0);
                break;
            case "btn2":
                this.setData({ active2: "active" });
                this.setData({ selected_state: 1 });
                //this.showarray(1);
                this.showarray(0);
                break;
            case "btn3":
                this.setData({ active3: "active" });
                this.setData({ selected_state: 2 });
                //this.showarray(2);
                this.showarray(0);
                break;
        }
    },
    //called when user clicked cancel event button.
    btn_remove_booking: function(event) {
        var index = event.target.id;
        var that = this;
        wx.showModal({
            content: '是否取消活动？',
            success: function(res) {
                if (res.confirm) {
                    var now = Date.now()
                    var tempdate
                    tempdate = Date.parse(that.data.events[index].start_time.replace(/-/g, '/'))
                    if ((tempdate - now) < 86400) {
                        wx.showToast({
                            title: '现在距离活动开始时间已不到24小时，无法取消活动',
                            icon: 'none',
                            time: 3000
                        })
                        return;
                    }
                    wx.request({
                        url: app.globalData.mainURL + 'api/cancelEvent',
                        method: 'POST',
                        header: {
                            'content-type': 'application/json'
                        },
                        data: {
                            event_id: that.data.events[index].id
                        },
                        success: function(res) {
                            var event = that.data.events
                            event[index].state = 2
                            that.setData({
                                events: event
                            })

                            wx.redirectTo({
                                url: '../final_cancel/final_cancel?type=1',
                                success: function(res) {
                                    var ret = res;
                                },
                                fail: function(res) {},
                                complete: function(res) {},
                            })
                        }
                    })

                } else if (res.cancel) {}
            }
        })
    },
    //called when user wants to see detail
    click_detail_event: function(event) {
        var that = this;
        if (that.data.select_state == 0) {
            //active to active detail
            wx.navigateTo({
                url: '../../index/detail_event/detail_event1?id=' + event.currentTarget.id
            })
        } else {
            //go to booking detail
            wx.navigateTo({
                url: 'booking_detail?id=' + event.currentTarget.id,
            })
        }
    },


    //functions for booked activity
    showevent: function(tabtype) {
        var book = this.data.booking

        var register_num = this.data.register_num
        if (book == null) return
        if (book.length < 2) {
            this.setData({
                booking: book,
            })
            return;
        }
        var temp

        if (tabtype == 0) {
            for (var i = 0; i < book.length - 1; i++) {
                for (var j = i + 1; j < book.length; j++) {
                    if (book[i].start_time < book[j].start_time) {
                        temp = book[i]
                        book[i] = book[j]
                        book[j] = temp
                        temp = register_num[i]
                        register_num[i] = register_num[j]
                        register_num[j] = temp
                    }
                }
            }
        }
        if (tabtype == 1) {
            for (var i = 0; i < book.length - 1; i++) {
                for (var j = i + 1; j < book.length; j++) {
                    if (book[i].end_time < book[j].end_time) {
                        temp = book[i]
                        book[i] = book[j]
                        book[j] = temp
                        temp = register_num[i]
                        register_num[i] = register_num[j]
                        register_num[j] = temp
                    }
                }
            }
        }
        this.setData({
            booking: book,
            register_num: register_num
        })
    },


    /**
     * This function is called after user select one of the tabs
     */
    selectTab1: function(event) {
        this.setData({ book_active1: " " });
        this.setData({ book_active2: " " });
        this.setData({ book_active3: " " });
        switch (event.currentTarget.id) {
            case "btn1":
                this.setData({ book_active1: "active" });
                this.setData({ selectedtab: 0 });
                this.showevent(0);
                break;
            case "btn2":
                this.setData({ book_active2: "active" });
                this.setData({ selectedtab: 1 });
                this.showevent(0);
                //this.showevent(1)
                break;
            case "btn3":
                this.setData({ book_active3: "active" });
                this.setData({ selectedtab: 2 });
                //this.showevent(2)
                this.showevent(0);
                break;
        }
    },

    //called when user clicked cancel event button.
    btn_remove_booking1: function(event) {
        var no = event.currentTarget.id
        var that = this

        that.data.formId = event.detail.formId;

        wx.showModal({
            content: '是否取消蜂约？',
            success: function(res) {
                if (res.confirm) {

                    var curDate = new Date();
                    curDate = curDate.getFullYear() + '年' + (curDate.getMonth() + 1) + '月' + curDate.getDate() + '日 ' +
                        app.makeNDigit(curDate.getHours()) + ':' + app.makeNDigit(curDate.getMinutes()) + ':' + app.makeNDigit(curDate.getSeconds());
                    var serviceTime = that.data.booking[no].start_time + ' ~ ' + that.data.booking[no].end_time;
                    var data = {
                        touser: wx.getStorageSync('openid'),
                        template_id: app.globalData.templateIds.pay_cancel,
                        page: 'pages/profile/my_activity/my_activity',
                        form_id: that.data.formId,
                        data: {
                            keyword1: { value: that.data.booking[no].name, color: '#000' },
                            keyword2: { value: serviceTime, color: '#000' },
                            keyword3: { value: that.data.booking[no].detail_address, color: '#000' },
                            keyword4: { value: curDate, color: '#000' },
                            keyword5: { value: app.globalData.userInfo.nickname, color: '#000' }
                        },
                        color: '#ff0000',
                        emphasis_keyword: 'keyword1.DATA',
                    };


                    if (that.data.booking[no].pay_type == "1") {
                        var ordercode = that.data.booking[no].pay_online;
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
                                            out_trade_no: that.data.booking[no].out_trade_no,
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
                                                    booking_id: that.data.booking[no].id,
                                                    out_refund_no: out_refund_no,
                                                    open_id: wx.getStorageSync('openid'),
                                                    msg_data: data,
                                                },
                                                success: function(res) {

                                                    if (res.data.status == true) {
                                                        var booking = that.data.booking;
                                                        booking[no].out_refund_no = out_refund_no
                                                        booking[no].state = 2
                                                        that.setData({
                                                            booking: booking
                                                        })
                                                    }
                                                }
                                            })
                                        }
                                    })
                                    that.onLoad()
                                } else {}
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
                                booking_id: that.data.booking[no].id,
                                open_id: wx.getStorageSync('openid'),
                                msg_data: data,
                            },
                            success: function(res) {

                                if (res.data.status == true) {
                                    var booking = that.data.booking;
                                    booking[no].out_refund_no = out_refund_no
                                    booking[no].state = 2
                                    that.setData({ booking: booking })
                                }
                            }
                        })
                    }
                } else if (res.cancel) {}
            }
        })
    },


    //called when user wants to write comment
    btn_write_comment: function(event) {
        var that = this;
        var item = that.data.booking[event.currentTarget.id];
        wx.navigateTo({
            url: '../../other/evaluation/evaluation?id=' + item.id + '&event_id=' + item.event_id
        })
    },
    onclick_go: function() {
        wx.switchTab({
            url: '../../activity/activity',
        })
    }

})
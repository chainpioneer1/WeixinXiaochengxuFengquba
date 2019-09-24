// pages/booking/bookingCancel.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        book_date: wx.getStorageSync('book_date'),
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
        _tmr: 0,
        isFirstInit: true,
        isPayProcessing: false,
        remained_time: '10分0秒'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(option) {

        var that = this;
        that.data.options = option;
        that.data.curBossId = option.id;
        that.data.curBookingId = option.book;
        that.setData({
            id: option.id, // applied user id
        })

    },
    onShow: function() {
        var that = this;
        var option = that.data.options;
        wx.showLoading({
            title: '加载中',
        })
        if (true || app.globalData.userInfo.user_id == 0)
            app.onInitialize(function() {
                that.onInitStart(option);
            })
        else
            that.onInitStart(option);
    },

    onInitStart: function(options) {
        var that = this;

        that.data.curUserId = app.globalData.userInfo.user_id;

        // var book_date = wx.getStorageSync('book_date');
        // var tDate = new Date(book_date + ' 00:00:00');
        // that.data.book_date = tDate.getFullYear() + '-' + (tDate.getMonth() + 1) + '-' + tDate.getDate();
        // that.data.bookList = wx.getStorageSync('book_info');

        // this.setData({
        //     eventType: app.globalData.eventType,
        //     userRole: app.globalData.userRole,
        //     bookingState: app.globalData.eventState,
        //     eventState: app.globalData.eventState,
        //     book_date: this.data.book_date,
        // });
        var id = this.data.curBossId;
        clearInterval(that.data._tmr);

        wx.request({
            url: app.globalData.mainURL + 'api/getUserDetail',
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            data: {
                'user_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                // console.log(res.data);
                if (res.data.status) {
                    that.setData({
                        user: res.data.result[0]
                    })

                }
            }
        }); // set swiper image

        wx.request({
            url: app.globalData.mainURL + 'api/getSiteDetail',
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            data: {
                'boss_id': id,
                'user_id': app.globalData.userInfo.user_id,
            },
            success: function(res) {
                //                console.log(res.data);
                if (res.data.status) {
                    that.data.site_info = res.data;
                    that.setData({
                        booking: that.data.site_info.site[0]
                    })
                    var totalBook = that.data.site_info.site_booking;
                    var currentBook = totalBook.find(function(a) { return a.id == that.data.curBookingId });
                    console.log(totalBook);
                    var tDate = new Date(currentBook.start_time.replace(/-/g, '/'));
                    that.data.book_date = tDate.getFullYear() + '-' + (tDate.getMonth() + 1) + '-' + tDate.getDate();
                    that.data.bookList = JSON.parse(currentBook.book_info);
                    that.data.currentBook = currentBook;

                    that.setData({
                        eventType: app.globalData.eventType,
                        userRole: app.globalData.userRole,
                        bookingState: app.globalData.eventState,
                        eventState: app.globalData.eventState,
                        book_date: that.data.book_date,
                    });

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
                    app.globalData.userInfo.honey = parseInt(app.globalData.userInfo.honey);
                    app.globalData.userInfo.amount = parseFloat(app.globalData.userInfo.amount);
                    app.globalData.userInfo.amount_withdraw = parseFloat(app.globalData.userInfo.amount_withdraw);
                    that.prepare_payment(totalPrice, app.globalData.userInfo.honey, app.globalData.userInfo.amount_withdraw, 2); // price, honey, wallet, pay_type(0-offline, 1-online pay)
                    var submit_time = new Date(currentBook.submit_time.replace(/-/g, '/') + '');
                    submit_time.setTime(submit_time.getTime() + 600000);
                    clearInterval(that.data._tmr);
                    that.data._tmr = setInterval(function() {
                        var curTime = new Date();
                        var diff = parseInt((submit_time.getTime() - curTime.getTime()) / 1000);
                        var min = parseInt(diff / 60);
                        var sec = diff - min * 60;
                        console.log(min + ':' + sec);
                        if (diff < 0) {
                            clearInterval(that.data._tmr);
                            that.showWarningModal();
                            return;
                        }
                        that.setData({
                            remained_time: min + '分' + sec + '秒'
                        })
                    }, 1000);
                }
            },
            complete: function() {
                wx.hideLoading({});
            }
        });
    },
    onUnload: function() {
        this.onHide();
    },
    onHide: function() {
        clearInterval(this.data._tmr);
        clearTimeout(this.data._tmr);
    },
    showWarningModal: function() {
        wx.showModal({
            title: '提示',
            content: '该订单已经失效, 请重新下单',
            showCancel: false,
            // confirmText: '是',
            // cancelText: '否',

            success: function(res) {
                if (res.confirm) {
                    wx.navigateBack({ delta: 1 });
                }
            }
        })
    },
    //called when user clicked cancel booking button
    onclick_cancel_booking: function() {

        var that = this;
        if (that.data.cancel_state == '') {
            return;
        }
        wx.showModal({
            content: '是否取消订单？',
            success: function(res) {
                if (res.confirm) {
                    var out_refund_no = app.globalData.mch_id + Date.now();
                    wx.request({
                        url: app.globalData.mainURL + 'api/datamanage/cancelRoomBooking',
                        method: 'POST',
                        header: {
                            'content-type': 'application/json'
                        },
                        data: {
                            booking_id: that.data.booking.id,
                            out_refund_no: out_refund_no
                        },
                        success: function(res) {

                            if (res.data.status == true) {
                                wx.navigateBack({
                                    delta: 2
                                })
                            }
                        }
                    });
                } else if (res.cancel) {}
            }
        })
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
    on_Input_Phonenumber: function(e) {
        this.data.user.phone = e.detail.value;
        this.setData({
            user: this.data.user
        })
    },

    ///////////////////////// pay_template processor //////////////////////////////////
    prepare_payment: function(price, honey, wallet, pay_type) {

        if (price == undefined) price = 0; // total price for pay needed
        if (honey == undefined) honey = 0; // user's honey
        if (wallet == undefined) wallet = 0; // user's wallet
        if (pay_type == undefined) pay_type = 0; // 0-offline paymeng, 1-online payment

        if (pay_type == 2) pay_type = 1;
        var that = this;
        that.data.price = price;
        that.data.old_wallet = wallet;

        that.data.phone = '';
        that.data.name = '';

        var honey_list = [];
        var honey_unit = 10000;
        var honey_rule = parseInt(app.globalData.rule[8].value);
        var honey_price_rule = honey_unit / honey_rule * parseFloat(app.globalData.rule[9].value);
        if (app.globalData.userInfo.isVIP == 1) {
            honey_rule = parseInt(app.globalData.rule[10].value);
            honey_price_rule = honey_unit / honey_rule * parseFloat(app.globalData.rule[11].value);
        }

        if (honey_rule > honey) honey_rule = honey;
        for (var i = honey_unit; i <= honey_rule; i += honey_unit) {
            honey_list.push(i);
        }
        that.setData({
            total_cost: price,

            pay_price: price,
            honey_list: honey_list,
            honey_id: 0,
            wallet: wallet,

            pay_type: pay_type, //0-offline, 1-online payment
            book_id: 918, // record id for booking
            book_type: 2, // 0-activity booking, 1-event booking, 2-room booking

            select_honey: 0,
            chk_imgs: ["../../../image/hook_n@2x.png", "../../../image/hook_s.png"],
            check_honey: 0,
            check_wallet: 0,
            honey_price_unit: honey_price_rule,

        });
        that.calculate_pay_price();
    },
    show_select_honey: function(event) {
        var that = this;
        if (that.data.check_honey == 1)
            that.setData({
                select_honey: 1
            })
    },
    select_honey_price: function(event) {
        var that = this;
        var idx = parseInt(event.currentTarget.dataset.id);
        that.setData({
            select_honey: 0,
            honey_id: idx,
        })
        that.calculate_pay_price();
    },
    payment_check: function(event) {
        var that = this;
        var type = event.currentTarget.dataset.type;
        switch (type) {
            case 'honey':
                that.data.check_honey = 1 - that.data.check_honey;

                break;
            case 'wallet':
                that.data.check_wallet = 1 - that.data.check_wallet;
                break;
        }
        that.calculate_pay_price();
        if (type == 'honey' && that.data.check_honey == 0.0) {
            wx.showToast({
                title: '当总价大于蜂蜜价时，可以使用蜂蜜!',
                icon: 'none',
                duration: 2000
            });
        }
    },
    calculate_pay_price: function() {
        var that = this;
        that.data.price = that.data.total_cost * 1;

        that.data.pay_price = that.data.price;
        that.data.wallet = that.data.old_wallet;
        if (that.data.check_honey == 1 && that.data.pay_price * 1 >= (that.data.honey_id * 1 + 1) * that.data.honey_price_unit)
            that.data.pay_price = that.data.pay_price - (that.data.honey_id * 1 + 1) * that.data.honey_price_unit;
        else if (that.data.honey_id == 0)
            that.data.check_honey = 0;

        if (that.data.check_wallet == 1) { // if wallet pay selected
            if (that.data.pay_price >= that.data.wallet * 1) { // if pay price > wallet 
                that.data.pay_price = that.data.pay_price - that.data.wallet;
                that.data.wallet = 0;
            } else { // wallet > pay price
                that.data.wallet -= that.data.pay_price;
                that.data.pay_price = 0;
            }
        }

        that.data.check_honey = parseFloat(that.data.check_honey.toFixed(2))
        that.data.check_wallet = parseFloat(that.data.check_wallet.toFixed(2))
        that.data.pay_price = parseFloat(that.data.pay_price.toFixed(2))
        that.data.wallet = parseFloat(that.data.wallet.toFixed(2))

        that.setData({
            check_honey: that.data.check_honey,
            check_wallet: that.data.check_wallet,
            pay_price: that.data.pay_price,
            wallet: that.data.wallet
        })
        that.data.isPayProcessing = false;
    },
    perform_pay: function(event) {
        var that = this;
        var type = that.data.pay_type;
        var item_id = that.data.book_id;
        var book_mode = that.data.book_type;

        if (this.data.user.phone.length == 0) {
            wx.showToast({
                title: '请填写手机号码',
                icon: 'none'
            })
            return;
        }
        if (!app.checkValidPhone(this.data.user.phone)) {
            wx.showToast({
                title: '请填写正确的手机号码',
                icon: 'none'
            })
            return;
        }
        if (!app.checkValidPhone(this.data.site_info.site[0].phone)) {
            wx.showToast({
                title: '商家电话号不正确，短信无法发送',
                icon: 'none',
                duration: 2000
            })
        }

        that.data.formId = event.detail.formId;

        if (that.data.isPayProcessing) return;
        that.data.isPayProcessing = true;

        var out_trade_no = app.globalData.mch_id + Date.now() + (10000 + Math.floor(Math.random() * 90000))
        that.data.share_day = (new Date(that.data.book_date.replace(/-/g, '/') + ' 00:00:00')).getDay();

        if (that.data.pay_type == 1 && that.data.pay_price != 0) {
            console.log(that.data.pay_price)
            var ordercode = that.data.pay_price;
            that.data.out_trade_no = out_trade_no;
            that.add_booking(function() {
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
                                    clearInterval(that.data._tmr);
                                    var userId = app.globalData.userInfo.user_id + '';
                                    app.globalData.userInfo.user_id = 0;
                                    wx.redirectTo({
                                        url: 'booking_final?bid=' + that.data.curBossId + '&uid=' + userId + '&sday=' + that.data.share_day,
                                        success: function() {}
                                    });
                                }
                            },
                            complete: function(res) {
                                that.data.isPayProcessing = false;
                                that.data.isfirstbtn = 0
                            }
                        })
                    }
                })

            });
        } else {
            // offline payment
            that.data.out_trade_no = '';
            that.add_booking(function() {
                that.data.isfirstbtn = 0;
                that.data.isPayProcessing = false;

                clearInterval(that.data._tmr);
                var userId = app.globalData.userInfo.user_id + '';
                app.globalData.userInfo.user_id = 0;
                wx.redirectTo({
                    url: 'booking_final?bid=' + that.data.curBossId + '&uid=' + userId + '&sday=' + that.data.share_day,
                    success: function() {}
                });
            });
        }
    },

    add_booking: function(callback) {
        var that = this;
        var share_day = that.data.share_day;
        var data = {
            touser: wx.getStorageSync('openid'),
            template_id: app.globalData.templateIds.order_start,
            page: 'pages/profile/profile',
            form_id: that.data.formId,
            data: {
                keyword1: { value: that.data.site_info.site[0].site_name, color: '#000' },
                keyword2: { value: that.data.site_info.site[0].detail_address, color: '#000' },
                keyword3: { value: that.data.currentBook.start_time, color: '#000' },
                keyword4: { value: that.data.currentBook.end_time, color: '#000' },
                keyword5: { value: that.data.price + '元', color: '#000' },
                keyword6: { value: 'info2', color: '#000' },
            },
            color: '#ff0000',
            emphasis_keyword: 'keyword1.DATA',
        };

        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/addRoomBookingPrepare',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                open_id: wx.getStorageSync('openid'),
                user_info: JSON.stringify({
                    name: that.data.user.nickname,
                    phone: that.data.user.phone
                }),
                msg_data: data,
                book_id: that.data.curBookingId,
                share_day: share_day,
                book_date: that.data.book_date,
                pay_type: that.data.pay_type,
                out_trade_no: that.data.out_trade_no,

                wallet: that.data.wallet,
                pay_cost: that.data.price,
                pay_online: that.data.pay_price,
                pay_honey: ((that.data.check_honey == 1) ? (that.data.honey_id * 1 + 1) * that.data.honey_price_unit : 0),

            },
            success: function(res) {
                if (callback) callback();
            },
            fail: function() {
                that.data.isPayProcessing = false;
            }
        });
    },


    ////////////////////////////////////////////////////////////////////////

})
const app = getApp()

Page({
    data: {
        nickname: "",
        user_avatar: "",
        event: [],
        realname: "",
        phonenumber: 0,
        memcount: 1,
        totalcost: 0,
        register_num: 0,
        user_id: 0,
        id: 0,
        pay_type: 1,
        btnstrarray: ["确认参加", "确认支付"],
        condStr: ['不可退', '可随时退、过期退'],
        isfirstbtn: 0,
        isPayProcessing: false,
        _tmr: 0,
    },
    onLoad: function(option) {
        var that = this;
        that.data.options = option;
        that.data.mem_count_img = [
            '../../../image/minus@2x.png', '../../../image/minus_hover@2x.png',
            '../../../image/plus@2x.png', '../../../image/plus_hover@2x.png'
        ];
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
        if (true || app.globalData.userInfo.user_id == 0)
            app.onInitialize(function() {
                that.onInitStart(option);
            })
        else
            that.onInitStart(option);
    },
    onInitStart: function(option) {
        var that = this;
        that.setData({
            userInfo: app.globalData.userInfo,
            userRole: app.globalData.userRole,
            id: option.id
        })

        clearInterval(that.data._tmr);
        wx.request({
                url: app.globalData.mainURL + 'api/datamanage/getBossgroupOrder',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data: {
                    'book_id': that.data.id,
                },
                success: function(res) {
                    console.log(res.data);
                    if (!res.data.status) return;
                    var info = res.data.result;
                    info.id = that.makeNDigit(info.id, 16);
                    info.start_time = info.start_time.split(' ')[0];
                    info.end_time = info.end_time.split(' ')[0];

                    that.setData({
                        info: info,
                        val_memcount: info.reg_num,
                    })
                    that.change_mem_count();

                    app.globalData.userInfo.honey = parseInt(app.globalData.userInfo.honey);
                    app.globalData.userInfo.amount = parseFloat(app.globalData.userInfo.amount);
                    app.globalData.userInfo.amount_withdraw = parseFloat(app.globalData.userInfo.amount_withdraw);
                    that.prepare_payment(that.data.total_cost, app.globalData.userInfo.honey, app.globalData.userInfo.amount_withdraw, 2); // price, honey, wallet, pay_type(0-offline, 1-online pay)
                    var submit_time = new Date(info.submit_time.replace(/-/g, '/') + '');
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

                },
                complete: function() {
                    wx.hideLoading({});
                }
            })
            //code for liseter paticipate
    },
    makeNDigit: function(num, len) {
        num = num.toString();
        if (!len) len = 2;
        var ret = ''
        for (var i = 0; i < len; i++) {
            ret += '0';
        }
        ret += num;
        ret = ret.substr(-len);
        return ret;
    },
    on_input_userinfo: function(event) {
        var type = event.currentTarget.dataset.type;
        switch (type) {
            case 'username':
                this.data.info.name = event.detail.value;
                break;
            case 'phone':
                this.data.info.phone = event.detail.value;
                break;
        }
        this.setData({ info: this.data.info });
    },
    change_mem_count: function(event) {
        var that = this;
        var memcount = parseInt(that.data.val_memcount);
        var btnType = '';
        if (event) btnType = event.currentTarget.dataset.type;
        var user = app.globalData.userInfo;
        that.setData({
            min_img: that.data.mem_count_img[0],
            plus_img: that.data.mem_count_img[2],
        })
        switch (btnType) {
            case 'plus':
                memcount++;
                that.setData({
                    min_img: that.data.mem_count_img[0],
                    plus_img: that.data.mem_count_img[3],
                })
                break;
            case 'minus':
                memcount--;
                that.setData({
                    min_img: that.data.mem_count_img[1],
                    plus_img: that.data.mem_count_img[2],
                })
                break;
        }
        if (memcount > (that.data.info.limit)) {
            memcount = that.data.info.limit;
        } else if (memcount < 1) memcount = 1;

        var cost = (1 * memcount) * (1 * this.data.info.group_price)
        if (cost == 0) {
            this.setData({ total_cost: 0 })
        } else {
            this.setData({ total_cost: cost.toFixed(2) })
        }
        that.setData({
            val_memcount: memcount,
        })
    },
    checkValidation: function() {
        var x = 0;
        var ret = false;
        if (this.data.info.name.length == 0) {
            x++
            wx.showToast({
                title: '请填写真实姓名',
                icon: 'none'
            })
            return ret;
        }
        if (this.data.info.name.length > 16) {
            x++
            wx.showToast({
                title: '姓名应不超过16个字',
                icon: 'none'
            })
            return ret;
        }
        if (true || this.data.info.phone == 1) {
            if (this.data.info.phone.length == 0) {
                x++
                wx.showToast({
                    title: '请填写手机号码',
                    icon: 'none'
                })
                return ret;
            }
            if (!app.checkValidPhone(this.data.info.phone)) {
                x++
                wx.showToast({
                    title: '请填写正确的手机号码',
                    icon: 'none'
                })
                return ret;
            }
        }

        if (this.data.isfirstbtn == 1) {
            x++
            wx.showToast({
                title: '已支付了，请返回。',
                icon: 'none'
            })
            return ret;
        } else if (this.data.isfirstbtn == 0) {
            this.data.isfirstbtn = 1
        }
        ret = true;
        return ret;

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
    // on_click_payway: function(e) {
    //     var x = 1 * e.detail.value
    //     this.setData({ btnstr: this.data.btnstrarray[x] })
    //     this.data.pay_type = e.detail.value
    //     this.setData({
    //         pay_type: this.data.pay_type
    //     })
    //     this.calculate_pay_price();
    // },

    ///////////////////////// pay_template processor //////////////////////////////////
    prepare_payment: function(price, honey, wallet, pay_type) {

        if (price == undefined) price = 0; // total price for pay needed
        if (honey == undefined) honey = 0; // user's honey
        if (wallet == undefined) wallet = 0; // user's wallet
        if (pay_type == undefined) pay_type = 0; // 0-offline paymeng, 1-online payment

        if (pay_type == 2) pay_type = 1;

        var that = this;
        that.data.price = price;

        that.data.phone = '';
        that.data.comment = '';
        that.data.name = '';
        that.data.old_wallet = wallet;
        that.data.mem_count_img = [
            '../../../image/minus@2x.png', '../../../image/minus_hover@2x.png',
            '../../../image/plus@2x.png', '../../../image/plus_hover@2x.png'
        ];

        var honey_unit = 10000;
        var honey_list = [];
        var honey_rule = parseInt(app.globalData.rule[12].value);
        var honey_price_rule = honey_unit / honey_rule * parseFloat(app.globalData.rule[13].value);

        if (honey_rule > honey) honey_rule = honey;
        for (var i = honey_unit; i <= honey_rule; i += honey_unit) {
            honey_list.push(i);
        }

        if (app.globalData.userInfo.isVIP != 1) {
            honey_unit = 0; //parseInt(app.globalData.rule[10].value);
            honey_price_rule = 0; //parseFloat(app.globalData.rule[11].value);
            honey_list = [];
        }

        that.setData({
            total_cost: price,
            pay_price: price,
            honey_list: honey_list,
            honey_id: 0,
            wallet: wallet * 1,

            pay_type: pay_type, //0-offline, 1-online payment
            book_id: that.data.info.id, // record id for booking
            book_type: 0, // 0-activity booking, 1-event booking, 2-room booking

            select_honey: 0,
            chk_imgs: ["../../../image/hook_n@2x.png", "../../../image/hook_s.png"],
            check_honey: 0,
            check_wallet: 0,
            honey_price_unit: honey_price_rule,

            min_img: that.data.mem_count_img[0],
            plus_img: that.data.mem_count_img[2],

        });

        this.calculate_pay_price();
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

        if (that.data.check_wallet == 1) {
            if (that.data.pay_price * 1 >= that.data.wallet * 1) {
                that.data.pay_price = that.data.pay_price - that.data.wallet;
                that.data.wallet = 0;
            } else {
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
        });
        that.data.isPayProcessing = false;
    },
    perform_pay: function(event) {
        var that = this;


        if (that.checkValidation() == false) return;

        if (that.data.isPayProcessing) return;
        that.data.isPayProcessing = true;

        that.data.out_trade_no = '';
        if (that.data.pay_type == 1 && that.data.pay_price != 0) {
            var ordercode = that.data.pay_price;
            var out_trade_no = app.globalData.mch_id + Date.now() + (10000 + Math.floor(Math.random() * 90000))
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
                                    that.data.isPayProcessing = false;
                                    app.globalData.userInfo.user_id = 0;
                                    wx.redirectTo({
                                        url: '../detail_bossgroup/bossgroup_success?id=' + that.data.info.id,
                                        success: function() {}
                                    })
                                }
                            },
                            complete: function(res) {
                                that.data.isPayProcessing = false;
                                that.data.isfirstbtn = 0;
                            }
                        })
                    }
                })
            });
        } else if (that.data.price != 0) {
            // offline payment
            that.data.out_trade_no = '';
            that.data.pay_price = 0;
            that.add_booking(function() {
                that.data.isfirstbtn = 0;
                that.data.isPayProcessing = false;
                clearInterval(that.data._tmr);
                app.globalData.userInfo.user_id = 0;
                wx.redirectTo({
                    url: '../detail_bossgroup/bossgroup_success?id=' + that.data.info.id,
                    success: function() {}
                })
            });
        } else {
            that.data.out_trade_no = '';
            that.data.pay_price = 0;
            that.data.pay_honey = 0;
            that.data.pay_online = 0;
            that.data.pay_type = 0;
            that.data.check_honey = 0;
            that.add_booking(function() {
                that.data.isfirstbtn = 0;
                that.data.isPayProcessing = false;
                clearInterval(that.data._tmr);
                app.globalData.userInfo.user_id = 0;
                wx.redirectTo({
                    url: '../detail_bossgroup/bossgroup_success?id=' + that.data.info.id,
                    success: function() {}
                })
            });
        }
    },

    add_booking: function(callback) {
        var that = this;
        wx.setStorageSync('group_paid', 1);
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/addGroupBookingPrepare',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                book_id: parseInt(that.data.info.id),

                out_trade_no: that.data.out_trade_no,
                user_info: JSON.stringify({
                    name: that.data.info.name,
                    phone: that.data.info.phone
                }),

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
        })
    },

    ////////////////////////////////////////////////////////////////////////

})
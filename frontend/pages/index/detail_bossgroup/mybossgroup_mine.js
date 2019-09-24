const app = getApp()
var QR = require("../../../utils/qrcode");

Page({
    data: {
        uploadURL: app.globalData.uploadURL,
        nickname: "",
        user_avatar: "",
        event: [],
        info: {
            pay_cost: 0,
            pay_honey: 0
        },
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
        bookingState: ["已支付", "进行中", "已完成", "已取消", "待支付", "已过期"],
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
            userInfo: app.globalData.userInfo,
            userRole: app.globalData.userRole,
            id: option.id
        })

        wx.getSystemInfo({
            success: function(res) {
                var _sW = res.windowWidth;
                var _sH = res.windowHeight;

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
                        if (!res.data.status) return;
                        var info = res.data.result;
                        info.id = that.makeNDigit(info.id, 16);
                        info.start_time = info.start_time.split(' ')[0];
                        info.end_time = info.end_time.split(' ')[0];
                        info.book_info = JSON.parse(info.book_info);
                        var isQRshowed = false;
                        var isUsed = false;
                        for (var i = 0; i < info.book_info.length; i++) {
                            var item = info.book_info[i];
                            item.order_code = that.makeNDigit(info.id, 4) + item.order_code;
                            item.view_order_code = that.makeViewCode(item.order_code);
                            if (item.is_used == 1) {
                                isUsed = true;
                                continue;
                            }
                            if (!isQRshowed) {
                                QR.qrApi.draw(item.order_code, 'qrcanvas', _sW * .25, _sW * .25);
                                isQRshowed = true;
                            }
                        }
                        if (info.user_info)
                            info.user_info = JSON.parse(info.user_info);
                        that.setData({
                            info: info,
                            isUsed: isUsed,
                            val_memcount: info.reg_num,
                            picture: res.data.picture
                        })
                        var isFirst = wx.getStorageSync('group_paid');
                        if (isFirst == '1') {
                            that.showWarningModal();
                            wx.setStorageSync('group_paid', 0)
                        }
                    },
                    complete: function() {
                        wx.hideLoading({});
                    }
                });
            }
        });
        //code for liseter paticipate
    },
    makeViewCode: function(code) {
        code = code.toString();
        var len = code.length;
        var ret = '';
        for (var i = 0; i < len; i++) {
            ret += code.substr(i, 1);
            if ((i + 1) % 4 == 0) ret += ' ';
        }
        return ret;
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
    show_preview: function(e) {
        var that = this
        var url = e.currentTarget.dataset.src;
        wx.previewImage({
            current: url,
            urls: [url],
        })
    },
    previewImage: function() {
        wx.canvasToTempFilePath({
            canvasId: 'qrcanvas',
            success: function(res) {
                var tempFilePath = res.tempFilePath;
                console.log(tempFilePath);
                wx.previewImage({
                    current: tempFilePath, // 当前显示图片的http链接  
                    urls: [tempFilePath] // 需要预览的图片http链接列表  
                })
            },
            fail: function(res) {
                // console.log(res);
            }
        });
    },
    go2Codeview: function(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: 'bossgroup_codeview?id=' + id
        })
    },
    go2Target: function(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var type = e.currentTarget.dataset.type;
        switch (type) {
            case 'boss':
                wx.navigateTo({
                    url: '../detail_gym/detail_gym?id=' + id
                })
                break;
            case 'feedback':
                wx.navigateTo({
                    url: '../../profile/my_booking/book_evaluation?id=' + id + '&&room_id=0'
                })
                break;
            case 'cancel':
                that.onclick_cancel_booking();
                break;
        }
    },

    //called when user clicked cancel booking button
    onclick_cancel_booking: function() {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '是否取消您的团购订单？',
            confirmText: '是',
            cancelText: '否',
            success: function(res) {
                if (res.confirm) {
                    var ordercode = that.data.info.pay_online;
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
                                            user_id: that.data.info.user_id,
                                            out_trade_no: that.data.info.out_trade_no,
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
            url: app.globalData.mainURL + 'api/datamanage/cancelGroupBooking',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                booking_id: that.data.info.id,
                out_refund_no: out_refund_no
            },
            success: function(res) {
                wx.showModal({
                    title: '团购退款成功',
                    content: '退款已经发起，请耐心等待',
                    showCancel: false,
                    // confirmText: '是',
                    // cancelText: '否',
                    success: function(res) {
                        wx.navigateBack({ delta: 1 });
                    }
                });

                // that.setData({
                //     showModal: true
                // })
            }
        })
    },
    showWarningModal: function() {
        wx.showModal({
            title: '团购成功',
            content: '团购码是消费兑换使用的唯一凭证，切勿泄露给他人',
            showCancel: false,
            // confirmText: '是',
            // cancelText: '否',
            success: function(res) {}
        })
    },
    onShareAppMessage: function(res) {
        console.log("SHARED")
        if (res.from === 'button') {
            console.log(res.target)
        }

        var that = this;
        return {
            title: '我的团购',
            path: '/pages/index/detail_bossgroup/bossgroup_success?id=' + that.data.info.id,
            success: function(res) {},
            fail: function(res) {}
        }
    }

    ////////////////////////////////////////////////////////////////////////

})
const app = getApp()

Page({
    data: {
        uploadURL: app.globalData.uploadURL,
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
        btnstrarray: ["提交订单", "未开始", "已过期"],
        isBtnDisabled: 1,
        condStr: ['不可退', '可随时退、过期退'],

        isfirstbtn: 0,
        isPayProcessing: false,
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

        wx.request({
                url: app.globalData.mainURL + 'api/datamanage/getBossgroupDetail',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data: {
                    'no': that.data.id,
                },
                success: function(res) {
                    if (!res.data.status) return;
                    var info = res.data.result;
                    info.group_desc = JSON.parse(info.group_desc);
                    console.log(info.group_desc);

                    var period_start = new Date(info.start.replace(/-/g, '/') + ' 00:00:00');
                    var period_end = new Date(info.end.replace(/-/g, '/') + ' 23:59:59');
                    var curDate = new Date();
                    that.data.isBtnDisabled = 0;
                    // if (period_start > curDate) that.data.isBtnDisabled = 1;
                    if (period_end < curDate) that.data.isBtnDisabled = 2;

                    that.setData({
                        isBtnDisabled: that.data.isBtnDisabled,
                        info: info,
                        val_memcount: 1,
                    })
                    that.change_mem_count();
                },
                complete: function() {
                    wx.hideLoading({});
                }
            })
            //code for liseter paticipate
    },
    show_preview: function(e) {
        var that = this
        var url = e.currentTarget.dataset.src;
        wx.previewImage({
            current: url,
            urls: [url],
        })
    },
    on_Input_Memcount: function(event) {
        if (event.detail.value == '') return;
        this.setData({ val_memcount: event.detail.value });
        this.change_mem_count();
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

    add_booking: function() {
        var that = this;
        if (that.data.isBtnDisabled != 0) return;

        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/orderGroupBooking',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                user_id: app.globalData.userInfo.user_id,
                boss_id: that.data.info.boss_id,
                bossgroup_id: that.data.info.no,
                reg_num: that.data.val_memcount,
                out_trade_no: '',
                pay_cost: that.data.total_cost,
                start_time: that.data.info.start,
                end_time: that.data.info.end
            },
            success: function(res) {
                that.data.isPayProcessing = false;
                that.data.isfirstbtn = 0;
                if (!res.data.status) {
                    wx.showToast({
                        title: '订单失败',
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                }
                wx.redirectTo({
                    url: '../bossgroup_input/bossgroup_input?id=' + res.data.book_id,
                    success: function() {
                        that.data.isfirstbtn = 0
                    }
                })
            }
        })
    },
    onShareAppMessage: function(res) {
        console.log("SHARED")
        if (res.from === 'button') {
            console.log(res.target)
        }

        var that = this;
        var title = that.data.info.group_package + ', 已售: ' + that.data.info.sell_cnt;
        title = that.data.info.group_package + ', 仅售' + that.data.info.group_price + '元';
        return {
            title: title,
            path: '/pages/index/detail_bossgroup/detail_bossgroup?id=' + that.data.id,
            success: function(res) {},
            fail: function(res) {}
        }
    }

    ////////////////////////////////////////////////////////////////////////

})
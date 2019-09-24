//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        uploadURL: app.globalData.uploadURL,
        event: {
            start_time: '',
            end_time: '',
            province: '',
            area: '',
            city: '',
            detail_address: '',
            pic: ''
        },
        show_state: false,
        pictures: [],
        id: '',
        focus: false,
        booking: [],
        pay_type_array: ["线下支付", "线上支付", "线上支付/线下支付"],
        eventType: [],
        userRole: [],
        eventState: [],
        feedbacks: [],
        is_full: false,
        is_registered: false,
        register_amount: 0,
        btn_text: '立即报名',
        is_disabled: true,
        rating: 0,
        rating_amount: 0,
        fav_img_list: ['../../../image/good_n@2x.png', '../../../image/good_s@2x.png'],
        comment: '',
        selected_index: -1,
        tmr_id: 0,
        my_booking_state: 0, //0:can booking, 1: can cancel
        font_size: "",
        my_booking: {},
        tmrID: 0,
        delta: 0,
        isFirstInit: true,
        isProcessing: false,
    },
    onLoad: function(option) {
        /////// temporary added ///
        // option.id = 1338;
        //////////////////////////

        var that = this;
        that.data.options = option;
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
        var _this = app;
        wx.login({
            success: function(res) {
                _this.globalData.user_code = res.code;
                wx.request({
                    url: _this.globalData.mainURL + "api/getopenid",
                    data: {
                        code: _this.globalData.user_code
                    },
                    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
                    header: {
                        'content-type': 'application/json'
                    }, // 设置请求的 header    
                    success: function(res) {
                        var obj = {};
                        _this.globalData.token = res.data.token;
                        obj.openid = res.data.openid;
                        obj.expires_in = Date.now() + res.data.expires_in;
                        _this.globalData.open_id_info = obj;
                        wx.setStorageSync('openid', res.data.openid); //存储openid 
                        wx.setStorageSync('session_key', res.data.session_key)

                        if (app.globalData.userInfo.user_id == 0)
                            app.onInitialize(function() {
                                that.onInitStart(option);
                            })
                        else
                            that.onInitStart(option);

                        // console.log('User step is ', wx.getStorageSync('user_step'));
                    }
                });
            }
        })
    },
    onInitStart: function(option) {
        this.data.isProcessing = true;
        this.setData({
            userInfo: app.globalData.userInfo,
            eventType: app.globalData.eventType,
            userRole: app.globalData.userRole,
            eventState: app.globalData.eventState
        });
        var that = this;
        that.setData({
            id: option.id
        })

        wx.request({
                url: app.globalData.mainURL + 'api/datamanage/addReadCount',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data: {
                    'event_id': that.data.id,
                },
                success: function(res) {
                    that.refresh(1);
                }
            })
            //code for liseter paticipate
    },
    refresh: function(sort_flag) {
        if (sort_flag == undefined) sort_flag = 0;
        var that = this;
        wx.request({
            url: app.globalData.mainURL + 'api/getEventDetail',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'event_id': that.data.id,
                'user_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                //get sorted feedback array
                for (let index = 0; index < res.data.feedbacks.length; index++) {
                    if (res.data.feedbacks[index].avatar == "") {
                        res.data.feedbacks[index].avatar = "../image/user-unlogin.png";
                    }
                    var time_array = res.data.feedbacks[index].submit_time.split(":");
                    res.data.feedbacks[index].submit_time = time_array[0] + ":" + time_array[1];
                    var child_array = res.data.feedbacks[index].child_array;
                    if (child_array.length > 0) {
                        for (let idx = 0; idx < child_array.length; idx++) {
                            var times = child_array[idx].submit_time.split(":");
                            var time_str = times[0] + ":" + times[1];
                            var now = Date.now();
                            var tempdate = Date.parse(time_str.replace(/-/g, '/'))
                            if (now - tempdate < 120000) {
                                child_array[idx].submit_time = "刚刚"
                            } else if (now - tempdate < 3600000) {
                                var minute = (now - tempdate) / 60000
                                minute = Math.floor(minute)
                                child_array[idx].submit_time = minute + "分钟前"
                            } else if (now - tempdate < 86400000) {
                                var hour = (now - tempdate) / 3600000
                                hour = Math.floor(hour)
                                child_array[idx].submit_time = hour + "小时前"
                            } else if (now - tempdate < 172800000) {
                                child_array[idx].submit_time = "昨天"
                            } else {
                                var date_str = child_array[idx].submit_time.split(' ')[0]
                                child_array[idx].submit_time = date_str; // + ' ' + time_str
                            }
                        }
                        res.data.feedbacks[index].child_array = child_array;
                    }
                }
                if (sort_flag == '1') {
                    res.data.feedbacks.sort(that.compare_favorite);
                    res.data.feedbacks.sort(that.compare_orgState);
                }
                that.setData({
                    rating: 1 * res.data.favor[0],
                    feedbacks: res.data.feedbacks,
                    myId: app.globalData.userInfo.user_id
                })

                var event_buf = res.data.result[0];
                event_buf.favor_state = 1 * event_buf.favor_state

                // if (event_buf.eventName.length > 15) {
                //     var name = event_buf.eventName
                //     name = name.slice(0, 15) + '...'
                //     event_buf.eventName = name
                // }
                if (event_buf.role == '1') {
                    if (event_buf.site_name.length > 13) {
                        var site_name = event_buf.site_name
                        site_name = site_name.slice(0, 13) + '...'
                        event_buf.site_name = site_name
                    }
                }

                var time = event_buf.start_time.split(':');
                event_buf.start_time = time[0] + ':' + time[1];
                time = event_buf.end_time.split(':');
                event_buf.end_time = time[0] + ':' + time[1];
                var picture = event_buf.pic.split(",");
                var images = [];
                if (picture.length != 0) {
                    for (var index = 0; index < picture.length; index++) {
                        images[index] = app.globalData.uploadURL + picture[index]
                    }
                }
                var tempdate = Date.parse(event_buf.start_time.replace(/-/g, '/'))
                    /*if (tempdate - Date.now() < 21600000) {
                        if (event_buf.role == '1') {
                            event_buf.isbtn = 0;
                        } else {
                            if (tempdate < Date.now()) {
                                event_buf.isbtn = 0;
                            } else {
                                event_buf.isbtn = 1
                            }
                        }
                    }*/

                if (tempdate < Date.now() || event_buf.isCancel == 0) { // already actived or cannot cancel
                    event_buf.isbtn = 0;
                } else {
                    event_buf.isbtn = 1
                }

                wx.setNavigationBarTitle({
                    title: app.globalData.eventType[event_buf.type] + '活动'
                })

                //get booking
                var books = res.data.booking;
                var registered_num = 0;
                that.setData({
                    event: event_buf,
                    id: that.data.id,
                    pictures: images,
                    comment: '',
                    favourite_num: 1 * res.data.result[0].favor_state,
                    is_registered: false,
                    is_disabled: false,
                    my_booking_state: 0,
                    font_size: "",
                    my_booking: {},
                    btn_text: "立即报名"
                })
                that.data.favourite_num = 1 * res.data.result[0].favor_state;
                that.data.is_registered = false;
                that.data.is_disabled = false;
                that.data.my_booking_state = 0;
                that.data.font_size = "";
                that.data.my_booking = {};
                that.data.btn_text = "立即报名";

                var isExist = false;
                for (var index = 0; index < books.length; index++) {

                    console.log(books[index].nickname)
                    if (books[index].user_id == app.globalData.userInfo.user_id && 1 * books[index].state == 0) {
                        if (that.data.event.isbtn == 1) {
                            that.setData({
                                is_registered: true,
                                is_disabled: false,
                                btn_text: '已报名点击取消',
                                my_booking_state: 1,
                                font_size: "small",
                                my_booking: books[index]
                            })
                            registered_num += 1 * books[index].reg_num;
                            isExist = true;
                        } else {
                            that.setData({
                                is_registered: true,
                                is_disabled: true,
                                btn_text: '已报名',
                            })
                            registered_num += 1 * books[index].reg_num;
                            isExist = true;
                        }
                        that.data.my_booking_state = 1;
                    } else if (1 * books[index].state == 2) {
                        // if (books[index].nickname == app.globalData.userInfo.nickname) {
                        //     that.setData({
                        //         is_registered: true,
                        //         is_disabled: true,
                        //         btn_text: '已取消报名',
                        //         font_size: "medium"
                        //     })
                        // }
                        // books.splice(index, 1)
                        // index--;
                    } else {
                        registered_num += 1 * books[index].reg_num;
                    }
                }

                that.setData({
                    register_amount: registered_num,
                })

                if (registered_num >= res.data.result[0].limit && that.data.btn_text == '立即报名') {
                    that.setData({
                        is_disabled: true,
                        btn_text: '人数已满'
                    })
                }
                for (var iter = 0; iter < books.length; iter++) {
                    if (books[iter].name == null) {
                        books[iter].name = books[iter].nickname
                    }
                }
                that.setData({
                    booking: books
                })

                console.log(that.data.event);
                console.log(that.data.booking);
                console.log(that.data.feedbacks);
                that.create_canvas();


                if (res.data.result[0].state != '0') {
                    that.setData({
                        is_disabled: true,
                        btn_text: '活动完成'
                    })
                }
                that.data.isProcessing = false;
            },
            complete: function() {
                wx.hideLoading({});
            }
        })
    },

    create_canvas: function() {
        var that = this;
        console.log('pages/index/detail_event/detail_event?id=' + that.data.id);
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/getQR',
            data: {
                access_token: app.globalData.token,
                path: 'pages/index/detail_event/detail_event?id=' + that.data.id,
                user_id: app.globalData.userInfo.user_id
            },
            method: 'POST',
            header: { 'content-type': 'application/json' },
            success: function(res) {
                console.log(res.data);

                if (res.data.status) {
                    var image_url = app.globalData.mainURL + res.data.data;
                    wx.downloadFile({
                        url: image_url,
                        type: 'image',
                        success: (resp) => {
                            var qr_filePath = resp.tempFilePath;
                            image_url = that.data.uploadURL + 'global/picture02@2x.png';
                            wx.downloadFile({
                                url: image_url,
                                type: 'image',
                                success: (resp) => {
                                    var img_filePath = resp.tempFilePath;
                                    const ctx = wx.createCanvasContext('shareImg');

                                    var ww = 750;
                                    var hh = 745;

                                    ctx.drawImage(img_filePath, 0, 0, ww, 440);

                                    ctx.globalAlpha = 1.0
                                    ctx.setFillStyle('#ffffff')
                                    ctx.fillRect(0, 440, ww, hh - 440);

                                    ctx.setFillStyle('#000')
                                    ctx.font = 'bold 34px PingFangSC-Regular';
                                    ctx.fillText(that.data.event.eventName, 30, 502)

                                    var detail_addr = that.data.event.detail_address;
                                    if (detail_addr.length > 18) {
                                        that.setData({
                                            delta: 0
                                        })
                                    } else {
                                        that.setData({
                                            delta: 50
                                        })
                                    }

                                    ctx.font = 'normal 28px PingFangSC-Regular';
                                    ctx.drawImage('../../../image/my_bee_category@2x.png', 30, 535, 30, 30)
                                    ctx.fillText(that.data.eventType[that.data.event.type], 70, 560)
                                    ctx.drawImage('../../../image/my_bee_number@2x.png', 155, 535, 30, 30)
                                    ctx.fillText(that.data.register_amount + '/' + that.data.event.limit + '人', 190, 560)
                                    ctx.drawImage('../../../image/my_bee_m@2x.png', 310, 535, 30, 32)
                                    ctx.fillText(that.data.event.cost + '元/人', 347, 560)

                                    ctx.font = 'normal 24px PingFangSC-Regular';
                                    ctx.fillText('时间 | ' + that.data.event.start_time + '~' + that.data.event.end_time, 30, 612)

                                    if (detail_addr.length > 18) {
                                        ctx.fillText('地址 | ' + detail_addr.substr(0, 18), 30, 662)
                                        ctx.fillText(detail_addr.substr(18), 98, 705)
                                    } else {
                                        ctx.fillText('地址 | ' + detail_addr, 30, 662)
                                    }

                                    ctx.setFillStyle('#000')
                                    ctx.font = 'bold 23px PingFangSC-Regular';
                                    ctx.fillText('长按扫码来参加', 557, 700)

                                    //add qr-code image
                                    ctx.drawImage(qr_filePath, 550, 480, 175, 175)
                                    ctx.draw()

                                    ////////// temporary added
                                    // setTimeout(function() {
                                    //     that.download_img();
                                    // }, 500);
                                    /////////////////////////////

                                }
                            })
                        }
                    })

                }
            }
        })
    },

    download_img: function() {
        var that = this
        wx.showLoading({
                title: '加载中...'
            })
            //convert canvas to image file
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 750,
            height: 745, // + that.data.delta,
            destWidth: 750,
            destHeight: 745, // + that.data.delta,
            canvasId: 'shareImg',
            success: function(res) {
                that.setData({
                    img_url: res.tempFilePath,
                    show_state: true
                })

                ///// temporary added
                // return;
                /////////////////////////

                wx.saveImageToPhotosAlbum({
                    filePath: that.data.img_url,
                    success(res) {
                        wx.showToast({
                            title: '已保存至相册，记得分享哦',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                })

            },
            fail: function(res) {
                console.log(res)
            },
            complete: function() {
                wx.hideLoading({});
            }
        })
    },

    compare_favorite: function(a, b) {
        if (a.fav_state > b.fav_state)
            return -1;
        if (a.fav_state < b.fav_state)
            return 1;
        return 0;
    },

    compare_orgState: function(a, b) {
        var that = this;
        if (a.user_id == that.data.event.organizer_id)
            return -1;
        if (b.user_id == that.data.event.organizer_id)
            return 1;
        return 0;
    },

    phone_call: function() {
        app.phoneCall(this.data.event.agent_phone);
    },
    set_preview: function() {
        var that = this
        wx.previewImage({
            urls: [that.data.event.pic],
            complete: function() {
                return
            }
        })
    },

    btn_Clicked_Personal_Input: function(event) {
        var that = this;

        if (that.data.isProcessing) return;

        that.data.formId = event.detail.formId;


        if (that.data.my_booking_state == 1) {
            wx.showModal({
                content: '是否取消蜂约？',
                success: function(res) {
                    if (res.confirm) {
                        console.log(that.data.my_booking);
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
                                keyword1: { value: that.data.event.eventName, color: '#000' },
                                keyword2: { value: serviceTime, color: '#000' },
                                keyword3: { value: that.data.event.detail_address, color: '#000' },
                                keyword4: { value: curDate, color: '#000' },
                                keyword5: { value: app.globalData.userInfo.nickname, color: '#000' }
                            },
                            color: '#ff0000',
                            emphasis_keyword: 'keyword1.DATA',
                        };


                        if (that.data.my_booking.pay_type == "1") {
                            var ordercode = that.data.my_booking.pay_online;
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
                                                out_trade_no: that.data.my_booking.out_trade_no,
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
                                                        booking_id: that.data.my_booking.id,
                                                        out_refund_no: out_refund_no,
                                                        open_id: wx.getStorageSync('openid'),
                                                        msg_data: data,
                                                    },
                                                    success: function(res) {
                                                        that.refresh();
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
                                    booking_id: that.data.my_booking.id,
                                    open_id: wx.getStorageSync('openid'),
                                    msg_data: data,
                                },
                                success: function(res) {
                                    that.refresh();
                                }
                            })
                        }
                    } else if (res.cancel) {}
                }
            })
            return;
        }

        wx.redirectTo({
            url: '../personal_input/personal_input?id=' + event.currentTarget.id,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    },

    btn_Clicked_Gym_Info: function(event) {
        // wx.navigateTo({
        //     url: '../detail_gym/detail_gym?id=' + event.currentTarget.id,
        //     success: function(res) {},
        //     fail: function(res) {},
        //     complete: function(res) {},
        // });
        wx.navigateTo({
            url: '../../other/create_event/create_event',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    btn_Clicked_Favor: function() {
        var event_buff = this.data.favourite_num
        var rating = this.data.rating
        if (event_buff == 0) {
            event_buff = 1
            this.setData({ favourite_num: event_buff })
            this.data.rating++
                this.setData({ rating: this.data.rating })
        } else {
            event_buff = 0
            this.setData({ favourite_num: event_buff })
            this.data.rating--
                this.setData({ rating: this.data.rating })
        }
        var that = this;
        wx.request({
            url: app.globalData.mainURL + 'api/setFavouriteEvent',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'user_id': app.globalData.userInfo.user_id,
                'event_id': that.data.event.id
            },
            success: function(res) {

            }
        })
    },
    On_input_comment: function(event) {
        this.data.comment = event.detail.value;
    },
    unselect_comment: function() {
        var that = this;
        that.data.tmr_id = setTimeout(function() {
            console.log("deselected");
            that.setData({
                selected_index: -1,
                parent_user: -1,
                focus: false
            })
        }, 500);
    },

    select_feedback: function(event) {
        var that = this;
        clearTimeout(that.data.tmr_id);
        var parent_user = event.currentTarget.dataset.parent;

        that.setData({
            focus: true,
            selected_index: event.currentTarget.dataset.id,
            parent_user: parent_user
        });
        setTimeout(function() {
            that.setData({ focus: true });
        }, 100);
        console.log('selected item');
        console.log(that.data.selected_index);
    },

    add_feedback: function() {
        var that = this;
        console.log('clicked feedback button');
        that.setData({
            focus: false
        })
        clearTimeout(that.data.tmr_id);
        if (that.data.comment == '') {
            return;
        }
        if (that.data.selected_index < 0) {
            //add new(parent) comment
            wx.showLoading({
                title: '发表中',
            })
            wx.request({
                url: app.globalData.mainURL + "api/addFeedback",
                method: "POST",
                header: {
                    "content-type": "application/json"
                },
                data: {
                    event_id: that.data.event.id,
                    user_id: app.globalData.userInfo.user_id,
                    parent_user: 0,
                    comment: that.data.comment
                },
                success: function(res) {
                    that.setData({
                        selected_index: -1,
                        parent_user: -1,
                        comment: ''
                    })
                    that.refresh();
                },
                complete: function() {
                    wx.hideLoading({});
                }
            });
        } else {
            //add child comment
            console.log(that.data.selected_index);
            var parent = that.data.feedbacks[that.data.selected_index];
            wx.showLoading({
                title: '发表中',
            })
            wx.request({
                url: app.globalData.mainURL + "api/datamanage/addChildFeedback",
                method: "POST",
                header: {
                    "content-type": "application/json"
                },
                data: {
                    event_id: that.data.event.id,
                    user_id: app.globalData.userInfo.user_id,
                    parent_user: that.data.parent_user,
                    comment: that.data.comment,
                    parent_no: parent.no
                },
                success: function(res) {
                    that.setData({
                        selected_index: -1,
                        parent_user: -1
                    })
                    that.refresh();
                },
                complete: function() {
                    wx.hideLoading({});
                }
            });
        }

    },

    delete_feedback: function(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var type = e.currentTarget.dataset.type;
        var msg = "";
        switch (type) {
            case "main":
                msg = "删除留言后, 留言下所有的回复都会被删除";
                break;
            case "child":
                msg = "确定删除这条回复吗";
                break;
        }
        wx.showModal({
            title: '提示',
            content: msg,
            confirmText: '删除',
            cancelText: '取消',
            success: function(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.globalData.mainURL + "api/datamanage/deleteFeedback",
                        method: "POST",
                        header: {
                            "content-type": "application/json"
                        },
                        data: {
                            no: id
                        },
                        success: function(res) {
                            that.refresh();
                        }
                    });
                }
            }
        })

    },

    onclick_viewUserInfo: function(event) {
        //go to userinfo view screen.
        var that = this;
        var index = event.currentTarget.id;
        var user_id = that.data.booking[index].user_id;
        console.log(user_id);
        wx.navigateTo({
            url: "../../profile/profile_friend?id=" + user_id + '&type=0'
        })

    },

    go2UserDetail: function(e) {
        var userId = e.currentTarget.dataset.id;
        if (userId != app.globalData.userInfo.user_id) {
            wx.navigateTo({
                url: '../../profile/profile_friend?id=' + userId + '&type=0'
            })
        }
    },

    submit_event_favorite: function(event) {
        console.log(event.currentTarget.id);
        var that = this;
        var feedback_id = that.data.feedbacks[event.currentTarget.id].no;
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/setFavouriteFeedback',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'user_id': app.globalData.userInfo.user_id,
                'feedback_id': feedback_id
            },
            success: function(res) {
                that.refresh();
            }
        })
    },
    goto_mapView: function() {
        //view event location in map
        var that = this;
        wx.openLocation({
                latitude: parseFloat(that.data.event.latitude),
                longitude: parseFloat(that.data.event.longitude)
            })
            // wx.navigateTo({
            //     url: "view_map?latitude=" + that.data.event.latitude + "&longitude=" + that.data.event.longitude
            // })


    },
    onclick_goHome: function() {
        wx.switchTab({
            url: '../index',
            success: function() {
                wx.showTabBar({})
            }
        })
    },

    hide_canvas: function() {
        var that = this;
        that.setData({
            show_state: false
        })
    },

    show_preview: function(res) {
        console.log(res)
        var that = this
        wx.previewImage({
            current: that.data.pictures[1 * res.currentTarget.id],
            urls: that.data.pictures,
        })
    },

    onShareAppMessage: function(res) {
        console.log("SHARED")
        if (res.from === 'button') {
            console.log(res.target)
        }

        var that = this;
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/addShareCount',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                user_id: app.globalData.userInfo.user_id,
                event_id: that.data.event.id
            },
            success: function(res) {}
        });
        var sport = parseInt(that.data.event.type);
        var act_type = ["踢", "打", "打", "打", "打", "打", "练", "练", "玩", "", "玩", "练",
            "", "", "", "打", "", "玩", "户外活动", "", "", "玩", "", "打", "打", "打", "练", "打", "买",
            "", "参加", "商家运动", "参加活动",
        ];
        var title = that.data.event.name + "喊你一起去" + act_type[sport] + app.globalData.eventType[sport] + ", 快来报名参加吧"
        if (sport == 18 || sport == 31 || sport == 32)
            title = that.data.event.name + "喊你一起去" + act_type[sport] + ", 快来报名参加吧"

        var eventDate = new Date(that.data.event.start_time.replace(/-/g, '/'));
        var weekStr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
        title = (eventDate.getMonth() + 1) + '月' + (eventDate.getDate()) + '日' + weekStr[eventDate.getDay()] +
            app.makeNDigit(eventDate.getHours()) + ':' + app.makeNDigit(eventDate.getMinutes()) + ', ';
        title += that.data.event.eventName; // + ', 已报名: ' + that.data.register_amount + '人';
        return {
            title: title,
            path: '/pages/index/detail_event/detail_event?id=' + that.data.event.id,
            success: function(res) {},
            fail: function(res) {}
        }
    }
})
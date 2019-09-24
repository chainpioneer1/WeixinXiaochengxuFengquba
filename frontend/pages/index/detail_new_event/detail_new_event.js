//pages/index/detail_new_event/detail_new_event.js
//获取应用实例
var WxParse = require('../../../wxParse/wxParse.js');
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
        delta: 0,

        start_date: "",
        end_date: "",
        remain_day: "",
        final_date: "",
        img_url: '',
        show_state: false,

        condition_array: ["姓名", "电话", "单位", "俱乐部", "性别", "身份证号", "所在城市", "所在大学院系", "职业", "地址", "邮箱", "上传照片"],
        condition_str: "",
        event_comment: '',
        train_type: ["赛事", "活动"],
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
        my_booking: {},
        tmrID: 0,
        isFirstInit: true,
        isProcessing: false,
    },
    onLoad: function (option) {
        var that = this;
        ///////// temporary added ///////
        // option.id = 1340;
        /////////////////////////////////
        that.data.options = option;
    },
    getUserModalHide: function () {
        this.setData({
            getUserInfoDisabled: false
        })
        this.data.isFirstInit = false;
        this.onShow();
        // setTimeout(function() {

        // }, 100);
    },
    onShow: function (option) {
        var that = app;
        var _this = this;
        that.globalData.initDisabled = false;
        wx.getSetting({
            success: function (res) {
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
                        fail: function () {
                            that.globalData.initDisabled = true;
                        },
                        complete: function () {
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
    onUnload: function () {
        this.onHide();
    },
    onHide: function () {
        clearInterval(this.data.tmrID);
        clearTimeout(this.data.tmr_id);
    },
    onPrepare: function () {
        var that = this;
        wx.showLoading({
            title: '加载中',
        })
        var option = that.data.options;

        var _this = app;
        wx.login({
            success: function (res) {
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
                    success: function (res) {
                        var obj = {};
                        _this.globalData.token = res.data.token;
                        obj.openid = res.data.openid;
                        obj.expires_in = Date.now() + res.data.expires_in;
                        _this.globalData.open_id_info = obj;
                        wx.setStorageSync('openid', res.data.openid); //存储openid 
                        wx.setStorageSync('session_key', res.data.session_key)

                        if (app.globalData.userInfo.user_id == 0)
                            app.onInitialize(function () {
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
    onInitStart: function (option) {
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
            success: function (res) {
                that.refresh(1);
            }
        })
        //code for liseter paticipate
    },
    refresh: function (sort_flag) {
        if (sort_flag == undefined) sort_flag = 0;
        var that = this;
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/getNewEventDetail',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'event_id': that.data.id,
                'user_id': app.globalData.userInfo.user_id
            },
            success: function (res) {

                //get sorted feedback array
                for (let index = 0; index < res.data.feedbacks.length; index++) {
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
                                var time = child_array[idx].submit_time.split(' ')
                                child_array[idx].submit_time = time[0];
                            }
                        }
                        res.data.feedbacks[index].child_array = child_array;
                    }
                }
                if (sort_flag == 1) {
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

                var time = event_buf.start_time.split(':');
                event_buf.start_time = time[0] + ':' + time[1];
                time = event_buf.end_time.split(':');
                event_buf.end_time = time[0] + ':' + time[1];

                var isBookingExpired = false;
                clearInterval(that.data.tmrID);
                that.data.tmrID = setInterval(function () {
                    var now = Date.now();
                    var tempdate = Date.parse(event_buf.final_time.replace(/-/g, '/'))
                    var tempdiff = (tempdate - now);
                    if (tempdiff < 0) {
                        tempdiff = 0;
                        isBookingExpired = true;
                        clearInterval(that.data.tmrID);
                    }
                    var remain_day = Math.floor(tempdiff / 86400000);
                    tempdiff = tempdiff - remain_day * 86400000;
                    var remain_hr = Math.floor(tempdiff / 3600000);
                    tempdiff = tempdiff - remain_hr * 3600000;
                    var remain_min = Math.floor(tempdiff / 60000);
                    var remain_sec = Math.floor((tempdiff - remain_min * 60000) / 1000);
                    remain_day = remain_day + '天 ' + that.makeNDigit(remain_hr) + ':' + that.makeNDigit(remain_min) + ':' + that.makeNDigit(remain_sec);
                    that.setData({
                        remain_day: remain_day,
                    })
                }, 1000);
                var now = Date.now();
                var tempdate = Date.parse(event_buf.final_time.replace(/-/g, '/'))
                var tempdiff = (tempdate - now);
                if (tempdiff < 0) {
                    tempdiff = 0;
                    isBookingExpired = true;
                }
                var remain_day = Math.floor(tempdiff / 86400000);
                tempdiff = tempdiff - remain_day * 86400000;
                var remain_hr = Math.floor(tempdiff / 3600000);
                tempdiff = tempdiff - remain_hr * 3600000;
                var remain_min = Math.floor(tempdiff / 60000);
                var remain_sec = Math.floor((tempdiff - remain_min * 60000) / 1000);
                remain_day = remain_day + '天 ' + remain_hr + ':' + remain_min + ':' + remain_sec;
                that.setData({
                    remain_day: remain_day,
                })

                var start_date = event_buf.start_time.split(':')[0] + ':' + event_buf.start_time.split(':')[1];
                var end_date = event_buf.end_time.split(':')[0] + ':' + event_buf.end_time.split(':')[1];
                var day_array = event_buf.final_time.split(' ')[0].split('-')
                var final_date = day_array[1] + '-' + day_array[2];

                var event_comment = event_buf.comment
                WxParse.wxParse('event_comment', 'html', event_comment, that)

                var picture = event_buf.pic.split(",");
                var images = [];
                if (picture.length != 0) {
                    for (var index = 0; index < picture.length; index++) {
                        images[index] = app.globalData.uploadURL + picture[index]
                    }
                }
                var tempdate = Date.parse(event_buf.start_time.replace(/-/g, '/'))

                var condition_str = '';
                var con_array = event_buf.condition.split(',');
                for (let index = 0; index < con_array.length; index++) {
                    if (con_array[index] == '1') {
                        if (condition_str.length == 0) {
                            condition_str = that.data.condition_array[index]
                        } else {
                            condition_str = condition_str + ',' + that.data.condition_array[index]
                        }
                    }
                }
                if (condition_str.length > 0) {
                    condition_str = '需' + condition_str;
                }

                that.setData({
                    event: event_buf,
                    is_train: event_buf.is_train,
                    id: that.data.id,
                    pictures: images,
                    comment: '',
                    start_date: start_date,
                    end_date: end_date,
                    final_date: final_date,
                    condition_str: condition_str
                });
                wx.setNavigationBarTitle({
                    title: that.data.train_type[that.data.is_train] + '详情'
                })

                //get booking
                var books = res.data.booking;
                var registered_num = 0;
                that.setData({
                    favourite_num: 1 * res.data.result[0].favor_state,
                    is_disabled: false,
                    btn_text: '立即报名',
                })

                for (var index = 0; index < books.length; index++) {
                    console.log(books[index].nickname)
                    if (books[index].user_id == app.globalData.userInfo.user_id && books[index].state == '0') {
                        if (books[index].state == '2')
                            that.setData({
                                is_registered: true,
                                is_disabled: true,
                                btn_text: '已取消',
                            })
                        else {
                            that.setData({
                                is_registered: true,
                                is_disabled: true,
                                btn_text: '已报名',
                            })
                            registered_num += 1 * books[index].reg_num;
                        }
                    } else if (books[index].state != '2') {
                        registered_num += 1 * books[index].reg_num;
                    }
                }
                if (isBookingExpired) {
                    that.setData({
                        is_registered: true,
                        is_disabled: true,
                        btn_text: '已截止',
                    })
                }
                that.setData({
                    register_amount: registered_num,
                })
                for (var iter = 0; iter < books.length; iter++) {
                    if (books[iter].name == null) {
                        books[iter].name = books[iter].nickname
                    }
                }
                that.setData({
                    booking: books
                })

                console.log(that.data.event);
                // console.log(that.data.booking);
                // console.log(that.data.feedbacks);
                that.show_canvas();
                that.data.isProcessing = false;
            },
            complete: function () {
                wx.hideLoading({});
            }
        })
    },
    show_canvas: function (options) {
        var that = this;

        console.log('pages/index/detail_new_event/detail_new_event?id=' + that.data.id);
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/getQR',
            data: {
                access_token: app.globalData.token,
                path: 'pages/index/detail_new_event/detail_new_event?id=' + that.data.id,
                user_id: app.globalData.userInfo.user_id
            },
            method: 'POST',
            header: { 'content-type': 'application/json' },
            success: function (res) {
                console.log(res.data);

                if (res.data.status) {
                    var image_url = app.globalData.mainURL + res.data.data;
                    wx.downloadFile({
                        url: image_url,
                        type: 'image',
                        success: (resp) => {
                            var qr_filePath = resp.tempFilePath;
                            image_url = that.data.uploadURL + 'global/picture04@2x.png';
                            if (that.data.is_train == 0)
                                image_url = that.data.uploadURL + 'global/picture03@2x.png';

                            wx.downloadFile({
                                url: image_url,
                                type: 'image',
                                success: (resp) => {
                                    var img_filePath = resp.tempFilePath;

                                    const ctx = wx.createCanvasContext('shareImg')

                                    var ww = 750;
                                    var hh = 985;
                                    ctx.drawImage(img_filePath, 0, 0, ww, 685);

                                    ctx.globalAlpha = 0.6;
                                    ctx.setFillStyle('#000');
                                    ctx.fillRect(0, 540, ww, 685 - 540);

                                    ctx.globalAlpha = 1.0
                                    ctx.setFillStyle('#ffffff')
                                    ctx.fillRect(0, 685, ww, hh - 685);

                                    ctx.setStrokeStyle('#ffffff')
                                    ctx.beginPath()
                                    ctx.moveTo(375, 560)
                                    ctx.lineTo(375, 665)
                                    ctx.stroke()

                                    ctx.setTextAlign('center')
                                    ctx.font = 'normal 24px PingFangSC-Regular';
                                    if (that.data.is_train)
                                        ctx.fillText('活动日期', 190, 582)
                                    else
                                        ctx.fillText('比赛日期', 190, 582)

                                    // ctx.fillText(that.data.train_type[that.data.is_train] + '日期', 150, 625)

                                    ctx.setTextAlign('left')
                                    ctx.fillText(that.data.start_date + ' 到', 75, 625)
                                    ctx.fillText(that.data.end_date, 75, 660)

                                    ctx.setTextAlign('center')
                                    var end_date = that.data.event.final_time.split(' ')[0];
                                    end_date = end_date.split('-')[1] + '-' + end_date.split('-')[2];
                                    ctx.fillText('截止日(' + end_date + ')', 560, 593)
                                    var remain_day = that.data.remain_day.split(' ')[0]
                                    remain_day = parseInt(remain_day.substr(0, remain_day.length - 1)) + 1;
                                    ctx.fillText(remain_day + '天(报满即止)', 560, 640)

                                    ctx.setFillStyle('#000')
                                    ctx.font = 'bold 34px PingFangSC-Regular';
                                    ctx.setTextAlign('left')
                                    ctx.fillText(that.data.event.eventName, 30, 743)

                                    ctx.font = 'normal 22px PingFangSC-Regular';

                                    ctx.drawImage('../../../image/my_bee_m@2x.png', 30, 770, 32, 36)
                                    ctx.fillText('报名费' + that.data.event.cost + '元/人', 75, 795)

                                    ctx.drawImage('../../../image/icon_place@2x.png', 32, 825, 27, 42)

                                    var detail_addr = that.data.event.detail_address;
                                    // detail_addr = '啊收到了开发骄傲斯洛伐开发骄傲斯洛伐克'
                                    if (detail_addr.length > 19) {
                                        that.setData({
                                            delta: 0
                                        })
                                    } else {
                                        that.setData({
                                            delta: 35
                                        })
                                    }
                                    var delta_value = that.data.delta;
                                    if (detail_addr.length > 19) {
                                        ctx.fillText('' + detail_addr.substr(0, 19), 75, 850)
                                        ctx.fillText(detail_addr.substr(19), 75, 892)
                                    } else {
                                        ctx.fillText('' + detail_addr, 75, 850)
                                    }

                                    ctx.drawImage('../../../image/iphone@2x.png', 32, 922 - delta_value, 30, 30)
                                    ctx.fillText(that.data.event.agent_phone, 75, 945 - delta_value)

                                    ctx.setFillStyle('#000')
                                    ctx.font = 'bold 23px PingFangSC-Regular';


                                    ctx.fillText('长按扫码来参加', 557, 940)
                                    //add qr-code image
                                    ctx.drawImage(qr_filePath, 550, 725, 175, 175)
                                    ctx.draw();


                                    ////////// temporary added ////////////

                                    // setTimeout(function() {
                                    //     that.downlaod_img();
                                    // }, 500);
                                    ///////////////////////////////////////

                                }
                            })
                        }
                    })

                }
            }
        })
    },


    downlaod_img: function () {
        //download image
        var that = this
        wx.showLoading({
            title: '加载中...'
        });
        //convert canvas to image file
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 750,
            height: 985, // - that.data.delta,
            destWidth: 750,
            destHeight: 985, // - that.data.delta,
            canvasId: 'shareImg',
            success: function (res) {
                that.setData({
                    img_url: res.tempFilePath,
                    show_state: true
                })

                ////////////// temporary added //////////////
                // return;
                /////////////////////////////////////////////

                // save imgage to album
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
            fail: function (res) {
                console.log(res)
            },
            complete: function () {
                wx.hideLoading({});
            }
        })
    },

    compare_favorite: function (a, b) {
        if (a.fav_state > b.fav_state)
            return -1;
        if (a.fav_state < b.fav_state)
            return 1;
        return 0;
    },

    compare_orgState: function (a, b) {
        var that = this;
        if (a.user_id == that.data.event.organizer_id)
            return -1;
        if (b.user_id == that.data.event.organizer_id)
            return 1;
        return 0;
    },

    phone_call: function () {
        app.phoneCall(this.data.event.agent_phone)
    },
    set_preview: function () {
        var that = this
        wx.previewImage({
            urls: [that.data.event.pic],
            complete: function () {
                return
            }
        })
    },

    btn_Clicked_Personal_Input: function (event) {
        var that = this;
        if (that.data.isProcessing) return;
        wx.redirectTo({
            url: '../new_event_input/new_event_input?id=' + event.currentTarget.id,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    },

    btn_Clicked_Favor: function () {
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
            success: function (res) {

            }
        })
    },
    On_input_comment: function (event) {
        this.data.comment = event.detail.value;
    },
    unselect_comment: function () {
        var that = this;
        that.data.tmr_id = setTimeout(function () {
            console.log("deselected");
            that.setData({
                selected_index: -1,
                parent_user: -1,
                focus: false
            })
        }, 500);
    },

    select_feedback: function (event) {
        var that = this;
        clearTimeout(that.data.tmr_id);
        var parent_user = event.currentTarget.dataset.parent;

        that.setData({
            focus: true,
            selected_index: event.currentTarget.dataset.id,
            parent_user: parent_user
        });
        setTimeout(function () {
            that.setData({ focus: true });
        }, 100);
        console.log('selected item');
        console.log(that.data.selected_index);
    },

    add_feedback: function () {
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
                success: function (res) {
                    that.setData({
                        selected_index: -1,
                        parent_user: -1,
                        comment: ''
                    })
                    that.refresh();
                },
                complete: function () {
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
                success: function (res) {
                    that.setData({
                        selected_index: -1,
                        parent_user: -1
                    })
                    that.refresh();
                },
                complete: function () {
                    wx.hideLoading({});
                }
            });
        }

    },

    delete_feedback: function (e) {
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
            success: function (res) {
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
                        success: function (res) {
                            that.refresh();
                        }
                    });
                }
            }
        })

    },

    go2UserDetail: function (e) {
        var userId = e.currentTarget.dataset.id;
        if (userId != app.globalData.userInfo.user_id) {
            wx.navigateTo({
                url: '../../profile/profile_friend?id=' + userId + '&type=0'
            })
        }
    },

    onclick_viewUserInfo: function (event) {
        //go to userinfo view screen.
        var that = this;
        var index = event.currentTarget.id;
        var user_id = that.data.booking[index].user_id;
        console.log(user_id);
        wx.navigateTo({
            url: "../../profile/profile_friend?id=" + user_id + '&type=0'
        })

    },

    submit_event_favorite: function (event) {
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
            success: function (res) {
                that.refresh();
            }
        })
    },
    goto_mapView: function () {
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
    onclick_goHome: function () {
        wx.switchTab({
            url: '../index',
            success: function () {
                wx.showTabBar({})
            }
        })
    },

    hide_canvas: function () {
        var that = this;
        that.setData({
            show_state: false
        })
    },

    show_preview: function (res) {
        console.log(res)
        var that = this
        wx.previewImage({
            current: that.data.pictures[1 * res.currentTarget.id],
            urls: that.data.pictures,
        })
    },

    makeNDigit: function (num, len) {
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
    onShareAppMessage: function (res) {
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
            success: function (res) { }
        });

        var sport = parseInt(that.data.event.type);

        var title = "鹿死谁手, 一起来参加" + app.globalData.eventType[sport] + "比赛决一雌雄";
        if (that.data.event.is_train == '1') {
            title = "这个活动不错哦，快来参加" + app.globalData.eventType[sport] + "培训班吧";
        }


        var eventDate = new Date(that.data.event.start_time.replace(/-/g, '/'));
        var weekStr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
        title = ''; //(eventDate.getMonth() + 1) + '月' + (eventDate.getDate()) + '日' + weekStr[eventDate.getDay()] + ', ';
        title += that.data.event.name + ', 已报名: ' + that.data.register_amount + '人';

        return {
            title: title,
            path: '/pages/index/detail_new_event/detail_new_event?id=' + that.data.event.id,
            success: function (res) { },
            fail: function (res) { }
        }
    }
})
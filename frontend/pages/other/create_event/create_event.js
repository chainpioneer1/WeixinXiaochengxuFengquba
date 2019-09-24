var dateTimePicker = require('../../../utils/datetimePicker.js');
const app = getApp();

Page({
    data: {
        uploadURL: app.globalData.uploadURL,
        province: [],
        member_state: 0,
        role: 1,
        image_path: ["", "", ""],
        switch_img: ["../../../image/switch_on@2x.png", "../../../image/switch_off@2x.png"],
        isCancel: 1,
        isPhone: 1,
        isPublic: 1,
        display: ["display:none;", ""],
        select: [1, 0, 0],
        selected: 0,
        event: {
            name: "",
            kind: 40,
            agent_name: "",
            agent_phone: "",
            start_time: "",
            end_time: "",
            address4: "",
            limit: "",
            limit_perUser: "",
            cost: "",
            comment: "",
            additional: 1,
            showModal1: false,
            showModal2: false,
            textareastr: "",
            payment_type: 1,
            placestr: "请输入活动简介，不超过500字",
        },
        system_templates: [],
        date: '2018-10-01',
        time: '12:00',
        dateTimeArray: null,
        dateTime: null,
        dateTimeArray1: null,
        dateTime1: null,
        startYear: 2000,
        endYear: 2050,
        eventType: [],
        overimagecount: 0,
        longitude: 0,
        latitude: 0,
        role: 1,
        open: false,
        province_id: 0,
        city_id: 0,
        area_id: 0,
        province_name: "",
        city_name: "",
        area_name: "",
        detail_address: "",
        select_position_text: '',
        isvip: 0,
        lawstr: "",
        isfirstbtn: 0,
        is_cross: 0,
        select_template: 2,
        last_template_str: "",
        templates: ["不使用模板", "系统默认模板", "上次编辑内容"],
        flag: 0,
    },
    onLoad: function(options) {
        app.globalData.ischooseimage = 0;
    },
    onShow: function() {
        var that = this;
        console.log(app.globalData.ischooseimage);
        if (app.globalData.ischooseimage == 0) {

            that.data.isProcessing = false;

            wx.showLoading({
                title: '加载中',
            })

            //get templates
            if (!wx.getStorageSync("last_template_str")) {
                wx.setStorageSync("last_template_str", "");
            }
            this.data.last_template_str = wx.getStorageSync("last_template_str");

            that.setData({
                textareastr: "",
                placestr: "请输入活动简介，不超过500字",
                textareastr: that.data.last_template_str,
                last_template_str: this.data.last_template_str,
                system_templates: app.globalData.template
            });
            that.data.event.comment = that.data.textareastr;

            // 获取完整的年月日 时分秒，以及默认显示的数组
            var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
            var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
            // 精确到分的处理，将数组的秒去掉
            var lastArray = obj1.dateTimeArray.pop();
            var lastTime = obj1.dateTime.pop();

            if (app.globalData.rule == '') {
                wx.request({
                    url: app.globalData.mainURL + 'api/getRules',
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function(res) {
                        app.globalData.rule = res.data.rule
                        console.log(app.globalData.rule)
                    },
                });
            }

            if (app.globalData.detailaddress != undefined)
                this.setData({ detailaddress: app.globalData.detailaddress })

            this.data.longitude = app.globalData.longitude
            this.data.latitude = app.globalData.latitude

            this.setData({
                dateTime: obj.dateTime,
                dateTimeArray: obj.dateTimeArray,
                dateTimeArray1: obj1.dateTimeArray,
                dateTime1: obj1.dateTime,
                honey: app.globalData.rule[8].value,
                role: app.globalData.userInfo.role,
                eventType: app.globalData.eventType
            })



            var _this = this;

            _this.data.event.start_time = "" + _this.data.dateTimeArray1[0][_this.data.dateTime1[0]] + '-' + _this.data.dateTimeArray1[1][_this.data.dateTime1[1]] + '-' + _this.data.dateTimeArray1[2][_this.data.dateTime1[2]] + ' ' + _this.data.dateTimeArray1[3][_this.data.dateTime1[3]] + ':' + _this.data.dateTimeArray1[4][_this.data.dateTime1[4]];
            _this.data.event.end_time = "" + _this.data.dateTimeArray[0][_this.data.dateTime[0]] + '-' + _this.data.dateTimeArray[1][_this.data.dateTime[1]] + '-' + _this.data.dateTimeArray[2][_this.data.dateTime[2]] + ' ' + _this.data.dateTimeArray[3][_this.data.dateTime[3]] + ':' + _this.data.dateTimeArray[4][_this.data.dateTime[4]];

            wx.request({
                url: app.globalData.mainURL + 'api/getProvinces',
                success: function(res) {
                    var tempprovince = res.data.result
                    tempprovince.unshift({ id: "0", province: "请选择省" });
                    _this.data.province = tempprovince;
                    _this.data.member_state = app.globalData.userInfo.isVIP;
                }
            })

            wx.request({
                url: app.globalData.mainURL + 'api/getUserState',
                data: {
                    'nickname': app.globalData.userInfo.nickname
                },
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    if (res.data.status) {
                        that.setData({
                            role: res.data.result[0].role
                        })
                        if (that.data.role == "1") {
                            wx.request({
                                url: app.globalData.mainURL + 'api/getUserDetail',
                                data: {
                                    user_id: app.globalData.userInfo.user_id
                                },
                                method: 'POST',
                                header: {
                                    'content-type': 'application/json'
                                },
                                success: function(res) {
                                    that.setData({
                                        province_name: res.data.result[0].province,
                                        city_name: res.data.result[0].city,
                                        area_name: res.data.result[0].area,
                                        province_id: res.data.result[0].province_id,
                                        city_id: res.data.result[0].city_id,
                                        area_id: res.data.result[0].area_id,
                                        select_position_text: res.data.result[0].province + res.data.result[0].city + res.data.result[0].area,
                                        detail_address: res.data.result[0].detail_address,
                                        longitude: res.data.result[0].longitude,
                                        latitude: res.data.result[0].latitude,
                                    })

                                    _this.data.event.address4 = res.data.result[0].detail_address
                                },
                                complete: function() {}
                            })
                        }
                    }
                }
            })
        }

        console.log(this.data.latitude + ',' + this.data.longitude);

        app.globalData.ischooseimage = 0;
        this.onPrepare();
    },
    onReady: function() {
        // wx.hideTabBar({
        //     fail: function() {
        //         setTimeout(function() { // Do a delay retries as a guarantee.
        //             wx.hideTabBar()
        //         }, 500)
        //     }
        // });
    },
    onPrepare: function() {
        app.globalData.iscreatepage = 1
        var that = this
        that.data.is_cross = 0;
        wx.request({
            url: app.globalData.mainURL + 'api/getUserState',
            method: 'post',
            data: {
                'nickname': app.globalData.userInfo.nickname
            },
            success: function(res) {
                var user_name = wx.getStorageSync('createEventUser');
                var user_phone = wx.getStorageSync('createEventPhone');
                if (user_name == '')
                    user_name = res.data.result[0].name;
                if (user_phone == '')
                    user_phone = res.data.result[0].phone;
                that.data.event.agent_name = user_name;
                that.data.event.agent_phone = user_phone;
                that.setData({
                    val_username: user_name,
                    val_phone: user_phone,
                })
                app.globalData.userInfo.state = res.data.result[0].state
                if (app.globalData.userInfo.state == 0 || app.globalData.userInfo.role == 0) {
                    wx.showModal({
                        title: '提示',
                        content: '请先进行身份认证',
                        success: function(res) {
                            if (res.confirm) {
                                wx.redirectTo({
                                    url: '../../profile/auth/auth',
                                })
                                that.data.is_cross = 1
                            } else if (res.cancel) {
                                wx.switchTab({
                                    url: '../../index/index',
                                    success: function() {}
                                })
                            }
                        },
                        complete: function() {
                            if (that.data.is_cross == 0)
                                wx.switchTab({
                                    url: '../../index/index',
                                    success: function() {}
                                })
                        }
                    })
                    return;
                }
                if (app.globalData.userInfo.state == 3) {
                    wx.showModal({
                        title: '提示',
                        content: '您的身份认证审核未通过，请重新提交',
                        success: function(res) {
                            if (res.confirm) {
                                wx.redirectTo({
                                    url: '../../profile/auth/auth',
                                })
                                that.data.is_cross = 1
                            } else if (res.cancel) {
                                wx.switchTab({
                                    url: '../../index/index',
                                    success: function() {}
                                })
                            }
                        },
                        complete: function() {
                            if (that.data.is_cross == 0)
                                wx.switchTab({
                                    url: '../../index/index',
                                    success: function() {}
                                })
                        }
                    })
                    return;
                }
                if (app.globalData.userInfo.state == 1) {
                    wx.showModal({
                        title: '提示',
                        content: '您的认证资料已提交，请等待审核通过',
                        showCancel: false,
                        complete: function() {
                            wx.switchTab({
                                url: '../../index/index',
                                success: function() {}
                            })
                        }
                    })
                    return;
                }
                var have_stadium = wx.getStorageSync("have_stadium")
                if (have_stadium == 0 && 1 * app.globalData.userInfo.role == 1) {
                    wx.showModal({
                        title: '提示',
                        content: '请填写商家资料',
                        success: function(res) {
                            if (res.confirm) {
                                wx.redirectTo({
                                    url: '../../profile/register_stadium/register_stadium',
                                    success: function() {}
                                })
                                that.data.is_cross = 1
                            } else if (res.cancel) {
                                wx.switchTab({
                                    url: '../../index/index',
                                    success: function() {}
                                })
                            }
                        },
                        complete: function() {
                            if (that.data.is_cross == 0)
                                wx.switchTab({
                                    url: '../../index/index',
                                    success: function() {}
                                })
                        }
                    })
                }
            },
            complete: function() {
                wx.hideLoading({});
            }
        })
    },
    navigateBack: function() {
        // console.log("OKBACK")
    },
    showitem: function() {
        this.setData({
            open: !this.data.open,
            showModal2: true
        })
    },
    on_click_type: function(e) {
        var _this = this
        _this.data.event.kind = e.currentTarget.id;
        _this.setData({
            event: _this.data.event,
            showModal2: false
        })
        if (_this.data.select_template == 1) {
            var activity_templates = _this.data.system_templates.filter(item => item.template_type == "2");
            var sys_template = activity_templates.filter(item => (1 * item.event_type_id - 1) == _this.data.event.kind);

            if (sys_template.length > 0) {
                _this.setData({
                    textareastr: sys_template[0].content
                });
                _this.data.event.comment = _this.data.textareastr;
            } else {
                wx.showToast({
                    title: '服务器上不存在该活动类型',
                    duration: 2000,
                    icon: 'none'
                })
                _this.setData({
                    select_template: 0
                });
            }
        }
    },
    On_blur_detailaddress: function(e) {
        this.data.event.address4 = e.detail.value;
        this.setData({ event: this.data.event });
    },
    on_blur_limit: function(e) {
        this.data.event.limit = e.detail.value;
        this.setData({ event: this.data.event });
    },
    on_blur_limit_perUser: function(e) {
        this.data.event.limit_perUser = e.detail.value;
        this.setData({ event: this.data.event });
    },
    on_blur_cost: function(e) {
        this.data.event.cost = e.detail.value;
        this.setData({ event: this.data.event });
    },
    on_blur_comment: function(e) {
        this.data.event.comment = e.detail.value;
        this.setData({
            event: this.data.event,
            textareastr: e.detail.value,
            flag: 1
        })
    },
    on_blur_scroll: function() {
        var that = this;
        // if (that.data.flag == 1) {
        that.setData({
            flag: 0,
            focus_comment: false
        });
        // }
    },
    scroll2Down: function() {
        var that = this;
        if (that.data.flag == 0) {
            that.data.flag = 1;
            that.setData({
                flag: 1
            })

            setTimeout(function() {
                wx.pageScrollTo({
                    scrollTop: 2000,
                    duration: 100
                });
            }, 100);
        }
    },
    on_event_name: function(e) {
        this.data.event.name = e.detail.value;
        this.setData({ event: this.data.event });
    },
    on_agent_name: function(e) {
        this.data.event.agent_name = e.detail.value;
        wx.setStorageSync('createEventUser', e.detail.value);
        this.setData({
            val_username: e.detail.value,
            event: this.data.event
        })
    },
    on_agent_phone: function(e) {
        this.data.event.agent_phone = e.detail.value;
        wx.setStorageSync('createEventPhone', e.detail.value);
        this.setData({
            val_phone: e.detail.value,
            event: this.data.event
        })
    },

    On_click_map: function(e) {
        var that = this;
        app.globalData.ischooseimage = 1
        wx.chooseLocation({
            success: function(res) {
                that.data.longitude = res.longitude
                that.data.latitude = res.latitude;

                var got_address = res.address;

                var url = 'https://restapi.amap.com/v3/geocode/regeo?key=8eb63e36d0b6d7d29a392503a4a80f6c&location=' + res.longitude + ',' + res.latitude + '&poitype=&radius=&extensions=all&batch=false&roadlevel=0';

                //get activity array
                wx.request({
                    url: url,
                    success: function(res) {
                        //console.log('got location');
                        //console.log(res.data);
                        //console.log(res.data.regeocode.addressComponent);
                        var province_name = res.data.regeocode.addressComponent.province
                        var city_name = res.data.regeocode.addressComponent.city
                        var area_name = res.data.regeocode.addressComponent.district

                        if (got_address == "") {
                            got_address = res.data.regeocode.formatted_address;
                        }
                        //get province infomation
                        var province_index = that.data.province.findIndex(item => item.province == province_name)

                        that.data.event.address4 = got_address;
                        that.setData({
                            detail_address: got_address,
                            select_position_text: province_name + city_name + area_name,
                            province_id: that.data.province[province_index].id,
                            province_name: province_name,
                            city_name: city_name,
                            area_name: area_name,
                            flag: 0,
                            event: that.data.event,
                            latitude: that.data.latitude,
                            longitude: that.data.longitude
                        });
                        console.log('--------' + that.data.longitude + ',' + that.data.latitude);
                        //get city infomation
                        wx.request({
                            url: app.globalData.mainURL + "api/getCities",
                            method: 'POST',
                            header: {
                                'content-type': 'application/json'
                            },
                            data: {
                                province: province_name
                            },
                            success: function(res) {
                                var city_array = res.data.result;
                                var city_index = city_array.findIndex(item => item.city == city_name)
                                that.setData({
                                    city_id: city_array[city_index].id
                                })
                            }
                        })

                        //get area infomation
                        wx.request({
                            url: app.globalData.mainURL + "api/getAreas",
                            method: 'POST',
                            header: {
                                'content-type': 'application/json'
                            },
                            data: {
                                province: province_name,
                                city: city_name
                            },
                            success: function(res) {
                                var area_array = res.data.result;
                                var area_index = area_array.findIndex(item => item.area == area_name)
                                that.setData({
                                    area_id: area_array[area_index].id
                                });
                                console.log(that.data.area_id);
                            }
                        })
                    }
                })
            },
            complete: function(res) {
                // console.log(res)
            }
        })
    },
    // changeDate(e) {
    //     this.setData({ date: e.detail.value });
    // },
    // changeTime(e) {
    //     this.setData({ time: e.detail.value });
    // },
    changeDateTime(e) {
        var _this = this
        _this.setData({
            dateTime: e.detail.value
        })
        _this.data.event.end_time = "" + _this.data.dateTimeArray[0][_this.data.dateTime[0]] + '-' + _this.data.dateTimeArray[1][_this.data.dateTime[1]] + '-' + _this.data.dateTimeArray[2][_this.data.dateTime[2]] + ' ' + _this.data.dateTimeArray[3][_this.data.dateTime[3]] + ':' + _this.data.dateTimeArray[4][_this.data.dateTime[4]];

        var start = new Date(_this.data.event.start_time.replace(/-/g, '/'));
        var end = new Date(_this.data.event.end_time.replace(/-/g, '/'));

        if (end < start) {
            wx.showToast({
                title: '结束时间不能晚于开始时间',
                icon: 'none',
                duration: 2500
            });
            _this.data.event.end_time = _this.data.event.start_time;
            _this.data.dateTimeArray = _this.data.dateTimeArray1;
            _this.data.dateTime = _this.data.dateTime1;
            _this.setData({
                dateTimeArray: _this.data.dateTimeArray,
                dateTime: _this.data.dateTime
            })
        }

        _this.setData({
            event: _this.data.event
        });
    },
    changeDateTime1(e) {
        var _this = this
        _this.setData({
            dateTime1: e.detail.value
        })
        _this.data.event.start_time = "" + _this.data.dateTimeArray1[0][_this.data.dateTime1[0]] + '-' + _this.data.dateTimeArray1[1][_this.data.dateTime1[1]] + '-' + _this.data.dateTimeArray1[2][_this.data.dateTime1[2]] + ' ' + _this.data.dateTimeArray1[3][_this.data.dateTime1[3]] + ':' + _this.data.dateTimeArray1[4][_this.data.dateTime1[4]];

        var cur = new Date();
        var start = new Date(_this.data.event.start_time.replace(/-/g, '/'));
        var end = new Date(_this.data.event.end_time.replace(/-/g, '/'));
        if (start < cur) {
            wx.showToast({
                title: '开始时间不能晚于当前时间',
                icon: 'none',
                duration: 2500
            });
            var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
            _this.setData({
                dateTimeArray1: obj.dateTimeArray,
                dateTime1: obj.dateTime
            })
            _this.data.event.start_time = "" + _this.data.dateTimeArray1[0][_this.data.dateTime1[0]] + '-' + _this.data.dateTimeArray1[1][_this.data.dateTime1[1]] + '-' + _this.data.dateTimeArray1[2][_this.data.dateTime1[2]] + ' ' + _this.data.dateTimeArray1[3][_this.data.dateTime1[3]] + ':' + _this.data.dateTimeArray1[4][_this.data.dateTime1[4]];
        }
        if (end < start) {
            wx.showToast({
                title: '结束时间不能晚于开始时间',
                icon: 'none',
                duration: 2500
            });
            _this.data.event.end_time = _this.data.event.start_time;
            _this.data.dateTimeArray = _this.data.dateTimeArray1;
            _this.data.dateTime = _this.data.dateTime1;
            _this.setData({
                dateTimeArray: _this.data.dateTimeArray,
                dateTime: _this.data.dateTime
            })
        }

        _this.setData({
            event: _this.data.event
        });
    },
    changeDateTimeColumn(e) {
        var arr = this.data.dateTime,
            dateArr = this.data.dateTimeArray;

        arr[e.detail.column] = e.detail.value;
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

        this.setData({
            dateTimeArray: dateArr,
            dateTime: arr
        });
    },
    changeDateTimeColumn1(e) {
        var arr = this.data.dateTime1,
            dateArr = this.data.dateTimeArray1;

        arr[e.detail.column] = e.detail.value;
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

        this.setData({
            dateTimeArray1: dateArr,
            dateTime1: arr
        });
    },
    radioChange: function(e) {
        var that = this
        var type = e.currentTarget.dataset.type;
        switch (type) {
            case "isCancel":
                that.data.isCancel = 1 - that.data.isCancel;
                break;
            case "isPhone":
                that.data.isPhone = 1 - that.data.isPhone;
                break;
            case "isPublic":
                that.data.isPublic = 1 - that.data.isPublic;
                break;
        }

        that.setData({
            isCancel: that.data.isCancel,
            isPhone: that.data.isPhone,
            isPublic: that.data.isPublic,
            event: that.data.event
        });
    },
    radioChange1: function(e) {
        var _this = this
        _this.data.event.additional = e.detail.value
        _this.setData({
            event: _this.data.event
        })
    },
    on_cancel: function() {
        wx.switchTab({
            url: '../../index/index',
            success: function() {}
        })
    },
    on_submit: function() {

        this.data.isProcessing = true;
        this.setData({
            flag: 0
        })

        var _this = this;

        _this.data.event.start_time = "" + _this.data.dateTimeArray1[0][_this.data.dateTime1[0]] + '-' + _this.data.dateTimeArray1[1][_this.data.dateTime1[1]] + '-' + _this.data.dateTimeArray1[2][_this.data.dateTime1[2]] + ' ' + _this.data.dateTimeArray1[3][_this.data.dateTime1[3]] + ':' + _this.data.dateTimeArray1[4][_this.data.dateTime1[4]];

        _this.data.event.end_time = "" + _this.data.dateTimeArray[0][_this.data.dateTime[0]] + '-' + _this.data.dateTimeArray[1][_this.data.dateTime[1]] + '-' + _this.data.dateTimeArray[2][_this.data.dateTime[2]] + ' ' + _this.data.dateTimeArray[3][_this.data.dateTime[3]] + ':' + _this.data.dateTimeArray[4][_this.data.dateTime[4]];

        var invalid = 0
        if (_this.data.event.name.length > 20) {
            _this.setData({
                focus_name: true,
                isProcessing: false
            })
            wx.showToast({
                title: '活动名称不应超过20个字',
                duration: 3000,
                icon: 'none'
            })
            return
        }
        if (_this.data.event.name.length == 0) {
            _this.setData({
                focus_name: true,
                isProcessing: false
            })
            wx.showToast({
                title: '请填写活动名称',
                duration: 3000,
                icon: 'none'
            })
            return
        }
        if (_this.data.event.agent_name.length > 20) {
            _this.setData({
                focus_agent_name: true,
                isProcessing: false
            })
            wx.showToast({
                title: '发起人的名字不应超过20个字',
                duration: 3000,
                icon: 'none'
            })
            return
        }
        if (_this.data.event.agent_name.length == 0) {
            _this.setData({
                focus_agent_name: true,
                isProcessing: false
            })
            wx.showToast({
                title: '请填写发起人的名字',
                duration: 3000,
                icon: 'none'
            })
            return
        }
        if (_this.data.event.agent_phone.length == 0) {
            _this.setData({
                focus_phone: true,
                isProcessing: false
            })
            wx.showToast({
                title: '请填写手机号码',
                duration: 3000,
                icon: 'none'
            })
            return
        }
        if (!app.checkValidPhone(_this.data.event.agent_phone)) {
            _this.setData({
                focus_phone: true,
                isProcessing: false
            })
            wx.showToast({
                title: '请填写正确的手机号码',
                duration: 3000,
                icon: 'none'
            })
            return
        }
        if (_this.data.event.limit == "" || _this.data.event.limit == 0) {
            _this.setData({
                focus_limit: true,
                isProcessing: false
            })
            wx.showToast({
                title: '人数上限必须大于0',
                duration: 3000,
                icon: 'none'
            })
            return
        }
        if (_this.data.event.limit_perUser == "" || _this.data.event.limit_perUser == 0) {
            _this.setData({
                focus_limit_person: true,
                isProcessing: false
            })
            wx.showToast({
                title: '每个用户最多可以报名人数必须大于0',
                duration: 3000,
                icon: 'none'
            })
            return
        }
        if (_this.data.event.cost == "") {
            _this.setData({
                focus_cost: true,
                isProcessing: false
            })
            wx.showToast({
                title: '请填写活动费用',
                duration: 3000,
                icon: 'none'
            })
            return
        }
        if (_this.data.event.cost < 0) {
            _this.setData({
                focus_cost: true,
                isProcessing: false
            })
            wx.showToast({
                title: '请填写活动费用',
                duration: 3000,
                icon: 'none'
            })
            return
        }

        if (_this.data.event.kind == 40) {
            _this.showitem();
            _this.setData({
                isProcessing: false,
            })
            wx.showToast({
                title: '请选择活动类型',
                duration: 3000,
                icon: 'none'
            })
            return
        }
        if (_this.data.select_position_text == "" && _this.data.role == 2) {
            _this.On_click_map();
            _this.setData({
                isProcessing: false,
            })
            wx.showToast({
                title: '请选择地图定位',
                duration: 3000,
                icon: 'none'
            })
            return
        }
        var tempstartdate = Date.parse(_this.data.event.start_time.replace(/-/g, '/'))
        var tempenddate = Date.parse(_this.data.event.end_time.replace(/-/g, '/'))

        if (tempstartdate > tempenddate) {
            _this.setData({
                isProcessing: false,
            })
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 100
            });
            wx.showToast({
                title: '活动结束时间必须晚于开始时间',
                duration: 3000,
                icon: 'none'
            })
            return
        }
        if (_this.data.image_path[0] == "") {
            _this.setData({
                isProcessing: false,
            })
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 100
            });
            wx.showToast({
                title: '请上传活动封面',
                duration: 3000,
                icon: 'none'
            })
            return
        }
        if (_this.data.overimagecount) {
            _this.setData({
                isProcessing: false,
            })
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 100
            });
            wx.showToast({
                title: '上传的图片不能超过5M',
                duration: 3000,
                icon: 'none'
            })
            return
        }

        if (_this.data.event.address4 == '') {
            _this.setData({
                isProcessing: false,
            })
            _this.setData({
                focus_address: true,
            });
            wx.showToast({
                title: '请填写详细地址',
                duration: 3000,
                icon: 'none'
            })
            return
        }
        if (_this.data.event.comment == '') {
            _this.setData({
                isProcessing: false,
                focus_comment: true,
                flag: 1
            })
            wx.showToast({
                title: '请填写活动简介',
                duration: 3000,
                icon: 'none',
            })
            return
        }
        // if (app.globalData.userInfo.role == "2" && _this.data.event.publicity == 1 && _this.data.event.additional == 1 && app.globalData.userInfo.isVIP == 0) {
        //     if (1 * app.globalData.honey_info.total_honey < 1 * app.globalData.rule[8].value) {
        //         invalid = 8
        //         wx.showToast({
        //             title: '蜂蜜不足',
        //             icon: 'none'
        //         })
        //     }
        // }
        if (invalid == 0) {
            var tmp = wx.getStorageSync("isfirstcreate")
            if (tmp == 1) {
                _this.data.event.comment = _this.data.textareastr;
                _this.setData({
                    showModal1: true,
                    textareastr: "",
                    placestr: '',
                    is_disabled: true,
                    isProcessing: false
                })
            } else {
                _this.on_submit1()

            }
        }
        wx.setStorageSync("isfirstcreate", 0)
        wx.setStorageSync("last_template_str", _this.data.event.comment);
    },
    on_submit1: function() {
        var _this = this;
        var image_array = _this.data.image_path;
        var image_str = "";
        this.setData({
            flag: 0
        })
        wx.uploadFile({
            url: app.globalData.mainURL + 'api/imageUpload',
            filePath: image_array[0],
            name: 'file',
            success: function(res) {
                if (JSON.parse(res.data).status) {
                    var image_url = JSON.parse(res.data).image_url;
                    image_str = image_str + image_url;
                    if (image_array[1] != "") {
                        wx.uploadFile({
                            url: app.globalData.mainURL + 'api/imageUpload',
                            filePath: image_array[1],
                            name: 'file',
                            success: function(res1) {
                                if (JSON.parse(res1.data).status) {
                                    var image_url1 = JSON.parse(res1.data).image_url;
                                    image_str = image_str + "," + image_url1;
                                    if (image_array[2] != "") {
                                        wx.uploadFile({
                                            url: app.globalData.mainURL + 'api/imageUpload',
                                            filePath: image_array[2],
                                            name: 'file',
                                            success: function(res2) {
                                                if (JSON.parse(res2.data).status) {
                                                    var image_url2 = JSON.parse(res2.data).image_url;
                                                    image_str = image_str + "," + image_url2;
                                                    //send url request to the server
                                                    console.log(image_str);
                                                    _this.on_submit2(image_str);
                                                }
                                            }
                                        });
                                    } else {
                                        //send url request to the server
                                        console.log(image_str);
                                        _this.on_submit2(image_str);

                                    }
                                }
                            }
                        })
                    } else {
                        //send url request to the server
                        console.log(image_str);
                        _this.on_submit2(image_str);
                    }
                }
            }
        })
    },
    on_submit2: function(image_str) {
        if (this.data.isfirstbtn == 1) return;
        else if (this.data.isfirstbtn == 0) {
            this.data.isfirstbtn = 1
        }
        this.setData({
            flag: 0
        })
        var _this = this;
        console.log(_this.data.event.comment);
        wx.request({
            url: app.globalData.mainURL + 'api/createEvent',
            data: {
                'user_id': app.globalData.userInfo.user_id,
                'role': app.globalData.userInfo.role,
                'event_name': _this.data.event.name,
                'event_type': _this.data.event.kind,
                'agent_name': _this.data.event.agent_name,
                'agent_phone': _this.data.event.agent_phone,
                'start_time': _this.data.event.start_time,
                'end_time': _this.data.event.end_time,
                'province': _this.data.province_id,
                'city': _this.data.city_id,
                'area': _this.data.area_id,
                'detail_address': _this.data.event.address4,
                'longitude': _this.data.longitude,
                'latitude': _this.data.latitude,
                'limit': _this.data.event.limit,
                'cost': _this.data.event.cost,
                'comment': _this.data.event.comment,
                'publicity': _this.data.isPublic,
                'isCancel': _this.data.isCancel,
                'isPhone': _this.data.isPhone,
                'additional': _this.data.event.additional,
                'member_state': app.globalData.userInfo.isVIP * 1,
                'image_str': image_str,
                'person_limit': _this.data.event.limit_perUser,
                'pay_type': _this.data.event.payment_type
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                if (app.globalData.userInfo.role == 2 && _this.data.isPublic == 1 && _this.data.event.additional == 1) {
                    var honey = wx.getStorageSync('honey_info')
                        //honey.total_honey -= _this.data.honey * 1
                    app.globalData.honey_info = honey
                    wx.setStorageSync('honey_info', honey)
                }
                wx.showToast({
                    title: '活动已创建成功',
                    icon: 'success',
                    time: 3000,
                    success: function() {
                        setTimeout(function() {
                            wx.redirectTo({
                                url: '../../index/detail_event/detail_event?id=' + res.data.result,
                                success: function() {}
                            })
                        }, 1000);
                    }
                })
            }
        });
    },
    on_click_newaddress: function() {
        this.setData({
            select_province: this.data.province_id,
            select_city: this.data.city_id,
            select_area: this.data.area_id,
            flag: 0
        })

        var _this = this
        wx.request({
            url: app.globalData.mainURL + "api/getCities",
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                province: _this.data.province[_this.data.province_id].province
            },
            success: function(res) {
                var cities = res.data.result
                for (var index = 0; index < cities.length; index++) {
                    if (cities[index].id == _this.data.city_id) {
                        _this.setData({ select_city: index })
                    }
                }
                _this.setData({
                    city: res.data.result
                })
                console.log(_this.data.city_id)
                if (res.data.status) {
                    wx.request({
                        url: app.globalData.mainURL + "api/getAreas",
                        method: 'POST',
                        header: {
                            'content-type': 'application/json'
                        },
                        data: {
                            province: _this.data.province_name,
                            city: _this.data.city_name
                        },
                        success: function(res) {
                            var areas = res.data.result
                            for (var index = 0; index < areas.length; index++) {
                                if (areas[index].id == _this.data.area_id) {
                                    _this.setData({ select_area: index })
                                }
                            }
                            _this.setData({
                                area: res.data.result
                            })
                        }
                    })
                }
            }
        })
    },
    onCancel1: function() {
        this.setData({
            showModal1: false,
            textareastr: this.data.event.comment,
            placestr: "请输入活动简介，不超过500字",
            is_disabled: false
        });
        this.setData({ placestr: '请输入活动简介，不超过500字' })
    },
    onConfirm1: function() {
        this.on_submit1()
        this.setData({
            showModal1: false,
            flag: 0
        });
    },
    //upload image functions
    on_click_image: function(e) {
        var that = this;
        var id = e.target.id;
        if (id >= 3) return;
        if (id >= that.data.selected) {
            app.globalData.ischooseimage = 1;
            wx.chooseImage({
                count: 3,
                success: function(res) {

                    var image = that.data.image_path;
                    // if (res.tempFiles[0].size > 1048) {
                    for (var i = 0; i < res.tempFiles.length; i++) {
                        if (res.tempFiles[i].size > 10485760) {
                            wx.showToast({
                                title: '图片太大，无法上传！',
                                icon: 'none',
                                duration: 3000
                            });
                            return;
                            that.data.overimagecount++;
                        }
                    }
                    for (var i = 0; i < res.tempFiles.length; i++) {
                        image[that.data.selected] = res.tempFilePaths[i];
                        that.data.selected++;
                        if (that.data.selected > 2) break;
                        that.data.select[that.data.selected] = 1;
                        that.data.isimage++;
                    }
                    that.setData({ image_path: image, selected: that.data.selected, select: that.data.select });
                    console.log(id + ',' + that.data.selected);
                },
            });
        }
    },
    on_click_delete: function(event) {
        var that = this;
        var image = that.data.image_path;
        var select_buf = that.data.select;
        var id = event.target.id;
        if (id < 2) {
            var index = 0;
            for (index = id; index < 2; index++) {
                image[index] = image[1 * index + 1];
                select_buf[index] = select_buf[1 * index + 1];
            }
            image[2] = '';
            select_buf[2] = 0;
            if (image[1] != "") {
                select_buf[2] = 1;
            }

        } else {
            image[2] = '';
            select_buf[2] = 1;
        }
        that.data.isimage--;
        that.data.selected--;
        that.setData({
            image_path: image,
            select: select_buf,
            selected: that.data.selected
        })
        console.log(id + ',' + that.data.selected)
    },

    bindtemplatechange: function(e) {
        var that = this;
        this.setData({
            select_template: e.detail.value
        })
        console.log(that.data.select_template);
        if (e.detail.value == 1) {
            //set system template
            if (that.data.event.kind == 40) {
                that.showitem();
                wx.showToast({
                    title: '请选择活动类型',
                    duration: 2000,
                    icon: 'none'
                })
            } else {
                var activity_templates = that.data.system_templates.filter(item => item.template_type == "2");
                var sys_template = activity_templates.filter(item => (1 * item.event_type_id - 1) == that.data.event.kind);

                if (sys_template.length > 0) {
                    that.setData({
                        textareastr: sys_template[0].content
                    });
                    that.data.event.comment = that.data.textareastr;
                } else {
                    wx.showToast({
                        title: '服务器上不存在该活动类型',
                        duration: 2000,
                        icon: 'none'
                    })
                }
            }
        } else if (e.detail.value == 2) {
            //set last template : get data from storage
            that.setData({
                textareastr: that.data.last_template_str
            });
            that.data.event.comment = that.data.textareastr;
        } else {
            //set default 
            that.setData({
                textareastr: ""
            });
            that.data.event.comment = that.data.textareastr;

        }
    },

    payment_radioChange: function(e) {
        this.data.event.payment_type = e.detail.value;
    },



})
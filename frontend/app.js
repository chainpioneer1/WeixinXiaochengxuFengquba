//app.js
var WXBizDataCrypt = require('./utils/RdWXBizDataCrypt.js');

App({
    globalData: {
        selected_booking_tab: 0,
        appid: 'wxea381fb0ca7c2a24', //appid needs to provide it yourself, here appid I randomly  
        secret: 'fengtiWeixin17642518820android12', //secret is required to provide, where the secret I wrote 
        mch_id: '1500220062',
        userInfo: {
            user_id: 0,
            'nickname': 'WeiXin',
            'avatar': '',
            'user_id': 0,
            'name': '',
            'phone': '',
            'honey': 0,
            'state': 0,
            'forbidden': 0,
            'isVIP': 0,
            eventData: {
                "ground_image": "",
                "act_type": "",
                "act_status": "",
                "favourite": 0,
                "act_name": "",
                "member_count": 0,
                "cost": 0,
                "act_date": " ",
                "address": "",
                "ground_name": "",
                "ground_owner": "",
                "max_member": 0,
                "act_intro": ""
            },
        },
        getUserInfoDisabled: false,
        getUserLocationDisabled: false,
        initDisabled: false,
        address: [],
        productState: ["待发货", "待收货", "交易成功"],
        eventState: ["进行中", "已完成", "已取消"],
        userRole: ['无', '商家', '个人'],
        eventType: ['足球', '篮球', '台球', '排球', '网球', '壁球', '瑜伽', '舞蹈', '电竞', '爬山', '轮滑', '武术',
            '旅游', '滑冰', '滑雪', '拳击', '跑步', '棋牌', '户外', '健身', '游泳', '桌游', '骑行', '羽毛球',
            '乒乓球', '保龄球', '跆拳道', '高尔夫', '运动装备', '射击射箭', '轰趴聚会', '综合商家', '其他'
        ],
        default_stadium_img: [{ picture: "global/picture01@2x.png" }],
        memberState: ['使用中', '已过期'],
        exchangeState: ['待发货', '待收货', '交易成功'],
        bindingState: ['提现中', '提现成功', '提现失败'],
        mainURL: 'https://www.fengteam.cn/backend3/',
        smsURL: 'https://www.fengteam.cn/sms/SendTemplateSMS.php',
        uploadURL: 'https://www.fengteam.cn/backend3/uploads/',
        // mainURL: 'https://127.0.0.1/honey/',
        // smsURL: 'https://www.fengteam.cn/sms/SendTemplateSMS.php',
        // uploadURL: 'https://127.0.0.1/honey/uploads/',
        honey_info: {
            total_honey: 0,
            honeybox_array: [],
        },
        template: [],
        daily_honey: [0, 0],
        isactivetime: 1,
        rule: '',
        step: 0,
        laststep: 0,
        see_news: 0,
        have_stadium: 0,
        issearch: 0,
        searchlat: 0,
        searchlong: 0,
        currentCityName: '',
        ischooseimage: 0,
        iscreatepage: 0,
        nickname_buf: '',
        isFirstLaunch: false,
        callback: null,
        _tmr: 0,
        _backend_tmr: 0,
        templateIds: {
            // order_cancel: 'uL8sjGNBu5z7I8ZpR7TCyDsSqLK19BjjspuLG4gvEmA', // activity name, time, number of person, canceled user, address
            order_start: '0za3UAJpKFCWHQi0ZH47i0ILE4t29UZ7GAc0D632mQs', // boss name, address, start time, end time, cost, sport type
            pay_cancel: 'VG1esuovTwhXWY0a4HWMuWjKWADb8rPhPkpVGFgga2s', // activity name, time, address, canceled time, canceled user
            event_start: '1X8r81uZNJQ1_byAYiTueELz9bWKIQNFY7legHDu_jU', // event name, start time, end time, address
            pay_success: '0DCgeORa3iSshUNs7q4hzCgV8Uep3sCdFypGRBvXY4A', // activity name, address, time, organizer, number of activity, number of paid, paid user
            group_success: '1c_Qfq9-np9sJKdJGdo6XP67vSNzPKSZbTRzuRQy6Zw', // activity name, number of person, organizer, activity time, address, paid person
        }
    },
    onLaunch: function() {},
    onAuthorize: function() {
        var that = this;
    },
    go2Setting: function() {
        wx.showModal({
            title: '提示',
            content: '要正常使用此小程序，您需要允许用户位置获取权限',
            showCancel: false,
            confirmText: '去设置',
            success: function(res) {
                wx.openSetting({
                    success: (res) => {
                        // console.log("openSetting: ", res);
                    }
                });
            },
        });
    },
    onInitialize: function(callback) {
        clearInterval(this.globalData._tmr);
        clearTimeout(this.globalData._tmr);
        this.globalData.callback = callback;
        // wx.setTabBarStyle({
        //         color: '#888888',
        //         selectedColor: '#472E00',
        //         backgroundColor: '#ffffff'
        //     })
        // wx.setNavigationBarColor({
        //     frontColor: '#000000',
        //     backgroundColor: '#ffffff',
        // })
        var _this = this
            // _this.getLocation();

        wx.request({
            url: _this.globalData.mainURL + 'api/getRules',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                _this.globalData.rule = res.data.rule;
                wx.setStorageSync('user_step', _this.globalData.rule[16].value);
                wx.setStorageSync('last_step', _this.globalData.rule[16].value);
                _this.globalData.user_step = _this.globalData.rule[16].value;
                _this.globalData.laststep = _this.globalData.rule[16].value;
            },
        })

        wx.request({
            url: _this.globalData.mainURL + 'api/getTemplates',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                // console.log(res)
                _this.globalData.template = res.data.template
                    // console.log(app.globalData.template)
            },
        })

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
                        _this.getUserDetail(obj);

                        // console.log('User step is ', wx.getStorageSync('user_step'));
                    }
                });
            }
        })
        _this.globalData.userInfo.nickname = _this.globalData.nickname
    },
    onUnload: function() {
        this.onHide();
    },
    onHide: function() {
        wx.setStorageSync('honey_info', this.globalData.honey_info)
    },
    getUserDetail: function(obj) {
        var _this = this;
        wx.getUserInfo({
            success: function(res) {
                var info = _this.globalData.userInfo;
                info.nickname = res.userInfo.nickName;
                // console.log(info.nickname)
                _this.globalData.nickname = info.nickname
                info.avatar = res.userInfo.avatarUrl;
                info.gender = res.userInfo.gender;
                console.log("GetUserStateByOpenId started")
                wx.request({
                    url: _this.globalData.mainURL + 'api/getUserStateByOpenId',
                    data: {
                        open_id: obj.openid
                    },
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function(res) {
                        if (res.data.status == false) {
                            var cur = new Date();
                            _this.globalData.todayfirst = cur.getDate();
                            _this.globalData.todayselected = [];
                            _this.globalData.honey_info = {
                                total_honey: 0,
                                honeybox_array: []
                            }
                            _this.globalData.daily_honey = [0, 0];
                            _this.globalData.favorinputtext = [];
                            wx.setStorageSync("have_stadium", 0)
                            wx.setStorageSync("isfirstcreate", 1)
                            setTimeout(function() {
                                _this.onLaunch();
                            }, 2000);
                            wx.request({
                                method: 'POST',
                                header: {
                                    'content-type': 'application/json'
                                },
                                url: _this.globalData.mainURL + 'api/addNewUser',
                                data: {
                                    nickname: _this.globalData.userInfo.nickname,
                                    avatar: _this.globalData.userInfo.avatar,
                                    open_id: obj.openid,
                                    gender: (_this.globalData.userInfo.gender - 1)
                                        // 'user_code': _this.globalData.user_code
                                        // 'session_key': _this.globalData.session_key
                                },
                                success: function(ret) {
                                    // if (ret.data.status) {
                                    //   // var info = ret.data.result;
                                    //   // //_this.globalData.userInfo;

                                    //   // _this.globalData.userInfo.name = _this.globalData.userInfo.nickname
                                    //   // _this.globalData.userInfo.user_id = info.user_id;
                                    // }
                                    // console.log(ret)
                                }
                            })
                        } else {
                            if (res.data.result[0].daily_honey != '') {
                                _this.globalData.daily_honey = JSON.parse(res.data.result[0].daily_honey)
                            } else {
                                _this.globalData.daily_honey = [0, 0];
                            }
                            _this.globalData.todayfirst = res.data.result[0].todayfirst;
                            _this.globalData.have_stadium = wx.getStorageSync("have_stadium")
                            if (_this.globalData.honey_info.honeybox_array == undefined) {
                                _this.globalData.honey_info = {
                                    total_honey: 0,
                                    honeybox_array: []
                                }
                            }
                            var cur = new Date();
                            _this.globalData.honey_info.today_honey = 1 * res.data.result[0].honey;
                            var info = _this.globalData.userInfo;
                            if (res.data.result[0].forbidden == 1) {
                                wx.showModal({
                                    title: '您的账号已被禁用',
                                    showCancel: false,
                                    complete: function() {
                                        wx.navigateBackMiniProgram({})
                                    }
                                })
                            }
                            info.user_id = res.data.result[0].no;
                            info.phone = res.data.result[0].phone;
                            info.state = res.data.result[0].state;
                            info.forbidden = res.data.result[0].forbidden;
                            info.honey = res.data.result[0].honey;
                            info.role = res.data.result[0].role;
                            if (info.role == 1) {
                                wx.request({
                                    url: _this.globalData.mainURL + "api/haveStadium",
                                    method: "POST",
                                    header: {
                                        "content-type": "application/json"
                                    },
                                    data: {
                                        user_id: info.user_id
                                    },
                                    success: function(res) {
                                        "" != res.data.result[0].site_introduction && wx.setStorageSync("have_stadium", 1);
                                    }
                                })
                            }
                            info.name = res.data.result[0].name;
                            info.amount = res.data.result[0].amount;
                            info.amount_withdraw = res.data.result[0].amount_withdraw;
                            _this.globalData.honey_info.total_honey = info.honey
                            wx.setStorageSync('honey_info', _this.globalData.honey_info)
                            if (info.state * 1 != 2) {
                                info.name = _this.globalData.userInfo.nickname
                            }
                            if (info.avatar == '') {
                                info.avatar = "/image/user-unlogin.png"
                            }
                            if (res.data.member[0].state == null) {
                                info.isVIP = 0
                            }
                            if (res.data.member[0].state == 1) {
                                info.isVIP = 1;
                            }
                            _this.globalData.userInfo = info
                                // console.log(info);
                            var tempdate1 = new Date()
                            if (tempdate1.getHours() >= 0 && tempdate1.getHours() < 7) {
                                _this.globalData.isactivetime = 0
                            } else {
                                _this.globalData.isactivetime = 1
                            }
                            if (_this.globalData.callback) _this.globalData.callback();
                            //clearInterval(_this.globalData._backend_tmr);
                            //_this.globalData._backend_tmr = setInterval(_this.changeServerState, 5000)
                            _this.checkDate();

                        }
                    },
                    fail: function() {}
                })
            }
        });
    },
    changeServerState: function() {
        wx.request({
            url: this.globalData.mainURL + "api/datamanage/checkEventState",
            method: "POST",
            header: {
                "content-type": "application/json"
            },
            data: {},
            success: function() {
                // console.log("Status Changed");
            }
        });
    },
    showHint: function() {
        wx.showModal({
            title: '提示',
            content: '开启微信计步权限，有机会获取蜂蜜哦',
            success: function(res) {
                if (res.confirm) {
                    wx.openSetting({

                        })
                        //跳转去设置
                }
            }
        })
    },
    getLocation: function(callback) {
        var that = this;
        wx.getLocation({
            type: 'gcj02',
            success: function(res) {
                that.globalData.searchlat = res.latitude;
                that.globalData.searchlong = res.longitude;

                var url = 'https://restapi.amap.com/v3/geocode/regeo?key=8eb63e36d0b6d7d29a392503a4a80f6c&location=' + res.longitude + ',' + res.latitude + '&poitype=&radius=&extensions=all&batch=false&roadlevel=0';

                //get activity array
                wx.request({
                    url: url,
                    success: function(res) {
                        // console.log('got location');
                        //console.log(res.data);
                        console.log(res.data.regeocode.addressComponent);
                        // var province_name = res.data.regeocode.addressComponent.province
                        that.globalData.userCityName = res.data.regeocode.addressComponent.city;
                        // var area_name = res.data.regeocode.addressComponent.district
                    },
                });
                if (callback) callback();
            }
        });
    },

    getLatLng: function(cityName, callback) {
        var that = this;
        var url = 'https://restapi.amap.com/v3/geocode/geo?key=8eb63e36d0b6d7d29a392503a4a80f6c&address=' + cityName;

        //get activity array
        wx.request({
            url: url,
            success: function(res) {
                console.log('got location');
                //console.log(res.data);
                //console.log(res.data.regeocode.addressComponent);
                // var province_name = res.data.regeocode.addressComponent.province
                //app.globalData.currentCityName = res.data.regeocode.addressComponent.city;
                var cityData = wx.getStorageSync('currentCity');
                var location = res.data.geocodes[0].location.split(',');
                cityData.current_latitude = location[1];
                cityData.current_longitude = location[0];
                cityData.city = cityName;
                if (cityData.city == cityData.user_cityName) {
                    cityData.current_latitude = cityData.user_latitude;
                    cityData.current_longitude = cityData.user_longitude;
                }
                that.globalData.currentCityName = cityName;
                wx.setStorageSync('currentCity', cityData);
                // var area_name = res.data.regeocode.addressComponent.district
            },
            complete: function(res) {
                // wx.showModal({ content: app.globalData.currentCityName });
                console.log(callback);
                if (callback)
                    callback();

            }
        });

    },

    resethoney: function() {

    },
    // checkDate1: function() {
    //     var _this = this
    //     var tempdate = new Date()
    //     var todayfirst = wx.getStorageSync('todayfirst');
    //     if (tempdate.getHours() < 7) {
    //         this.globalData.isactivetime = 0
    //         var todaytime = new Date().getDate()

    //         wx.setStorageSync("todayselected", [])
    //         _this.globalData.daily_honey = [0, 0]
    //         wx.setStorageSync("daily_honey", [0, 0])
    //     }
    //     if (tempdate.getHours() >= 7) {
    //         this.globalData.isactivetime = 1

    //         // if (todayfirst != tempdate.getDate() && todayfirst != '') {
    //         //     console.log(todayfirst);
    //         //     wx.setStorageSync('todayfirst', tempdate.getDate())
    //         // }
    //     }


    //     var that = this
    //     wx.request({
    //         url: that.globalData.mainURL + 'api/getNewBookingAlarm',
    //         method: 'POST',
    //         header: {
    //             'content-type': 'application/json'
    //         },
    //         data: {
    //             user_id: that.globalData.userInfo.user_id
    //         },
    //         success: function(res) {
    //             if (res.data.bookingNewsAmount.length > 0) {
    //                 for (var iter = 0; iter < res.data.bookingNewsAmount.length; iter++) {
    //                     var booking_data = res.data.bookingNewsAmount[iter]
    //                     that.gainNewHoney(booking_data)
    //                 }
    //             }
    //         },
    //     })
    //     for (var iter = 0; iter < this.globalData.honey_info.honeybox_array.length; iter++) {
    //         if (Date.now() - this.globalData.honey_info.honeybox_array[iter].start_time > 172800000) {
    //             this.globalData.honey_info.honeybox_array.splice(iter, 1)
    //         }
    //     }
    // },
    checkDate: function() {
        var a = WXBizDataCrypt;
        var e = this,
            t = new Date(),
            o = e.globalData.todayfirst;
        t.getHours() < 7 && (this.globalData.isactivetime = 0)
        if (t.getHours() >= 7) {
            this.globalData.isactivetime = 1
            o != t.getDate() && "" != o && (
                console.log(o),
                e.globalData.todayfirst = t.getDate(),
                e.globalData.todayselected = [],
                wx.login({
                    success: function(t) {
                        wx.request({
                            url: e.globalData.mainURL + "api/getopenid",
                            data: {
                                code: t.code
                            },
                            method: "POST",
                            header: {
                                "content-type": "application/json"
                            },
                            success: function(t) {
                                var o = {};
                                o.openid = t.data.openid;
                                o.expires_in = Date.now() + t.data.expires_in;
                                e.globalData.session_key = t.data.session_key;
                                wx.getSetting({
                                    success: function(t) {
                                        e.globalData.step = 1 * e.globalData.rule[16].value
                                        e.globalData.laststep = 1 * e.globalData.rule[16].value
                                        console.log('Last day step is ' + e.globalData.laststep);
                                        console.log('Today step is ' + e.globalData.step);
                                        new Date();
                                        var i = new Date();
                                        e.globalData.daily_honey = [0, 0];
                                        var l = 1 * e.globalData.laststep * (1 * e.globalData.rule[3].value);
                                        l = 1 * Math.floor(l)
                                        wx.request({
                                            url: e.globalData.mainURL + "api/setTodayFirst",
                                            method: "POST",
                                            header: {
                                                "content-type": "application/json"
                                            },
                                            data: {
                                                todayfirst: i.getDate(),
                                                user_id: e.globalData.userInfo.user_id,
                                                honey: l
                                            },
                                            success: function() {
                                                console.log("success");
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }));
        }
        for (var n = 0; n < this.globalData.honey_info.honeybox_array.length; n++)
            Date.now() - this.globalData.honey_info.honeybox_array[n].start_time > 1728e5 && this.globalData.honey_info.honeybox_array.splice(n, 1);
    },

    checkValidPhone: function(phone) {
        var compare = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        return compare.test(phone);
    },

    phoneCall: function(phone) {
        var that = this
        console.log(that.checkValidPhone(phone));
        if (!that.checkValidPhone(phone)) {
            wx.showToast({
                title: '这不是有效的电话号',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        wx.makePhoneCall({
            phoneNumber: phone,
            complete: function() {
                return
            }
        })
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

})
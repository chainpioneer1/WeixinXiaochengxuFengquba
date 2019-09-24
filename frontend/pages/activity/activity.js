//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        uploadUrl: app.globalData.uploadURL,
        actBanners: ["global/banner1@2x.png", "global/banner2@2x.png"],
        pxBanners: ["global/peixunbanner1@2x.png", "global/peixunbanner2@2x.png"],
        active1: "active",
        active2: "",
        sport_kind_text: app.globalData.eventType,
        isfilterset: 0,
        longitude: 0,
        latitude: 0,

        // old events variable 
        select_menu_state: 0,
        select_order_menu_state: 0,
        select_role_menu_state: 0,
        select_time_menu_state: 0,
        select_style_menu_state: 0,
        color_array: [
            "#000000",
            "#e6b53c"
        ],
        menu_btn_array: [
            "../../image/btn_updown@2x.png",
            "../../image/btn_updown_hover@2x.png"
        ],
        image_favs: ["../../image/good_n@2x.png", "../../image/good_s@2x.png"],
        menu_order_index: 0,
        menu_role_index: 0,
        menu_style_index: 34,
        menu_time_index: 0,
        starttime: '开始时间',
        endtime: '结束时间',
        prev_menu_style_index: 0,
        menu_order_array: [
            "排序",
            "离我最近",
            "价格最低",
            "价格最高",
        ],
        menu_order_array1: [
            "全国"
        ],
        menu_role_array: [
            "不限",
            "商家",
            "个人",
        ],
        events: [],
        filter_events: [],

        selected_state: 0,
        userInfo: [],
        eventType: [],
        userRole: [],
        eventState: [],
        favor: [],

        // new events variable
        select_new_menu_state: 0,
        select_new_order_menu_state: 0,
        select_new_time_menu_state: 0,
        select_new_style_menu_state: 0,

        menu_new_order_index: 0,
        menu_new_style_index: 34,
        menu_new_time_index: 0,
        new_starttime: '开始时间',
        new_endtime: '结束时间',
        prev_new_menu_style_index: 0,

        new_events: [],
        filter_new_events: [],
        new_selected_state: 0,
        tmrID: 0,
        isFirstInit: true,
    },
    onLoad: function(query) {
        var that = this;
        if (query.active2) {
            if (query.active2.length > 0) {
                that.setData({
                    active2: 'active',
                    active1: ''
                })
            }
        }
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
        that.data.starttime = '开始时间'
        that.data.endtime = '结束时间'

        this.setData({
            starttime: that.data.starttime,
            endtime: that.data.endtime,
        })
        var currentCity = wx.getStorageSync('currentCity');

        var longitude = currentCity.user_longitude;
        var latitude = currentCity.user_latitude;
        var city = currentCity.city;
        var province = currentCity.province;
        that.updateEventLists(longitude, latitude, city, province);
    },
    updateEventLists: function(longitude, latitude, city, province) {
        var that = this;
        that.data.longitude = longitude;
        that.data.latitude = latitude;
        wx.request({
            url: app.globalData.mainURL + 'api/getEventsByProvince',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                city: city,
                province: province,
                user_id: app.globalData.userInfo.user_id
            },
            success: function(res) {
                if (!res.data.status) return;
                var eventCities = res.data.eventCities;
                var menu_order_array1 = ["全国"];
                var menu_new_order_index = 0;

                for (var i = 0; i < eventCities.length; i++) {
                    var item = eventCities[i];
                    menu_order_array1.push(item.city_name);
                    if (item.city_name == city)
                        menu_new_order_index = i + 1;
                }
                that.setData({
                    menu_order_array1: menu_order_array1,
                    menu_new_order_index: menu_new_order_index,
                    eventCities: eventCities
                });
                var event_buf = res.data.result;
                if (event_buf != null) {
                    for (var index = 0; index < event_buf.length; index++) {
                        var time = event_buf[index].start_time.split(':');
                        event_buf[index].start_time = time[0] + ':' + time[1];
                        time = event_buf[index].end_time.split(':');
                        event_buf[index].end_time = time[0] + ':' + time[1];
                        var start_date = event_buf[index].start_time.split(' ')
                        event_buf[index].start_time_now = Date.parse(start_date[0].replace(/-/g, '/'))

                        //get remained days and hours
                        var cur_date = new Date();
                        console.log(event_buf[index].end_time.replace(/-/g, '/'));
                        var end_date = new Date(event_buf[index].end_time.replace(/-/g, '/'));
                        if (event_buf[index].owner == 0)
                            end_date = new Date(event_buf[index].final_time.replace(/-/g, '/'));
                        var timeDiff = end_date.getTime() - cur_date.getTime();
                        if (timeDiff < 0) timeDiff = 0;
                        var diffhours = Math.floor(timeDiff / (1000 * 3600));
                        var remain_day = Math.floor(diffhours / 24);
                        var remain_hour = diffhours - remain_day * 24;
                        event_buf[index].remain_day = remain_day;
                        event_buf[index].remain_hour = remain_hour;
                        if (remain_day < 10 && remain_day >= 0) {
                            event_buf[index].remain_day = "0" + remain_day;
                        }
                        if (remain_hour < 10) {
                            event_buf[index].remain_hour = "0" + remain_hour;
                        }

                        event_buf[index].end_time_now = Date.parse(event_buf[index].end_time.replace(/-/g, '/'))
                        if (event_buf[index].current_member == null) {
                            event_buf[index].current_member = 0;
                        }

                        var item = event_buf[index];
                        if (item.owner == 0) {
                            var start = new Date(item.start_time.replace(/-/g, '/'));
                            var end = new Date(item.end_time.replace(/-/g, '/'));
                            item.start_time = start.getFullYear() + '年' + (start.getMonth() + 1) + '月' + start.getDate() + '日';
                            item.end_time = end.getFullYear() + '年' + (end.getMonth() + 1) + '月' + end.getDate() + '日';
                        }

                        if (event_buf[index].name.length > 14) {
                            var name = event_buf[index].name;
                            name = name.slice(0, 14) + '...';
                            event_buf[index].name = name
                        }
                        if (event_buf[index].organizer_id != '0' && event_buf[index].name.length > 14) {
                            var name = event_buf[index].name;
                            name = name.slice(0, 14) + '...';
                            event_buf[index].name = name
                        }
                        event_buf[index].favor = res.data.favor[index];
                        event_buf[index].distance = that.getDistanceFromLatLonInKm(that.data.latitude, that.data.longitude, event_buf[index].latitude, event_buf[index].longitude);
                        if (event_buf[index].distance > 1) {
                            event_buf[index].distance_str = (1.0 * event_buf[index].distance).toFixed(1) + "km";
                        } else {
                            event_buf[index].distance_str = 1000 * event_buf[index].distance + "m";
                        }
                        var pic_array = event_buf[index].pic.split(",")
                        event_buf[index].pic_array = pic_array;
                    }
                    // console.log(event_buf);
                    var old_event_array = [];
                    var new_event_array = [];
                    old_event_array = event_buf.filter(item => (item.owner == "1"))
                    new_event_array = event_buf.filter(item => (item.owner == "0"))
                    that.setData({
                        events: old_event_array,
                        new_events: new_event_array,
                        favor: res.data.favor,
                        userInfo: app.globalData.userInfo,
                        eventType: app.globalData.eventType,
                        userRole: app.globalData.userRole,
                        eventState: app.globalData.eventState
                    })
                    that.all_filter_item();
                    that.all_filter_events();
                }
            },
            complete: function() {
                wx.hideLoading({});
            }
        })
    },

    selectTab: function(e) {
        if (e.currentTarget.id == 'tab-btn1' & this.data.active1 == "") {
            this.setData({ active1: "active", active2: "" })
            this.setData({ select_tab: 0, isfilterset: 0 })
        }
        if (e.currentTarget.id == 'tab-btn2' & this.data.active2 == "") {
            this.setData({ active1: "", active2: "active" })
            this.setData({ select_tab: 1, isfilterset: 0 })
        }
    },

    click_detail_event: function(event) {
        wx.navigateTo({
            url: '../index/detail_event/detail_event?id=' + event.currentTarget.id
        })
    },
    click_detail_new_event: function(event) {
        wx.navigateTo({
            url: '../index/detail_new_event/detail_new_event?id=' + event.currentTarget.id
        })
    },


    on_click_ordermenu: function() {
        var that = this;
        this.setData({
            select_menu_state: (that.data.select_order_menu_state + 1) % 2,
            select_order_menu_state: (that.data.select_order_menu_state + 1) % 2,
            select_role_menu_state: 0,
            select_time_menu_state: 0,
            select_style_menu_state: 0,
        })

    },
    on_click_rolemenu: function() {
        var that = this;
        this.setData({
            select_menu_state: (that.data.select_role_menu_state + 1) % 2,
            select_order_menu_state: 0,
            select_role_menu_state: (that.data.select_role_menu_state + 1) % 2,
            select_time_menu_state: 0,
            select_style_menu_state: 0,
        })
    },
    on_click_timemenu: function() {
        var that = this;
        this.setData({
            select_menu_state: (that.data.select_time_menu_state + 1) % 2,
            select_order_menu_state: 0,
            select_role_menu_state: 0,
            select_time_menu_state: (that.data.select_time_menu_state + 1) % 2,
            select_style_menu_state: 0,
        })
    },
    on_click_stylemenu: function() {
        var that = this;
        if (that.data.select_style_menu_state == 0) {
            that.setData({
                prev_menu_style_index: that.data.menu_style_index,
            })
        } else {
            that.setData({
                menu_style_index: that.data.prev_menu_style_index,
            })
        }
        that.setData({
            select_menu_state: (that.data.select_style_menu_state + 1) % 2,
            select_order_menu_state: 0,
            select_role_menu_state: 0,
            select_time_menu_state: 0,
            select_style_menu_state: (that.data.select_style_menu_state + 1) % 2,
        })
    },

    getDistanceFromLatLonInKm: function(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        if (lat1 == lat2 && lon1 == lon2) return "0.0";

        // var theta = lon1 - lon2;
        // var dist = Math.sin(this.deg2rad(lat1)) * Math.sin(this.deg2rad(lat2)) +
        //     Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.cos(this.deg2rad(theta));
        // dist = Math.acos(dist);
        // console.log(lat1, lat2, lon1, lon2);
        // var miles = this.rad2deg(dist) * 60 * 1.1515;
        // return (miles * 1.609344).toFixed(3);


        var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d.toFixed(3);
    },

    deg2rad: function(deg) {
        return deg * (Math.PI / 180);
    },

    rad2deg: function(rad) {
        return rad * (180 / Math.PI);
    },

    compare_distance: function(a, b) {
        if (a.distance < b.distance)
            return -1;
        if (a.distance > b.distance)
            return 1;
        return 0;
    },

    compare_regTime: function(a, b) {
        if (a.reg_time < b.reg_time)
            return 1;
        if (a.reg_time > b.reg_time)
            return -1;
        return 0;
    },
    compare_price_low_first: function(a, b) {
        if (a.cost < b.cost)
            return -1;
        if (a.cost > b.cost)
            return 1;
        return 0;
    },
    compare_price_low_last: function(a, b) {
        if (a.cost > b.cost)
            return -1;
        if (a.cost < b.cost)
            return 1;
        return 0;
    },


    //filter functions
    all_filter_item: function() {
        var that = this;
        var order_index = that.data.menu_order_index;
        var role_index = that.data.menu_role_index;
        var time_index = that.data.menu_time_index;
        var style_index = that.data.menu_style_index;

        //get role array
        var filter_array = [];
        if (role_index == 0) {
            // search by nearest 3km from me 
            filter_array = that.data.events;
        } else {
            // search by nearest 5km from me 
            filter_array = that.data.events.filter(item => item.role == role_index);
        }

        //get style arrays
        var style_array = [];
        if (style_index >= 33) {
            style_array = filter_array;
        } else {
            style_array = filter_array.filter(item => item.type == style_index);
        }


        //get time arrays
        var time_array = [];
        var isstarttime = 0
        var isendtime = 0
        if (this.data.starttime == '开始时间') {
            isstarttime = Date.parse('2000-01-01')
        } else {
            isstarttime = Date.parse(this.data.starttime.replace(/-/g, '/'))
        }

        if (this.data.endtime == '结束时间') {
            isendtime = Date.parse('2100-01-01')
        } else {
            isendtime = Date.parse(this.data.endtime.replace(/-/g, '/')) + 86400000
        }

        if (time_index == 1) {
            //filter from isstarttime to isendtime
            time_array = style_array.filter(item => (item.start_time_now >= isstarttime) && (item.end_time_now < isendtime));

        } else if (time_index == 2) {
            var cur_date = new Date();
            var cur_date_str = cur_date.toDateString("yyyy/MM/dd");
            var iscurtime = Date.parse(cur_date_str);

            var week_day = cur_date.getDay();
            if (week_day == 0) { //sunday
                isstarttime = iscurtime;
                isendtime = iscurtime + 86400000
            } else {
                var diff_day = 6 - week_day;
                isstarttime = iscurtime + diff_day * 86400000;
                isendtime = iscurtime + (diff_day + 2) * 86400000;
            }
            //filter by endweek date
            time_array = style_array.filter(item => (item.start_time_now < isendtime) && (item.end_time_now >= isstarttime));
        } else {
            time_array = style_array;
        }
        that.setData({ filter_events: [] });
        //get order arrays
        if (order_index == 1) {
            // search by nearest from me
            that.setData({
                filter_events: time_array.sort(that.compare_distance)
            });
        } else if (order_index == 2) {
            //search by lowest score 
            that.setData({
                filter_events: time_array.sort(that.compare_price_low_first)
            });

        } else if (order_index == 3) {
            //sorted by most expensive      
            that.setData({
                filter_events: time_array.sort(that.compare_price_low_last)
            });
        } else {
            that.setData({
                filter_events: time_array
            });
        }
    },
    clicked_order_item: function(event) {
        var that = this;
        this.setData({
            select_menu_state: 0,
            select_order_menu_state: 0,
            select_role_menu_state: 0,
            select_time_menu_state: 0,
            select_style_menu_state: 0,
            menu_order_index: event.currentTarget.id
        });
        that.all_filter_item();
    },
    clicked_role_item: function(event) {
        var that = this;
        that.setData({
            select_menu_state: 0,
            select_order_menu_state: 0,
            select_role_menu_state: 0,
            select_time_menu_state: 0,
            select_style_menu_state: 0,
            menu_role_index: event.currentTarget.id
        });
        that.all_filter_item();
    },
    clicked_style_item: function(event) {
        this.setData({
            menu_style_index: event.currentTarget.id
        })
    },
    clicked_style_all: function(event) {
        this.setData({
            menu_style_index: 33
        })
    },
    cancel_btn_clicked: function() {
        var that = this;
        this.setData({
            menu_style_index: that.data.prev_menu_style_index,
            select_menu_state: 0,
            select_order_menu_state: 0,
            select_role_menu_state: 0,
            select_time_menu_state: 0,
            select_style_menu_state: 0,
        })
    },
    ok_btn_clicked: function() {
        this.setData({
            select_menu_state: 0,
            select_order_menu_state: 0,
            select_role_menu_state: 0,
            select_time_menu_state: 0,
            select_style_menu_state: 0,
        });
        this.all_filter_item();
    },
    starttime_picker: function(event) {
        this.setData({
            starttime: event.detail.value
        })
    },
    endtime_picker: function(event) {
        this.setData({
            endtime: event.detail.value
        })
    },
    //change date range
    on_click_range_time: function(event) {
        this.setData({
            select_menu_state: 0,
            select_order_menu_state: 0,
            select_role_menu_state: 0,
            select_time_menu_state: 0,
            select_style_menu_state: 0,
            menu_time_index: 1
        })
        this.all_filter_item();
    },
    // clicked endweek button
    on_click_endweek: function(event) {
        this.setData({
            select_menu_state: 0,
            select_order_menu_state: 0,
            select_role_menu_state: 0,
            select_time_menu_state: 0,
            select_style_menu_state: 0,
            menu_time_index: 2
        })
        this.all_filter_item();
    },
    // clicked cancel of select date
    on_click_cancel_btn: function(event) {
        this.setData({
            select_menu_state: 0,
            select_order_menu_state: 0,
            select_role_menu_state: 0,
            select_time_menu_state: 0,
            select_style_menu_state: 0,
            menu_time_index: 0
        })
        this.all_filter_item();
    },
    // new event functions
    on_click_ordermenu_new: function() {
        var that = this;
        this.setData({
            select_new_menu_state: (that.data.select_new_order_menu_state + 1) % 2,
            select_new_order_menu_state: (that.data.select_new_order_menu_state + 1) % 2,
            select_new_time_menu_state: 0,
            select_new_style_menu_state: 0,
        })

    },
    on_click_timemenu_new: function() {
        var that = this;
        this.setData({
            select_new_menu_state: (that.data.select_new_time_menu_state + 1) % 2,
            select_new_order_menu_state: 0,
            select_new_time_menu_state: (that.data.select_new_time_menu_state + 1) % 2,
            select_new_style_menu_state: 0,
        })
    },
    on_click_stylemenu_new: function() {
        var that = this;
        if (that.data.select_new_style_menu_state == 0) {
            that.setData({
                prev_new_menu_style_index: that.data.menu_new_style_index,
            })
        } else {
            that.setData({
                menu_new_style_index: that.data.prev_new_menu_style_index,
            })
        }
        that.setData({
            select_new_menu_state: (that.data.select_new_style_menu_state + 1) % 2,
            select_new_order_menu_state: 0,
            select_new_time_menu_state: 0,
            select_new_style_menu_state: (that.data.select_new_style_menu_state + 1) % 2,
        })
    },

    //filter functions
    all_filter_events: function() {
        var that = this;
        var order_index = that.data.menu_new_order_index;
        var time_index = that.data.menu_new_time_index;
        var style_index = that.data.menu_new_style_index;

        //get style arrays
        var style_array = [];
        if (style_index >= 33) {
            style_array = that.data.new_events;
        } else {
            style_array = that.data.new_events.filter(item => item.type == style_index);
        }


        //get time arrays
        var time_array = [];
        var isstarttime = 0
        var isendtime = 0
        if (this.data.new_starttime == '开始时间') {
            isstarttime = Date.parse('2000-01-01')
        } else {
            isstarttime = Date.parse(this.data.new_starttime.replace(/-/g, '/'))
        }

        if (this.data.new_endtime == '结束时间') {
            isendtime = Date.parse('2100-01-01')
        } else {
            isendtime = Date.parse(this.data.new_endtime.replace(/-/g, '/')) + 86400000
        }

        if (time_index == 1) {
            //filter from isstarttime to isendtime
            time_array = style_array.filter(item => (item.start_time_now >= isstarttime) && (item.end_time_now < isendtime));

        } else if (time_index == 2) {
            var cur_date = new Date();
            var cur_date_str = cur_date.toDateString("yyyy/MM/dd");
            var iscurtime = Date.parse(cur_date_str);

            var week_day = cur_date.getDay();
            if (week_day == 0) { //sunday
                isstarttime = iscurtime;
                isendtime = iscurtime + 86400000
            } else {
                var diff_day = 6 - week_day;
                isstarttime = iscurtime + diff_day * 86400000;
                isendtime = iscurtime + (diff_day + 2) * 86400000;
            }
            //filter by endweek date
            time_array = style_array.filter(item => (item.start_time_now < isendtime) && (item.end_time_now >= isstarttime));
        } else {
            time_array = style_array;
        }

        //get order arrays
        that.setData({
            filter_new_events: []
        });
        setTimeout(function() {
            if (true || order_index == 1) {
                // search by nearest from me
                that.setData({
                    filter_new_events: time_array.sort(that.compare_regTime)
                });
            } else if (order_index == 2) {
                //search by lowest score 
                that.setData({
                    filter_new_events: time_array.sort(that.compare_price_low_first)
                });

            } else if (order_index == 3) {
                //sorted by most expensive      
                that.setData({
                    filter_new_events: time_array.sort(that.compare_price_low_last)
                });
            } else {
                that.setData({
                    filter_new_events: time_array
                });
            }
        }, 10);

    },

    clicked_order_item_new: function(event) {
        var that = this;
        var id = parseInt(event.currentTarget.id);
        this.setData({
            select_new_menu_state: 0,
            select_new_order_menu_state: 0,
            select_new_time_menu_state: 0,
            select_new_style_menu_state: 0,
            menu_new_order_index: id + ''
        });
        if (id == 0) {
            that.updateEventLists(that.data.longitude, that.data.latitude, '', '');
        } else {
            if (that.data.eventCities.length == 0) return;
            var cityData = that.data.eventCities[id - 1];
            that.updateEventLists(that.data.longitude, that.data.latitude, cityData.city_name, cityData.province_name);
        }
    },
    clicked_style_item_new: function(event) {
        this.setData({
            menu_new_style_index: event.currentTarget.id
        })
    },
    clicked_style_all_new: function(event) {
        this.setData({
            menu_new_style_index: 33
        })
    },
    cancel_btn_clicked_new: function() {
        var that = this;
        this.setData({
            menu_new_style_index: that.data.prev_new_menu_style_index,
            select_new_menu_state: 0,
            select_new_order_menu_state: 0,
            select_new_time_menu_state: 0,
            select_new_style_menu_state: 0,
        })
    },
    ok_btn_clicked_new: function() {
        this.setData({
            select_new_menu_state: 0,
            select_new_order_menu_state: 0,
            select_new_time_menu_state: 0,
            select_new_style_menu_state: 0,
        });
        this.all_filter_events();
    },
    starttime_picker_new: function(event) {
        this.setData({
            new_starttime: event.detail.value
        })
    },
    endtime_picker_new: function(event) {
        this.setData({
            new_endtime: event.detail.value
        })
    },

    //change date range
    on_click_range_time_new: function(event) {
        this.setData({
            select_new_menu_state: 0,
            select_new_order_menu_state: 0,
            select_new_time_menu_state: 0,
            select_new_style_menu_state: 0,
            menu_new_time_index: 1
        })
        this.all_filter_events();
    },
    // clicked endweek button
    on_click_endweek_new: function(event) {
        this.setData({
            select_new_menu_state: 0,
            select_new_order_menu_state: 0,
            select_new_time_menu_state: 0,
            select_new_style_menu_state: 0,
            menu_new_time_index: 2
        })
        this.all_filter_events();
    },
    // clicked cancel of select date
    on_click_cancel_btn_new: function(event) {
        this.setData({
            select_new_menu_state: 0,
            select_new_order_menu_state: 0,
            select_new_time_menu_state: 0,
            select_new_style_menu_state: 0,
            menu_new_time_index: 0
        })
        this.all_filter_events();
    },
    onShareAppMessage: function(res) {
        console.log("SHARED")
        if (res.from === 'button') {
            // console.log(res.target)
        }
        var title = '找场馆、约伙伴、参加赛事，就用蜂去吧';
        var that = this;
        return {
            title: title,
            path: '/pages/activity/activity?active2=' + that.data.active2,
            success: function(res) {},
            fail: function(res) {}
        }
    },
    show_preview: function(res) {
        console.log(res)
        var that = this;
        console.log(res);
        var src = res.currentTarget.dataset.url;
        wx.previewImage({
            current: 0,
            urls: [src],
        })
    },
    go2Fengyun: function() {
        wx.navigateToMiniProgram({
            appId: 'wx772b3b3ff5817bdc',
            path: 'pages/competition/index/index',
            extraData: {},
            // envVersion: 'develop',
            success(res) {},
            fail(res) {
                wx.switchTab({
                    url: "/pages/activity/activity?active2=" + that.data.active2
                })
            }
        })
    }
})
const app = getApp()
var amapFile = require('../../../lib/amap-wx.js')
var myAmap = new amapFile.AMapWX({ key: "f8f1f5c8a20c199dd0f70f5a6b162280" })
var mapCtx
Page({
    data: {
        inputtext: "",
        show_content_state: 0,
        show_place_state: 0,
        show_activity_state: 0,
        rooturl: "../../../",
        image_favs: ["../../../image/good_n@2x.png", "../../../image/good_s@2x.png"],
        active1: "",
        active2: "",
        favorinput: [],
        sport_type_array: [],
        sport_kind_text: ['足球',
            '篮球',
            '台球',
            '排球',
            '网球',
            '壁球',
            '瑜伽',
            '舞蹈',
            '电竞',
            '爬山',
            '轮滑',
            '武术',
            '旅游',
            '滑冰',
            '滑雪',
            '拳击',
            '跑步',
            '棋牌',
            '户外',
            '健身',
            '游泳',
            '桌游',
            '骑行',
            '羽毛球',
            '乒乓球',
            '保龄球',
            '跆拳道',
            '高尔夫',
            '运动装备',
            '射击射箭',
            '轰趴聚会',
            '综合商家',
            '其他'
        ],

        site_array: [],
        filter_site_array: [],
        events: [],
        filter_events: [],

        userInfo: [],
        eventType: [],
        userRole: [],
        eventState: [],
        uploadUrl: app.globalData.uploadURL,
        favorite_pictures: [
            "../../../image/favoriting.png",
            "../../../image/favorited.png"
        ],
        starparam: {
            stars: [0, 1, 2, 3, 4],
            srcImage_0: "../../../image/star-0.png",
            srcImage_1: "../../../image/star-1.png",
            srcImage_2: "../../../image/star-2.png",
            srcImage_3: "../../../image/star-3.png",
            srcImage_4: "../../../image/star-4.png",
            score: 4.3,
            srcImage: ""
        },
        event_type: app.globalData.eventType,

    },
    onLoad: function (option) {

    },
    onShow: function (option) {

        if (!wx.getStorageSync("favorinputtext")) {
            wx.setStorageSync("favorinputtext", [])
        }

        this.data.favorinput = wx.getStorageSync("favorinputtext")
        this.setData({ favorinput: this.data.favorinput })
        console.log(this.data.favorinput);
        var that = this
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                var longitude = res.longitude;
                var latitude = res.latitude;
                var url = 'https://restapi.amap.com/v3/geocode/regeo?key=8eb63e36d0b6d7d29a392503a4a80f6c&location=' + longitude + ',' + latitude + '&poitype=&radius=&extensions=all&batch=false&roadlevel=0';

                //get activity array
                wx.request({
                    url: url,
                    success: function (res) {
                        var city = res.data.regeocode.addressComponent.city
                        var province = res.data.regeocode.addressComponent.province
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
                            success: function (res) {
                                console.log(res);
                                var event_buf = res.data.result;
                                that.data.sport_type_array = [];
                                if (event_buf != null) {
                                    for (var index = 0; index < event_buf.length; index++) {
                                        if (!that.data.sport_type_array._find(item => item == that.data.sport_kind_text[event_buf[index].type])) {
                                            that.data.sport_type_array.push(that.data.sport_kind_text[event_buf[index].type]);
                                        }
                                        var time = event_buf[index].start_time.split(':');
                                        event_buf[index].start_time = time[0] + ':' + time[1];
                                        time = event_buf[index].end_time.split(':');
                                        event_buf[index].end_time = time[0] + ':' + time[1];
                                        var start_date = event_buf[index].start_time.split(' ')
                                        event_buf[index].start_time_now = Date.parse(start_date[0].replace(/-/g, '/'))
                                        event_buf[index].end_time_now = Date.parse(event_buf[index].end_time.replace(/-/g, '/'))
                                        if (event_buf[index].current_member == null) {
                                            event_buf[index].current_member = 0;
                                        }
                                        event_buf[index].rootname = event_buf[index].name;
                                        if (event_buf[index].name.length > 10) {
                                            var name = event_buf[index].name
                                            name = name.slice(0, 10) + '...'
                                            event_buf[index].name = name
                                        }
                                        event_buf[index].favor = res.data.favor[index];
                                    }
                                    console.log(event_buf);
                                    that.setData({
                                        events: event_buf.filter(item => (item.owner == "1")),
                                        userInfo: app.globalData.userInfo,
                                        eventType: app.globalData.eventType,
                                        userRole: app.globalData.userRole,
                                        eventState: app.globalData.eventState
                                    });
                                    var currentCity = wx.getStorageSync('currentCity').city;
                                    wx.request({
                                        url: app.globalData.mainURL + 'api/getItemsOnMap',
                                        data: {
                                            latitude: latitude,
                                            longitude: longitude,
                                            user_id: app.globalData.userInfo.user_id,
                                            current_city: currentCity,
                                        },
                                        method: 'POST',
                                        header: {
                                            'content-type': 'application/json'
                                        },
                                        success: function (res) {
                                            if (!res.data.status) return;
                                            var site_buf = res.data.site;
                                            for (var index = 0; index < site_buf.length; index++) {
                                                if (site_buf[index].site_name.length > 12) {
                                                    var name = site_buf[index].site_name
                                                    name = name.slice(0, 12) + '...'
                                                    site_buf[index].site_name = name
                                                }
                                                if (!that.data.sport_type_array._find(item => item == that.data.sport_kind_text[site_buf[index].site_type])) {
                                                    that.data.sport_type_array.push(that.data.sport_kind_text[site_buf[index].site_type]);
                                                }
                                            }
                                            console.log(that.data.sport_type_array);
                                            console.log(res.data.site);

                                            that.setData({
                                                site_array: res.data.site,
                                                sport_type_array: that.data.sport_type_array
                                            });
                                            that.get_filtered_array(that.data.inputtext);
                                        },
                                    });
                                }
                            }
                        })
                    }
                });

            }
        })
    },
    //input view actions
    on_input_text: function (res) {
        this.setData({
            inputtext: res.detail.value
        })
    },

    get_filtered_array: function (search_text) {
        var that = this;
        //get site array
        var filter_site = [];
        console.log(search_text);
        var filter_sitebyName = that.data.site_array.filter(item => (item.site_name + "").includes(search_text));
        var filter_sitebyType = that.data.site_array.filter(item => that.data.sport_kind_text[item.site_type] == search_text);
        filter_site = filter_sitebyName;
        for (let index = 0; index < filter_sitebyType.length; index++) {
            var site = filter_sitebyType[index];
            if (!filter_site._find(item => item.boss_id == site.boss_id)) {
                filter_site.push(site);
            }
        }

        //get event array
        var filter_event = [];
        var filter_eventbyName = that.data.events.filter(item => item.rootname.includes(search_text));
        var filter_eventbyType = that.data.events.filter(item => that.data.sport_kind_text[item.type] == search_text);
        filter_event = filter_eventbyName;
        for (let index = 0; index < filter_eventbyType.length; index++) {
            var event = filter_eventbyType[index];
            if (!filter_event._find(item => item.id == event.id)) {
                filter_event.push(event);
            }
        }

        that.setData({
            filter_site_array: filter_site,
            filter_events: filter_event
        })

    },
    on_click_search: function () {
        var that = this;
        if (that.data.inputtext == "") {
            this.setData({
                filter_site_array: that.data.site_array,
                filter_events: that.data.events
            });
        } else {
            //add input value to the history.
            console.log(that.data.favorinput);
            if (that.data.favorinput.length > 0) {
                if (!that.data.favorinput._find(item => item == that.data.inputtext)) {
                    that.data.favorinput.push(that.data.inputtext);
                    wx.setStorageSync("favorinputtext", that.data.favorinput);
                }
            } else {
                that.data.favorinput.push(that.data.inputtext);
                wx.setStorageSync("favorinputtext", that.data.favorinput);
            }
            //get filter array from 
            that.get_filtered_array(that.data.inputtext);
        }
        this.setData({
            favorinput: that.data.favorinput,
            inputtext: that.data.inputtext,
            show_content_state: 1,
            show_place_state: 1,
            show_activity_state: 0,
            active1: "active",
            active2: ""
        });
    },


    //tab bar action
    selectTab1: function (e) {
        this.setData({
            active1: "active",
            active2: "",
            show_content_state: 1,
            show_place_state: 1,
            show_activity_state: 0,
        });
    },
    selectTab2: function (e) {
        this.setData({
            active1: "",
            active2: "active",
            show_content_state: 1,
            show_place_state: 0,
            show_activity_state: 1,
        });
    },


    //sport type search action
    clicked_sport_type: function (event) {
        var that = this;
        this.setData({
            inputtext: that.data.sport_type_array[event.currentTarget.id]
        });

        if (that.data.favorinput.length > 0) {
            if (!that.data.favorinput._find(item => item == that.data.inputtext)) {
                that.data.favorinput.push(that.data.inputtext);
                wx.setStorageSync("favorinputtext", that.data.favorinput);
            }
        } else {
            that.data.favorinput.push(that.data.inputtext);
            wx.setStorageSync("favorinputtext", that.data.favorinput);
        }
        //get filter array from 
        that.get_filtered_array(that.data.inputtext);

        this.setData({
            favorinput: that.data.favorinput,
            inputtext: that.data.inputtext,
            show_content_state: 1,
            show_place_state: 1,
            show_activity_state: 0,
            active1: "active",
            active2: ""
        });
    },


    //history search action
    on_click_all_delete: function () {
        wx.setStorageSync("favorinputtext", [])
        this.setData({ favorinput: [] })
    },
    on_click_delete: function (event) {
        var that = this;
        console.log(event.currentTarget.id);
        that.data.favorinput.splice(event.currentTarget.id, 1);
        wx.setStorageSync("favorinputtext", that.data.favorinput);

        this.setData({
            favorinput: that.data.favorinput
        });
    },

    on_click_favor_item: function (event) {
        var that = this;
        this.setData({
            inputtext: that.data.favorinput[event.currentTarget.id]
        });
        that.get_filtered_array(that.data.inputtext);
        this.setData({
            favorinput: that.data.favorinput,
            inputtext: that.data.inputtext,
            show_content_state: 1,
            show_place_state: 1,
            show_activity_state: 0,
            active1: "active",
            active2: ""
        });

    },

    //go to place
    click_detail_place: function (event) {
        wx.navigateTo({
            url: '../detail_gym/detail_gym?id=' + event.currentTarget.id + '&no=' + event.currentTarget.dataset.no,
        })
    },

    //go to action
    click_detail_event: function (event) {
        wx.navigateTo({
            url: '../detail_event/detail_event?id=' + event.currentTarget.id
        })
    }

})




//filter and find array
Array.prototype.filter = function (fun /* , thisArg*/) {
    "use strict";

    if (this === void 0 || this === null)
        throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
        throw new TypeError();

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
        if (i in t) {
            var val = t[i];

            // NOTE: Technically this should Object.defineProperty at
            //       the next index, as push can be affected by
            //       properties on Object.prototype and Array.prototype.
            //       But that method's new, and collisions should be
            //       rare, so use the more-compatible alternative.
            if (fun.call(thisArg, val, i, t))
                res.push(val);
        }
    }

    return res;
};
Array.prototype._find = function (fn) {
    if (this === null) throw new TypeError('this is null or not defined');

    let that = Object(this),
        len = that.length >>> 0;

    if (typeof fn !== 'function') throw new TypeError('fn is not function');

    for (let i = 0; i < len; i++) {
        if (fn(that[i])) return that[i];
    }
    return undefined;
}

Array.prototype._filter = function (fn) {
    if (this === null) throw new TypeError('this is null or not defined');

    let that = Object(this);

    if (typeof fn !== 'function') throw new TypeError('fn is not function');

    let new_arr = [];

    for (let i = 0; i < that.length >>> 0; i++) {
        fn(that[i]) && new_arr.push(that[i]);
    }

    return new_arr;
}
const app = getApp()
var amapFile = require('../../lib/amap-wx.js')
require('../../utils/global.js')

var myAmap = new amapFile.AMapWX({ key: "8eb63e36d0b6d7d29a392503a4a80f6c" })
var mapCtx;
Page({
    data: {
        rooturl: "../../",
        uploadUrl: app.globalData.uploadURL,
        event_type: app.globalData.eventType,
        view_type: 0,
        isAuthorized: true,
        select_kind: 0,
        select_able_type: "../../image/mapview_icon.png",
        current_latitude: 0,
        current_longitude: 0,
        filter_places: [],
        circles: [],
        pageID: '11',

        // template_table variables    
        favorite_pictures: [
            "../../image/favoriting.png",
            "../../image/favorited.png"
        ],
        starparam: {
            stars: [0, 1, 2, 3, 4],
            srcImage_0: "../../image/star-0.png",
            srcImage_1: "../../image/star-1.png",
            srcImage_2: "../../image/star-2.png",
            srcImage_3: "../../image/star-3.png",
            srcImage_4: "../../image/star-4.png",
            score: 4.3,
            srcImage: ""
        },
        select_menu_state: 0,
        select_order_menu_state: 0,
        select_filter_menu_state: 0,
        select_style_menu_state: 0,
        color_array: [
            "#000000",
            "#e6b53c"
        ],
        menu_btn_array: [
            "../../image/btn_updown@2x.png",
            "../../image/btn_updown_hover@2x.png"
        ],
        menu_order_index: 2,
        menu_filter_index: 0,
        menu_style_index: 34,
        prev_menu_style_index: 0,
        menu_order_array: [
            "离我最近",
            "评分最高",
            "智能排序",
        ],
        menu_filter_array: [{
                areaId: "000000",
                areaName: "全部"
            },
            {
                areaId: "000000",
                areaName: "附近3km"
            },
            {
                areaId: "000000",
                areaName: "附近5km"
            }
        ],
        item_array: [
            { id: 0, src: app.globalData.uploadURL + "global/move00@2x.png" },
            { id: 1, src: app.globalData.uploadURL + "global/move01@2x.png" },
            { id: 2, src: app.globalData.uploadURL + "global/move02@2x.png" },
            { id: 3, src: app.globalData.uploadURL + "global/move03@2x.png" },
            { id: 4, src: app.globalData.uploadURL + "global/move04@2x.png" },
            { id: 5, src: app.globalData.uploadURL + "global/move05@2x.png" },
            { id: 6, src: app.globalData.uploadURL + "global/move06@2x.png" },
            { id: 7, src: app.globalData.uploadURL + "global/move07@2x.png" },
            { id: 8, src: app.globalData.uploadURL + "global/move08@2x.png" },
            { id: 9, src: app.globalData.uploadURL + "global/move09@2x.png" },
            { id: 10, src: app.globalData.uploadURL + "global/move10@2x.png" },
            { id: 11, src: app.globalData.uploadURL + "global/move11@2x.png" },
            { id: 12, src: app.globalData.uploadURL + "global/move12@2x.png" },
            { id: 13, src: app.globalData.uploadURL + "global/move13@2x.png" },
            { id: 14, src: app.globalData.uploadURL + "global/move14@2x.png" },
            { id: 15, src: app.globalData.uploadURL + "global/move15@2x.png" },
            { id: 16, src: app.globalData.uploadURL + "global/move16@2x.png" },
            { id: 17, src: app.globalData.uploadURL + "global/move17@2x.png" },
            { id: 18, src: app.globalData.uploadURL + "global/move18@2x.png" },
            { id: 19, src: app.globalData.uploadURL + "global/move19@2x.png" },
            { id: 20, src: app.globalData.uploadURL + "global/move20@2x.png" },
            { id: 21, src: app.globalData.uploadURL + "global/move21@2x.png" },
            { id: 22, src: app.globalData.uploadURL + "global/move22@2x.png" },
            { id: 23, src: app.globalData.uploadURL + "global/move23@2x.png" },
            { id: 24, src: app.globalData.uploadURL + "global/move24@2x.png" },
            { id: 25, src: app.globalData.uploadURL + "global/move25@2x.png" },
            { id: 26, src: app.globalData.uploadURL + "global/move26@2x.png" },
            { id: 27, src: app.globalData.uploadURL + "global/move27@2x.png" },
            { id: 28, src: app.globalData.uploadURL + "global/move28@2x.png" },
            { id: 29, src: app.globalData.uploadURL + "global/move29@2x.png" },
            { id: 30, src: app.globalData.uploadURL + "global/move30@2x.png" },
            { id: 31, src: app.globalData.uploadURL + "global/move31@2x.png" },
            { id: 32, src: app.globalData.uploadURL + "global/move32@2x.png" },
            { id: 33, src: app.globalData.uploadURL + "global/move33@2x.png" }
        ],
        show_array: [
            { id: 0, src: app.globalData.uploadURL + "global/move00@2x.png" },
            { id: 1, src: app.globalData.uploadURL + "global/move01@2x.png" },
            { id: 2, src: app.globalData.uploadURL + "global/move02@2x.png" },
            { id: 3, src: app.globalData.uploadURL + "global/move03@2x.png" },
            { id: 4, src: app.globalData.uploadURL + "global/move04@2x.png" },
            { id: 5, src: app.globalData.uploadURL + "global/move05@2x.png" },
            { id: 6, src: app.globalData.uploadURL + "global/move06@2x.png" },
            { id: 7, src: app.globalData.uploadURL + "global/move07@2x.png" },
            { id: 8, src: app.globalData.uploadURL + "global/move08@2x.png" }
        ],
        uppoint: 0,
        downpoint: 8,
        currentkind: app.globalData.uploadURL + "global/move00@2x.png",
        marker: [],
        site_array: [],
        newscount: 0,
        events: [],
        currentid: 0,
        currentCityName: '',
        num: 0,
        flag: 100,
        file_paths: [],
        _tmr: 0,
        isFirstInit: true,
    },
    onLoad: function(option) {
        if (option.closeFlag == 'true') {
            wx.navigateBack({ delta: 1 });
            return;
        }
        mapCtx = wx.createMapContext('mymap')
    },
    getUserModalHide: function() {
        this.setData({
            getUserInfoDisabled: false
        })
        this.data.isFirstInit = false;
        this.onShow();
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
        if (app.globalData.userInfo.user_id == 0)
            app.onInitialize(function() {
                that.onInitStart(option);
            })
        else
            that.onInitStart(option);
    },
    onInitStart: function() {
        //get system templates.
        var that = this;

        wx.showTabBar({})
        that.data.show_array = [
            { id: 0, src: app.globalData.uploadURL + "global/move00@2x.png" },
            { id: 1, src: app.globalData.uploadURL + "global/move01@2x.png" },
            { id: 2, src: app.globalData.uploadURL + "global/move02@2x.png" },
            { id: 3, src: app.globalData.uploadURL + "global/move03@2x.png" },
            { id: 4, src: app.globalData.uploadURL + "global/move04@2x.png" },
            { id: 5, src: app.globalData.uploadURL + "global/move05@2x.png" },
            { id: 6, src: app.globalData.uploadURL + "global/move06@2x.png" },
            { id: 7, src: app.globalData.uploadURL + "global/move07@2x.png" },
            { id: 8, src: app.globalData.uploadURL + "global/move08@2x.png" }
        ]
        that.data.select_kind = 0
        that.data.uppoint = 0
        that.data.downpoint = 8
        that.data.currentkind = app.globalData.uploadURL + "global/move00@2x.png"
        that.data.marker = []
        that.data.circles = []
        that.data.newscount = 0
        that.data.events = []
        that.data.currentid = 0;

        this.setData({
            getUserInfoDisabled: app.globalData.getUserInfoDisabled,
            show_array: that.data.show_array,
            currentkind: that.data.currentkind,
            currentid: 0,
            select_kind: that.data.select_kind,
            rooturl: that.data.rooturl
        });

        this.data.num = 0
        if (app.globalData.userInfo.forbidden == 1) {
            wx.showModal({
                title: '您的账号已被禁用',
                showCancel: false,
                complete: function() {
                    wx.navigateBackMiniProgram({})

                }
            })
        }
        wx.setNavigationBarTitle({
            title: '蜂去吧'
        })
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#e6b53c'
        })

        that.setData({
            isAuthorized: (app.globalData.userInfo.state != 0)
        })
        wx.request({
            url: app.globalData.mainURL + 'api/getNewAlarm',
            data: {
                user_id: app.globalData.userInfo.user_id
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                if (!res.data.status) return;
                if (res.data.news.length > 0)
                    that.setData({ newscount: res.data.news[0].amount * 1 })
                else
                    that.setData({ newscount: 0 })
            },
        })
        clearInterval(that.data._tmr);
        // that.data._tmr = setInterval(function() {
        // if (wx.getStorageSync('currentCity') == "")
        that.updateLocation();
        // }, 5000);

    },
    updateLocation: function() {
        var that = this;
        wx.getLocation({
            type: 'gcj02',
            success: function(res) {
                var cityData = wx.getStorageSync('currentCity');
                var isCityInitialized = true;
                if (cityData == '') {
                    cityData = {
                        current_latitude: res.latitude + '',
                        current_longitude: res.longitude + ''
                    };
                    isCityInitialized = false;
                }
                cityData.user_latitude = res.latitude + '';
                cityData.user_longitude = res.longitude + '';
                // if (app.globalData.issearch == 0) {
                //     that.data.current_latitude = res.latitude
                //     that.data.current_longitude = res.longitude
                // } else {
                //     that.data.current_latitude = app.globalData.searchlat
                //     that.data.current_longitude = app.globalData.searchlong
                //     app.globalData.issearch = 0
                // }
                app.globalData.searchlat = res.latitude + '';
                app.globalData.searchlong = res.longitude + '';

                var url = 'https://restapi.amap.com/v3/geocode/regeo?key=8eb63e36d0b6d7d29a392503a4a80f6c&location=' + res.longitude + ',' + res.latitude + '&poitype=&radius=&extensions=all&batch=false&roadlevel=0';

                //get activity array
                wx.request({
                    url: url,
                    success: function(res) {
                        //console.log('got location');
                        //console.log(res.data);
                        //console.log(res.data.regeocode.addressComponent);
                        // var province_name = res.data.regeocode.addressComponent.province
                        app.globalData.userCityName = res.data.regeocode.addressComponent.city;
                        app.globalData.userProvinceName = res.data.regeocode.addressComponent.province;
                        if (!isCityInitialized) {
                            cityData.city = app.globalData.userCityName;
                            cityData.province = app.globalData.userProvinceName;
                            app.globalData.currentCityName = cityData.city;
                        }
                        cityData.user_cityName = app.globalData.userCityName;
                        wx.setStorageSync('currentCity', cityData);
                        // var area_name = res.data.regeocode.addressComponent.district
                    },
                    complete: function(res) {
                        // wx.showModal({ content: app.globalData.currentCityName });

                        // var cityShow = app.globalData.userCityName;
                        // if (cityShow.length > 4) cityShow = cityShow.substr(1, 3) + '...';
                        that.data.circles[0] = {
                            latitude: parseFloat(cityData.user_latitude),
                            longitude: parseFloat(cityData.user_longitude),
                            color: "#e6b53c",
                            fillColor: "#e6b53c20",
                            radius: wx.getStorageSync('user_step') / 2,
                            // radius: 500 / 2,
                            strokeWidth: 1
                        };
                        // that.setData({
                        //     currentCityName: cityShow,
                        //     current_latitude: cityData.current_latitude,
                        //     current_longitude: cityData.current_longitude,
                        //     circles: that.data.circles
                        // })

                        var cityShow = cityData.city;
                        if (cityShow.length > 4) cityShow = cityShow.substr(1, 3) + '...';

                        wx.request({
                            url: app.globalData.mainURL + 'api/getItemsOnMap',
                            data: {
                                latitude: cityData.current_latitude,
                                longitude: cityData.current_longitude,
                                user_id: app.globalData.userInfo.user_id,
                                current_city: cityData.city
                            },
                            method: 'POST',
                            header: {
                                'content-type': 'application/json'
                            },
                            success: function(res) {
                                if (!res.data.status) return;
                                wx.getSystemInfo({
                                    success: function(res2) {
                                        var brandx = 0
                                        var brandy = 0
                                        if (res2.brand == 'iPhone') {
                                            brandx = -50
                                            brandy = 20
                                        }
                                        var iter
                                        for (iter = 0; iter < res.data.honey.length; iter++) {
                                            var str = res.data.honey[iter].amount + "ml"
                                            var id = "h" + res.data.honey[iter].no
                                            that.data.marker[iter] = {
                                                iconPath: "../../image/honey.png",
                                                id: id,
                                                boss_id: res.data.honey[iter].boss_id,
                                                favor_state: res.data.honey[iter].favor_state,
                                                latitude: 1 * (res.data.honey[iter].latitude),
                                                longitude: 1 * (res.data.honey[iter].longitude),
                                                width: (68 / 750) * res2.screenWidth,
                                                height: (40 / 1344) * res2.screenHeight,
                                                anchor: { x: 0, y: 1 },
                                                kind: "honey",
                                                label: {
                                                    content: str,
                                                    color: "#000000",
                                                    fontSize: (20 / 750) * res2.screenWidth,
                                                    bgColor: "#e6b53c",
                                                    padding: (3 / 750) * res2.screenWidth,
                                                    borderWidth: (1 / 750) * res2.screenWidth,
                                                    borderColor: "#000000",
                                                    borderRadius: (3 / 750) * res2.screenWidth,
                                                    x: ((70 + brandx) / 750) * res2.screenWidth,
                                                    y: ((-38 + brandy) / 1344) * res2.screenHeight
                                                }
                                            }
                                        }
                                        if (iter == res.data.honey.length) {
                                            wx.getSavedFileList({
                                                success: function(res) {
                                                    if (res.fileList.length > 0) {
                                                        wx.removeSavedFile({
                                                            filePath: res.fileList[0].filePath,
                                                            complete: function(res) {
                                                                // console.log(res)
                                                            }
                                                        })
                                                    }
                                                }
                                            })
                                            var sites = res.data.site;
                                            that.data.site_array = [];
                                            iter = 0;
                                            var menu_filter_array = [{
                                                areaId: res.city_id,
                                                areaName: "" + cityShow
                                            }];
                                            if (cityData.city == cityData.user_cityName) {
                                                menu_filter_array.push({
                                                    areaId: "000000",
                                                    areaName: "附近3km"
                                                });
                                                menu_filter_array.push({
                                                    areaId: "000000",
                                                    areaName: "附近5km"
                                                });
                                            }
                                            that.data.current_city_id = res.city_id;
                                            that.data.menu_filter_array = menu_filter_array;
                                            for (var i = 0; i < sites.length; i++) {
                                                if (sites[i].site_name.length > 16) {
                                                    var name = sites[i].site_name;
                                                    name = name.slice(0, 16) + '...'
                                                    sites[i].site_name = name
                                                }
                                                if (parseFloat(sites[i].point) == 0.0)
                                                    sites[i].point = "5.0";
                                                if (sites[i].picture.length == 0)
                                                    sites[i].picture = app.globalData.default_stadium_img;
                                                that.data.site_array.push(sites[i])
                                                that.data.marker.push({
                                                    iconPath: "../../image/" + (1 * sites[i].site_type + 1) + ".png",
                                                    id: "o" + sites[i].boss_id,
                                                    latitude: 1 * sites[i].latitude,
                                                    longitude: 1 * sites[i].longitude,
                                                    width: .092 * res2.screenWidth,
                                                    height: 73 / 1344 * res2.screenHeight,
                                                    kind: "site"
                                                });
                                                // console.log("-----" + that.data.menu_filter_array._find(item => item.areaId == sites[i].areaId));
                                                if (!that.data.menu_filter_array._find(item => item.areaId == sites[i].areaId)) {
                                                    that.data.menu_filter_array.push({
                                                        areaId: sites[i].areaId,
                                                        areaName: sites[i].areaName
                                                    });
                                                }
                                            }
                                            that.setData({
                                                currentCityName: cityShow,
                                                current_latitude: cityData.current_latitude,
                                                current_longitude: cityData.current_longitude,
                                                circles: that.data.circles,
                                                menu_filter_array: that.data.menu_filter_array,
                                            });
                                            that.all_filter_item();
                                            that.show_marker();
                                            console.log(that.data.filter_places);
                                        }
                                    },
                                })
                            },
                            complete: function() {
                                wx.hideLoading({});
                            },
                        })

                    }
                });
            },
        });
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        var that = this;
        // console.log('hidden.......')
        clearInterval(that.data._tmr);
    },
    sleep: function(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }

    },
    download_honey: function(res, res2, iter, brandx, brandy) {
        setTimeout(function() {
            // console.log(iter)
        }, 1000)

    },
    download_icon: function(map_icon, index, sites) {
        var iter = index
        var that = this
        wx.getSystemInfo({
            success: function(res2) {
                wx.downloadFile({
                    url: app.globalData.uploadURL + map_icon,
                    success: function(res1) {
                        var temppath = res1.tempFilePath
                        wx.saveFile({
                            tempFilePath: temppath,
                            success: function(res) {
                                that.data.marker.push({
                                    iconPath: res.savedFilePath,
                                    id: 'o' + sites[iter].boss_id,
                                    latitude: 1 * sites[iter].latitude,
                                    longitude: 1 * sites[iter].longitude,
                                    width: (69 / 750) * res2.screenWidth,
                                    height: (73 / 1344) * res2.screenHeight,
                                    kind: "site",
                                })

                                if (app.globalData.map_idx == sites.length - 1) {
                                    that.show_marker()
                                }
                                app.globalData.map_idx++
                            }
                        })
                    }
                })
            }
        })
    },
    show_marker: function(kind = 0, first = 1) {

        var tempmarker = new Array()
        if (kind == 0) {
            this.setData({ markers: this.data.marker })
        } else {
            for (var iter = 0; iter < this.data.marker.length; iter++) {
                if (this.data.marker[iter].kind == "honey") {
                    tempmarker.push(this.data.marker[iter])
                } else if (this.data.marker[iter].kind == "site") {
                    if (kind == 0) {
                        tempmarker.push(this.data.marker[iter]);
                        continue
                    }
                    var split_array = this.data.marker[iter].iconPath.split("/");
                    var index = split_array[split_array.length - 1].split(".")[0];
                    if (kind == index) {
                        tempmarker.push(this.data.marker[iter]);
                        continue;
                    }
                    // for (var jter = 0; jter < this.data.events.length; jter++) {
                    //   if (kind != 0 && this.data.events[jter].type * 1 == kind - 1 && 'o' + this.data.events[jter].no == this.data.marker[iter].id && this.data.events[jter].state == 0) {
                    //     tempmarker.push(this.data.marker[iter])
                    //     break;
                    //   }
                    // }
                }
            }
            // console.log(tempmarker)
            this.setData({ markers: tempmarker })
        }
    },
    //marker function
    on_Click_maker: function(event) {

        var that = this;
        if (event.markerId[0] == "h") {
            var markernumber = event.markerId.slice(1, event.markerId.length)

            var vip = app.globalData.userInfo.isVIP + 1
            for (var iter = 0; iter < this.data.marker.length; iter++) {
                if (this.data.marker[iter].id == event.markerId) {
                    break;
                }
            }
            var origin = [this.data.marker[iter]] //selected honey      

            if (origin[0].boss_id != null) {
                if (origin[0].favor_state == '0') {
                    // console.log('show modal');
                    //show modal and go to gym to set favourite.
                    wx.showModal({
                        title: '提示',
                        content: '关注商家才能采集\n该商家产生的蜂蜜哦!',
                        confirmText: '去关注',
                        cancelText: '算了',
                        success: function(res) {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: 'detail_gym/detail_gym?id=' + origin[0].boss_id,
                                })
                            }
                        }
                    })
                    return;
                }
            }
        }
        var a = event;

        if ("h" == a.markerId[0]) {
            for (var t = e.globalData.userInfo.isVIP + 1, i = 0; i < this.data.marker.length && this.data.marker[i].id != a.markerId; i++);



            var n = [this.data.marker[i]],
                o = n[0].label.content;
            o = 1 * o.slice(0, o.length - 2);
            var r = this.distance(n[0].latitude, n[0].longitude, this.data.current_latitude, this.data.current_longitude),
                s = 0,
                d = 0;
            "" == e.globalData.user_step && (e.globalData.user_step = 0);
            var l = e.globalData.user_step / 2 * t;
            // console.log("------markersin =  ------" + l);
            if ("" == e.globalData.daily_honey && (e.globalData.daily_honey = [0, 0]), !(r < l)) return void wx.showToast({
                title: "距离不够，请到商家附近采蜜",
                icon: "none",
                duration: 2e3
            });
            var c = 1 + Math.ceil(Math.random() * (1 * e.globalData.rule[5].value - e.globalData.daily_honey[0]) - 1),
                g = Math.ceil(parseInt(o) * (.1 + .4 * Math.random()));
            if (g < c && (c = g), c < 3 ? (s = 1, d = o) : (o -= c, d = c), e.globalData.daily_honey[0] >= e.globalData.rule[5].value) return void wx.showToast({
                title: "您今天已经收获了" + e.globalData.rule[5].value + "ml蜂蜜，明天再来哦",
                icon: "none",
                duration: 1e3
            });
            if (0 == e.globalData.isactivetime) return void wx.showToast({
                title: "从早上7点开始可以收集蜂蜜",
                icon: "none",
                duration: 2e3
            });
            var u = e.globalData.todayselected;
            "" == u && (u = []);
            for (i = 0; i < u.length; i++)
                if (u[i] == a.markerId) return void wx.showToast({
                    title: "您已经采集过了",
                    icon: "none",
                    duration: 2e3
                });
            var h = e.globalData.honey_info;
            e.globalData.daily_honey[0] += d, h.total_honey = 1 * h.total_honey + d;
            var m = h.total_honey;
            e.globalData.honey_info = h, u.push(a.markerId), e.globalData.todayselected = u;
            v = a.markerId.slice(1, a.markerId.length);
            e.globalData.honey_info = h;
            //  console.log(d);
            var p = "成功收取" + d + "ml蜂蜜";
            wx.showToast({
                title: p,
                duration: 2e3,
                icon: "none"
            }), wx.request({
                url: e.globalData.mainURL + "api/catchHoney",
                method: "POST",
                header: {
                    "content-type": "application/json"
                },
                data: {
                    amount: m,
                    no: v,
                    user_id: e.globalData.userInfo.user_id,
                    honey: d,
                    daily_honey: JSON.stringify(e.globalData.daily_honey)
                },
                success: function(a) {}
            }), 0 == s && (n[0].label.content = o + "ml", this.data.marker.push(n[0])), this.setData({
                markers: this.data.marker
            });
        } else if ("o" == a.markerId[0]) {
            var v = a.markerId.slice(1, a.markerId.length);
            wx.navigateTo({
                url: "detail_gym/detail_gym?id=" + v
            });
        }
    },
    distance: function(lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295;
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p)) / 2
        return 12742000 * Math.asin(Math.sqrt(a)) // 2 * R; R = 6371 km
    },
    //sidebar functions
    on_click_down: function(event) {
        if (this.data.downpoint < 33) {
            this.data.show_array.shift()
            this.data.downpoint++;
            this.data.uppoint++
                this.data.show_array.push(this.data.item_array[this.data.downpoint])
            this.setData({ show_array: this.data.show_array })
        }
    },
    on_click_up: function(event) {
        if (this.data.uppoint > 0) {
            this.data.show_array.pop()
            this.data.downpoint--;
            this.data.uppoint--
                this.data.show_array.unshift(this.data.item_array[this.data.uppoint])
            this.setData({ show_array: this.data.show_array })
        }
    },
    on_selectkind: function(event) {
        this.setData({
            currentkind: this.data.item_array[event.currentTarget.id].src,
            select_kind: 0,
            currentid: event.currentTarget.id * 1
        })
        this.show_marker(event.currentTarget.id * 1, 0)
    },

    on_click_select_menu: function() {
        this.setData({ select_kind: 1 })
    },

    on_click_global_city: function() {
        var that = this;
        wx.navigateTo({
            url: 'cities/cities',
        })
    },

    go_claim: function() {
        var that = this;
        wx.navigateTo({
            url: '../profile/auth/auth?id=0',
        })
    },

    //searchbox function
    on_click_search: function() {
        wx.navigateTo({
            url: 'search/search',
        })
    },

    on_click_viewstyle: function() {
        var that = this;
        if (that.data.view_type == 0) {
            that.setData({
                view_type: 1,
                select_able_type: "../../image/tableview_icon.png",
            });
        } else {
            that.setData({
                view_type: 0,
                select_able_type: "../../image/mapview_icon.png",
            });
            this.all_filter_item();
        }
    },
    // on_click_create_event: function() {
    //     wx.request({
    //         url: app.globalData.mainURL + 'api/getUserState',
    //         method: 'post',
    //         data: {
    //             'nickname': app.globalData.userInfo.nickname
    //         },
    //         success: function(res) {
    //             app.globalData.userInfo.state = res.data.result[0].state
    //             if (app.globalData.userInfo.state == 0) {
    //                 wx.showModal({
    //                     title: '提示',
    //                     content: '请先进行身份认证',
    //                     success: function(res) {
    //                         if (res.confirm) {
    //                             wx.navigateTo({
    //                                 url: '../profile/auth/auth',
    //                             })
    //                         } else if (res.cancel) {}
    //                     }
    //                 })
    //                 return;
    //             }
    //             if (app.globalData.userInfo.state == 3) {
    //                 wx.showModal({
    //                     title: '提示',
    //                     content: '您的身份认证审核未通过，请重新提交',
    //                     success: function(res) {
    //                         if (res.confirm) {
    //                             wx.navigateTo({
    //                                 url: '../profile/auth/auth',
    //                             })
    //                         } else if (res.cancel) {}
    //                     }
    //                 })
    //                 return;
    //             }
    //             if (app.globalData.userInfo.state == 1) {
    //                 wx.showModal({
    //                     title: '提示',
    //                     content: '您的认证资料已提交，请等待审核通过',
    //                     showCancel: false,
    //                 })
    //                 return;
    //             }
    //             wx.navigateTo({
    //                 url: '../other/create_event/create_event',
    //             })
    //         }
    //     })

    // },
    on_click_news: function() {
        wx.navigateTo({
            url: 'news/news'
        })
    },
    preventTouchMove: function() {
        // console.log("Ok")
    },

    // template_table functions
    click_detail_place: function(event) {
        wx.navigateTo({
            url: 'detail_gym/detail_gym?id=' + event.currentTarget.id + '&no=' + event.currentTarget.dataset.no,
        })
    },
    click_set_status: function(event) {
        var that = this;
        var boss_id = event.currentTarget.id;
        var boss_no = event.currentTarget.dataset.no;
        var item = that.data.site_array._find(item => item.boss_no == boss_no);
        var index = that.data.site_array.indexOf(item);

        wx.showLoading({
            title: '处理中',
        })

        wx.request({
            url: app.globalData.mainURL + 'api/cancelFavouriteSite',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'user_id': app.globalData.userInfo.user_id,
                'boss_id': 0, //boss_id,
                'boss_no': boss_no
            },
            success: function(res) {

                if (that.data.site_array[index].isfavourite == 0) {
                    that.data.site_array[index].isfavourite = 1;
                    that.data.site_array[index].favourite_count++;
                } else {
                    that.data.site_array[index].isfavourite = 0;
                    that.data.site_array[index].favourite_count--;
                }
                that.setData({
                    site_array: that.data.site_array
                })
                that.all_filter_item();
            },
            complete: function() {
                wx.hideLoading({});
            }
        })
    },

    on_click_ordermenu: function() {
        var that = this;
        this.setData({
            select_menu_state: (that.data.select_order_menu_state + 1) % 2,
            select_order_menu_state: (that.data.select_order_menu_state + 1) % 2,
            select_filter_menu_state: 0,
            select_style_menu_state: 0,
        })

    },
    on_click_filtermenu: function() {
        var that = this;
        this.setData({
            select_menu_state: (that.data.select_filter_menu_state + 1) % 2,
            select_order_menu_state: 0,
            select_filter_menu_state: (that.data.select_filter_menu_state + 1) % 2,
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
            select_filter_menu_state: 0,
            select_style_menu_state: (that.data.select_style_menu_state + 1) % 2,
        })
    },

    compare_distance: function(a, b) {
        if (a.distance * 1 < b.distance * 1)
            return -1;
        if (a.distance * 1 > b.distance * 1)
            return 1;
        return 0;
    },
    compare_score: function(a, b) {
        if (a.point * 1 > b.point * 1)
            return -1;
        if (a.point * 1 < b.point * 1)
            return 1;
        return 0;
    },
    compare_favorite: function(a, b) {
        if (a.isfavourite > b.isfavourite)
            return -1;
        if (a.isfavourite < b.isfavourite)
            return 1;
        return 0;
    },


    //filter functions
    all_filter_item: function() {
        var that = this;
        var order_index = that.data.menu_order_index;
        var filter_index = that.data.menu_filter_index;
        var style_index = that.data.menu_style_index;
        var cityData = wx.getStorageSync('currentCity');
        //get filter array
        var filter_array = [];
        if (filter_index == 0) {
            // search by nearest 3km from me 
            filter_array = that.data.site_array.filter(item => item.cityId == that.data.current_city_id);
        } else if (filter_index == 1 && cityData.city == cityData.user_cityName) {
            // search by nearest 5km from me 
            filter_array = that.data.site_array.filter(item => 1.0 * item.distance < 3.0);
        } else if (filter_index == 2 && cityData.city == cityData.user_cityName) {
            // search by nearest 5km from me 
            filter_array = that.data.site_array.filter(item => 1.0 * item.distance < 5.0);
        } else {
            // search specific areas
            filter_array = that.data.site_array.filter(item => item.areaId == that.data.menu_filter_array[filter_index].areaId);
        }

        //get style arrays
        var style_array = [];
        if (style_index >= 33) {
            style_array = filter_array;
        } else {
            style_array = filter_array.filter(item => item.site_type == style_index);
        }

        that.data.filter_places = [];
        // that.setData({
        //     filter_places: []
        // })

        //get order arrays
        if (order_index == 0) {
            // search by nearest from me
            that.setData({
                filter_places: style_array.sort(that.compare_distance)
            });
        } else if (order_index == 1) {
            //search by highest score 
            that.setData({
                filter_places: style_array.sort(that.compare_score)
            });

        } else {
            //sorted by distance
            var sort_distance_array = style_array.sort(that.compare_distance);
            //已关注 first, 未关注 second
            that.setData({
                filter_places: sort_distance_array.sort(that.compare_favorite)
            });
        }
    },
    clicked_order_item: function(event) {
        var that = this;
        this.setData({
            select_menu_state: 0,
            select_order_menu_state: 0,
            select_filter_menu_state: 0,
            select_style_menu_state: 0,
            menu_order_index: event.currentTarget.id
        });
        that.all_filter_item();
    },
    clicked_filter_item: function(event) {
        var that = this;
        that.setData({
            select_menu_state: 0,
            select_order_menu_state: 0,
            select_filter_menu_state: 0,
            select_style_menu_state: 0,
            menu_filter_index: event.currentTarget.id
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
            select_filter_menu_state: 0,
            select_style_menu_state: 0,
        })
    },
    ok_btn_clicked: function() {
        this.setData({
            select_menu_state: 0,
            select_order_menu_state: 0,
            select_filter_menu_state: 0,
            select_style_menu_state: 0,
        });
        this.all_filter_item();
    },
    getUserinfo: function(a) {
        // console.log(a);
        app.globalData.userInfo.nickname = app.detail.userInfo.nickName,
            app.globalData.userInfo.avatar = a.detail.userInfo.avatarUrl;
    },
    onShareAppMessage: function(res) {
        console.log("SHARED")
        if (res.from === 'button') {
            // console.log(res.target)
        }
        var that = this;

        var title = "看看你的周围有哪些运动商家，一起来玩吧"

        return {
            title: title,
            path: '/pages/index/index',
            success: function(res) {},
            fail: function(res) {}
        }
    }
})

//filter and find array
Array.prototype.filter = function(fun /* , thisArg*/ ) {
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
Array.prototype._find = function(fn) {
    if (this === null) throw new TypeError('this is null or not defined');

    let that = Object(this),
        len = that.length >>> 0;

    if (typeof fn !== 'function') throw new TypeError('fn is not function');

    for (let i = 0; i < len; i++) {
        if (fn(that[i])) return that[i];
    }
    return undefined;
}

Array.prototype._filter = function(fn) {
    if (this === null) throw new TypeError('this is null or not defined');

    let that = Object(this);

    if (typeof fn !== 'function') throw new TypeError('fn is not function');

    let new_arr = [];

    for (let i = 0; i < that.length >>> 0; i++) {
        fn(that[i]) && new_arr.push(that[i]);
    }

    return new_arr;
}
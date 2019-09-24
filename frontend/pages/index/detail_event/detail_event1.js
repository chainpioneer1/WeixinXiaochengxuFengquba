//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        event: {
            start_time: '',
            end_time: '',
            province: '',
            area: '',
            city: '',
            detail_address: '',
            pic: ''
        },
        pictures: [],
        id: '',
        booking: [],
        pay_type_array: ["线下支付", "线上支付", "线上支付/线下支付"],
        eventType: [],
        userRole: [],
        eventState: [],
        feedbacks: [],
        is_full: false,
        is_registered: false,
        register_amount: 0,
        rating: 0,
        rating_amount: 0,
        color_array: ["#e6b53c", "red"],
        fav_img_list: ['../../../image/good_n@2x.png', '../../../image/good_s@2x.png'],
        img_black_start_src: '../../../image/star_n@2x.png',
        img_yellow_start_src: '../../../image/star_s@2x.png',
        comment: '',
        tmr_id: 0,
        tmrID: 0,
        options: [],
        isFirstInit: true,
    },
    onLoad: function(option) {
        var that = this;
        that.data.options = option;
    },
    onShow: function() {
        var that = this;
        var option = that.data.options;
        if (app.globalData.userInfo.user_id == 0) {
            if (!that.data.isFirstInit) app.onLaunch();
            clearTimeout(that.data.tmrID)
            that.data.tmrID = setTimeout(function() {
                that.data.isFirstInit = false;
                if (!app.globalData.initDisabled)
                    that.onShow();
            }, 4000);
        } else {
            that.onInitStart(option);
        }
    },
    onInitStart: function(option) {
        wx.showLoading({
            title: '加载中',
        })
        this.setData({
            userInfo: app.globalData.userInfo,
            eventType: app.globalData.eventType,
            userRole: app.globalData.userRole,
            eventState: app.globalData.eventState
        });
        var that = this;
        that.setData({
            id: option.id
        });
        that.refresh();
    },
    refresh: function() {
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

                that.setData({
                    rating: 1 * res.data.favor[0],
                })

                //get event detail
                var event_buf = res.data.result[0];
                event_buf.favor_state = 1 * event_buf.favor_state
                    // if (event_buf.eventName.length > 15) {
                    //     var name = event_buf.eventName
                    //     name = name.slice(0, 15) + '...'
                    //     event_buf.eventName = name
                    // }
                if ((event_buf.role != '2') && (event_buf.site_name.length > 15)) {
                    var site_name = event_buf.site_name
                    site_name = site_name.slice(0, 15) + '...'
                    event_buf.site_name = site_name
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
                if (tempdate - Date.now() < 21600000) {
                    if (event_buf.role == '1') {
                        event_buf.isbtn = 0;
                    } else {
                        if (tempdate < Date.now()) {
                            event_buf.isbtn = 0;
                        } else {
                            event_buf.isbtn = 1
                        }
                    }
                }

                wx.setNavigationBarTitle({
                    title: app.globalData.eventType[event_buf.type] + '活动'
                })
                that.setData({
                    event: event_buf,
                    id: that.data.id,
                    pictures: images,
                });


                //get booking
                var books = res.data.booking;
                var registered_num = 0;
                that.setData({ favourite_num: 1 * res.data.result[0].favor_state })
                for (var index = 0; index < books.length; index++) {
                    if (1 * books[index].state == 2) {
                        books.splice(index, 1)
                        index--;
                    } else {
                        registered_num += 1 * books[index].reg_num;
                    }
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

                //get feedbacks

                console.log(that.data.event);
                console.log(that.data.booking);
            },
            complete: function() {
                wx.hideLoading({});
            }
        })
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/getRatingByEvent',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'event_id': that.data.id
            },
            success: function(res) {
                console.log(res);
                if (res.data.status) {
                    that.setData({
                        feedbacks: res.data.result,
                    })
                    console.log(that.data.feedbacks);
                }
            }
        })
    },

    phone_call: function(event) {
        app.phoneCall(event.currentTarget.dataset.id);
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
    onclick_viewUserInfo: function(event) {
        //go to userinfo view screen.
        var that = this;
        var user_id = event.currentTarget.id;
        console.log(user_id);
        wx.navigateTo({
            url: "../../profile/profile_friend?id=" + user_id + '&type=0'
        })

    },

})
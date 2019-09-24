//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        userInfo: {
            avatar: '',
            name: '',
            age: 0,
            gender: 0,
            phone: '',
            person_sign: '',
        },
        sex_images: ["../../image/man@2x.png",
            "../../image/women@2x.png"
        ],
        type_array: [],
        event_types: app.globalData.eventType,
        isFirstInit: true,
    },
    getUserModalHide: function() {
        this.setData({
            getUserInfoDisabled: false
        })
        this.data.isFirstInit = false;
        app.globalData.initDisabled = false;
        this.onShow();
        // setTimeout(function() {

        // }, 100);
    },
    onShow: function(option) {
        var that = app;
        var _this = this;
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
    onInitStart: function(option) {
        var that = this;
        wx.showTabBar({})
        wx.request({
            url: app.globalData.mainURL + 'api/getUserDetail',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'user_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                var user = res.data.result;
                that.data.userInfo = user[0];
                that.setData({ userInfo: user[0] });
                console.log(that.data.userInfo);
                wx.request({
                    url: app.globalData.mainURL + 'api/datamanage/getTypeListById',
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data: {
                        'user_id': app.globalData.userInfo.user_id
                    },
                    success: function(res) {
                        var type_array = [];
                        if (res.data.status) {
                            type_array = res.data.result;
                        }
                        var user_sports = [];
                        if (that.data.userInfo.sport_type) user_sports = that.data.userInfo.sport_type.split(',');
                        var show_arr = [];
                        for (var i = 0; i < user_sports.length; i++) {
                            var item = { type: user_sports[i], count: 0 };
                            for (var k = 0; k < type_array.length; k++) {
                                var unit = type_array[k];
                                if (unit.type == item.type) {
                                    item.count = unit.count;
                                    break;
                                }
                            }
                            show_arr.push(item);
                        }
                        that.data.type_array = show_arr;
                        that.setData({ type_array: show_arr });
                    }
                })
            },
            complete: function() {
                wx.hideLoading({});
            }
        });
    },

    on_clicked_edit_info: function(event) {
        //go to edit info screen
        wx.navigateTo({
            url: 'my_info/my_info'
        });
    },
    //listener of tabbar
    //footer function
    whichpress: function(event) {
        switch (event.currentTarget.id) {
            case 'my_activity':
                wx.navigateTo({
                    url: 'my_activity/my_activity'
                });
                break;


            case 'my_event':
                wx.navigateTo({
                    url: 'my_event/my_event'
                });
                break;
            case 'my_booking':
                wx.navigateTo({
                    url: 'my_booking/booking'
                });
                break;
            case 'my_purse':
                wx.navigateTo({
                    url: 'my_purse/my_purse'
                });
                break;
            case 'delivery_address':
                wx.navigateTo({
                    url: 'delivery/delivery',
                })
                break;
            case 'my_membership':
                wx.navigateTo({
                    url: 'my_membership/my_membership',
                })
                break;
            case 'my_focus':
                wx.navigateTo({
                    url: 'my_focus/my_focus',
                })
                break;
            case 'auth_me':
                if (app.globalData.userInfo.state == 0) {
                    wx.navigateTo({
                        url: 'auth/auth',
                    })
                } else {
                    wx.navigateTo({
                        url: 'auth/auth-text/auth_text',
                    })
                }
                break;

            case 'about_stadium':
                wx.navigateTo({
                    url: 'register_stadium/register_stadium',
                })
                break;
            case 'stadium_work':
                wx.navigateTo({
                    url: 'stadium_work/stadium_work',
                })
                break;
            default:
                break;
        }
    },
    on_clicked_share_info: function() {
        console.log('share button clicked');

    },
    phone_call: function(event) {
        app.phoneCall(event.currentTarget.dataset.id)
    },

    onShareAppMessage: function(res) {
        console.log("SHARED")
        if (res.from === 'button') {
            console.log(res.target)
        }
        var that = this;

        var title = "这是个运动达人，添加他为好友，一起运动吧"

        return {
            title: title,
            path: '/pages/profile/profile_friend?id=' + app.globalData.userInfo.user_id + '&type=0',
            success: function(res) {},
            fail: function(res) {}
        }
    }
})
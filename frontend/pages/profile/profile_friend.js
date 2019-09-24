//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        user_id: '',
        pageType: 0, // page type - 0: mine, 1: from others - confirm or applied
        friendItem: [],
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
        tmrID: 0,
        isFirstInit: true,

    },
    onLoad: function(option) {
        var that = this;
        that.data.user_id = option.id;
        that.data.pageType = parseInt(option.type);
        that.setData({
            user_id: option.id
        })
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
        app.globalData.initDisabled = false;
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
        wx.showTabBar({});
        //Setting Nickname and avatar of User    
        var that = this;
        wx.request({
            url: app.globalData.mainURL + 'api/getUserDetail',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'user_id': that.data.user_id
            },
            success: function(res) {
                var user = res.data.result;
                var friends = res.data.honeyFriend;
                if (that.data.pageType == 1)
                    friends = res.data.honeyNewFriend;

                console.log(app.globalData.userInfo.user_id);
                var status = that.getFriendStatus(friends, 'status');
                that.data.userInfo = user[0];
                that.setData({
                    userInfo: user[0],
                    pageType: that.data.pageType,
                    applyStatus: status
                });
                if (status == 1)
                    wx.setNavigationBarTitle({
                        title: '我的蜂友'
                    })

                wx.request({
                    url: app.globalData.mainURL + 'api/datamanage/getTypeListById',
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data: {
                        'user_id': that.data.user_id
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
    getFriendStatus: function(allList, ret) {
        var that = this;
        var st = 2;
        var friendItem = [];
        if (ret == undefined) ret = 'status';

        switch (that.data.pageType) {
            case 0: // mine page
            case 1: // from other person page
                for (var i = 0; i < allList.length; i++) {
                    var item = allList[i];
                    if (item.user_id == app.globalData.userInfo.user_id &&
                        item.friend_id == that.data.user_id) {
                        st = item.status;
                        friendItem.push(item);
                        break;
                    }
                }
                if (friendItem.length > 0) break;
                for (var i = 0; i < allList.length; i++) {
                    var item = allList[i];
                    if (item.user_id == that.data.user_id &&
                        item.friend_id == app.globalData.userInfo.user_id) {
                        st = item.status;
                        friendItem.push(item);
                        break;
                    }
                }
                break;
        }
        if (ret == 'status')
            return st;
        else
            return friendItem[0];
    },
    addFriend: function(event) {
        // go to add Friend page
        var that = this;
        var id = event.currentTarget.dataset.id;
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/addFriend',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'user_id': app.globalData.userInfo.user_id,
                'friend_id': that.data.user_id
            },
            success: function(res) {
                if (res.data.status)
                    that.setData({
                        applyStatus: that.getFriendStatus(res.data.data, 'status')
                    })
                else {
                    wx.showToast({
                        title: '蜂友添加失败',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    },
    removeFriend: function(event) {
        // go to add Friend page
        var that = this;
        var id = event.currentTarget.dataset.id;
        wx.showModal({
            title: '提示',
            content: '确定解除蜂友?',
            confirmText: '好的',
            cancelText: '算了',
            success: function(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.globalData.mainURL + 'api/datamanage/removeFriend',
                        method: 'POST',
                        header: {
                            'content-type': 'application/json'
                        },
                        data: {
                            'user_id': app.globalData.userInfo.user_id,
                            'friend_id': that.data.user_id
                        },
                        success: function(res) {
                            if (res.data.status)
                                that.setData({
                                    applyStatus: that.getFriendStatus(res.data.data, 'status')
                                })
                            else {
                                wx.showToast({
                                    title: '蜂友解除失败',
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                        }
                    })
                }
            }
        })

    },
    applyFriend: function(event) {
        // go to add Friend page
        var that = this;
        var id = event.currentTarget.dataset.id;
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/confirmFriend',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'user_id': app.globalData.userInfo.user_id,
                'friend_id': that.data.user_id
            },
            success: function(res) {
                if (res.data.status)
                    that.setData({
                        applyStatus: that.getFriendStatus(res.data.data, 'status')
                    })
                else {
                    wx.showToast({
                        title: '蜂友添加失败',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    },
    tmrID: 0,
    go2FriendBackyard: function(event) {
        // go to Friend's backyard page
        var id = event.currentTarget.dataset.id;
        var that = this;
        var status = parseInt(event.currentTarget.dataset.status);
        console.log(id + ',,,,' + status);
        if (status == 1)
            wx.redirectTo({
                url: '../backyard/backyard_friend?id=' + id
            });
        else {
            that.setData({
                isModalShow: 1
            })
            clearTimeout(that.tmrID);
            that.tmrID = setTimeout(function() {
                that.setData({
                    isModalShow: 0
                })
            }, 2000);

        }
    },
    phone_call: function(event) {
        app.phoneCall(event.currentTarget.dataset.id)
    },
    on_clicked_share_info: function() {
        console.log('share button clicked');

    },

    onShareAppMessage: function(res) {
        console.log("SHARED")
        if (res.from === 'button') {
            console.log(res.target)
        }
        var that = this;
        return {
            title: '个人名片',
            path: '/pages/profile/profile_friend?id=' + that.data.user_id + '&type=0',
            success: function(res) {},
            fail: function(res) {}
        }
    }
})
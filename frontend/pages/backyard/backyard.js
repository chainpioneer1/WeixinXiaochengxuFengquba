//index.js
//获取应用实例
const app = getApp()
var WXBizDataCrypt = require('../../utils/RdWXBizDataCrypt.js');
var dtemp1, dtemp2
Page({
    data: {
        avatar: "",
        show_leader: 0,
        newCount: 0,
        isSelectedFav: 'cur',
        isSelectedTotal: '',
        mine: 0,
        rank_icon: ['../../image/leader-1st@2x.png', '../../image/leader-2nd@2x.png', '../../image/leader-3rd@2x.png', '../../image/blank.png'],
        honey_icon: ['../../image/garden_sc_fm02@2x.png', '../../image/blank.png'],
        calendar_icon: ['../../image/garden_mrqd@2x.png', '../../image/garden_yqd@2x.png'],
        signed_status: 0,
        uploadRoot: app.globalData.uploadURL
    },
    onLoad() {
        var that = app;
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
        app.checkDate(), wx.request({
            url: app.globalData.mainURL + "api/getBackyard",
            method: "POST",
            header: {
                "content-type": "application/json"
            },
            data: {
                user_id: app.globalData.userInfo.user_id
            },
            success: function(res) {
                that.data.mine = app.globalData.userInfo.user_id;
                app.globalData.honey_info.total_honey = res.data.honey;
                var honey_info = app.globalData.honey_info;
                honey_info.honeybox_array = [];
                console.log(honey_info)
                that.setData({
                    signed_status: (res.data.sign) ? 1 : 0
                })
                if (res.data.status) {
                    var honeyList = res.data.result
                    for (var n = 0; n < honeyList.length; n++) {
                        var start_time;
                        start_time = Date.parse(honeyList[n].create_time.replace(/-/g, "/")),
                            honey_info.honeybox_array.push({
                                no: honeyList[n].no,
                                user_id: honeyList[n].user_id,
                                x: honeyList[n].x,
                                y: honeyList[n].y,
                                honey: honeyList[n].amount,
                                start_time: start_time
                            });
                    }
                    app.globalData.honey_info = honey_info, that.setData({
                        total: parseInt(app.globalData.honey_info.total_honey),
                        honeybox_array: honey_info.honeybox_array,
                        avatar: app.globalData.userInfo.avatar
                    });
                } else honey_info.honeybox_array = [],
                    that.setData({
                        total: parseInt(app.globalData.honey_info.total_honey),
                        honeybox_array: honey_info.honeybox_array,
                        avatar: app.globalData.userInfo.avatar
                    });
                app.globalData.honey_info = honey_info;
            }
        });
        // console.log(app.globalData.daily_honey);

        wx.request({
            url: app.globalData.mainURL + 'api/getHoneyFriend',
            data: {
                user_id: app.globalData.userInfo.user_id
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                // console.log(res);                
                if (res.data.status) {
                    that.data.friendList = res.data.data;
                }
            },
        })
        wx.request({
                url: app.globalData.mainURL + 'api/datamanage/getNewHoneyFriend',
                data: {
                    user_id: app.globalData.userInfo.user_id
                },
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    // console.log(res);
                    if (res.data.status) {
                        that.data.friendList1 = res.data.data;
                    }
                    that.calculateNewFriends();
                },
                complete: function() {
                    wx.hideLoading({});
                },
            })
            // app.checkDate()
            // var honey_info = wx.getStorageSync('honey_info')
            // this.setData({
            //     total: app.globalData.honey_info.total_honey,
            //     honeybox_array: honey_info.honeybox_array,
            //     avatar: app.globalData.userInfo.avatar
            // })
        this.closeLeaderView();

    },
    On_click_beeshop: function() {
        wx.navigateTo({
            url: 'mainbeeshop/mainbeeshop',
        })
    },
    On_click_beelist: function() {
        wx.navigateTo({
            url: 'transaction/transaction',
        })
    },
    On_click_comment: function() {
        wx.navigateTo({
            url: 'help/help',
        })
    },
    On_click_calendar: function() {
        // go to friend page
        wx.navigateTo({
            url: 'calendar',
        })
    },
    On_click_friend: function() {
        // go to friend page
        wx.navigateTo({
            url: 'my_friend/friends',
        })
    },
    calculateNewFriends: function() {
        var that = this;
        var allList = that.data.friendList1;
        var cnt = 0;
        for (var i = 0; i < allList.length; i++) {
            var item = allList[i];
            // user_id means user that received apply request.
            if (item.user_id == app.globalData.userInfo.user_id &&
                item.status == 0)
                cnt++;
        }

        that.setData({
            newCount: cnt
        });
    },
    On_click_leader: function() {
        // show leader box
        var that = this;
        that.leaderFavSelected();
    },
    closeLeaderView: function() {
        // close leader box
        var that = this;
        that.setData({
            show_leader: 0
        });
    },

    leaderFavSelected: function() {
        // leader/favorite tab selected
        var that = this;

        // get all friend information    
        var allList = [];
        var mineList = [];
        mineList.push(that.data.friendList);
        mineList = mineList[0];
        allList.push(that.data.friendList1);
        allList = allList[0];
        if (mineList.length == 0) return;
        // console.log(allList);
        var filtered = new Array();
        var j = 0;
        for (var i = 0; i < mineList.length; i++) {
            var item = mineList[i];
            // main_id means user's id
            if (item.main_id == app.globalData.userInfo.user_id) {
                item.user_id = item.main_id;
                item.show_id = item.main_id;
                item.honey = parseInt(item.honey);
                filtered.push(item);
                filtered[filtered.length - 1].friend_id = item.main_id;
            }
        }
        for (var i = 0; i < allList.length; i++) {
            var item = allList[i];
            // user_id means user that received apply request.

            if (item.main_id != app.globalData.userInfo.user_id &&
                item.user_id == app.globalData.userInfo.user_id &&
                item.status == 1) {
                item.show_id = item.main_id;
                item.honey = parseInt(item.honey);
                filtered.push(item);
            }
        }

        filtered.sort(function(a, b) { return (a.honey < b.honey ? 1 : -1); });

        that.setData({
            mine: that.data.mine,
            filterList: filtered,
            show_leader: 1,
            isSelectedFav: 'cur',
            isSelectedTotal: '',
        });
    },

    leaderTotalSelected: function() {
        // leader/total tab selected
        var that = this;
        var allList = [];
        allList.push(that.data.friendList);
        allList = allList[0];
        if (allList.length == 0) return;

        // get my friend information   
        // console.log(allList);

        var filtered = new Array();
        for (var i = 0; i < allList.length; i++) {
            var item = allList[i];
            // main_id means user's id
            if (true || item.main_id != app.globalData.userInfo.user_id) {
                item.friend_id = item.main_id;
                item.show_id = item.main_id;
                item.honey = parseInt(item.honey);
                filtered.push(item);
                filtered[filtered.length - 1].friend_id = item.main_id;
            }

        }

        that.setData({
            mine: that.data.mine,
            filterList: filtered,
            show_leader: 1,
            isSelectedFav: '',
            isSelectedTotal: 'cur',
        });
    },
    go2FriendBackyard: function(event) {
        // go to friend's backyard page
        var id = event.currentTarget.dataset.id;
        if (id == app.globalData.userInfo.user_id) return;
        var that = this;
        // console.log(id);
        if (that.data.isSelectedFav == 'cur') {
            wx.navigateTo({
                url: 'backyard_friend?id=' + id + '&type=0'
            })
        } else {
            wx.navigateTo({
                url: '../profile/profile_friend?id=' + id + '&type=0'
            })
        }
    },

    on_click_honey: function(event) {
        var that = this;
        if (app.globalData.userInfo.user_id == 0)
            if (app.globalData.isactivetime == 0) {
                wx.showToast({
                    title: '从早上7点开始可以收集蜂蜜',
                    icon: 'none',
                    duration: 2000
                })
                return;
            }
        var selected = 0;
        var honey = 0;
        var honey_info = wx.getStorageSync('honey_info');
        honey_info = app.globalData.honey_info;
        // console.log(honey_info.honeybox_array)
        for (var iter = 0; iter < honey_info.honeybox_array.length; iter++) {
            if (event.currentTarget.id * 1 == honey_info.honeybox_array[iter].start_time) {
                selected = iter
                    // console.log(event.currentTarget.id)
                    // console.log(honey_info.honeybox_array[selected].start_time)
                honey = honey_info.honeybox_array[iter].honey * 1
                break
            }
        }
        var backyard_no = honey_info.honeybox_array[selected].no;
        if (app.globalData.daily_honey[1] >= app.globalData.rule[6].value) {
            var title = '您今天已经收获了' + app.globalData.rule[6].value + 'ml蜂蜜，明天再来哦'
                // console.log(title)
            wx.showToast({
                title: title,
                icon: 'none'
            })
            return
        } else {
            if (app.globalData.daily_honey[1] + honey > app.globalData.rule[6].value * 1) {
                honey_info.honeybox_array[selected].honey -= (app.globalData.rule[6].value - app.globalData.daily_honey[1]);
                honey = app.globalData.rule[6].value - app.globalData.daily_honey[1]
            } else {
                honey_info.honeybox_array.splice(selected, 1)
            }
            app.globalData.daily_honey[1] = app.globalData.daily_honey[1] * 1 + 1 * honey
            honey_info.total_honey = parseFloat(1 * honey) + parseFloat(honey_info.total_honey * 1);
            this.setData({
                honeybox_array: honey_info.honeybox_array
            })
            wx.setStorageSync('daily_honey', app.globalData.daily_honey)
            wx.setStorageSync('honey_info', honey_info)
            app.globalData.honey_info = honey_info
            wx.request({
                url: app.globalData.mainURL + 'api/catchHoney',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data: {
                    no: 0,
                    backyard_no: backyard_no,
                    amount: honey_info.total_honey,
                    honey: honey,
                    user_id: app.globalData.userInfo.user_id,
                    //todayfirst: wx.getStorageSync('todayfirst'),
                    daily_honey: JSON.stringify(wx.getStorageSync('daily_honey'))
                },
                success: function(res) {

                    that.setData({
                        total: parseInt(app.globalData.honey_info.total_honey),
                        honeybox_array: app.globalData.honey_info.honeybox_array
                    })
                }
            })
        }
        // console.log(app.globalData.honey_info.honeybox_array)
    },
    onShareAppMessage: function(res) {
        console.log("SHARED")
        if (res.from === 'button') {
            // console.log(res.target)
        }
        var that = this;

        var title = "快来采集蜂蜜，免费兑换精美礼品哦"

        return {
            title: title,
            path: '/pages/backyard/backyard_friend?id=' + app.globalData.userInfo.user_id,
            success: function(res) {},
            fail: function(res) {}
        }
    }
})
//index.js
//获取应用实例
const app = getApp()
var WXBizDataCrypt = require('../../utils/RdWXBizDataCrypt.js');
var dtemp1, dtemp2
Page({
    data: {
        avatar: "",
        show_leader: 0,
        isSelectedFav: 'cur',
        isSelectedTotal: '',
        friend_info: [],
        friend_id: 0,
        user_data: [],
        uploadRoot: app.globalData.uploadURL
    },
    onLoad(option) {
        var that = this;
        that.data.friend_id = option.id;
    },
    onShow: function() {
        var that = this;
        wx.showLoading({
            title: '加载中',
        })
        app.checkDate(), wx.request({
            url: app.globalData.mainURL + "api/getBackyard",
            method: "POST",
            header: {
                "content-type": "application/json"
            },
            data: {
                user_id: that.data.friend_id
            },
            success: function(res) {
                console.log(res.data);
                var honey_info = app.globalData.honey_info;
                honey_info.honeybox_array = [];
                // console.log(honey_info)
                if (res.data.status) {
                    var honeyList = res.data.result
                    for (var n = 0; n < honeyList.length; n++) {
                        var start_time;
                        start_time = Date.parse(honeyList[n].create_time.replace(/-/g, "/")),
                            honey_info.honeybox_array.push({
                                no: honeyList[n].no,
                                user_id: honeyList[n].user_id,
                                receiver_id: honeyList[n].receiver_id,
                                x: honeyList[n].x,
                                y: honeyList[n].y,
                                honey: honeyList[n].amount,
                                start_time: start_time
                            });
                    }
                    app.globalData.honey_info = honey_info, that.setData({
                        total: app.globalData.honey_info.total_honey,
                        honeybox_array: honey_info.honeybox_array,
                        avatar: app.globalData.userInfo.avatar
                    });
                } else honey_info.honeybox_array = [],

                    that.setData({
                        total: app.globalData.honey_info.total_honey,
                        honeybox_array: honey_info.honeybox_array,
                        avatar: app.globalData.userInfo.avatar,
                        username: app.globalData.userInfo.username,
                        friend_id: that.data.friend_id,
                    })
                app.globalData.honey_info = honey_info;
            },
            complete: function() {
                wx.hideLoading({});
            }
        });
        // console.log(app.globalData.daily_honey);


        wx.request({
            url: app.globalData.mainURL + 'api/getUserDetail',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'user_id': that.data.friend_id
            },
            success: function(res) {
                var user = res.data.result;
                var friends = res.data.honeyFriend;
                if (that.data.pageType == 1)
                    friends = res.data.honeyNewFriend;

                // console.log(app.globalData.userInfo.user_id);
                that.setData({
                    userInfo: user[0]
                });
            }
        });

        wx.showTabBar();
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
    go2FriendProfile: function(event) {
        // go to friend's backyard page
        var id = event.currentTarget.dataset.id;
        // console.log(id);
        wx.redirectTo({
            url: '../profile/profile_friend?id=' + id + '&type=0'
        })
    },
    On_click_leader: function() {
        var that = this;
        that.setData({
            show_leader: 1
        });
    },
    // On_click_profile: function() {
    //     var that = this;
    //     wx.navigateTo({
    //         url: 'transaction/transaction',
    //     })
    // },
    closeLeaderView: function() {
        var that = this;
        that.setData({
            show_leader: 0
        });
    },

    leaderFavSelected: function() {
        var that = this;
        that.setData({
            isSelectedFav: 'cur',
            isSelectedTotal: '',
        });
    },

    leaderTotalSelected: function() {
        var that = this;
        that.setData({
            isSelectedFav: '',
            isSelectedTotal: 'cur',
        });
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
        console.log(honey_info.honeybox_array)
        for (var iter = 0; iter < honey_info.honeybox_array.length; iter++) {
            if (event.currentTarget.id * 1 == honey_info.honeybox_array[iter].start_time) {
                selected = iter
                    // console.log(event.currentTarget.id)
                    // console.log(honey_info.honeybox_array[selected].start_time)
                honey = parseInt(honey_info.honeybox_array[iter].honey / 2);
                break
            }
        }
        var backyard_no = honey_info.honeybox_array[selected].no;
        if (app.globalData.daily_honey[1] >= app.globalData.rule[6].value) {
            var title = '您今天已经收获了' + app.globalData.rule[6].value + 'ml蜂蜜，明天再来哦'
            console.log(title)
            wx.showToast({
                title: title,
                icon: 'none'
            })
            return
        } else if (honey_info.honeybox_array[selected].receiver_id != 0) {
            var title = '这种蜂蜜不能由其他人获得'
                // console.log(title)
            wx.showToast({
                title: title,
                icon: 'none'
            })
            return
        } else {

            if (app.globalData.daily_honey[1] + honey > app.globalData.rule[6].value * 1) {
                honey_info.honeybox_array[selected].honey -= app.globalData.rule[6].value - app.globalData.daily_honey[1]
                honey = app.globalData.rule[6].value - app.globalData.daily_honey[1]
            } else {
                honey_info.honeybox_array[selected].honey -= honey;
                honey_info.honeybox_array[selected].receiver_id = app.globalData.userInfo.user_id;
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
                    daily_honey: JSON.stringify(wx.getStorageSync('daily_honey'))
                },
                success: function(res) {

                    that.setData({
                        total: app.globalData.honey_info.total_honey,
                        honeybox_array: app.globalData.honey_info.honeybox_array
                    })
                }
            })
        }
        // console.log(app.globalData.honey_info.honeybox_array)
    }
})
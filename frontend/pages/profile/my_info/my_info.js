//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        select_index: 40,
        userInfo: {},
        sex_check_index: 0,
        sex_checked_state: [true, false],
        sport_kind_array: [],
        remain_array: [],
        color_array: ["#000000", "#e6b53c"],
        selected_sport_type: [],
        show_array: ["../../../image/ttt_n@2x.png", "../../../image/ttt_s@2x.png"]
    },
    onLoad: function() {
        wx.showTabBar({})
            //Setting Nickname and avatar of User
        var that = this;

        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/getUserDetail1',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'user_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                var user = res.data.result;
                that.setData({ userInfo: user[0] });
                if (that.data.userInfo.gender == "1") {
                    that.data.sex_checked_state[0] = false;
                    that.data.sex_checked_state[1] = true;
                }
                that.setData({
                    sex_checked_state: that.data.sex_checked_state
                })
                console.log(that.data.userInfo);
                that.data.remain_array = that.get_all_type();
                that.data.sport_kind_array = that.get_all_type();
                if (that.data.userInfo.sport_type) {
                    var sport_type = [];
                    var type_array = that.data.userInfo.sport_type.split(",");
                    for (let index = 0; index < type_array.length; index++) {
                        sport_type.push(that.get_all_type()[type_array[index]]);
                        var item_index = that.data.remain_array.indexOf(that.get_all_type()[type_array[index]])
                        that.data.remain_array.splice(item_index, 1);
                    }
                    that.setData({
                        selected_sport_type: sport_type,
                        remain_array: that.data.remain_array
                    })
                    console.log(that.data.remain_array);
                }
            }
        })
    },
    get_all_type: function(event) {
        return ['足球',
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
        ];
    },

    On_blur_name: function(event) {
        var that = this;
        this.data.userInfo.name = event.detail.value;
        this.setData({
            userInfo: that.data.userInfo
        })
    },
    sex_radioChange: function(event) {
        var that = this;
        this.data.userInfo.gender = event.detail.value;
        this.setData({
            userInfo: that.data.userInfo
        })
    },

    On_blur_age: function(event) {
        var that = this;
        this.data.userInfo.age = event.detail.value;
        this.setData({
            userInfo: that.data.userInfo
        })
    },
    On_blur_phone: function(event) {
        var that = this;
        this.data.userInfo.phone = event.detail.value;
        this.setData({
            userInfo: that.data.userInfo
        })
    },
    ishow_radioChange: function(event) {
        var that = this;
        var state = (that.data.userInfo.show_state + 1) % 2;
        that.data.userInfo.show_state = state
        that.setData({
            userInfo: that.data.userInfo
        })

    },
    On_click_deleteType: function(event) {
        var that = this;
        var index = event.currentTarget.id;
        console.log(event.currentTarget.id);
        that.data.selected_sport_type.splice(index, 1);
        that.setData({
            selected_sport_type: that.data.selected_sport_type
        })
    },
    On_click_AddType: function(event) {
        var that = this;
        if (that.data.selected_sport_type.length == 3) {
            //show alert
            wx.showToast({
                title: '最多只能选择三个',
                duration: 2000,
                icon: 'none'
            })
        } else {
            var remain_array = that.get_all_type();
            for (let index = 0; index < that.data.selected_sport_type.length; index++) {
                var item = that.data.selected_sport_type[index];
                var item_index = remain_array.indexOf(item);
                remain_array.splice(item_index, 1);
            }

            this.setData({
                remain_array: remain_array,
                select_menu_state: 1,
                select_index: 40
            })
        }
    },
    clicked_style_item: function(event) {
        this.setData({
            select_index: event.currentTarget.id
        })
    },
    cancel_btn_clicked: function() {
        this.setData({
            select_menu_state: 0
        })
    },
    ok_btn_clicked: function(event) {
        //add selected kind to selected_sport_type
        var that = this;
        if (that.data.select_index == 40) {
            wx.showToast({
                title: '请选择一种活动类型',
                duration: 2000,
                icon: 'none'
            })
        } else {
            var item = that.data.remain_array[that.data.select_index];
            that.data.selected_sport_type.push(item);
            this.setData({
                select_menu_state: 0,
                selected_sport_type: that.data.selected_sport_type
            })
        }
    },
    On_blur_personSign: function(event) {

        var that = this;
        that.data.userInfo.person_sign = event.detail.value;
        that.setData({
            userInfo: that.data.userInfo
        })

    },
    On_click_submit: function(event) {
        var that = this;
        if (this.data.userInfo.phone.length == 0) {
            wx.showToast({
                title: '请填写手机号码',
                icon: 'none'
            })
            return;
        }
        if (!app.checkValidPhone(this.data.userInfo.phone)) {
            wx.showToast({
                title: '请填写正确的手机号码',
                icon: 'none'
            })
            return;
        }
        if (this.data.selected_sport_type.length == 0) {
            wx.showToast({
                title: '请至少选择一个运动项目',
                icon: 'none'
            })
            return;
        }
        if (parseInt(this.data.userInfo.age) <= 0) {
            wx.showToast({
                title: '请输入年龄',
                icon: 'none'
            })
            return;
        }
        //submit user data
        var all_type = that.get_all_type();
        var first_index = all_type.indexOf(that.data.selected_sport_type[0]);
        var sport_types_str = '' + first_index;
        var sport_type = first_index;
        if (that.data.selected_sport_type.length > 1) {
            sport_type = 31;
            for (let index = 1; index < that.data.selected_sport_type.length; index++) {
                var item = that.data.selected_sport_type[index];
                var sport_index = all_type.indexOf(item);
                sport_types_str = sport_types_str + ',' + sport_index;
            }
        }
        that.data.userInfo.sport_type = sport_types_str;
        console.log('user info data');
        console.log(that.data.userInfo);
        wx.request({


            url: app.globalData.mainURL + 'api/datamanage/updateUserById',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'userInfo': that.data.userInfo,
                'user_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                wx.showToast({
                    title: '更新成功',
                    duration: 1000,
                    icon: 'none'
                })
                setTimeout(function() {
                    wx.switchTab({
                        url: '../profile',
                        success: function() {
                            wx.showTabBar({})
                        }
                    })
                }, 1500);

            }
        })
    },

})
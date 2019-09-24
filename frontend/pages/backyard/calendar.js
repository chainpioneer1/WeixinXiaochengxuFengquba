//index.js
//获取应用实例
const app = getApp();

// var calendarPicker = require("../../utils/calendarPicker");

Page({
    data: {
        avatar: "",
        uploadRoot: app.globalData.uploadURL,

        days: [],
        signUp: [],
        curSignId: 0,
        defaultSign: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        cur_year: 0,
        cur_month: 0,
        count: 0,
        _tmr: 0,
        msgContent: ''
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
        this.makeCalendar();
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

        that.setData({
            avatar: app.globalData.userInfo.avatar,
            total: app.globalData.userInfo.honey
        })

        this.onGetSignUp();
    },
    makeCalendar: function() {
        //获取当前年月  
        const date = new Date();
        const cur_year = date.getFullYear();
        const cur_month = date.getMonth() + 1;
        const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
        this.setData({
            cur_year: cur_year,
            cur_month: cur_month,
            weeks_ch: weeks_ch
        });
        this.calculateEmptyGrids(cur_year, cur_month);
        //获取当前用户当前任务的签到状态
    },
    // 获取当月共多少天
    getThisMonthDays: function(year, month) {
        return new Date(year, month, 0).getDate()
    },

    // 获取当月第一天星期几
    getFirstDayOfWeek: function(year, month) {
        return new Date(Date.UTC(year, month - 1, 1)).getDay();
    },

    // 计算当月1号前空了几个格子，把它填充在days数组的前面
    calculateEmptyGrids: function(year, month) {
        var that = this;
        //计算每个月时要清零
        that.setData({ days: [] });
        const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
        if (firstDayOfWeek > 0) {
            for (let i = 0; i < firstDayOfWeek; i++) {
                var obj = {
                    date: '',
                    isSign: false,
                    isDisabled: true
                }
                that.data.days.push(obj);
            }
            this.setData({
                days: that.data.days
            });
            //清空
        } else {
            this.setData({
                days: []
            });
        }
        that.calculateDays(year, month);
    },

    // 绘制当月天数占的格子，并把它放到days数组中
    calculateDays: function(year, month) {
        var that = this;
        var curDate = new Date();
        const thisMonthDays = this.getThisMonthDays(year, month);
        for (let i = 1; i <= thisMonthDays; i++) {
            var obj = {
                date: i,
                isSign: false,
                isDisabled: false,
            }
            var tmpDate = new Date(year + '/' + month + '/' + i);
            if (curDate < tmpDate) obj.isDisabled = true;
            that.data.days.push(obj);
        }
        that.onJudgeSign();
    },

    on_click_date: function(e) {
        var that = this;
        var viewDate = e.currentTarget.dataset.date;
        var id = parseInt(e.currentTarget.dataset.id);
        var curDate = new Date();
        var daysArr = that.data.days;
        curDate = new Date(curDate.getFullYear() + '/' + (curDate.getMonth() + 1) + '/' + curDate.getDate());
        viewDate = new Date(that.data.cur_year + '/' + that.data.cur_month + '/' + viewDate);

        if (curDate.toLocaleDateString() != viewDate.toLocaleDateString()) return;

        if (daysArr[id].isSign) {
            that.showNotify('您已签到了');
            return;
        }

        var signs = [];
        for (var i = 0; i < daysArr.length; i++) {
            var item = daysArr[i];
            if (item.date == '') continue;
            if (item.date == curDate.getDate())
                daysArr[i].isSign = true;
            if (daysArr[i].isSign) signs.push(1);
            else signs.push(0);
        }
        // console.log(signs);
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/setBackyardSign',
            data: {
                user_id: app.globalData.userInfo.user_id,
                no: that.data.curSignId,
                sign_month: curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + curDate.getDate(),
                sign_info: JSON.stringify(signs)
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res.data);
                if (res.data.status) {
                    var signInfo = res.data.result;
                    that.data.signUp = signInfo;
                    that.setData({ total: res.data.userHoney });
                    app.globalData.userInfo.honey = that.data.total;
                    that.onJudgeSign();
                    that.showNotify('签到成功，获得' + app.globalData.rule[15].value + 'ml蜂蜜');
                }
            },
            complete: function() {
                wx.hideLoading({});
            },
        })

    },

    showNotify: function(content) {
        var that = this;
        that.setData({
            msgContent: content
        })
        clearTimeout(that.data._tmr);
        that.data._tmr = setTimeout(function() {
            that.setData({
                msgContent: ''
            })
        }, 2000);
    },

    go2Back: function() {
        wx.navigateBack({ delta: 1 });
    },
    //匹配判断当月与当月哪些日子签到打卡
    onJudgeSign: function() {
        var that = this;
        var signs = that.data.signUp;

        var viewStart = new Date(that.data.cur_year + '/' + that.data.cur_month + '/1');
        var viewEnd = new Date(that.data.cur_year + '/' + that.data.cur_month + '/1');
        viewEnd = viewEnd.setMonth(viewEnd.getMonth() + 1);

        var signItem = signs.find(function(a) {
            var mon = new Date(a.sign_month.replace(/-/g, '/'));
            return (mon >= viewStart && mon < viewEnd);
        })
        that.data.curSignId = 0;
        if (signItem) {
            that.data.curSignId = signItem.no;
            signItem = JSON.parse(signItem.sign_info);
        } else {
            signItem = that.data.defaultSign;
        }
        var daysArr = that.data.days;
        var j = 0;
        for (var i = 0; i < daysArr.length; i++) {
            var item = daysArr[i];
            if (item.date == '') continue;
            if (signItem[j] == 1) daysArr[i].isSign = true;
            else daysArr[i].isSign = false;
            j++;
        }
        that.setData({ days: daysArr });
        // console.log(signItem);
    },
    // 切换控制年月，上一个月，下一个月
    handleCalendar: function(e) {
        const handle = e.currentTarget.dataset.handle;
        const cur_year = this.data.cur_year;
        const cur_month = this.data.cur_month;
        if (handle === 'prev') {
            let newMonth = cur_month - 1;
            let newYear = cur_year;
            if (newMonth < 1) {
                newYear = cur_year - 1;
                newMonth = 12;
            }
            this.setData({
                cur_year: newYear,
                cur_month: newMonth
            })
            this.calculateEmptyGrids(newYear, newMonth);
        } else {
            let newMonth = cur_month + 1;
            let newYear = cur_year;
            if (newMonth > 12) {
                newYear = cur_year + 1;
                newMonth = 1;
            }
            this.setData({
                cur_year: newYear,
                cur_month: newMonth
            })
            this.calculateEmptyGrids(newYear, newMonth);
        }
    },

    //获取当前用户该任务的签到数组
    onGetSignUp: function() {
        var that = this;
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/getBackyardSign',
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
                    var signInfo = res.data.result;
                    that.data.signUp = signInfo;
                    that.onJudgeSign();
                }
            },
            complete: function() {
                wx.hideLoading({});
            },
        })

    },

    onShareAppMessage: function(res) {
        console.log("SHARED")
        if (res.from === 'button') {
            // console.log(res.target)
        }
        var that = this;

        var title = "签到日历";

        return {
            title: title,
            path: '/pages/backyard/calendar',
            success: function(res) {},
            fail: function(res) {}
        }
    }
})
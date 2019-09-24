//index.js
//获取应用实例
const app = getApp();

// var calendarPicker = require("../../utils/calendarPicker");

var monthPicker = require('../../../utils/monthPicker');

Page({
    data: {
        avatar: "",
        uploadRoot: app.globalData.uploadURL,

        days: [],
        signUp: [],
        curSignId: 0,
        defaultSign: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        count: 0,
        _tmr: 0,
        msgContent: '',
        main_menu: 0,
        sub_menu: 0,
        scanCode: '',
        show_confirm: false,
        show_calendar: false,
        baseDate: [1978, 1, 1],
        priceGroup: {
            total_price: 0,
            group_count: 0,
            group_price: 0,
            room_count: 0,
            room_price: 0
        },
        cur7Date: {},
        _today: {
            year: (new Date()).getFullYear(),
            month: (new Date()).getMonth() * 1 + 1,
            date: (new Date()).getDate(),
        }
    },
    onLoad() {
        var that = this;

        var monthObj = monthPicker.monthPicker();
        var curDate = new Date();

        this.setData({
            monthArray: monthObj.dateTimeArray,
            historyMonth: [curDate.getFullYear(), curDate.getMonth() + 1],
            analyseMonth: [curDate.getFullYear(), curDate.getMonth() + 1],
            totalPrice: this.data.priceGroup,
            curDayPrice: this.data.priceGroup,
            cur7DayPrice: this.data.priceGroup,
            curMonthPrice: this.data.priceGroup,
        });
        that.data.cur7Date.end = new Date();
        curDate.setDate(curDate.getDate() - 7);
        that.data.cur7Date.start = curDate;
        var cur7 = that.data.cur7Date;
        that.setData({
            cur7DateStart: cur7.start.getFullYear() + '-' + (cur7.start.getMonth() + 1) + '-' + cur7.start.getDate(),
            cur7DateEnd: cur7.end.getFullYear() + '-' + (cur7.end.getMonth() + 1) + '-' + cur7.end.getDate(),
        })

    },
    getUserModalHide: function() {
        this.setData({
            getUserInfoDisabled: false
        })
        this.data.isFirstInit = false;
        app.globalData.initDisabled = false;
        this.onShow();

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

        that.onJudgeSign();

        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/getBossBooking',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'boss_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                that.data.bossBooking = res.data.result;
                that.calculateStatistics();
            },
            complete: function() {
                wx.hideLoading({});
            }
        });

    },
    calculateStatistics: function() {
        var that = this;
        // calculate Used Bossgroup List
        var bossBooking = that.data.bossBooking;
        if (!bossBooking) return;
        var curDate = new Date();

        var historyMonthStart = new Date(that.data.historyMonth[0] + '/' + that.data.historyMonth[1] + '/' + 1);
        var historyMonthEnd = new Date(that.data.historyMonth[0] + '/' + that.data.historyMonth[1] + '/' + 1);
        historyMonthEnd.setMonth(historyMonthEnd.getMonth() + 1);
        var historyBookedArr = bossBooking.filter(function(a) {
            var submit = new Date(a.submit_time.replace(/-/g, '/'));
            var stateCond = a.state == 0 || a.state == 1 || a.state == 2 || a.state == 5;
            var paidCond = a.pay_honey > 0 || a.pay_online > 0 || a.pay_wallet > 0;
            return (submit > historyMonthStart && submit < historyMonthEnd && stateCond && a.book_type == 1 && paidCond);
        })

        // calculate history bossgroup items (used and waiting)
        var tmpArrUsed = [];
        var tmpArrWaiting = [];
        for (var i = 0; i < historyBookedArr.length; i++) {
            var item = historyBookedArr[i];
            var book_info = JSON.parse(item.book_info);
            var userName = item.name;
            var userPhone = item.phone;
            if (item.user_info) {
                userName = (JSON.parse(item.user_info)).name;
                userPhone = (JSON.parse(item.user_info)).phone;
            }
            for (var j = 0; j < book_info.length; j++) {
                var codeItem = book_info[j];
                var viewItem = {
                    groupName: item.group_package,
                    groupPrice: item.group_price,
                    bookName: '团购券' + that.makeNDigit(j + 1, 2),
                    name: userName,
                    phone: userPhone,
                    order_num: that.makeNDigit(item.id, 16),
                    paid_time: item.submit_time,
                    used_time: codeItem.used_time || '待核销'
                }
                if (codeItem.is_used == 1) tmpArrUsed.push(viewItem)
                else if (item.state == 0 || item.state == 1) tmpArrWaiting.push(viewItem);
            }
        }
        if (that.data.sub_menu == 0) that.setData({ historyBook: tmpArrUsed });
        else that.setData({ historyBook: tmpArrWaiting })

        // calculate checked Code Item (qr scanned result)
        if (that.data.checkedBookItem) {
            var checkedCodeBook = [historyBookedArr.find(function(a) { return a.id == that.data.checkedBookItem.id })];
            var tmpArrChecked = [];
            for (var i = 0; i < checkedCodeBook.length; i++) {
                var item = checkedCodeBook[i];
                var book_info = JSON.parse(item.book_info);
                var userName = item.name;
                var userPhone = item.phone;
                if (item.user_info) {
                    userName = (JSON.parse(item.user_info)).name;
                    userPhone = (JSON.parse(item.user_info)).phone;
                }
                for (var j = 0; j < book_info.length; j++) {
                    var codeItem = book_info[j];
                    var viewItem = {
                        groupName: item.group_package,
                        groupPrice: item.group_price,
                        bookName: '团购券' + that.makeNDigit(j + 1, 2),
                        name: userName,
                        phone: userPhone,
                        order_num: that.makeNDigit(item.id, 16),
                        paid_time: item.submit_time,
                        used_time: codeItem.used_time || '待核销'
                    }
                    if (codeItem.order_code == that.makeNDigit(that.data.scanCode, 6)) tmpArrChecked.push(viewItem)
                }
            }
            that.setData({ checkedCode: tmpArrChecked });
        }
        console.log(that.data);
        that.setData({
            totalPrice: this.data.priceGroup,
            curDayPrice: this.data.priceGroup,
            cur7DayPrice: this.data.priceGroup,
            curMonthPrice: this.data.priceGroup,
        });
        for (var i = 0; i < bossBooking.length; i++) {
            var item = bossBooking[i];
            var paidDate = new Date(item.submit_time.replace(/-/g, '/'));
            paidDate = new Date(paidDate.getFullYear() + '/' + (paidDate.getMonth() + 1) + '/' + paidDate.getDate() + ' 00:00:00');
            if (item.state == 3) continue;
            var isPaid = item.pay_honey > 0 || item.pay_online > 0 || item.pay_wallet > 0;
            if (!isPaid) continue;
            var book_info = JSON.parse(item.book_info);
            var orderCnt = book_info.length;
            that.data.totalPrice.total_price += item.pay_cost * 1;
            if (item.book_type == 0) { // roomBooking
                that.data.totalPrice.room_count += orderCnt;
                that.data.totalPrice.room_price += item.pay_cost * 1;
            } else { // groupBooking
                that.data.totalPrice.group_count += orderCnt;
                that.data.totalPrice.group_price += item.pay_cost * 1;
            }

            var curDate = new Date(that.data.cur_year + '/' + that.data.cur_month + '/' + that.data.cur_date + ' 00:00:00');
            if (paidDate.toLocaleDateString() == curDate.toLocaleDateString()) {
                that.data.curDayPrice.total_price += item.pay_cost * 1;
                if (item.book_type == 0) { // roomBooking
                    that.data.curDayPrice.room_count += orderCnt;
                    that.data.curDayPrice.room_price += item.pay_cost * 1;
                } else { // groupBooking
                    that.data.curDayPrice.group_count += orderCnt;
                    that.data.curDayPrice.group_price += item.pay_cost * 1;
                }
            }

            var startDate = new Date(that.data.cur7DateStart.replace(/-/g, '/') + ' 00:00:00');
            var endDate = new Date(that.data.cur7DateEnd.replace(/-/g, '/') + ' 23:59:59');
            if (paidDate >= startDate && paidDate < endDate) {
                that.data.cur7DayPrice.total_price += item.pay_cost * 1;
                if (item.book_type == 0) { // roomBooking
                    that.data.cur7DayPrice.room_count += orderCnt;
                    that.data.cur7DayPrice.room_price += item.pay_cost * 1;
                } else { // groupBooking
                    that.data.cur7DayPrice.group_count += orderCnt;
                    that.data.cur7DayPrice.group_price += item.pay_cost * 1;
                }
            }
            var startDate = new Date(that.data.analyseMonth[0] + '/' + that.data.analyseMonth[1] + '/1 00:00:00');
            var endDate = new Date(that.data.analyseMonth[0] + '/' + that.data.analyseMonth[1] + '/1 00:00:00');
            endDate.setMonth(endDate.getMonth() + 1);
            if (paidDate >= startDate && paidDate < endDate) {
                that.data.curMonthPrice.total_price += item.pay_cost * 1;
                if (item.book_type == 0) { // roomBooking
                    that.data.curMonthPrice.room_count += orderCnt;
                    that.data.curMonthPrice.room_price += item.pay_cost * 1;
                } else { // groupBooking
                    that.data.curMonthPrice.group_count += orderCnt;
                    that.data.curMonthPrice.group_price += item.pay_cost * 1;
                }
            }

            that.data.totalPrice.total_price = that.data.totalPrice.total_price.toFixed(2) * 1;
            that.data.totalPrice.room_price = that.data.totalPrice.room_price.toFixed(2) * 1;
            that.data.totalPrice.group_price = that.data.totalPrice.group_price.toFixed(2) * 1;

            that.data.curDayPrice.total_price = that.data.curDayPrice.total_price.toFixed(2) * 1;
            that.data.curDayPrice.room_price = that.data.curDayPrice.room_price.toFixed(2) * 1;
            that.data.curDayPrice.group_price = that.data.curDayPrice.group_price.toFixed(2) * 1;

            that.data.cur7DayPrice.total_price = that.data.cur7DayPrice.total_price.toFixed(2) * 1;
            that.data.cur7DayPrice.room_price = that.data.cur7DayPrice.room_price.toFixed(2) * 1;
            that.data.cur7DayPrice.group_price = that.data.cur7DayPrice.group_price.toFixed(2) * 1;

            that.data.curMonthPrice.total_price = that.data.curMonthPrice.total_price.toFixed(2) * 1;
            that.data.curMonthPrice.room_price = that.data.curMonthPrice.room_price.toFixed(2) * 1;
            that.data.curMonthPrice.group_price = that.data.curMonthPrice.group_price.toFixed(2) * 1;
        }
        that.setData({
            totalPrice: that.data.totalPrice,
            curDayPrice: that.data.curDayPrice,
            cur7DayPrice: that.data.cur7DayPrice,
            curMonthPrice: that.data.curMonthPrice,
        });

    },
    on_click_category: function(e) {
        var that = this;
        var type = e.currentTarget.dataset.type;
        var id = e.currentTarget.dataset.id;
        switch (type) {
            case 'mainmenu':
                that.setData({ main_menu: id });
                break;
            case 'submenu':
                that.setData({ sub_menu: id });
                break;
        }
        that.calculateStatistics();
    },
    on_click_codebutton: function(e) {
        var that = this;
        var type = e.currentTarget.dataset.type;
        switch (type) {
            case 'scancode':
                wx.scanCode({
                    //扫描条形码ISBN
                    success: function(res) {
                        // success
                        console.log(res.result);
                        that.setData({
                            scanCode: res.result
                        });
                    },
                    fail: function() {
                        // fail
                    },
                    complete: function() {
                        // complete
                    }
                });
                break;
            case 'confirmcode':
                wx.request({
                    url: app.globalData.mainURL + 'api/datamanage/checkGroupCode',
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data: {
                        'order_code': that.data.scanCode,
                        'is_apply': 0
                    },
                    success: function(res) {
                        if (!res.data.status) {
                            wx.showModal({
                                title: '核销失败',
                                content: res.data.result,
                                showCancel: false,
                                // confirmText: '是',
                                // cancelText: '否',
                                success: function(res) {

                                }
                            })
                            return;
                        }
                        that.data.checkedBookItem = res.data.result;
                        that.calculateStatistics();
                        that.setData({
                            show_confirm: true
                        });
                    }
                });
                break;
            case 'applycode':
                that.setData({
                    show_confirm: false
                });
                wx.request({
                    url: app.globalData.mainURL + 'api/datamanage/checkGroupCode',
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data: {
                        'order_code': that.data.scanCode,
                        'is_apply': 1
                    },
                    success: function(res) {
                        if (!res.data.status) {
                            wx.showModal({
                                title: '核销失败',
                                content: res.data.result,
                                showCancel: false,
                                // confirmText: '是',
                                // cancelText: '否',
                                success: function(res) {

                                }
                            })
                            return;
                        }
                        app.globalData.userInfo.user_id = 0;
                        that.onPrepare();
                        that.setData({
                            show_confirm: false
                        });
                    }
                });
                break;
            case 'cancelcode':
                that.setData({
                    show_confirm: false
                });
                break;
        }
    },
    on_select_date: function(e) {
        var that = this;
        var type = e.currentTarget.dataset.type;
        switch (type) {
            case 'analyse-date':
                that.setData({ show_calendar: true })
                break;
        }
    },
    on_select_month: function(e) {
        var that = this;

        var itemId = parseInt(e.target.dataset.id);
        var itemType = e.target.dataset.type;
        var itemValue = e.detail.value;
        var historyMonth = that.data.historyMonth;
        var analyseMonth = that.data.analyseMonth;
        var isNew = false;
        switch (itemType) {
            case 'history':
                historyMonth = [
                    itemValue[0] + that.data.baseDate[0],
                    itemValue[1] + that.data.baseDate[1]
                ];
                break;
            case 'analyse-month':
                analyseMonth = [
                    itemValue[0] + that.data.baseDate[0],
                    itemValue[1] + that.data.baseDate[1]
                ];
                break;
        }
        that.setData({
            historyMonth: that.data.historyMonth,
            analyseMonth: that.data.analyseMonth
        })
        that.calculateStatistics();
    },
    changeMonthColumn: function(e) {
        var that = this;
        var itemId = parseInt(e.target.dataset.id);
        var itemType = e.target.dataset.type;
        var itemValue = e.detail.value;

        var target = [];
        switch (itemType) {
            case 'history':
                target = that.data.historyMonth;
                break;
            case 'analyse-month':
                target = that.data.analyseMonth;
                break;
        }
        target[e.detail.column] = itemValue + that.data.baseDate[e.detail.column];

        that.setData({
            historyMonth: that.data.historyMonth,
            analyseMonth: that.data.analyseMonth
        })
    },
    on_input_code: function(e) {
        var that = this;
        var code = e.detail.value;
        that.setData({
            scanCode: code
        });
    },
    makeCalendar: function() {
        //获取当前年月  
        const date = new Date();
        const cur_year = date.getFullYear();
        const cur_month = date.getMonth() + 1;
        const cur_date = date.getDate();
        const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
        this.setData({
            cur_year: cur_year,
            cur_month: cur_month,
            cur_date: cur_date,
            old_year: cur_year,
            old_month: cur_month,
            old_date: cur_date,
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
        var curDate = new Date();
        var selectedDate = new Date(that.data.cur_year + '/' + that.data.cur_month + '/' + viewDate);
        if (selectedDate > curDate) return;

        that.data.cur_date = viewDate;
        that.onJudgeSign();
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
        var daysArr = that.data.days;
        for (var i = 0; i < daysArr.length; i++) {
            var item = daysArr[i]
            if (item.isDisabled) continue;
            if (item.date == that.data.cur_date) item.isSign = true;
            else item.isSign = false;
        }
        that.setData({
            days: daysArr,
            cur_year: that.data.cur_year,
            cur_month: that.data.cur_month,
            cur_date: that.data.cur_date,
        });
    },
    // 切换控制年月，上一个月，下一个月
    handleCalendar: function(e) {
        var that = this;
        var handle = e.currentTarget.dataset.handle;
        var cur_year = this.data.cur_year;
        var cur_month = this.data.cur_month;
        var cur_date = this.data.cur_date;
        switch (handle) {
            case 'cancel':
                cur_year = that.data.old_year;
                cur_month = that.data.old_month;
                cur_date = that.data.old_date;
                that.setData({ show_calendar: false });
            case 'confirm':
                that.data.old_year = cur_year;
                that.data.old_month = cur_month;
                that.data.old_date = cur_date;
                that.setData({ show_calendar: false });
                break;
            case 'prev':
                cur_date = 1;
                cur_month--;
                if (cur_month < 1) {
                    cur_year--;
                    cur_month = 12;
                }
                break;
            case 'next':
                cur_date = 1;
                cur_month++;
                if (cur_month > 12) {
                    cur_year++;
                    cur_month = 1;
                }
                break;
        }
        this.setData({
            cur_year: cur_year,
            cur_month: cur_month,
            cur_date: cur_date
        })
        this.calculateEmptyGrids(cur_year, cur_month);
        this.calculateStatistics();
    },
    makeNDigit: function(num, len) {
        num = num.toString();
        if (!len) len = 2;
        var ret = ''
        for (var i = 0; i < len; i++) {
            ret += '0';
        }
        ret += num;
        ret = ret.substr(-len);
        return ret;
    },
})
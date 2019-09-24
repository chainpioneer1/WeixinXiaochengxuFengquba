var app = getApp();

require('../../../utils/global.js');

Page({
    data: {
        site: [],
        rooturl: "../../../",
        event: [],
        isFavourite: false,
        pictures: [],
        eventType: [],
        options: [],
        userRole: [],
        eventState: [],
        cancel_time: 0,
        favourite_image: ['../../../image/favoriting.png', '../../../image/favorited.png'],
        image_favs: ['../../../image/good_n@2x.png', '../../../image/good_s@2x.png'],
        menu_btn_array: [
            "../../../image/btn_updown@2x.png",
            "../../../image/btn_updown_hover@2x.png"
        ],
        starparam: {
            stars: [0, 1, 2, 3, 4],

            srcImage_0: '../../../image/star-0.png',
            srcImage_1: '../../../image/star-1.png',
            srcImage_2: '../../../image/star-2.png',
            srcImage_3: '../../../image/star-3.png',
            srcImage_4: '../../../image/star-4.png',

            score: 5,
            srcImage: '',
        },
        weekStr: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        curDate: 0,
        curBossId: '',
        curUserId: '',
        dateList: [],
        timeList: [],
        roomList: [],
        weekList: [],
        bookList: [
            { "room_name": "一号场", "cost": "150", "status": "0" }, // status ==0:enabled, 1:disabled, 2:booked
            { "room_name": "二号场", "cost": "150", "status": "0" }, // status ==0:enabled, 1:disabled, 2:booked
            { "room_name": "三号场", "cost": "150", "status": "0" }, // status ==0:enabled, 1:disabled, 2:booked
            { "room_name": "四号场", "cost": "150", "status": "0" }, // status ==0:enabled, 1:disabled, 2:booked
            { "room_name": "五号场", "cost": "150", "status": "0" }, // status ==0:enabled, 1:disabled, 2:booked
            { "room_name": "六号场", "cost": "150", "status": "0" }, // status ==0:enabled, 1:disabled, 2:booked
        ],
        totalPrice: 0,
        originalPrice: 0,
        tmrID: 0,
        isFirstInit: true,
        main_menu: 0,
        futureWeek: 1,
        stStr: {
            disabled: 0,
            booked: 1,
            enabled: 2,
            cancelled: 3,
            activated: 4,
            selected: 5,
            mine: 0,
            nouser: -1
        },
        room_info_notify: ''
    },
    onLoad: function(option) {
        var that = this;
        // option.id = 1263;
        that.data.options = option;
        that.data.curBossId = option.id;
        that.data.curUserId = app.globalData.userInfo.user_id;
        that.data.curDate = new Date();
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
    onInitStart: function(options) {
        var options = this.data.options;
        this.setData({
            eventType: app.globalData.eventType,
            userRole: app.globalData.userRole,
            bookingState: app.globalData.eventState,
            eventState: app.globalData.eventState
        });
        var id = this.data.curBossId;
        var that = this;

        wx.request({
            url: app.globalData.mainURL + 'api/getSiteDetail',
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            data: {
                'boss_id': id,
                'user_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                // console.log(res.data);
                if (res.data.status) {
                    that.data.site = res.data;
                    that.makeList();
                }
            },
            complete: function() {
                wx.hideLoading({});
            }
        })
        var futureWeekArr = [];
        for (var i = 0; i <= 52; i++) {
            futureWeekArr.push(i);
        }
        that.setData({
            futureWeekArr: futureWeekArr
        })
    },

    makeList: function() {

        var that = this;
        var da = new Date();
        var data = that.data.site;
        var cur = that.data.curDate;
        that.data.refDate = that.data.curDate.toDateString() + ' ';
        var weekStr = that.data.weekStr;
        that.data.dateList = [];
        var site = data.site[0];
        var service_time = site.service_time.split(',');
        var isFirstDate = true;
        for (var index = 0; index < 365; index++) {
            var year = da.getFullYear();
            var month = da.getMonth() + 1;
            var day = da.getDate();
            var isExist = false;
            for (var mm = 0; mm < service_time.length; mm++) {
                if (da.getDay() == (parseInt(service_time[mm]) % 7)) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                if (isFirstDate && that.data.curDate.toDateString() == da.toDateString()) {
                    da.setDate(da.getDate() + 1);
                    that.data.curDate = new Date(da.toDateString());
                    that.data.refDate = that.data.curDate.toDateString() + ' ';
                } else {
                    da.setDate(da.getDate() + 1);
                }
                continue;
            }
            isFirstDate = false;
            var str = '';
            var isToday = '';
            if (day == (new Date()).getDate() && month == (new Date()).getMonth() + 1) {
                str += '今天 (';
            }
            if (day == that.data.curDate.getDate() && month == that.data.curDate.getMonth() + 1) {
                isToday = 'cur';
            }

            str += year + '年' + month + '月' + day + '日';
            if (day == (new Date()).getDate() && month == (new Date()).getMonth() + 1) {
                str += ')';
            }
            that.data.dateList.push({
                date: str,
                dateIndex: index,
                istoday: isToday,
                weekday: weekStr[da.getDay()]
            });

            da.setDate(da.getDate() + 1);
        }
        // console.log(that.data.dateList);
        that.data.priceDateList = [];
        da = new Date();
        for (var i = 0; i < 7; i++) {
            var isExist = false;
            for (var mm = 0; mm < service_time.length; mm++) {
                if (i == (parseInt(service_time[mm]) % 7)) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist) continue;
            var isToday = '';
            if (i == that.data.curDate.getDay()) {
                isToday = 'cur';
            }
            that.data.priceDateList.push({
                date: '',
                dateIndex: i,
                istoday: isToday,
                weekday: weekStr[i]
            })
        }

        that.data.cancel_time = site.cancel_time;
        var room = data.site_room;
        var booking = data.site_booking;
        var boss_room = data.boss_room;

        var start1_time = new Date(that.data.refDate + ' ' + site.start1);
        var end1_time = new Date(that.data.refDate + site.end1);
        var start2_time = new Date(that.data.refDate + site.start2);
        var end2_time = new Date(that.data.refDate + site.end2);
        var diff1 = end1_time.getHours() - start1_time.getHours();
        var diff2 = end2_time.getHours() - start2_time.getHours();
        var time_step = parseFloat(site.service_unit); // unit:hour

        that.data.timeList = [];

        var tmp = new Date(start1_time.toString());
        for (var i = 0; i < diff1 + time_step; i += time_step) {
            if (tmp > end1_time) tmp = new Date(end1_time.toString());
            var hr = tmp.getHours();
            var min = tmp.getMinutes();
            that.data.timeList.push(that.setDigit(hr, 2) + ':' + that.setDigit(min, 2));
            tmp.setTime(tmp.getTime() + time_step * 3600000);
        }
        var tmp = new Date(start2_time.toString());
        for (var i = 0; i < diff2 + time_step; i += time_step) {
            if (i == 0 && site.end1 == site.start2) {
                tmp.setTime(tmp.getTime() + time_step * 3600000);
                continue;
            }
            if (tmp > end2_time) tmp = new Date(end2_time.toString());
            var hr = tmp.getHours();
            var min = tmp.getMinutes();
            that.data.timeList.push(that.setDigit(hr, 2) + ':' + that.setDigit(min, 2));
            tmp.setTime(tmp.getTime() + time_step * 3600000);
        }

        that.data.roomList = [];
        that.data.bookList = [];
        that.data.priceList = [];

        for (var i = 0; i < room.length; i++) {
            that.data.roomList.push(room[i].room_name);
        }

        that.data.totalPrice = 0;
        var ST = that.data.stStr;
        for (var kk = 0; kk < that.data.timeList.length - 1; kk++) {
            var arr = [];
            var arr1 = [];
            for (var i = 0; i < room.length; i++) {
                var cost = room[i].cost;
                var priceUserId = room[i].user_id;
                var priceStatus = ST.enabled;
                var priceCost = cost + '';

                var status = ST.disabled; // 0 - disabled, 1- booked, 2- enabled, 4- active time

                var curstart = new Date(that.data.refDate + that.data.timeList[kk]);
                var curend = new Date(that.data.refDate + that.data.timeList[kk + 1]);

                // if current time is in service period then change status to booked
                if (curstart >= start1_time && curend <= end1_time) {
                    status = ST.booked;
                    room[i].user_id = ST.nouser;
                }
                if (curstart >= start2_time && curend <= end2_time) {
                    status = ST.booked;
                    room[i].user_id = ST.nouser;
                }

                // if current time is service time, then change status to enabled
                if (status != ST.disabled) {
                    for (var mm = 0; mm < service_time.length; mm++) {
                        if (curstart.getDay() == (parseInt(service_time[mm]) % 7)) {
                            status = ST.enabled;
                            break;
                        }
                    }
                }
                // if current status is booked, then change status to disabled
                if (status == ST.booked) status = ST.disabled;

                // if current cell is already user booked, then change status to disabled
                if (status != ST.disabled) {

                    for (var jj = 0; jj < boss_room.length; jj++) {
                        var bookRecord = JSON.parse(boss_room[jj].room_info);
                        if (curstart < (new Date(boss_room[jj].active_date.replace(/-/g, '/') + ' 00:00:00')) ||
                            boss_room[jj].info_type != 0) continue;
                        var isBreak = false;
                        for (var mm = 0; mm < bookRecord.length; mm++) {
                            var item = bookRecord[mm];
                            if (item.room_id != room[i].id) continue; // if current room is not matched then continue

                            // if service time is active time, then change status to active
                            if (curstart >= (new Date(boss_room[jj].active_date.replace(/-/g, '/') + ' ' + item.start_time)) &&
                                curend <= (new Date(boss_room[jj].active_date.replace(/-/g, '/') + ' ' + item.end_time))) {
                                status = ST.activated;
                                cost = item.cost;
                                room[i].user_id = 0;
                                room[i].book_id = boss_room[jj].id;
                                isBreak = true;
                                break;
                            }
                        }
                        if (isBreak) break;
                    }

                    for (var jj = 0; jj < boss_room.length; jj++) {
                        var bookRecord = JSON.parse(boss_room[jj].room_info);
                        var priceStart = new Date(curstart.toLocaleString());
                        priceStart.setDate(priceStart.getDate() + 7);
                        if (priceStart < (new Date(boss_room[jj].active_date.replace(/-/g, '/') + ' 00:00:00')) ||
                            priceStart.getDay() != (new Date(boss_room[jj].active_date.replace(/-/g, '/') + ' 00:00:00')).getDay() ||
                            boss_room[jj].info_type == 0) continue;
                        var isBreak = false;
                        for (var mm = 0; mm < bookRecord.length; mm++) {
                            var item = bookRecord[mm];
                            if (item.room_id != room[i].id) continue; // if current room is not matched then continue

                            // if service time is active time, then change status to active
                            if (curstart >= (new Date(that.data.refDate + ' ' + item.start_time)) &&
                                curend <= (new Date(that.data.refDate + ' ' + item.end_time))) {
                                priceCost = item.cost;
                                if (curstart >= (new Date(boss_room[jj].active_date.replace(/-/g, '/') + ' 00:00:00'))) {
                                    cost = priceCost;
                                }
                                priceUserId = ST.mine;
                                priceStatus = ST.disabled;
                                isBreak = true;
                                break;
                            }
                        }
                        if (isBreak) break;
                    }

                    for (var jj = 0; jj < booking.length; jj++) {
                        var bookRecord = JSON.parse(booking[jj].book_info);
                        var isBreak = false;
                        if (booking[jj].state == ST.cancelled) continue; // if order is cancelled then continue
                        for (var mm = 0; mm < bookRecord.length; mm++) {
                            var item = bookRecord[mm];
                            if (item.room_id != room[i].id) continue; // if current room is not matched then continue
                            if (item.state == ST.cancelled) continue; // if cell status is canceled then continue

                            // if service time is active time, then change status to active
                            if (curstart >= (new Date(item.start_time.replace(/-/g, '/'))) &&
                                curend <= (new Date(item.end_time.replace(/-/g, '/')))) {
                                status = ST.activated;
                                cost = -cost;
                                room[i].user_id = item.user_id;
                                room[i].book_id = booking[jj].id;
                                isBreak = true;
                                break;
                            }
                        }
                        if (isBreak) break;
                    }
                }

                // if cell's end time is passed now, then change status to disabled
                if (curend < new Date()) {
                    status = ST.disabled;
                    room[i].user_id = ST.nouser;
                }

                // if already booked by other person or active time, then change status to disabled
                if ((status == ST.booked || status == ST.activated) && room[i].user_id != app.globalData.userInfo.user_id)
                    status = ST.disabled;

                var rD = new Date(that.data.refDate);
                var dateString = rD.getFullYear() + '年' + (rD.getMonth() + 1) + '月' + rD.getDate() + '日';
                arr.push({
                    cost: cost,
                    status: status,
                    room_id: room[i].id,
                    book_id: room[i].book_id,
                    user_id: room[i].user_id,
                    start_time: curstart.getTime(),
                    end_time: curend.getTime(),
                });
                arr1.push({
                    cost: Math.abs(priceCost * 1).toFixed(2),
                    status: priceStatus,
                    room_id: room[i].id,
                    user_id: priceUserId,
                    start_time: curstart.getTime(),
                    end_time: curend.getTime(),
                });
                if (status == 1) that.data.totalPrice += parseFloat(cost);
            }
            that.data.originalPrice = that.data.totalPrice;

            that.data.bookList.push(arr);
            that.data.priceList.push(arr1);
        }
        // console.log(that.data.bookList);
        that.data.sellDateList = that.data.dateList;
        if (that.data.main_menu == '1') that.data.dateList = that.data.priceDateList;
        that.setData({
            dateList: that.data.dateList,
            roomList: that.data.roomList,
            timeList: that.data.timeList,
            bookList: that.data.bookList,
            priceList: that.data.priceList,
        });
    },
    on_click_category: function(e) {
        var that = this;
        var type = e.currentTarget.dataset.type;
        var id = e.currentTarget.dataset.id;
        var dateList = (id == 0) ? that.data.sellDateList : that.data.priceDateList;
        switch (type) {
            case 'mainmenu':
                that.setData({ main_menu: id, dateList: dateList });
                break;
            case 'submenu':
                that.setData({ sub_menu: id });
                break;
        }
    },
    on_input_price: function(e) {
        var value = parseFloat(e.detail.value);
        if (value == NaN) value = '';
        this.setData({
            priceInput: value,
        });
    },
    changeFutureWeek(e) {
        this.setData({ futureWeek: parseInt(e.detail.value) + 1 });
    },
    bookRoom: function(event) {
        var that = this;
        var param = event.target.id;
        var roomid = parseInt(param.split('-')[1]);
        var timeid = parseInt(param.split('-')[0]);
        var start = that.data.timeList[timeid];
        var end = that.data.timeList[timeid + 1];
        var room = that.data.bookList[timeid][roomid];
        if (that.data.main_menu != 0) room = that.data.priceList[timeid][roomid];
        var ST = that.data.stStr;
        switch (room.status) {
            case ST.activated: // if current cell is in activated time
            case ST.disabled: // if old disabled
                if (room.user_id == ST.mine || that.data.main_menu != 0) {
                    room.status = ST.selected; // change status to selected
                }
                break;
            case ST.selected: // if old booked
                if (room.user_id == ST.mine || room.user_id == app.globalData.userInfo.user_id) {
                    room.status = ST.disabled; // change status to enabled
                }
                break;
            case ST.booked: // if old booked
                if (room.user_id == ST.mine || room.user_id == app.globalData.userInfo.user_id) {
                    room.status = ST.enabled; // change status to enabled
                }
                break;
            case ST.enabled: // if old available 
                room.status = ST.booked;
                room.user_id = ST.mine;
                room.book_id = (!room.book_id) ? '' : room.book_id;
                break;
        }
        that.setData({
            bookList: that.data.bookList,
            priceList: that.data.priceList,
            room_info_notify: ''
        })
        var selectedCnt = 0;
        var selectedRoom = {};
        for (var i = 0; i < that.data.bookList.length; i++) {
            for (var j = 0; j < that.data.bookList[i].length; j++) {
                if (that.data.bookList[i][j].status == ST.selected || that.data.bookList[i][j].status == ST.booked) {
                    selectedCnt++;
                    selectedRoom = that.data.bookList[i][j];
                }
            }
        }
        if (selectedCnt != 1) return;
        console.log(selectedRoom);
        var boss_room = that.data.site.boss_room;
        var total_start = '';
        var total_end = '';
        var total_dates = [];
        var baseDate = '2000/01/01 ';
        for (var i = 0; i < boss_room.length; i++) {
            var item = boss_room[i];
            var room_info = JSON.parse(item.room_info);
            var roomItem = room_info.find(function(a) {
                return a.room_id == selectedRoom.room_id &&
                    (new Date(selectedRoom.start_time)).toTimeString() == (new Date(baseDate + a.start_time)).toTimeString() &&
                    (new Date(selectedRoom.end_time)).toTimeString() == (new Date(baseDate + a.end_time)).toTimeString()
            });
            if (roomItem) {
                var actDate = new Date(item.active_date.replace(/-/g, '/'));
                total_dates.push({
                    date: actDate.getFullYear() + '年' + (actDate.getMonth() + 1) + '月' + actDate.getDate() + '日',
                    cmp: actDate,
                    dayNum: actDate.getDay()
                });
            }
        }
        var room_info_notify = '';
        if (total_dates.length > 0) {
            var filtered = total_dates.filter(function(a) { return a.dayNum == that.data.curDate.getDay(); });
            if (filtered.length > 0) room_info_notify += filtered[0].date;
            var k = 0;
            for (var i = 0; i < filtered.length - 1; i++) {
                var item = filtered[i];
                var stt = item.cmp.setDate(item.cmp.getDate() + 7);
                var ent = filtered[i + 1].cmp.getTime();
                k++;
                if (stt == ent) continue;

                if (k == 1) {
                    if (room_info_notify != '') room_info_notify += ', ';
                    room_info_notify += filtered[i + 1].date;
                } else {
                    room_info_notify += '~' + filtered[i].date;
                    room_info_notify += '(共' + (k) + '周)';

                    room_info_notify += ', ' + filtered[i + 1].date;
                }
                k = 0;
            }
            if (k >= 1) {
                room_info_notify += '~' + filtered[filtered.length - 1].date;
                room_info_notify += '(共' + (k + 1) + '周)';
            }

        }

        if (room_info_notify == '') room_info_notify = '可出售';
        that.setData({
            room_info_notify: room_info_notify
        });
    },
    on_submit: function(e) {
        var that = this;
        var type = e.currentTarget.dataset.type;
        switch (type) {
            case 'update':
                that.confirmUpdate(e);
                break;
            case 'confirm':
                wx.showModal({
                    title: '提示',
                    content: '是否更新到修改后的状态?',
                    confirmText: '确定',
                    cancelText: '取消',
                    success: function(res) {
                        if (res.confirm) {
                            that.confirmUpdate(e);
                        }
                    }
                });
                break;
        }
    },

    confirmUpdate: function(e) {
        var that = this;
        var ST = that.data.stStr;
        var type = e.currentTarget.dataset.type;
        var price = parseFloat(that.data.priceInput);
        if (!price) price = '0';
        else price = price.toFixed(2);
        that.setData({ priceInput: price });
        var bookList = that.data.bookList;
        if (that.data.main_menu != 0) bookList = that.data.priceList;
        if (that.data.main_menu == 0 && that.data.futureWeek == 1 && type == 'update') {
            for (var i = 0; i < bookList.length; i++) {
                var rowItem = bookList[i];
                for (var j = 0; j < rowItem.length; j++) {
                    var item = rowItem[j];
                    if (item.user_id == ST.mine && item.status == ST.booked) {
                        item.status = ST.enabled;
                    }
                    if (item.user_id == ST.mine && item.status == ST.selected) {
                        item.status = ST.enabled;
                    }
                }
            }
        } else if (type == 'update' || that.data.main_menu == 1) {
            for (var i = 0; i < bookList.length; i++) {
                var rowItem = bookList[i];
                for (var j = 0; j < rowItem.length; j++) {
                    var item = rowItem[j];
                    if (item.user_id == ST.mine && (item.status == ST.booked || item.status == ST.selected)) {
                        item.cost = price;
                        //that.data.bookList[i][j].cost = price;
                        if (type == 'update') {
                            item.status = ST.disabled;
                        }
                    }
                }
            }
        }
        that.setData({ bookList: that.data.bookList, priceList: that.data.priceList });
        switch (type) {
            case 'update':
                break;
            case 'confirm':
                that.applyBooking();
                break;
        }
    },
    applyBooking: function() {
        var that = this;
        var bookData = that.data.bookList;
        if (that.data.main_menu != 0) bookData = that.data.priceList;
        var uploads = [];
        var curTime = new Date();
        var ST = that.data.stStr;

        for (var i = 0; i < bookData.length; i++) {
            var element = [];
            element.push(bookData[i]);
            element = element[0];
            for (var j = 0; j < element.length; j++) {
                var item = [];
                item.push(element[j]);
                item = item[0];
                // if (item.user_id == app.globalData.userInfo.user_id && (item.status == 1 || item.status == 4)) {
                if (item.user_id == ST.mine && (item.status == ST.selected || item.status == ST.booked)) {
                    var start = new Date(item.start_time);
                    var end = new Date(item.end_time);
                    var uploadItem = {};
                    uploadItem.room_id = item.room_id;
                    uploadItem.start_time = start.getHours() + ':' + start.getMinutes() + ':' + start.getSeconds();
                    uploadItem.end_time = end.getHours() + ':' + end.getMinutes() + ':' + end.getSeconds();
                    uploadItem.cost = item.cost;
                    uploads.push(uploadItem);
                }
            }
        }
        uploads.sort(function(a, b) { return (parseInt(a.room_id) > parseInt(b.room_id)) ? 1 : -1; });
        uploads.sort(function(a, b) {
            if (parseInt(a.room_id) > parseInt(b.room_id)) return 1;
            else if (parseInt(a.room_id) < parseInt(b.room_id)) return -1;
            else
                return (a.start_time > b.start_time) ? 1 : -1;
        });
        that.order_booking(uploads);
        return;
    },

    order_booking: function(room_info) {
        var that = this;
        var active_date = new Date(that.data.refDate + ' 08:00:00');
        var clear_date = new Date(that.data.refDate + ' 08:00:00');
        var info_type = 0;
        var infoLen = that.data.futureWeek - 1;
        if (that.data.main_menu != 0) {
            active_date.setDate(active_date.getDate() + 7);
            info_type = 1;
            infoLen = 1;
        }
        var dbItems = [];
        var clearItems = [];

        for (var i = 0; i < 52; i++) {
            clearItems.push({
                boss_id: that.data.curBossId,
                info_type: info_type,
                active_date: clear_date.getTime(),
                room_info: room_info,
            })
            clear_date.setDate(clear_date.getDate() + 7);
        }
        for (var i = 0; i < infoLen; i++) {
            dbItems.push({
                boss_id: that.data.curBossId,
                info_type: info_type,
                active_date: active_date.getTime(),
                room_info: room_info,
            })
            active_date.setDate(active_date.getDate() + 7);
        }
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/bossRoomBooking',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: { room_info: dbItems, clear_info: clearItems },
            success: function(res) {
                // wx.showModal({
                //     content:JSON.stringify(res.data)             
                // })
                // return;

                if (res.data.status) {
                    //wx.navigateBack({ delta: 1 });
                    that.onInitStart();
                }
            },
            complete: function() {
                wx.hideLoading({});
            }
        })
    },
    selectDate: function(event) {
        var that = this;
        var type = event.currentTarget.dataset.type;
        switch (type) {
            case 'container':
                that.setData({ weekday_picker: true })
                break;
            case 'picker':
                var id = event.currentTarget.id;
                id = parseInt(id.split('-')[1]);
                if (that.data.main_menu == '1') id -= (new Date()).getDay();
                that.data.curDate = (new Date()).setDate((new Date()).getDate() + id);
                that.data.curDate = new Date(that.data.curDate);
                that.makeList();
            case 'back':
                that.setData({ weekday_picker: false });
                break;
        }
    },
    setDigit: function(num, length) {
        var r = "" + num;
        while (r.length < length) {
            r = "0" + r;
        }
        return r;
    },
    pushMsg: function(e) {
        var that = this;
        var formId = e.detail.formId;
        var curTime = new Date();
        var openid = wx.getStorageSync('openid');
        var data = {
            touser: 'oMH3D5DjR7NT_QQD1FAsbN3w0lK4',
            template_id: app.globalData.templateIds.pay_success,
            page: 'pages/index/index',
            form_id: '1548690784098',
            data: {
                keyword1: { value: '足球活动', color: '#000' },
                keyword2: { value: '辽宁省丹东市', color: '#000' },
                keyword3: { value: '2019-01-29', color: '#000' },
                keyword4: { value: '发起人', color: '#000' },
                keyword5: { value: '3', color: '#000' },
                keyword6: { value: '3', color: '#000' },
                keyword7: { value: '1', color: '#000' },
            },
            color: '#ff0000',
            emphasis_keyword: 'keyword1.DATA',
        };
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/sendWxMessage',
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            data: {
                openid: openid,
                data: data
            },
            success: function(res) {
                // console.log(res.data);
                wx.showModal({
                    title: '发送成功',
                    content: formId + ',' + JSON.stringify(res)
                })
            }
        })

    },
});
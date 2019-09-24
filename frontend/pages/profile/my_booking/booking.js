// pages/booking/booking.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        active1: "active",
        active2: "",
        active3: "",
        booking: [],
        selectedtab: 1,
        eventType: [],
        userRole: [],
        bookingState: ["已支付", "进行中", "已完成", "已取消", "待支付"],
        nameLen: [14, 10], // maximum ellipse length(user, boss)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(query) {
        this.setData({
            userInfo: app.globalData.userInfo,
            eventType: app.globalData.eventType,
            userRole: app.globalData.userRole
        });

    },
    onShow: function() {
        var that = this;
        var active_tab = app.globalData.selected_booking_tab;
        switch (active_tab) {
            case 0:
                that.setData({
                    selectedtab: 1,
                    active1: "active",
                    active2: "",
                    active3: ""
                })
                break;
            case 1:
                that.setData({
                    selectedtab: 2,
                    active1: "",
                    active2: "active",
                    active3: ""
                })
                break;
            case 2:
                that.setData({
                    selectedtab: 3,
                    active1: "",
                    active2: "",
                    active3: "active"
                })
                break;
            default:
                break;
        }
        //return;
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/getMyRoomBooking',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'user_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                that.data.booking = [];
                if (res.data.status == true) {
                    console.log(res.data)
                    var book = res.data.result;
                    var rooms = res.data.rooms;
                    var bossgroups = res.data.bossgroups;

                    if (book != null) {
                        for (var index = 0; index < book.length; index++) {
                            var item = book[index];
                            item.start_time = item.start_time.split(' ')[0];
                            item.end_time = item.end_time.split(' ')[0];
                            if (item.book_type == 1) {
                                var bossgroup = bossgroups.find(function(a) { return a.no == item.bossgroup_id; })
                                if (bossgroup) {
                                    item.site_name = bossgroup.group_package;
                                }
                            }
                            if (item.site_name.length > that.data.nameLen[0]) {
                                var site_name = book[index].site_name
                                site_name = site_name.slice(0, that.data.nameLen[0]) + '...'
                                item.site_name = site_name
                            }

                            if (item.is_rating == null) {
                                item.is_rating = 0;
                            }
                            item.roll_state = 0; //my room booked state

                            var book_info = JSON.parse(item.book_info);
                            if (item.book_type == 0) {
                                book_info.sort(function(a, b) { return (parseInt(a.room_id) > parseInt(b.room_id)) ? 1 : -1; });
                                book_info.sort(function(a, b) {
                                    if (parseInt(a.room_id) > parseInt(b.room_id)) return 1;
                                    else if (parseInt(a.room_id) < parseInt(b.room_id)) return -1;
                                    else
                                        return ((new Date(a.start_time.replace(/-/g, '/'))) > (new Date(b.start_time.replace(/-/g, '/')))) ? 1 : -1;
                                });
                                for (var j = 0; j < book_info.length; j++) {
                                    var tempdate;
                                    tempdate = book_info[j].end_time.split(" ")
                                    book_info[j].end_time = tempdate[1];

                                    var time = book_info[j].start_time.split(':');
                                    book_info[j].start_time = time[0] + ':' + time[1];

                                    var time1 = book_info[j].end_time.split(':');
                                    book_info[j].end_time = time1[0] + ':' + time1[1];

                                    for (var kk = 0; kk < rooms.length; kk++) {
                                        if (book_info[j].room_id == rooms[kk].id) {
                                            book_info[j].room_name = rooms[kk].room_name + '';
                                            if (j > 0 && book_info[j].room_id == book_info[j - 1].room_id)
                                                book_info[j].room_name = '';
                                            break;
                                        }
                                    }
                                }
                            }
                            item.book_info = book_info;
                        }
                        console.log(book);
                        that.data.booking = book;
                    }
                }
                wx.request({
                    url: app.globalData.mainURL + 'api/datamanage/getRoomBookingByBossID',
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data: {
                        'user_id': app.globalData.userInfo.user_id
                    },
                    success: function(res1) {
                        if (res1.data.status == false) {
                            that.setData({ booking: that.data.booking });
                            return;
                        }
                        var book_order = res1.data.result;
                        var bossgroups = res1.data.bossgroups;
                        if (book_order != null) {
                            for (var index = 0; index < book_order.length; index++) {
                                var item = book_order[index];

                                item.start_time = item.start_time.split(' ')[0];
                                item.end_time = item.end_time.split(' ')[0];

                                if (item.book_type == 1) {
                                    var bossgroup = bossgroups.find(function(a) { return a.no == item.bossgroup_id; })
                                    if (bossgroup) {
                                        item.site_name = bossgroup.group_package;
                                    }
                                }

                                if (item.site_name.length > that.data.nameLen[1]) {
                                    var site_name = item.site_name
                                    site_name = site_name.slice(0, that.data.nameLen[1]) + '...'
                                    item.site_name = site_name
                                }
                                if (item.is_rating == null) {
                                    item.is_rating = 0;
                                }
                                item.site_name += "(商家)";
                                // var time = item.start_time.split(':');
                                // item.start_time = time[0] + ':' + time[1];

                                // var time1 = item.end_time.split(':');
                                // item.end_time = time1[0] + ':' + time1[1];
                                item.roll_state = 1; //my room booked state

                                var book_info = JSON.parse(item.book_info);
                                if (item.book_type == 0) {
                                    book_info.sort(function(a, b) { return (parseInt(a.room_id) > parseInt(b.room_id)) ? 1 : -1; });
                                    book_info.sort(function(a, b) {
                                        if (parseInt(a.room_id) > parseInt(b.room_id)) return 1;
                                        else if (parseInt(a.room_id) < parseInt(b.room_id)) return -1;
                                        else
                                            return ((new Date(a.start_time.replace(/-/g, '/'))) > (new Date(b.start_time.replace(/-/g, '/')))) ? 1 : -1;
                                    });
                                    for (var j = 0; j < book_info.length; j++) {
                                        var tempdate;
                                        tempdate = book_info[j].end_time.split(" ")
                                        book_info[j].end_time = tempdate[1];

                                        var time = book_info[j].start_time.split(':');
                                        book_info[j].start_time = time[0] + ':' + time[1];

                                        var time1 = book_info[j].end_time.split(':');
                                        book_info[j].end_time = time1[0] + ':' + time1[1];

                                        for (var kk = 0; kk < rooms.length; kk++) {
                                            if (book_info[j].room_id == rooms[kk].id) {
                                                book_info[j].room_name = rooms[kk].room_name + '';
                                                if (j > 0 && book_info[j].room_id == book_info[j - 1].room_id)
                                                    book_info[j].room_name = '';
                                                break;
                                            }
                                        }
                                    }
                                }
                                item.book_info = book_info;
                                that.data.booking.push(item);

                            }
                        }
                        // that.setData({
                        //     booking: that.data.booking
                        // })
                        console.log(that.data.booking);
                        that.showevent(0)
                    }
                })
            }
        })
    },
    showevent: function(tabtype) {
        var book = this.data.booking
        if (book == null) return
        if (book.length < 2) {
            this.setData({
                booking: book,
            })
            return;
        }
        var temp
        console.log(book[0].start_time > book[1].start_time)
        if (tabtype == 0) {
            book.sort(function(a, b) {
                return ((new Date(a.submit_time.replace(/-/g, '/'))) > (new Date(b.submit_time.replace(/-/g, '/')))) ? 1 : -1;
            });
            // for (var i = 0; i < book.length - 1; i++) {
            //     for (var j = i + 1; j < book.length; j++) {
            //         if (book[i].start_time < book[j].start_time) {
            //             temp = book[i]
            //             book[i] = book[j]
            //             book[j] = temp
            //         }
            //     }
            // }
        }
        if (tabtype == 1) {
            book.sort(function(a, b) {
                return ((new Date(a.submit_time.replace(/-/g, '/'))) > (new Date(b.submit_time.replace(/-/g, '/')))) ? 1 : -1;
            });
            // for (var i = 0; i < book.length - 1; i++) {
            //     for (var j = i + 1; j < book.length; j++) {
            //         if (book[i].end_time < book[j].end_time) {
            //             temp = book[i]
            //             book[i] = book[j]
            //             book[j] = temp
            //         }
            //     }
            // }
        }
        this.setData({
            booking: book
        })
    },
    /**
     * This function is called after user select one of the tabs
     */
    selectTab: function(event) {
        this.setData({ active1: " " });
        this.setData({ active2: " " });
        this.setData({ active3: " " });
        switch (event.currentTarget.id) {
            case "btn1":
                this.setData({ active1: "active" });
                this.setData({ selectedtab: 1 });
                app.globalData.selected_booking_tab = 0;
                this.showevent(0)
                break;
            case "btn2":
                this.setData({ active2: "active" });
                this.setData({ selectedtab: 2 });
                app.globalData.selected_booking_tab = 1;
                this.showevent(1)
                break;
            case "btn3":
                this.setData({ active3: "active" });
                this.setData({ selectedtab: 3 });
                app.globalData.selected_booking_tab = 2;
                this.showevent(2)
                break;
        }
    },
    //called when user wants to see detail
    click_detail_event: function(event) {
        var bossId = event.currentTarget.dataset.boss;
        var id = event.currentTarget.id;
        var status = event.currentTarget.dataset.status;
        var site_name = event.currentTarget.dataset.name;
        var type = event.currentTarget.dataset.type;
        if (type == 0) {
            if (status == '4' && site_name.indexOf('(商家)') == -1)
                wx.navigateTo({
                    url: 'booking_user_detail?id=' + bossId + '&book=' + id,
                })
            else
                wx.navigateTo({
                    url: 'booking_detail?id=' + id,
                })
        } else {
            if (status == '4' && site_name.indexOf('(商家)') == -1)
                wx.navigateTo({
                    url: '../../index/bossgroup_input/bossgroup_input?id=' + id,
                })
            else if (site_name.indexOf('(商家)') == -1)
                wx.navigateTo({
                    url: '../../index/detail_bossgroup/mybossgroup_mine?id=' + id,
                })
            else
                wx.navigateTo({
                    url: '../../index/detail_bossgroup/mybossgroup?id=' + id,
                })
        }
    },
    //called when user wants to write comment
    btn_write_comment: function(event) {
        var index = event.currentTarget.id;
        wx.navigateTo({
            url: 'book_evaluation?id=' + this.data.booking[index].id + '&room_id=' + this.data.booking[index].room_id
        })
    }
})
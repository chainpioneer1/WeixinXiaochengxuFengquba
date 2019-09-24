// pages/booking/booking.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        uploadURL: app.globalData.uploadURL,
        active1: "active",
        active2: "",
        active3: "",
        booking: [],
        selectedtab: 0,
        eventType: [],
        userRole: [],
        bookingState: [],
        image_favs: ["../../../image/good_n@2x.png", "../../../image/good_s@2x.png"],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(query) {
        this.setData({
            userInfo: app.globalData.userInfo,
            eventType: app.globalData.eventType,
            userRole: app.globalData.userRole,
            bookingState: app.globalData.eventState
        });
        var that = this;
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/getMyBooking1',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'user_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                if (res.data.status == false) return

                var book = res.data.result;
                var favor = res.data.favor;
                var reg_num = res.data.register_num;
                if (book != null) {
                    for (var index = 0; index < book.length; index++) {
                        book[index].picture = book[index].pic.split(",");
                        book[index].pic = book[index].pic.split(",")[0];
                        book[index].avatar = app.globalData.uploadURL + book[index].pic;
                        book[index].favor_num = favor[index];
                        book[index].reg_num = parseInt(reg_num[index]);

                        if (book[index].favor_state == null) {
                            book[index].favor_state = 0;
                            book[index].idshow = '0000000000'
                            book[index].idshow = book[index].idshow.slice(0, 10 - book[index].id.length) + book[index].id
                        }
                        if (book[index].name.length > 15) {
                            var name = book[index].name
                            name = name.slice(0, 15) + '...'
                            book[index].name = name
                        }
                        var time = book[index].start_time.split(':');
                        book[index].start_time = time[0] + ':' + time[1];

                        var time1 = book[index].end_time.split(':');
                        book[index].end_time = time1[0] + ':' + time1[1];
                        that.data.booking = book.filter(item => item.owner == '0')
                    }
                    console.log(res.data);
                    console.log(that.data.booking);
                    that.showevent(0)
                }
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
            for (var i = 0; i < book.length - 1; i++) {
                for (var j = i + 1; j < book.length; j++) {
                    if (book[i].start_time < book[j].start_time) {
                        temp = book[i]
                        book[i] = book[j]
                        book[j] = temp

                    }
                }
            }
        }
        if (tabtype == 1) {
            for (var i = 0; i < book.length - 1; i++) {
                for (var j = i + 1; j < book.length; j++) {
                    if (book[i].end_time < book[j].end_time) {
                        temp = book[i]
                        book[i] = book[j]
                        book[j] = temp
                    }
                }
            }
        }
        this.setData({
            booking: book,
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
                this.setData({ selectedtab: 0 });
                this.showevent(0)
                break;
            case "btn2":
                this.setData({ active2: "active" });
                this.setData({ selectedtab: 1 });
                this.showevent(1)
                break;
            case "btn3":
                this.setData({ active3: "active" });
                this.setData({ selectedtab: 2 });
                this.showevent(2)
                break;
        }
    },
    //called when user wants to see detail
    click_detail_event: function(event) {
        wx.navigateTo({
            url: 'event_detail?id=' + event.currentTarget.id,
        })
    },
})
// pages/booking/bookingCancel.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        uploadURL: app.globalData.uploadURL,
        img_black_start_src: '../../../image/star_n@2x.png',
        img_yellow_start_src: '../../../image/star_s@2x.png',
        count_yellowStar: 3,
        booking: [],
        eventType: [],
        userRole: [],
        bookingState: [],
        register_num: 0,
        bookingcanceltime: 1,
        field_opt: ["姓名", "电话", "单位", "俱乐部", "性别", "身份证号", "所在城市", "所在大学院系", "职业", "地址", "邮箱", "上传图片"],
        val_opt: ["", "", "", "", "", "", "", "", "", "", "", ""],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(query) {
        this.setData({
            eventType: app.globalData.eventType,
            userRole: app.globalData.userRole,
            bookingState: app.globalData.eventState
        });
        var that = this;
        var id = query.id;

        wx.request({
            url: app.globalData.mainURL + 'api/getBookingDetail',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'booking_id': id,
                'user_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                console.log(res)
                var book = res.data.result[0];
                if (book != null) {
                    var avatar = book.pic.split(",")[0];
                    book.picture = book.pic.split(",");
                    book.avatar = app.globalData.uploadURL + avatar;
                    book.idshow = '0000000000';
                    book.idshow = book.idshow.slice(0, 10 - book.id.length) + book.id
                    var time = book.start_time.split(':');
                    var register = res.data.register_num[0].register_num
                    if (register == null) register = 0;
                    book.start_time = time[0] + ':' + time[1];
                    time = book.end_time.split(':')
                    book.end_time = time[0] + ':' + time[1]

                    // if (book.name.length > 15) {
                    //     var name = book.name
                    //     name = name.slice(0, 15) + '...'
                    //     book.name = name
                    // }
                    that.data.booking = book;
                    var condition = book.condition.split(',');
                    var book_info = JSON.parse(book.book_info);
                    var customer_info = [];
                    for (var i = 0; i < condition.length; i++) {
                        if (parseInt(condition[i]) > -1) {
                            if (i == 4) book_info[i] = (book_info[i] == '2' ? '女' : '男');
                            if (i == 11) book_info[i] = app.globalData.uploadURL + book_info[i];
                            if (book_info[i] == '') book_info[i] = '无';
                            customer_info.push({
                                name: that.data.field_opt[i],
                                isImg: (i == 11),
                                value: book_info[i]
                            })
                        }
                    }
                    that.setData({
                        booking: book,
                        customer_info: customer_info,
                        rating: res.data.rating,
                        register_num: register
                    })
                    console.log(book.cost * book.reg_num)
                }
            }
        })
    },

    show_preview: function(e) {
        var that = this
        var url = e.currentTarget.dataset.src;
        wx.previewImage({
            current: url,
            urls: [url],
        })
    },

    phone_call: function() {
        app.phoneCall(this.data.booking.agent_phone);
    },
    goto_mapView: function() {
        //view event location in map
        var that = this;
        wx.openLocation({
                latitude: parseFloat(that.data.booking.latitude),
                longitude: parseFloat(that.data.booking.longitude)
            })
            // wx.navigateTo({
            //     url: "view_map?latitude=" + that.data.booking.latitude + "&longitude=" + that.data.booking.longitude
            // })


    },

    //called when user go to detail gym page
    go_to_place: function(event) {
        wx.navigateTo({
            url: '../../index/detail_new_event/detail_new_event?id=' + this.data.booking.event_id
        })
    },
})
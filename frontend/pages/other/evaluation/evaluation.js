//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        img_black_start_src: '../../../image/star_n@2x.png',
        img_yellow_start_src: '../../../image/star_s@2x.png',
        star_img_position: 122,
        count_yellowStar: 3,
        text_count: 0,
        comment: '',
        booking_id: 0,
        event_id: 0,
        siteInfo: {},
        all_sport_type: app.globalData.eventType,
        type_array: [],
        starparam: {
            stars: [0, 1, 2, 3, 4],
            srcImage_0: "../../../image/star-0.png",
            srcImage_1: "../../../image/star-1.png",
            srcImage_2: "../../../image/star-2.png",
            srcImage_3: "../../../image/star-3.png",
            srcImage_4: "../../../image/star-4.png",
            score: 4.3,
            srcImage: ""
        },
    },
    onLoad: function(param) {

        this.setData({
            booking_id: param.id,
            event_id: param.event_id
        });
        var that = this;
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/getSiteDetailFromEventId',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'event_id': that.data.event_id
            },
            success: function(res) {
                var site_type = res.data.site.site_type_detail.split(",");
                var type_array = [];
                for (let index = 0; index < site_type.length; index++) {
                    type_array.push(that.data.all_sport_type[site_type[index]])
                }
                if (parseFloat(res.data.site.point) == 0) res.data.site.point = '5.0';
                that.setData({
                    siteInfo: res.data.site,
                    type_array: type_array
                });
                console.log(that.data.siteInfo);
                console.log(that.data.type_array);
            }
        });

    },
    bindInputText: function(e) {
        this.setData({
            text_count: e.detail.cursor,
            comment: e.detail.value
        })
    },

    additionStar: function(event) {
        this.setData({ count_yellowStar: this.data.count_yellowStar + 1 })
    },

    subtractStar: function(event) {
        this.setData({ count_yellowStar: this.data.count_yellowStar - 1 })
    },
    btn_submit: function() {
        if (this.data.comment.length <= 200) {
            var that = this;
            wx.request({
                url: app.globalData.mainURL + 'api/addRating',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data: {
                    'booking_id': that.data.booking_id,
                    'point': that.data.count_yellowStar,
                    'comment': that.data.comment
                },
                success: function(res) {
                    if (res.data.status == true) {
                        // wx.redirectTo({
                        //   url: '../../profile/my_activity/my_activity',
                        // });
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                }
            })
        } else {
            wx.showToast({
                title: '你输入的字符超过200字！',
                icon: 'none'
            })
        }
        console.log(this.data.comment)
    }
})
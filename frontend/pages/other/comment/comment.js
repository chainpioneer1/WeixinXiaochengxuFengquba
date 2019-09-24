//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        img_black_start_src: '../../../image/star_n@2x.png',
        img_yellow_start_src: '../../../image/star_s@2x.png',
        star_img_position: 25,
        rating: [],
        method: 'event',
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
        var that = this;
        var id = param.id;
        var kind = param.kind;
        if (kind == 'event') {
            wx.request({
                url: app.globalData.mainURL + 'api/getRatingByEvent',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data: {
                    'event_id': id
                },
                success: function(res) {
                    var ratings = res.data.result;
                    if (ratings != null) {
                        for (var index = 0; index < ratings.length; index++) {
                            ratings[index].avatar = ratings[index].avatar;
                        }
                        that.setData({
                            rating: ratings,
                            method: kind
                        })
                    }
                }
            })
        } else {
            wx.request({
                url: app.globalData.mainURL + 'api/getRatingBySite',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data: {
                    'boss_id': id
                },
                success: function(res) {
                    var ratings = res.data.result;
                    var site = res.data.site[0];

                    var site_type = site.site_type_detail.split(" ");
                    var type_array = [];
                    for (let index = 0; index < site_type.length; index++) {
                        type_array.push(site_type[index])
                    }

                    if (ratings != null) {
                        that.setData({
                            siteInfo: site,
                            type_array: type_array,
                            rating: ratings,
                            method: kind
                        })
                    }
                }
            })
        }
    }
})
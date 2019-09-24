// pages/profile/my_focus/my_focus.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        favourite: [],
        defaultAvatar: app.globalData.uploadURL + 'global/picture01@2x.png',
        imgURL: app.globalData.uploadURL + 'global/success_n@2x.png',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        wx.request({
            url: app.globalData.mainURL + 'api/getFavouriteSite',
            method: 'POST',
            header: {
                'content-type': 'application/json',
            },
            data: {
                'user_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                var fav_buf = res.data.result;
                if (fav_buf != null) {
                    that.setData({ favourite: fav_buf });
                } else {
                    that.setData({ favourite: [] });
                }
            }
        })
    },
    phone_call: function(res) {
        app.phoneCall(this.data.favourite[res.currentTarget.id].phone);
    },

    btn_Clicked_Focus: function(event) {
        var that = this;
        wx.navigateTo({
            url: '../../index/detail_gym/detail_gym?id=' + that.data.favourite[event.currentTarget.id].boss_id + '&no=' + that.data.favourite[event.currentTarget.id].boss_no,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
        var a = new Array();
    },
    on_cancel: function(event) {
        var that = this;
        wx.request({
            url: app.globalData.mainURL + 'api/cancelFavouriteSite',
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            data: {
                'boss_id': 0, //that.data.favourite[event.currentTarget.id].boss_id,
                'user_id': app.globalData.userInfo.user_id,
                'boss_no': that.data.favourite[event.currentTarget.id].boss_no
            },
            success: function(res) {
                that.onLoad();
            }
        })
    }
})
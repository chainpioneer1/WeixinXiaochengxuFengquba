// pages/backyard/transaction/transaction.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        array: [],
        imgURL: app.globalData.uploadURL + 'global/success_n@2x.png'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        wx.request({
            url: app.globalData.mainURL + 'api/getExchange',
            data: {
                user_id: app.globalData.userInfo.user_id
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                if (!res.data.status) return;
                var shoparray = res.data.result
                for (var index = 0; index < shoparray.length; index++) {
                    shoparray[index].idshow = '0000000000'
                    shoparray[index].idshow = shoparray[index].idshow.slice(0, 10 - shoparray[index].no.length) + shoparray[index].no
                }
                that.setData({ array: shoparray, upload_url: app.globalData.uploadURL, productState: app.globalData.productState })
            },
            fail: function() {}
        })
    },
    onDetailState: function(query) {
        wx.navigateTo({
            url: '../transaction_detail/transaction_detail?id=' + query.currentTarget.id,
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
})
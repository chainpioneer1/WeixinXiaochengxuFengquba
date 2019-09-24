// pages/other/select_location/select_location.js
var app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        method: "auth",
        longitude: 0,
        latitude: 0,
        marker: [],
        showModal: false,
        longitude: 0,
        latitude: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            method: options.method,
            longitude: options.longitude,
            latitude: options.latitude
        });
        this.mapCtx = wx.createMapContext("myMap");
    },
    on_click_map: function(e) {
        var that = this;
        var x = e.touches[0].pageX;
        var y = e.touches[0].pageY;
        this.mapCtx.getRegion({
            success: function(res) {
                var longitude =
                    res.southwest.longitude -
                    (res.southwest.longitude - res.northeast.longitude) / (750.0 / x);
                var latitude =
                    res.northeast.latitude +
                    (res.southwest.latitude - res.northeast.latitude) / (1268.0 / y);
                that.setData({
                    marker: [{
                        iconPath: "../../../../image/me@2x.png",
                        id: 0,
                        latitude: latitude,
                        longitude: longitude,
                        width: 50,
                        height: 50
                    }],
                    showModal: true,
                    longitude: longitude,
                    latitude: latitude
                });
                app.globalData.longitude = longitude;
                app.globalData.latitude = latitude;
            }
        });
    },
    onCancel1: function() {
        this.setData({
            showModal: false
        });
    },
    onConfirm1: function() {
        this.setData({
            showModal0: false
        });
        wx.navigateBack({
            delta: 1
        });
    }
});
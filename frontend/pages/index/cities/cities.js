// pages/index/news/news.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        options: [],
        newCount: 0,
        allList: [],
        filterItem: 'A',
        filterList: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        that.setData({
            filterList: that.data.filterList
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;
        wx.showLoading({
            title: '加载中',
        })
        that.setData({
            currentName: wx.getStorageSync('currentCity').city
        })
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/getAllCities',
            data: {},
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                if (res.data.status) {
                    console.log('Got All Cities');
                    that.data.allList = res.data.data;
                    that.makeList();
                } else {
                    // console.log(res);
                }
            },
            complete: function() {
                wx.hideLoading({});
            },
        })
    },

    go2Filtered: function(event) {
        var that = this;
        var id = event.currentTarget.dataset.id;

        // id: one of a~z, friendList:all of userlist.
        // console.log(id);
        that.setData({
            filterItem: id
        })
    },
    makeList: function() {
        var that = this;
        var allList = that.data.allList;
        var filtered = [];
        for (var i = 0; i < allList.length; i++) {
            if (!allList[i].filter_character) allList[i].filter_character = ' ';
            if (allList[i].city == '市' || allList[i].city == '县') continue;
            filtered.push(allList[i]);
        }

        filtered = filtered.sort(function(a, b) {
            return (a.city.localeCompare(b.city));
        });

        filtered = filtered.sort(function(a, b) {
            return (a.filter_character.localeCompare(b.filter_character));
        });

        var filter_character = ' ';
        for (var i = 0; i < filtered.length; i++) {
            if (filtered[i].filter_character == filter_character) filtered[i].filter_character = '';
            else filter_character = filtered[i].filter_character;
        }
        that.setData({
            allList: filtered
        });
    },

    selectCityItem: function(event) {
        // id: my friend's user_id
        var that = this;
        var id = event.currentTarget.dataset.id;
        if (id == undefined) return;
        var city = that.data.allList.find(function(a) { return (a.id == id); });
        var cityData = wx.getStorageSync('currentCity');
        city.user_latitude = cityData.user_latitude;
        city.user_longitude = cityData.user_longitude;
        city.user_cityName = cityData.user_cityName;
        wx.setStorageSync('currentCity', city);

        app.getLatLng(city.city, function() {
            wx.switchTab({
                url: '../index'
            });
        });

        that.setData({
                currentName: city.city
            })
            // 
            // wx.navigateTo({
            //     url: '../../profile/profile_friend?id=' + id + '&type=0'
            // })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

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
// pages/index/news/news.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        options: [],
        newCount: 0,
        friendList: [],
        filterList: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        that.setData({
            eventData: app.globalData.eventType,
            filterList: that.data.filterList
        })

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/getNewHoneyFriend',
            data: {
                user_id: app.globalData.userInfo.user_id
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                if (res.data.status) {
                    console.log(res.data);
                    that.data.friendList = res.data.data;

                    that.calculateNewFriends();
                } else {
                    // console.log(res);
                }
            },
        })
    },

    filterUser: function(event) {
        var that = this;
        var id = event.currentTarget.dataset.id;
        var friendList = that.data.friendList;
        // id: one of a~z, friendList:all of userlist.
        // console.log(id);
        that.setData({
            filterItem: id
        })
    },
    calculateNewFriends: function() {
        var that = this;
        var allList = that.data.friendList;
        var cnt = 0;
        for (var i = 0; i < allList.length; i++) {
            var item = allList[i];
            // user_id means user that received apply request.
            if (item.user_id == app.globalData.userInfo.user_id &&
                item.main_id != app.globalData.userInfo.user_id &&
                item.status == 0)
                cnt++;
        }

        var filtered = new Array();
        var j = 0;
        for (var i = 0; i < allList.length; i++) {
            var item = allList[i];
            // user_id means user that received apply request.
            if (item.user_id == app.globalData.userInfo.user_id &&
                item.main_id != app.globalData.userInfo.user_id &&
                item.status == 1)
                filtered.push(item);
        }
        filtered = filtered.sort(function(a, b) { return (a.filter_character.localeCompare(b.filter_character)); });
        var filter_character = ' ';
        for (var i = 0; i < filtered.length; i++) {
            if (filtered[i].filter_character == filter_character) filtered[i].filter_character = '';
            else filter_character = filtered[i].filter_character;
        }
        // console.log(filtered);
        that.setData({
            newCount: cnt,
            friendList: filtered
        });
    },

    go2FriendDetail: function(event) {
        // id: my friend's user_id
        var that = this;
        var id = event.currentTarget.dataset.id;
        if (id == undefined) return;
        // console.log(that.data.friendList)
        // 
        wx.navigateTo({
            url: '../../profile/profile_friend?id=' + id + '&type=0'
        })
    },

    go2NewFriendPage: function(event) {
        // id: my friend's user_id
        var that = this;
        var cnt = event.currentTarget.dataset.cnt;
        if (cnt == 0) return;
        // console.log(that.data.friendList)
        wx.redirectTo({
            url: 'nfriends'
        })
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
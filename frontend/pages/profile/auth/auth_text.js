// pages/profile/auth/auth.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hide: 0,
        role: 1,
        mo_user_info: { user_role: '商家', stadium_info: "", ownername: "", phonenumber: "", authnumber: "", address: "", detail_address: "", map: "", register_image: "../../../image/002@3x.png", idcard: "", front_image: "../../../image/sfz@3x.png", back_image: "../../../image/sfb@3x.png", },
        mo_person_info: { user_role: '个人', nickname: "", ownername: "", phonenumber: "", authnumber: "" },
        overimagecount: 0,
    },
    On_clicked_role: function() {
        this.data.hide = !this.data.hide;
        this.setData({ hide: this.data.hide })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({ mo_user_info: this.data.mo_user_info })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

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

    On_change_picker: function(e) {
        if (e.detail.value[0] == 1) {
            this.data.mo_user_info.user_role = "个人"
            this.data.role = 0;

        } else {
            this.data.role = 1;
            this.data.mo_user_info.user_role = "商家"
        }
        this.setData({ role: this.data.role })
        this.setData({ mo_user_info: this.data.mo_user_info })
    },
    On_blur_stadiuminfo: function(e) {
        this.data.mo_user_info.stadium_info = e.detail.value;
    },
    On_blur_ownername: function(e) {
        this.data.mo_user_info.ownername = e.detail.value;
    },
    On_blur_phonenumber: function(e) {
        this.data.mo_user_info.phonenumber = e.detail.value;
    },
    On_blur_authnumber: function(e) {
        this.data.mo_user_info.authnumber = e.detail.value;
    },
    On_clicked_address: function(e) {
        this.data.mo_user_info.address = e.detail.value;
    },
    On_blur_detailaddress: function(e) {
        this.data.mo_user_info.detail_address = e.detail.value;
    },

    //receive sms
    On_click_authnumber: function(e) {},

    On_click_map: function(e) {

    },
    On_click_registerimage: function(e) {
        var that = this;
        wx.chooseImage({
            success: function(res) {
                if (res.tempFiles[0].size > 10485760) {
                    wx.showToast({
                        title: '图片太大，无法上传！',
                        icon: 'none',
                        duration: 3000
                    });
                    return;
                    that.data.overimagecount++;
                }
                that.data.mo_user_info.register_image = res.tempFilePaths[0];
                that.setData({ mo_user_info: that.data.mo_user_info })
            },
        })
    },
    On_blur_idcard: function(e) {
        this.data.mo_user_info.idcard = e.detail.value;
    },
    On_click_frontimage: function(e) {
        var that = this;
        wx.chooseImage({
            success: function(res) {
                if (res.tempFiles[0].size > 10485760) {
                    wx.showToast({
                        title: '图片太大，无法上传！',
                        icon: 'none',
                        duration: 3000
                    });
                    return;
                    that.data.overimagecount++;
                }
                that.data.mo_user_info.front_image = res.tempFilePaths[0];
                that.setData({ mo_user_info: that.data.mo_user_info })
            },
        })
    },
    On_click_backimage: function(e) {
        var that = this;
        wx.chooseImage({
            success: function(res) {
                if (res.tempFiles[0].size > 10485760) {
                    wx.showToast({
                        title: '图片太大，无法上传！',
                        icon: 'none',
                        duration: 3000
                    });
                    return;
                    that.data.overimagecount++;
                }
                that.data.mo_user_info.back_image = res.tempFilePaths[0];
                that.setData({ mo_user_info: that.data.mo_user_info })
            },
        })
    },
    On_click_submit: function(e) {
        var invalid = 0;
        if (this.data.overimagecount > 0) {
            invalid = invalid + 1
        }
        if (this.data.mo_user_info.stadium_info.length > 20) {
            invalid = invalid + 1
        }
        if (this.data.mo_user_info.ownername.length > 4) {
            invalid = invalid + 1
        }
        if (!app.checkValidPhone(this.data.mo_user_info.phonenumber)) {
            invalid = invalid + 1
        }
        if (this.data.mo_user_info.idcard.toString().length > 18) {
            invalid = invalid + 1
        }
        if (invalid == 0) {

        } else {
            wx.showToast({
                title: 'Error',
                icon: 'none',
                duration: 2000
            })
        }
    },

    //personal data input
    On_blur_ownername1: function(e) {
        this.data.mo_person_info.ownername = e.detail.value;
    },
    On_blur_phonenumber1: function(e) {
        this.data.mo_person_info.phonenumber = e.detail.value;
    },
    On_blur_authnumber1: function(e) {
        this.data.mo_person_info.authnumber = e.detail.value;
    },
})
//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        img_note_src: '../../../../image/t@2x.png',
        realname: "",
        cardnum: 0,
        idnumber: "",
        phonenumber: "",
        bankname: "",
        error: ""
    },
    input_Realname: function(e) {
        this.setData({ realname: e.detail.value })
    },
    input_Bankcardnumber: function(e) {
        this.setData({ cardnum: e.detail.value })
    },
    input_Idcardnumber: function(e) {
        this.setData({ idnumber: e.detail.value })
    },
    input_Phonenumber: function(e) {
        this.setData({ phonenumber: e.detail.value })
    },
    input_Bankname: function(e) {
        this.setData({ bankname: e.detail.value })
    },
    on_Clicked_OK: function() {
        var that = this;
        var x = 0
        if (this.data.realname.length == 0) {
            x++
            wx.showToast({ title: '请填写持卡人姓名', icon: 'none', time: 3000 })
            return
        }
        if (this.data.realname.length > 5 || this.data.realname.length < 2) {
            x++
            wx.showToast({ title: "持卡人姓名应为2-5个字", icon: 'none', time: 3000 })
            return
        }
        if (that.data.cardnum.toString().length == 0) {
            x++
            wx.showToast({ title: '请填写银行卡号', icon: 'none', time: 3000 })
            return
        }
        if (that.data.cardnum.toString().length > 21 || that.data.cardnum.toString().length < 16) {
            x++
            wx.showToast({ title: "请填写正确的银行卡号为16-21个字", icon: 'none', time: 3000 })
            return
        }
        if (that.data.phonenumber.length == 0) {
            x++
            wx.showToast({ title: "请填写银行预留手机号码", icon: 'none', time: 3000 })
            return
        }
        if (that.data.phonenumber.length != 11) {
            x++
            wx.showToast({ title: "请填写正确的银行预留手机号码为11个字", icon: 'none', time: 3000 })
            return
        }
        if (that.data.idnumber.length == 0) {
            x++
            wx.showToast({ title: "请填写身份证号", icon: 'none', time: 3000 })
            return
        }
        if (that.data.idnumber.length > 18 || that.data.idnumber.length < 15) {
            x++
            wx.showToast({ title: "请填写正确的身份证号为15-18个字", icon: 'none', time: 3000 })
            return
        }
        if (that.data.bankname.length == 0) {
            x++
            wx.showToast({ title: "请填写开户行名称", icon: 'none', time: 3000 })
            return
        }
        if (that.data.bankname.length > 10) {
            x++
            wx.showToast({ title: "开户行名称应不超过10个字", icon: 'none', time: 3000 })
            return
        }
        if (x == 0) {
            this.setData({ error: "" })
            wx.request({
                url: app.globalData.mainURL + 'api/addBindingInfo',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data: {
                    user_id: app.globalData.userInfo.user_id,
                    receiver: that.data.realname,
                    credit_no: that.data.cardnum,
                    id_no: that.data.idnumber,
                    bank_phone: that.data.phonenumber,
                    bank: that.data.bankname
                },
                success: function(res) {
                    wx.navigateTo({
                        url: '../my_purse',
                    })
                }
            })
        }
    }
})
//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        image_withdrawal_next_src: '../../resources/next@2x.png',
        account_balance: 0,
        is_new_user: 1,
        cost: 0,
        receiver: "",
        credit_no: "",
        id_no: "",
        id_no_hidden: "",
        credit_no_hidden: "",
        isbtnclicked: 0,
    },
    onLoad: function() {},
    onShow: function() {
        var that = this;
        wx.request({
            url: app.globalData.mainURL + 'api/getBindingInfo',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'user_id': app.globalData.userInfo.user_id
            },

            success: function(res) {
                console.log(res)
                if (res.data.status == false) return
                if (res.data.status == true) {
                    that.setData({
                        is_new_user: 0,
                        account_balance: res.data.result[0].amount,
                        receiver: res.data.result[0].receiver,
                        credit_no: res.data.result[0].credit_no,
                        id_no: res.data.result[0].id_no
                    })
                    if (res.data.result[0].id_no == null) return;
                    var buff = res.data.result[0].id_no.slice(0, 4) + '********' + that.data.id_no.slice((that.data.id_no.length - 4), that.data.id_no.length);
                    that.setData({
                        id_no_hidden: buff,
                        credit_no_hidden: that.data.credit_no.slice(that.data.credit_no.length - 4, that.data.credit_no.length)
                    })
                }
            }
        })
    },
    onCancel: function() {
        this.setData({
            showModal: false
        });
    },
    //if user will send money
    onConfirm: function(e) {
        var invalid = 0
        console.log("purse")
        console.log(Number.isFinite(this.data.cost))
        if (!Number.isFinite(this.data.cost * 1)) {
            wx.showToast({
                title: '输入金额比100元小！',
                icon: 'none'
            })
            invalid = 3
            return;
        }
        if (this.data.cost < 100) {
            wx.showToast({ title: "输入金额比100元小！", icon: 'none' })
            invalid = 1
            return;
        }
        if (this.data.cost > 1 * this.data.account_balance) {
            wx.showToast({ title: "余额不足", icon: 'none' })
            invalid = 2
            return;
        }
        /*
        if(this.data.cost < 0)
        {
          wx.showToast({
            title: '输入金额比100元小！',
            icon:'none'
          })
          invalid = 3
        }
        */
        if (this.data.isbtnclicked == 1 && invalid == 0) return;
        else if (this.data.isbtnclicked == 0 && invalid == 0) {
            this.data.isbtnclicked = 1
        }
        if (invalid == 0) {
            var that = this;
            wx.request({
                url: app.globalData.mainURL + 'api/addBindingHistory',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data: {
                    'user_id': app.globalData.userInfo.user_id,
                    'amount': that.data.cost
                },
                success: function(res) {
                    if (res.data.status == true) {
                        wx.redirectTo({
                            url: '../final_cancel/final_cancel?method=purse',
                            success: function() {
                                that.data.isbtnclicked = 0
                            }
                        })
                    }
                }
            })
        }
    },
    //if user will register
    onCancel1: function() {
        this.setData({
            showModal1: false
        });
    },
    onConfirm1: function() {
        this.setData({
            showModal1: false
        });
        wx.navigateTo({
            url: 'add_New_Account/add_New_Account',
        })
    },
    //bind input data to variable
    on_Input_Cost: function(e) {
        this.setData({
            cost: e.detail.value
        })
    },
    //when user click send button
    on_Clicked_Cost: function() {
        wx.navigateTo({
            url: 'my_withdraw',
        })

    },
    on_Clicked_Detail: function() {
        wx.navigateTo({
            url: 'trans_detail/trans_detail',
        })
    }
})
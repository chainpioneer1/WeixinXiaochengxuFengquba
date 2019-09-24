//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        image_withdrawal_next_src: '../../resources/next@2x.png',
        account_balance: 0,
        available_balance: 0,
        remained_balance: 0,
        is_new_user: 1,
        cost: "0.00",
        receiver: "",
        credit_no: "",
        id_no: "",
        id_no_hidden: "",
        credit_no_hidden: "",
        isbtnclicked: 0,
        todayCnt: 0
    },
    onLoad: function() {},
    onShow: function() {
        this.onPrepare();
    },
    onPrepare: function() {
        var that = this;
        wx.showLoading({
            title: '加载中',
        })
        var option = that.data.options;
        if (app.globalData.userInfo.user_id == 0)
            app.onInitialize(function() {
                that.onInitStart(option);
            })
        else
            that.onInitStart(option);
    },
    onInitStart: function(option) {
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
                if (!res.data.status) return
                that.data.todayCnt = res.data.count;
                that.setData({
                    is_new_user: 0,
                    account_balance: res.data.result[0].amount,
                    available_balance: res.data.result[0].amount_withdraw,
                    remained_balance: (res.data.result[0].amount * 1 - res.data.result[0].amount_withdraw * 1).toFixed(2),
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
            },
            complete: function() {
                wx.hideLoading({});
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
        if (this.data.cost > 1 * this.data.available_balance) {
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
                                //that.data.isbtnclicked = 0
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
        if (this.data.isbtnclicked == 1) {
            wx.redirectTo({
                url: 'my_purse',
            })
        }
    },
    //bind input data to variable
    on_Input_Cost: function(e) {
        var type = e.currentTarget.dataset.type;
        switch (type) {
            case 'all':
                var price = e.currentTarget.dataset.value;
                break;
            case 'input':
                var price = e.detail.value;
                break;
        }
        if (price == '') return;
        if (price.substr(price.length - 1) == '.') return;
        price = (parseInt(price * 100) / 100);
        this.setData({
            cost: price
        })
    },
    //bind input data to variable
    on_Input_Cost_Click: function(e) {
        var price = e.detail.value;
        price = price.trim('.');
        console.log(price);
        if (price == '0.00' || parseFloat(price) == 0.0) {
            this.setData({
                cost: ''
            })
        }
    },
    on_Input_Cost_Blur: function(e) {
        var price = e.detail.value;
        if (price == '' || parseFloat(price) == 0.0) {
            this.setData({
                cost: '0.00'
            })
        }
    },
    //when user click send button
    on_Clicked_Cost: function() {
        var that = this;
        var err = 0;
        var msgTxt = '';
        if (that.data.isbtnclicked == 1) {
            // err++;
            // msgTxt = '已提现成功了';
            // this.setData({
            //     showModal1: true,
            //     message: msgTxt
            // });
            return;
        }
        that.data.isbtnclicked = 1;
        if (that.data.todayCnt >= 5) {
            err++;
            msgTxt = '今日提现次数已经用完'
        }
        if (that.data.cost * 1.0 < 2.0 || that.data.cost * 1.0 > 1000.0) {
            err++;
            msgTxt = '每笔提现金额最低2元，最高1000元'
        }
        if (that.data.cost * 1.0 > that.data.available_balance * 1.0) {
            err++;
            msgTxt = '提现金额大于钱包余额，请重新输入'
        }
        if (that.data.cost * 1.0 == 0.0) {
            err++;
            msgTxt = '请输入提现金额'
        }
        if (err > 0) {
            that.data.isbtnclicked = 0;
            this.setData({
                showModal1: true,
                message: msgTxt
            })
            return;
        }

        var submit_time = Date.now();
        var partner_trade_no = app.globalData.mch_id + submit_time;
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/withdraw',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'id': wx.getStorageSync('openid'),
                'user_id': app.globalData.userInfo.user_id,
                'fee': parseInt(that.data.cost * 99.4) / 100,
                'partner_trade_no': partner_trade_no
            },
            success: function(res) {
                if (res.data.status == true) {
                    wx.request({
                        url: app.globalData.mainURL + 'api/addBindingHistory',
                        method: 'POST',
                        header: {
                            'content-type': 'application/json'
                        },
                        data: {
                            'user_id': app.globalData.userInfo.user_id,
                            'partner_trade_no': partner_trade_no,
                            'binding_no': res.data.payment_no,
                            'binding_time': res.data.payment_time,
                            'submit_time': res.data.submit_time,
                            'amount': that.data.cost * 1.0
                        },
                        success: function(res) {
                            if (res.data.status == true) {
                                that.setData({
                                    account_balance: res.data.result.amount,
                                    available_balance: res.data.result.amount_withdraw,
                                    remained_balance: (res.data.result.amount * 1 - res.data.result.amount_withdraw * 1).toFixed(2),
                                    showModal1: true,
                                    message: '提现申请已经提交，请留意您的微信余额变化'
                                })
                            }
                        }
                    })

                } else {
                    that.data.isbtnclicked = 0;
                    if (res.data.errmsg.indexOf('0000') > 0) {
                        res.data.errmsg = '每笔提现金额最低2元，最高1000元';
                    }
                    that.setData({
                        showModal1: true,
                        message: res.data.errmsg
                    })
                }
            }
        })
    },
    on_Clicked_Detail: function() {
        wx.navigateTo({
            url: 'trans_detail/withdraw_history',
        })
    }
})
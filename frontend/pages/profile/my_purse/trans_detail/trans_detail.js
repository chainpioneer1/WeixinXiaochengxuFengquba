//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        title: [
            '申请提现', //0
            '申请报名活动', //1
            '申请提现', //2
            '用户报名活动', //3
            '用户取消报名', //4
            '取消活动', //5
            '取消活动', //6
            '报名活动', //7
            '取消活动', //8
            '申请商家订单', //9
            '用户商家订单', //10
            '用户取消订单', //11
            '申请报名赛事', //12
            '用户报名赛事', //13
            '取消订单', //14
            '申请团购', //15
            '用户申请团购', //16
            '取消团购', //17
            '用户取消团购', //18
        ],
        plus: [
            '-', //0
            '-', //1
            '+', //2
            '+', //3
            '-', //4
            '-', //5
            '+', //6
            '-', //7
            '+', //8
            '-', //9
            '+', //10
            '-', //11
            '-', //12
            '+', //13
            '+', //14
            '-', //15
            '+', //16
            '+', //17
            '-' //18
        ],
        sub_title: [
            '提现中',
            '提现成功',
            '提现失败'
        ],
        payment: [],
    },
    onLoad: function() {
        var that = this;
        wx.request({
            url: app.globalData.mainURL + 'api/getPaymentHistory',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'user_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                console.log("Get Datas")
                if (res.data.status == true) {
                    var payment = res.data.payment
                    for (var index = 0; index < payment.length; index++) {
                        var item = payment[index];
                        if (Math.floor(item.amount) == item.amount) {
                            // payment[index].amount +='.00'
                        }
                        if (item.site_name) {
                            if (item.site_name.length > 10) item.site_name = item.site_name.substr(0, 10) + '...';
                        }
                        if (item.name) {
                            if (item.name.length > 10) item.name = item.name.substr(0, 10) + '...';
                        }
                        item.amount = Math.abs(item.amount);
                    }
                    that.setData({
                        payment: payment,
                    })
                }
            }
        })
    }
})
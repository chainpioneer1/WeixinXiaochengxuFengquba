const app = getApp()
var amapFile = require('../../lib/amap-wx.js')
var myAmap = new amapFile.AMapWX({ key: "F8f1f5c8a20c199dd0f70f5a6b162280" })
var mapCtx
    // pages/canvas/canvas.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        show_state: false,
        body_text: 'hello',
        uploadRoot: app.globalData.uploadURL
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function(options) {
        var that = this;
        // that.setData({
        //   body_text:app.globalData.token
        // })
        console.log(app.globalData.userInfo.user_id);

        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/getQR',
            data: { access_token: app.globalData.token, path: 'pages/index/index', user_id: app.globalData.userInfo.user_id },
            method: 'POST',
            header: { 'content-type': 'application/json' },
            success: function(res) {
                console.log(res.data);

                if (res.data.status) {
                    var image_url = app.globalData.mainURL + res.data.data;
                    wx.downloadFile({
                        url: image_url,
                        type: 'image',
                        success: (resp) => {
                            var qr_filePath = resp.tempFilePath;
                            console.log(qr_filePath);
                            const ctx = wx.createCanvasContext('shareImg')
                            ctx.drawImage(qr_filePath, 0, 0, 200, 200)
                            ctx.draw()
                        }
                    })

                }
            }
        })

    },

    create_canvas: function() {
        var that = this;
        var img_url = app.globalData.uploadURL + 'events/975_img1.jpg';
        wx.downloadFile({
            url: img_url,
            type: 'image',
            success: (resp) => {
                var qr_filePath = resp.tempFilePath;
                const ctx = wx.createCanvasContext('shareImg')
                ctx.drawImage(qr_filePath, 0, 0, 200, 200)
                ctx.draw()
                return;
            }
        })
    },


    /**
     * 生成分享图
     */
    share: function() {
        var that = this

        //convert canvas to image file
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 600,
            height: 900,
            destWidth: 600,
            destHeight: 900,
            canvasId: 'shareImg',
            success: function(res) {
                that.setData({
                    img_url: res.tempFilePath,
                    show_state: true
                })

                // save imgage to album
                wx.saveImageToPhotosAlbum({
                    filePath: that.data.img_url,
                    success(res) {
                        wx.showToast({
                            title: '已保存至相册，记得分享哦',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                })

            },
            fail: function(res) {
                console.log(res)
            }
        })
    },
    hide_canvas: function() {
        var that = this;
        that.setData({
            show_state: false
        })
    },
})
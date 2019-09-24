// pages/profile/delivery/editdelivery.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        method: '',
        address: {
            'no': 0,
            'detail_address': '',
            'province': "",
            'city': "",
            'area': "",
            'name': '',
            'email': '',
            'phone': ''
        },
        address_no: 0,
        kind: 0,
        product_id: 0,
        select_address: 0,
        pid: 0,
        cid: 0,
        aid: 0,
        province: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var _this = this


        //get province array
        wx.request({
            url: app.globalData.mainURL + 'api/getProvinces',
            success: function(res) {
                var tempprovince = res.data.result
                tempprovince.unshift({ id: "0", province: "请选择省" })
                _this.data.province = tempprovince
            }
        })


        _this.data.address_no = options.no
        if (options.no != 0) {
            var address_buf = this.data.address;
            address_buf.no = options.no;
            address_buf.name = options.name;
            address_buf.phone = options.phone;
            address_buf.province = options.province;
            address_buf.city = options.city;
            address_buf.area = options.area;
            address_buf.detail_address = options.detail_address;
            address_buf.email = options.email;

            this.setData({
                pid: options.pid,
                cid: options.cid,
                aid: options.aid,
                address: address_buf
            })
            this.setData({
                method: 'change'
            })
        } else {
            this.setData({
                method: 'new'
            })
        }
        if (options.kind != null) {
            _this.data.kind = options.kind
            _this.data.product_id = options.id
            _this.data.method = 'new'
            _this.setData({
                method: 'new'
            })
        }

    },

    on_blur_postname: function(e) {
        this.data.address.name = e.detail.value
    },
    on_blur_phonenumber: function(e) {
        this.data.address.phone = e.detail.value
    },
    on_blur_address: function(e) {
        this.data.address.detail_address = e.detail.value
    },
    on_blur_mail: function(e) {
        this.data.address.email = e.detail.value;
    },
    on_click_submit: function(e) {
        var error = 0
        var that = this
        if (this.data.address.name.length == 0) {
            wx.showToast({
                title: '请填写姓名',
                icon: 'none'
            })
            return
        }
        if (this.data.address.name.length < 2 || this.data.address.name.length > 6) {
            wx.showToast({
                title: '姓名应为2-6个字',
                icon: 'none'
            })
            return
        }

        if (this.data.address.detail_address == '') {
            wx.showToast({
                title: '请选择省/市/区',
                duration: 3000,
                icon: 'none'
            })
            return
        }

        if (this.data.address.phone.toString().length == 0) {
            wx.showToast({
                title: '请填写手机号码',
                icon: 'none'
            })
            return
        }
        if (!app.checkValidPhone(this.data.address.phone)) {
            wx.showToast({
                title: '请填写正确的手机号码',
                icon: 'none'
            })
            return
        }
        if (this.data.address.email.length == 0) {
            wx.showToast({
                title: '请填写邮政编码',
                icon: 'none'
            })
            return;
        }
        if (error == 0) {
            if (that.data.method == "new") {
                wx.request({
                    url: app.globalData.mainURL + 'api/addAcceptAddress',
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data: {
                        'user_id': app.globalData.userInfo.user_id,
                        'name': that.data.address.name,
                        'phone': that.data.address.phone,
                        'province': that.data.pid,
                        'city': that.data.cid,
                        'area': that.data.aid,
                        'detail_address': that.data.address.detail_address,
                        'email': that.data.address.email
                    },
                    success: function(res) {
                        if (that.data.kind == 0)
                            wx.switchTab({
                                url: '../profile',
                            })
                        else {
                            wx.redirectTo({
                                url: '../../backyard/product_order/product_order?id=' + that.data.product_id,
                            })
                        }
                    }
                })
            } else {
                if (that.data.select_address == 1) {
                    console.log(that.data.province[that.data.select_province].id)
                    wx.request({
                        url: app.globalData.mainURL + 'api/changeAcceptAddress',
                        method: 'POST',
                        header: {
                            'content-type': 'application/json'
                        },
                        data: {
                            'address_id': this.data.address_no,
                            'user_id': app.globalData.userInfo.user_id,
                            'name': that.data.address.name,
                            'phone': that.data.address.phone,
                            'province': that.data.pid,
                            'city': that.data.cid,
                            'area': that.data.aid,
                            'detail_address': that.data.address.detail_address,
                            'email': that.data.address.email
                        },
                        success: function(res) {
                            console.log(res)
                            if (that.data.kind == 0)
                                wx.switchTab({
                                    url: '../profile',
                                })
                            else {
                                wx.redirectTo({
                                    url: '../../backyard/product_order/product_order?id=' + that.data.product_id,
                                })
                            }
                        }
                    })
                } else {
                    wx.request({
                        url: app.globalData.mainURL + 'api/changeAcceptAddress',
                        method: 'POST',
                        header: {
                            'content-type': 'application/json'
                        },
                        data: {
                            'address_id': this.data.address_no,
                            'user_id': app.globalData.userInfo.user_id,
                            'name': that.data.address.name,
                            'phone': that.data.address.phone,
                            'province': that.data.pid,
                            'city': that.data.cid,
                            'area': that.data.aid,
                            'detail_address': that.data.address.detail_address,
                            'email': that.data.address.email
                        },
                        success: function(res) {
                            console.log(res)
                            if (that.data.kind == 0)
                                wx.switchTab({
                                    url: '../profile',
                                })
                            else {
                                wx.redirectTo({
                                    url: '../../backyard/product_order/product_order?id=' + that.data.product_id,
                                })
                            }
                        }
                    })
                }
            }
        }
    },


    On_click_map: function(e) {
        var that = this
        app.globalData.ischooseimage = 1
        wx.chooseLocation({
            success: function(res) {
                var got_address = res.address;
                var url = 'https://restapi.amap.com/v3/geocode/regeo?key=8eb63e36d0b6d7d29a392503a4a80f6c&location=' + res.longitude + ',' + res.latitude + '&poitype=&radius=&extensions=all&batch=false&roadlevel=0';

                //get activity array
                wx.request({
                    url: url,

                    success: function(res) {
                        console.log(res.data.regeocode.addressComponent);
                        that.data.address.province = res.data.regeocode.addressComponent.province
                        that.data.address.city = res.data.regeocode.addressComponent.city
                        that.data.address.area = res.data.regeocode.addressComponent.district
                        if (got_address == "") {
                            got_address = res.data.regeocode.formatted_address;
                        }


                        that.data.address.detail_address = got_address;
                        that.setData({
                            address: that.data.address
                        })

                        //get pid
                        var province_index = that.data.province.findIndex(item => item.province == that.data.address.province)
                        that.setData({
                            pid: that.data.province[province_index].id,
                        })

                        //get cid
                        wx.request({
                            url: app.globalData.mainURL + "api/getCities",
                            method: 'POST',
                            header: {
                                'content-type': 'application/json'
                            },
                            data: {
                                province: that.data.address.province
                            },
                            success: function(res) {
                                var city_array = res.data.result;
                                var city_index = city_array.findIndex(item => item.city == that.data.address.city)
                                that.setData({
                                    cid: city_array[city_index].id
                                })
                            }
                        })

                        // get aid                    
                        wx.request({
                            url: app.globalData.mainURL + "api/getAreas",
                            method: 'POST',
                            header: {
                                'content-type': 'application/json'
                            },
                            data: {
                                province: that.data.address.province,
                                city: that.data.address.city
                            },
                            success: function(res) {
                                var area_array = res.data.result;
                                var area_index = area_array.findIndex(item => item.area == that.data.address.area)
                                that.setData({
                                    aid: area_array[area_index].id
                                });
                            }
                        })
                    }
                });
            }
        })
    },




})
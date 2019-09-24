// pages/profile/auth/auth.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        province: [],
        nickname: '',
        user_role: "个人",
        role: 2, // 0-无，1-商家，2-个人
        method: 'new',

        user: {
            name: "",
            phone: "",
            site_name: "",
            detail_address: "",
            id_no: "",
            allow_pic: "../../../image/zhizhao.png",
            id_pic1: "../../../image/sfz@2x.png",
            id_pic2: "../../../image/sfb@2x.png",

        },
        hide: 0,
        overimagecount: 0,
        longitude: 0,
        latitude: 0,
        sms_state: 0,
        sms_button_text: ['获取验证码', 's后重发'],
        sms_count_state: 1,
        second_count: 60,
        check_code: 0,
        sms_check_state: false,
        userRole: [],
        province_id: 0,
        city_id: 0,
        area_id: 0,
        province_name: "",
        city_name: "",
        area_name: "",
        detail_address: "",
        select_location_text: "",
        method: 'new',
        check_image: 0,
        check_auth_image1: 0,
        check_auth_image2: 0,
        disable: 1,
        istrue: 0,
        _tmr: 0
    },

    On_clicked_role: function() {
        if (this.data.method == 'new' || this.data.method == 'rewrite') {
            this.data.hide = !this.data.hide;
            this.setData({ hide: this.data.hide })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.data.options = options;
        // },
        // onShow: function() {
        this.setData({
            userRole: app.globalData.userRole
        })
        if (this.data.options.id == undefined) this.data.options.id = -1;
        var options = this.data.options;
        var method = options.method;
        this.setData({
            nickname: app.globalData.userInfo.nickname,
        })
        wx.request({
            url: app.globalData.mainURL + 'api/getProvinces',
            success: function(res) {
                var tempprovince = res.data.result
                tempprovince.unshift({ id: "0", province: "请选择省" });
                _this.data.province = tempprovince;
                _this.data.member_state = app.globalData.userInfo.isVIP;
            }
        })
        if (!app.globalData.userInfo.nickname) {
            wx.showModal({
                title: '获取用户信息失败',
                content: '由于无法获取您的信息，所以您无法进行身份认证',
                showCancel: false,
                complete: function(res) {
                    wx.switchTab({
                        url: '../../profile/profile',
                        success: function() {
                            wx.showTabBar({})
                        }
                    })
                }
            })
            return;
        }
        var _this = this
        if (method == null) {
            method = 'new'
        }
        var that = this
        if (method != 'new') {
            if (method == "rewrite") {
                this.setData({ disable: 0 })
                this.data.check_image = 1
                this.data.check_auth_image1 = 1
                this.data.check_auth_image2 = 1
            }
            wx.request({
                url: app.globalData.mainURL + 'api/getUserDetail',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data: {
                    user_id: app.globalData.userInfo.user_id
                },
                success: function(res) {
                    console.log(res)
                    if (res.data.status == true) {
                        var user_info = res.data.result[0]
                        if (user_info.role == '2') {
                            _this.setData({ istrue: 0 })
                        }

                        that.setData({
                            province_name: user_info.province,
                            city_name: user_info.city,
                            area_name: user_info.area,
                            province_id: user_info.province_id,
                            city_id: user_info.city_id,
                            area_id: user_info.area_id,
                            select_location_text: user_info.province + user_info.city + user_info.area,
                            longitude: user_info.longitude,
                            latitude: user_info.latitude,
                            detail_address: user_info.detail_address
                        })
                        if (user_info.role == 1) {
                            user_info.allow_pic = app.globalData.uploadURL + user_info.allow_pic
                            user_info.id_pic1 = app.globalData.uploadURL + user_info.id_pic1
                            user_info.id_pic2 = app.globalData.uploadURL + user_info.id_pic2
                            that.data.check_image = 1
                            that.data.check_auth_image1 = 1
                            that.data.check_auth_image2 = 1
                        }
                        if (user_info.allow_pic == undefined) {
                            user_info.allow_pic = "../../../image/zhizhao.png"
                            user_info.id_pic1 = "../../../image/sfz@2x.png"
                            user_info.id_pic2 = "../../../image/sfb@2x.png"
                        }
                        that.setData({
                            user: user_info,
                            role: user_info.role,
                            user_role: that.data.userRole[user_info.role],
                            method: method
                        })

                    }
                }
            })
        } else if (options.id != -1) {
            if (method == "rewrite") {
                this.setData({ disable: 0 })
                this.data.check_image = 1
                this.data.check_auth_image1 = 1
                this.data.check_auth_image2 = 1
            }
            that.setData({
                role: 1,
                user_role: that.data.userRole[1],
                istrue: 1
            })
            if (options.id != 0) {
                wx.request({
                    url: app.globalData.mainURL + 'api/getSiteDetail',
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data: {
                        user_id: app.globalData.userInfo.user_id,
                        boss_id: 0,
                        boss_no: options.id
                    },
                    success: function(res) {
                        console.log(res)
                        if (res.data.status == true) {
                            var user_info = res.data.site[0];
                            method = 'rewrite';
                            that.setData({
                                province_name: user_info.province,
                                city_name: user_info.city,
                                area_name: user_info.area,
                                province_id: user_info.province_id,
                                city_id: user_info.city_id,
                                area_id: user_info.area_id,
                                select_location_text: user_info.detail_address,
                                longitude: user_info.longitude,
                                latitude: user_info.latitude,
                                detail_address: user_info.detail_address
                            });

                            user_info.name = '';
                            user_info.phone = '';
                            user_info.id_no = '';

                            user_info.allow_pic = "../../../image/zhizhao.png"
                            user_info.id_pic1 = "../../../image/sfz@2x.png"
                            user_info.id_pic2 = "../../../image/sfb@2x.png"

                            that.setData({
                                user: user_info,
                                method: method
                            })

                        }
                    }
                })
            }
        }
    },

    on_click_radio: function(e) {
        if (this.data.method == "new" || this.data.method == 'rewrite') {
            if (e.currentTarget.id == "radio2") { // 个人
                this.data.role = 2;
                this.data.istrue = 0;
            } else { // 商家
                this.data.role = 1;
                this.data.istrue = 1;
            }
            this.data.user_role = this.data.userRole[this.data.role];
            this.setData({ istrue: this.data.istrue })
            this.setData({ role: this.data.role })
            this.setData({ user_role: this.data.user_role })
        }

    },
    On_blur_stadiuminfo: function(e) {
        this.data.user.site_name = e.detail.value;
    },
    On_blur_name: function(e) {
        this.data.user.name = e.detail.value;
    },
    On_blur_phone: function(e) {
        this.data.user.phone = e.detail.value;
    },
    On_blur_authnumber: function(e) {
        this.data.user.authnumber = e.detail.value;
    },
    On_blur_detailaddress: function(e) {
        this.data.user.detail_address = e.detail.value;
    },

    //receive sms
    On_click_authnumber: function(e) {
        var that = this
        if (that.data.sms_state == 0) {
            if (that.data.user.phone.length == 0) {
                wx.showToast({
                    title: '请填写手机号码',
                    icon: 'none',
                    time: 3000
                })
                return
            }
            if (app.checkValidPhone(that.data.user.phone)) {
                var random = Math.ceil(Math.random() * 900000) + 99999;
                wx.request({
                    url: app.globalData.smsURL,
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data: {
                        'phonenumber': that.data.user.phone,
                        'random': random
                    },
                    success: function(res) {
                        if (res.result != "fail") {
                            clearInterval(that.data._tmr);
                            that.data._tmr = setInterval(function() {
                                that.setData({
                                    second_count: (that.data.second_count - 1)
                                })
                                if (that.data.second_count == 0) {
                                    that.setData({
                                        second_count: 60,
                                        sms_state: 0
                                    })
                                    clearInterval(that.data._tmr);
                                }
                            }, 1000)
                            that.setData({
                                sms_state: 1,
                                check_code: random
                            })
                        }
                    }
                })
            } else {
                wx.showToast({
                    title: '请填写正确的手机号码',
                    icon: 'none',
                    duration: 3000
                })
            }
        }
    },
    onUnload: function() {
        this.onHide();
    },
    onHide: function() {
        var that = this;
        clearInterval(that.data._tmr);
    },
    On_click_map: function(e) {
        // if (this.data.method == 'edit') return

        var that = this
        app.globalData.ischooseimage = 1
        wx.chooseLocation({
            success: function(res) {
                that.data.longitude = res.longitude
                that.data.latitude = res.latitude
                var got_address = res.address;
                var url = 'https://restapi.amap.com/v3/geocode/regeo?key=8eb63e36d0b6d7d29a392503a4a80f6c&location=' + res.longitude + ',' + res.latitude + '&poitype=&radius=&extensions=all&batch=false&roadlevel=0';

                //get activity array
                wx.request({
                    url: url,
                    success: function(res) {
                        console.log(res.data.regeocode.addressComponent);
                        var province_name = res.data.regeocode.addressComponent.province
                        var city_name = res.data.regeocode.addressComponent.city
                        var area_name = res.data.regeocode.addressComponent.district

                        if (got_address == "") {
                            got_address = res.data.regeocode.formatted_address;
                        }

                        var detail_addr = got_address;

                        //get province infomation
                        var province_index = that.data.province.findIndex(item => item.province == province_name)
                        that.data.user.detail_address = detail_addr;
                        that.setData({
                            user: that.data.user,
                            province_id: that.data.province[province_index].id,
                            province_name: province_name,
                            city_name: city_name,
                            area_name: area_name
                        })
                        console.log(that.data.province_id);

                        //get city infomation
                        wx.request({
                            url: app.globalData.mainURL + "api/getCities",
                            method: 'POST',
                            header: {
                                'content-type': 'application/json'
                            },
                            data: {
                                province: province_name
                            },
                            success: function(res) {
                                var city_array = res.data.result;
                                var city_index = city_array.findIndex(item => item.city == city_name)
                                that.setData({
                                    city_id: city_array[city_index].id
                                })
                                console.log(that.data.city_id);
                            }
                        })

                        //get area infomation
                        wx.request({
                            url: app.globalData.mainURL + "api/getAreas",
                            method: 'POST',
                            header: {
                                'content-type': 'application/json'
                            },
                            data: {
                                province: province_name,
                                city: city_name
                            },
                            success: function(res) {
                                var area_array = res.data.result;
                                var area_index = area_array.findIndex(item => item.area == area_name)
                                that.setData({
                                    area_id: area_array[area_index].id,
                                    select_location_text: province_name + city_name + area_name,
                                });
                                console.log(that.data.area_id);
                            }
                        })
                    }
                })
            },
            complete: function(res) {
                console.log(res)
            }
        })
    },

    On_click_registerimage: function(e) {
        if (this.data.method == "new" || this.data.method == "rewrite" || this.data.method == 'edit') {
            var that = this;
            wx.chooseImage({
                count: 1,
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
                    that.data.check_image = 1
                    that.data.user.allow_pic = res.tempFilePaths[0];
                    that.setData({ user: that.data.user })
                    console.log('########   UserId ################', app.globalData.userInfo.user_id);
                    wx.uploadFile({
                        url: app.globalData.mainURL + 'api/addAllowPic',
                        filePath: res.tempFilePaths[0],
                        name: 'file',
                        formData: {
                            'user_id': app.globalData.userInfo.user_id,
                            'boss_no': that.data.options.id
                        },
                        success: function(res) {
                            console.log(res);
                        }
                    })
                },
            })
        }
    },
    On_blur_idcard: function(e) {
        this.data.user.id_no = e.detail.value;
    },
    On_click_frontimage: function(e) {
        if (this.data.method == "new" || this.data.method == "rewrite" || this.data.method == 'edit') {
            var that = this;
            wx.chooseImage({
                count: 1,
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
                    that.data.check_auth_image1 = 1
                    that.data.user.id_pic1 = res.tempFilePaths[0];
                    that.setData({ user: that.data.user })
                    wx.uploadFile({
                        url: app.globalData.mainURL + 'api/addIDPic1',
                        filePath: res.tempFilePaths[0],
                        name: 'file',
                        formData: {
                            'user_id': app.globalData.userInfo.user_id,
                            'boss_no': that.data.options.id
                        },
                        success: function() {}
                    })
                },
            })
        }
    },
    On_click_backimage: function(e) {
        if (this.data.method == "new" || this.data.method == "rewrite" || this.data.method == 'edit') {
            var that = this;
            wx.chooseImage({
                count: 1,
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
                    that.data.check_auth_image2 = 1
                    that.data.user.id_pic2 = res.tempFilePaths[0];
                    that.setData({ user: that.data.user })
                    wx.uploadFile({
                        url: app.globalData.mainURL + 'api/addIDPic2',
                        filePath: that.data.user.id_pic2,
                        name: 'file',
                        formData: {
                            'user_id': app.globalData.userInfo.user_id,
                            'boss_no': that.data.options.id
                        },
                        success: function(res) {}
                    })
                },
            })
        }
    },
    On_click_submit: function(e) {
        var that = this;
        if (that.data.method == "new" || that.data.method == 'rewrite' || this.data.method == 'edit') {
            var invalid = 0;
            if (that.data.role == 1) {
                if (that.data.overimagecount > 0) {
                    invalid = invalid + 1
                    wx.showToast({
                        title: '上传的照片请不要超过5M',
                        duration: 3000,
                        icon: 'none'
                    })
                    return
                }
                if (that.data.user.site_name.length == 0) {
                    invalid++;
                    wx.showToast({
                        title: '请填写商家名称',
                        duration: 3000,
                        icon: 'none'
                    })
                    return
                }
                if (that.data.user.site_name.length > 20) {
                    invalid = invalid + 1
                    wx.showToast({
                        title: '商家名称不应超过20个字',
                        duration: 3000,
                        icon: 'none'
                    })
                    return
                }
                if (that.data.user.name.length == 0) {
                    invalid = invalid + 1
                    wx.showToast({
                        title: '请填写商家姓名',
                        duration: 3000,
                        icon: 'none'
                    })
                    return
                }
                if (that.data.user.name.length > 4) {
                    invalid = invalid + 1
                    wx.showToast({
                        title: '商家姓名不应超过4个字',
                        duration: 3000,
                        icon: 'none'
                    })
                    return
                }

                if (that.data.user.detail_address.length == 0) {
                    invalid = invalid + 1
                    wx.showToast({
                        title: '请填写详细地址',
                        duration: 3000,
                        icon: 'none'
                    })
                    return
                }
                // if (that.data.user.detail_address.length > 20) {
                //     invalid = invalid + 1
                //     wx.showToast({
                //         title: '详细地址不要超过20个字',
                //         duration: 3000,
                //         icon: 'none'
                //     })
                //     return
                // }
                // if (that.data.user.id_no.length == 0) {
                //   invalid = invalid + 1
                //   wx.showToast({
                //     title: '请填写身份证号',
                //     duration: 3000,
                //     icon: 'none'
                //   })
                //   return
                // }
                // if (that.data.user.id_no.length > 18 || that.data.user.id_no.length < 15) {
                //   invalid = invalid + 1
                //   wx.showToast({
                //     title: '请填写正确的身份证号',
                //     duration: 3000,
                //     icon: 'none'
                //   })
                //   return
                // }
                if (that.data.check_image != 1) {
                    invalid = invalid + 1
                    wx.showToast({
                        title: '请上传营业执照照片',
                        duration: 3000,
                        icon: 'none'
                    })
                    return
                }
                if (that.data.check_auth_image1 != 1) {
                    invalid = invalid + 1
                    wx.showToast({
                        title: '请上传两张身份证照片（正反面各一张）',
                        duration: 3000,
                        icon: 'none'
                    })
                    return
                }
                if (that.data.check_auth_image2 != 1) {
                    invalid = invalid + 1
                    wx.showToast({
                        title: '请上传两张身份证照片（正反面各一张）',
                        duration: 3000,
                        icon: 'none'
                    })
                    return
                }
                if (that.data.select_location_text == '') {
                    invalid = invalid + 1
                    wx.showToast({
                        title: '请在地图上选择商家地点',
                        duration: 3000,
                        icon: 'none'
                    })
                    return
                }
                if (that.data.longitude == 0) {
                    invalid = invalid + 1
                    wx.showToast({
                        title: '请在地图上选择商家地点',
                        duration: 3000,
                        icon: 'none'
                    })
                    return
                }
            }
            if (that.data.check_code * 1 != 1 * that.data.user.authnumber) {
                invalid = invalid + 1
                wx.showToast({
                    title: '验证码错误!',
                    duration: 3000,
                    icon: 'none'
                })
                return
            }
            if (invalid == 0) {
                if (that.data.role == 2) {
                    app.globalData.role = 2
                    app.globalData.state = 1
                    wx.request({
                        url: app.globalData.mainURL + 'api/registerUser',
                        method: 'POST',
                        header: {
                            'content-type': 'application/json'
                        },
                        data: {
                            user_id: app.globalData.userInfo.user_id,
                            role: 2,
                            name: that.data.user.name,
                            phone: that.data.user.phone
                        },
                        success: function(res) {
                            if (res.data.status == true) {
                                app.globalData.userInfo.state = 1
                                app.globalData.userInfo.name = that.data.user.name
                                app.globalData.userInfo.phone = that.data.user.phone
                                app.globalData.userInfo.role = 2

                                wx.redirectTo({
                                    url: './auth-text/auth_text',
                                })
                            }
                        }
                    })

                } else {
                    wx.showLoading({
                        title: '加载中',
                        mask: true,
                    })
                    app.globalData.role = 1
                    app.globalData.state = 1
                    wx.request({
                        url: app.globalData.mainURL + 'api/registerBoss',
                        method: 'POST',
                        header: {
                            'content-type': 'application/json'
                        },
                        data: {
                            role: 1,
                            user_id: app.globalData.userInfo.user_id,
                            boss_no: that.data.options.id,
                            name: that.data.user.name,
                            phone: that.data.user.phone,
                            site_name: that.data.user.site_name,
                            province: that.data.province_id,
                            city: that.data.city_id,
                            area: that.data.area_id,
                            detail_address: that.data.user.detail_address,
                            longitude: that.data.longitude,
                            latitude: that.data.latitude,
                            id_no: that.data.user.id_no
                        },
                        success: function(res) {},
                        complete: function() {
                            wx.hideLoading({});
                        }
                    })
                    console.log(that.data.user.allow_pic);
                    app.globalData.userInfo.state = 1;
                    app.globalData.userInfo.name = that.data.user.name;
                    app.globalData.userInfo.phone = that.data.user.phone;
                    app.globalData.userInfo.role = 1;
                    wx.redirectTo({
                        url: './auth-text/auth_text',
                    })
                }
            }
        } else {
            if (that.data.check_code * 1 != 1 * that.data.user.authnumber) {
                wx.showToast({
                    title: '验证码错误！',
                    duration: 3000,
                    icon: 'none'
                })
                return;
            }
            if (1) {
                app.globalData.state = 1
                wx.request({
                    url: app.globalData.mainURL + 'api/updateUserPhone',
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data: {
                        user_id: app.globalData.userInfo.user_id,
                        phone: that.data.user.phone
                    },
                    success: function(res) {
                        wx.redirectTo({
                            url: './auth-text/auth_text',
                        })
                    }
                })
            }
        }
    },

    //personal data input
    On_blur_name1: function(e) {
        this.data.user.name = e.detail.value;
    },
    On_blur_phone1: function(e) {
        this.data.user.phone = e.detail.value;
    },
    On_blur_authnumber: function(e) {
        this.data.user.authnumber = e.detail.value;
    }

})
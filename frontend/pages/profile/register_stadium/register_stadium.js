// pages/profile/register_stadium/register_stadium.js
const app = getApp();
var timePicker = require('../../../utils/timePicker.js');
var datePicker = require('../../../utils/datePicker.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bossInfo: {}, //path of icon
        image_path: ["", "", "", "", ""], //path of images
        selected: 0, //the index of image the user might select
        select: [1, 0, 0, 0, 0], //state of images to view
        display: ["display:none;", ""], //style information of images
        introduction: '', //introduction of site
        service: '', //service comment of site
        method: 'new',
        image_buf: [],
        isimage: 0,
        overimagecount: 0,
        overavatarsize: 0,
        edit_state: 0,

        //variable for select sport kind
        select_index: 40,
        color_array: ["#c0c0c0", "rgba(108,171,59,1)"],
        sport_kind_array: [],
        remain_array: [],
        selected_sport_type: [],

        //variable for select weekday array
        weekday_array: [0, 0, 0, 0, 0, 0, 0],
        weekday_one: "周一",
        weekday_strs: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],

        //variable for select time range    
        timeArray: null,
        time_start1: [8, 0],
        time_end1: [12, 0],
        time_start2: [14, 0],
        time_end2: [18, 0],

        //variable for booking unit array
        booking_unit_index: 0,
        booking_units: [{ name: '半小时', value: '0.5' },
            { name: '一小时', value: '1' },
            { name: '两小时', value: '2' },
            { name: '上下午', value: '12' },
            { name: '全天', value: '24' },
        ],


        //variable for add room info array
        room_info_array: [{ name: '', cost: '0' }, { name: '', cost: '0' }, { name: '', cost: '0' }],

        // variable for add group info array
        baseDate: [1978, 1, 1],
        group_info_array: [],
        group_info_array_templ: {
            no: '0',
            group_name: '',
            group_package: '',
            group_price: '',
            group_inprice: '',
            start: [(new Date()).getFullYear(), (new Date()).getMonth() + 1, (new Date()).getDate()],
            end: [(new Date()).getFullYear(), (new Date()).getMonth() + 1, (new Date()).getDate()],
            limit: '',
            condition: '0',
            status: '0',
            group_desc: [{
                text: '',
                textLen: 1,
                img: ""
            }],
            editable: true
        },
        //variable for select type unit
        type_unit_index: 0,
        type_units: [
            { name: '开始前72小时可退', value: '72' },
            { name: '开始前48小时可退', value: '48' },
            { name: '开始前24小时可退', value: '24' },
            { name: '开始前12小时可退', value: '12' },
            { name: '开始前6小时可退', value: '6' },
            { name: '开始前都可退', value: '0' },
            { name: '不可退订', value: '10000' },
        ],
        isProcessing: false,
        _tmr: 0,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log("ONLOAD")
        var that = this;
        var obj = timePicker.timePicker();
        var dateObj = datePicker.datePicker();

        this.setData({
            timeArray: obj.timeArray,
            dateArray: dateObj.dateTimeArray
        });

        wx.request({
            url: app.globalData.mainURL + "api/getSiteStatus",
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'user_id': app.globalData.userInfo.user_id
            },
            success: function(res) {
                if (res.data.status == true) {
                    that.setData({
                        bossInfo: res.data.result[0],
                        edit_state: 0 //res.data.edit_state[0].edit_state
                    });
                    console.log(res.data);
                    console.log(that.data.edit_state);

                    //get current sport type array
                    that.data.remain_array = that.get_all_type();
                    that.data.sport_kind_array = that.get_all_type();
                    if (that.data.bossInfo.site_type_detail) {
                        var sport_type = [];
                        var type_array = that.data.bossInfo.site_type_detail.split(",");
                        for (let index = 0; index < type_array.length; index++) {
                            sport_type.push(that.get_all_type()[type_array[index]]);
                            var item_index = that.data.remain_array.indexOf(that.get_all_type()[type_array[index]])
                            that.data.remain_array.splice(item_index, 1);
                        }
                        that.setData({
                            selected_sport_type: sport_type,
                            remain_array: that.data.remain_array
                        })
                    }
                    //get image array
                    var select_buf = that.data.select;
                    var image = that.data.image_path;
                    var image_buf = [];
                    var select = 0;
                    for (var index = 0; index < res.data.picture.length; index++) {
                        select_buf[index + 1] = 1;
                        select++;
                        image[index] = app.globalData.uploadURL + res.data.picture[index].picture;
                        image_buf.push(app.globalData.uploadURL + res.data.picture[index].picture);
                    }
                    that.data.isimage = res.data.picture.length;

                    var groupData = [];

                    for (var i = 0; i < res.data.groups.length; i++) {
                        var item = res.data.groups[i];
                        if (item.status == '3') continue;
                        item.start = item.start.split('-');
                        item.end = item.end.split('-');
                        item.group_desc = JSON.parse(item.group_desc);
                        if (item.group_desc == null) item.group_desc = [];
                        for (var j = 0; j < item.group_desc.length; j++) {
                            var groupDesc = item.group_desc[j];
                            groupDesc.editting = false;
                            if (groupDesc.img != '')
                                groupDesc.textLen = parseInt(groupDesc.text.length / 20) + 1;

                            groupDesc.img = app.globalData.uploadURL + groupDesc.img;
                            image_buf.push(groupDesc.img);
                        }
                        //item.group_desc.push(that.data.group_info_array_templ.group_desc[0]);
                        item.editable = false;
                        item.editting = false;
                        groupData.push(item);
                    }
                    that.setData({
                        image_buf: image_buf,
                        group_info_array: groupData,
                        image_path: image,
                        select: select_buf,
                        selected: select,
                        method: 'change'
                    })
                    console.log(image_buf);
                    //get service time
                    var weekday_array = that.data.bossInfo.service_time.split(",");
                    for (let index = 0; index < weekday_array.length; index++) {
                        that.data.weekday_array[weekday_array[index] - 1] = 1;
                    }
                    var weekday_one = "星期一";
                    for (let index = 0; index < that.data.weekday_array.length; index++) {
                        if (that.data.weekday_array[index] == '1') {
                            weekday_one = that.data.weekday_strs[index];
                            break;
                        }
                    }
                    that.setData({
                        weekday_array: that.data.weekday_array,
                        weekday_one: weekday_one
                    })

                    //get start, end time
                    if (that.data.bossInfo.start1) {
                        var start1_array = that.data.bossInfo.start1.split(":");
                        that.data.time_start1[0] = that.data.timeArray[0].indexOf(start1_array[0]);
                        that.data.time_start1[1] = that.data.timeArray[1].indexOf(start1_array[1]);
                    }
                    if (that.data.bossInfo.start2) {
                        var start2_array = that.data.bossInfo.start2.split(":");
                        that.data.time_start2[0] = that.data.timeArray[0].indexOf(start2_array[0]);
                        that.data.time_start2[1] = that.data.timeArray[1].indexOf(start2_array[1]);
                    }
                    if (that.data.bossInfo.end1) {
                        var end1_array = that.data.bossInfo.end1.split(":");
                        that.data.time_end1[0] = that.data.timeArray[0].indexOf(end1_array[0]);
                        that.data.time_end1[1] = that.data.timeArray[1].indexOf(end1_array[1]);
                    }
                    if (that.data.bossInfo.end2) {
                        var end2_array = that.data.bossInfo.end2.split(":");
                        that.data.time_end2[0] = that.data.timeArray[0].indexOf(end2_array[0]);
                        that.data.time_end2[1] = that.data.timeArray[1].indexOf(end2_array[1]);
                    }

                    that.setData({
                        time_start1: that.data.time_start1,
                        time_start2: that.data.time_start2,
                        time_end1: that.data.time_end1,
                        time_end2: that.data.time_end2
                    })

                    //get booking unit index
                    var service_unit = that.data.bossInfo.service_unit;
                    var booking_item = that.data.booking_units._find(item => 1.0 * item.value == service_unit);
                    that.setData({
                        booking_unit_index: that.data.booking_units.indexOf(booking_item)
                    });

                    //get room array
                    var room_infos = [];
                    for (let index = 0; index < res.data.room.length; index++) {
                        var room = res.data.room[index];
                        room_infos.push({
                            name: room.room_name,
                            cost: room.cost
                        });
                    }
                    if (room_infos.length > 0)
                        that.setData({
                            room_info_array: room_infos,
                            stadium_time: res.data.room[0].submit_time
                        })

                    //get type unit index
                    var cancel_time = that.data.bossInfo.cancel_time;
                    var type_item = that.data.type_units._find(item => item.value == cancel_time);
                    that.setData({
                        type_unit_index: that.data.type_units.indexOf(type_item)
                    });

                }
            }
        })
    },

    //function for select sport kind
    get_all_type: function(event) {
        return JSON.parse(JSON.stringify(app.globalData.eventType));
    },
    On_click_deleteType: function(event) {
        var that = this;
        var index = event.currentTarget.id;
        that.data.selected_sport_type.splice(index, 1);
        that.setData({
            selected_sport_type: that.data.selected_sport_type
        })
    },
    On_click_AddType: function(event) {
        var that = this;
        that.data.remain_array = that.get_all_type();
        if (that.data.selected_sport_type.length == 3) {
            //show alert
            wx.showToast({
                title: '最多只能选择三个',
                duration: 2000,
                icon: 'none'
            })
        } else {
            for (let index = 0; index < that.data.selected_sport_type.length; index++) {
                var item = that.data.selected_sport_type[index];
                var item_index = that.data.remain_array.indexOf(item);
                that.data.remain_array.splice(item_index, 1);
            }

            this.setData({
                remain_array: that.data.remain_array,
                select_menu_state: 1,
                select_index: 40
            })
        }
    },

    clicked_style_item: function(event) {
        this.setData({
            select_index: event.currentTarget.id
        })
    },
    cancel_btn_clicked: function() {
        this.setData({
            select_menu_state: 0
        })
    },
    ok_btn_clicked: function(event) {
        //add selected kind to selected_sport_type
        var that = this;
        if (that.data.select_index == 40) {
            wx.showToast({
                title: '请选择一种活动类型',
                duration: 2000,
                icon: 'none'
            })
        } else {
            var item = that.data.remain_array[that.data.select_index];
            that.data.selected_sport_type.push(item);
            this.setData({
                select_menu_state: 0,
                selected_sport_type: that.data.selected_sport_type
            })
        }
    },
    //---------------------------------------------- 

    // function for select weekday array
    clicked_weekday_item: function(event) {
        var that = this;
        var current_value = that.data.weekday_array[event.currentTarget.id];
        that.data.weekday_array[event.currentTarget.id] = (current_value + 1) % 2;
        that.setData({
            weekday_array: that.data.weekday_array
        })
    },
    hideTimeListView: function() {
        var that = this;
        var weekday_one = "星期一";
        for (let index = 0; index < that.data.weekday_array.length; index++) {
            if (that.data.weekday_array[index] == '1') {
                weekday_one = that.data.weekday_strs[index];
                break;
            }
        }
        that.setData({
            select_weekday_state: 0,
            weekday_one: weekday_one
        });
    },
    onclick_weekday: function() {
        var that = this;
        that.setData({
            select_weekday_state: 1
        })
    },

    //function for select time range
    changeStartTime1(event) {
        var _this = this
        _this.setData({
            time_start1: event.detail.value
        })
    },
    changeStartTimeColumn1(event) {
        var arr = this.data.time_start1;
        arr[event.detail.column] = event.detail.value;
        this.setData({
            time_start1: arr
        });
    },

    changeEndTime1(event) {
        var _this = this
        _this.setData({
            time_end1: event.detail.value
        })
    },
    changeEndTimeColumn1(event) {
        var arr = this.data.time_end1;
        arr[event.detail.column] = event.detail.value;
        this.setData({
            time_end1: arr
        });
    },

    changeStartTime2(event) {
        var _this = this
        _this.setData({
            time_start2: event.detail.value
        })
    },
    changeStartTimeColumn2(event) {
        var arr = this.data.time_start2;
        arr[event.detail.column] = event.detail.value;
        this.setData({
            time_start2: arr
        });
    },

    changeEndTime2(event) {
        var _this = this
        _this.setData({
            time_end2: event.detail.value
        })
    },
    changeEndTimeColumn2(event) {
        var arr = this.data.time_end2;
        arr[event.detail.column] = event.detail.value;
        this.setData({
            time_end2: arr
        });
    },

    //function for select booking unit
    clicked_bookingUnit_item: function(event) {
        var that = this;
        that.setData({
            select_bookingUnit_state: 0,
            booking_unit_index: event.currentTarget.id
        })

    },

    onclick_bookingUnit: function() {
        var that = this;
        that.setData({
            select_bookingUnit_state: 1
        })
    },

    //function for add room info array
    deleteRoomInfo: function(event) {
        var that = this;
        var room_index = event.currentTarget.id;
        that.data.room_info_array.splice(room_index, 1);
        that.setData({
            room_info_array: that.data.room_info_array
        })
    },
    onClick_AddRoom: function(event) {
        var that = this;
        that.data.room_info_array.push({ name: '', cost: '0' });
        that.setData({
            room_info_array: that.data.room_info_array
        })
    },
    input_roomName: function(event) {
        var that = this;
        var room_index = event.currentTarget.id;
        that.data.room_info_array[room_index].name = event.detail.value;
        that.setData({
            room_info_array: that.data.room_info_array
        })
    },
    input_roomCost: function(event) {
        var that = this;
        var room_index = event.currentTarget.id;
        that.data.room_info_array[room_index].cost = event.detail.value;
        that.setData({
            room_info_array: that.data.room_info_array
        })
    },
    //function for select type unit 
    clicked_typeUnit_item: function(event) {
        var that = this;
        that.setData({
            select_typeUnit_state: 0,
            type_unit_index: event.currentTarget.id
        });
    },
    onclick_typeUnit: function() {
        var that = this;
        that.setData({
            select_typeUnit_state: 1
        })
    },
    on_click_advanced: function(e) {
        wx.navigateTo({
            url: 'advanced_stadium?id=' + this.data.bossInfo.boss_id,
        })
    },
    changeDateColumn: function(e) {
        var that = this;
        var itemId = parseInt(e.target.dataset.id);
        var itemType = e.target.dataset.type;
        var itemValue = e.detail.value;
        that.blur_group_data(1);
        var groupData = that.data.group_info_array;
        var target = [];
        switch (itemType) {
            case 'start':
                target = groupData[itemId].start;
                break;
            case 'end':
                target = groupData[itemId].end;
                break;
        }
        target[e.detail.column] = itemValue + that.data.baseDate[e.detail.column];
        that.setData({
            group_info_array: groupData
        });
    },
    input_line_change: function(e) {
        var that = this;
        var itemId = parseInt(e.target.dataset.id);
        var itemType = e.target.dataset.type;
        var itemValue = e.detail.value;
        var groupData = that.data.group_info_array;
        var subId = parseInt(e.target.dataset.subid);
        groupData[itemId].group_desc[subId].textLen = e.detail.height;
        that.setData({
            group_info_array: groupData
        })
    },
    blur_group_data: function(e) {
        var that = this;

        // var itemId = parseInt(e.target.dataset.id);
        // var itemType = e.target.dataset.type;
        // var itemValue = e.detail.value;
        var groupData = that.data.group_info_array;
        var isEditting = false;
        for (var k = 0; k < groupData.length; k++) {
            if (!isEditting && groupData[k].editting) isEditting = true;
            groupData[k].editting = false;
            for (var i = 0; i < groupData[k].group_desc.length; i++) {
                if (!isEditting && groupData[k].group_desc[i].editting) isEditting = true;
                groupData[k].group_desc[i].editting = false;
            }
        }
        if (e) {
            clearTimeout(that.data._tmr);
            that.setData({
                group_info_array: groupData
            });
        }
        return isEditting;
    },
    input_group_data: function(e) {
        var that = this;
        var itemId = parseInt(e.target.dataset.id);
        var itemType = e.target.dataset.type;
        var itemValue = e.detail.value;
        var groupData = that.data.group_info_array;
        if (!groupData[itemId].editable) return;
        var isNew = false;
        var isEditting = that.blur_group_data();
        // if (itemType != 'group_package' && itemType != 'group_desc_text') that.blur_group_data(1);
        switch (itemType) {
            case 'group_name':
                groupData[itemId].group_name = itemValue;
                break;
            case 'group_package':
                groupData[itemId].group_package = itemValue;
                break;
            case 'group_package_edit':
                groupData[itemId].editting = true;
                clearTimeout(that.data._tmr);
                if (!isEditting) {
                    that.setData({
                        group_info_array: groupData
                    });
                    // that.data._tmr = setTimeout(function() {

                    // }, 100);
                }
                return;
                break;
            case 'group_price':
                groupData[itemId].group_price = itemValue;
                break;
            case 'group_inprice':
                groupData[itemId].group_inprice = itemValue;
                break;
            case 'start':
                groupData[itemId].start = [
                    itemValue[0] + that.data.baseDate[0],
                    itemValue[1] + that.data.baseDate[1],
                    itemValue[2] + that.data.baseDate[2]
                ];
                break;
            case 'end':
                groupData[itemId].end = [
                    itemValue[0] + that.data.baseDate[0],
                    itemValue[1] + that.data.baseDate[1],
                    itemValue[2] + that.data.baseDate[2]
                ];
                break;
            case 'group_limit':
                groupData[itemId].limit = itemValue;
                break;
            case 'group_condition':
                groupData[itemId].condition = itemValue;
                break;
            case 'group_desc_text':
                var subId = parseInt(e.target.dataset.subid);
                groupData[itemId].group_desc[subId].text = itemValue;
                // groupData[itemId].group_desc[subId].textLen = parseInt(itemValue.length / 20) + 1;
                break;
            case 'group_desc_text_edit':
                var subId = parseInt(e.target.dataset.subid);
                clearTimeout(that.data._tmr);
                if (!isEditting) {
                    groupData[itemId].group_desc[subId].editting = true;
                    that.setData({
                        group_info_array: groupData
                    });
                    // that.data._tmr = setTimeout(function() {}, 100)
                }
                return;
                break;
            case 'group_desc_img':
                isNew = true;
            case 'group_desc_img_edit':
                var subId = parseInt(e.target.dataset.subid);
                var image = groupData[itemId].group_desc[subId].img;
                if (isNew && image != "") return;
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
                        groupData[itemId].group_desc[subId].img = res.tempFilePaths[0];
                        if (image == "")
                            groupData[itemId].group_desc.push(that.data.group_info_array_templ.group_desc[0]);
                        that.setData({
                            group_info_array: groupData
                        })
                    },
                })
                return;
                break;
            case 'group_desc_img_remove':
                var subId = parseInt(e.target.dataset.subid);
                groupData[itemId].group_desc[subId].img = '';
                // groupData[itemId].group_desc.splice(subId, 1);
                break;
        }
        that.setData({
            group_info_array: groupData
        })
    },
    onClick_ModifyGroup: function(e) {
        var that = this;
        var groupData = that.data.group_info_array;
        var itemType = e.target.dataset.type;
        that.blur_group_data(1);
        switch (itemType) {
            case "add":
                groupData.push(that.data.group_info_array_templ);
                var groupNum = 1;
                if (groupData.length > 1) groupNum = parseInt(groupData[groupData.length - 2].group_name.substr(2)) + 1;
                groupData[groupData.length - 1].group_name = '团购' + groupNum;
                break;
            case "remove":

                var itemId = parseInt(e.target.dataset.id);
                wx.showModal({
                    title: '提示',
                    content: '删除后, 该团购无法恢复',
                    // confirmText: '是',
                    // cancelText: '否',
                    success: function(res) {
                        if (res.confirm) {
                            groupData.splice(itemId, 1);
                            that.setData({
                                group_info_array: groupData
                            })
                        }
                    }
                })
                break;
        }
        that.setData({
            group_info_array: groupData
        })
    },
    // ----------------------------------
    onShow: function() {
        console.log("ONSHOW")
    },
    onReady: function() {
        console.log("ONREADY")
    },
    onHide: function() {
        console.log("ONHIDE")
    },

    on_click_image: function(e) {
        var that = this;
        var id = e.target.id;
        that.blur_group_data(1);
        if (id >= that.data.selected)
            wx.chooseImage({
                count: 5,
                success: function(res) {
                    var image = that.data.image_path;
                    for (var i = 0; i < res.tempFiles.length; i++) {
                        if (res.tempFiles[i].size > 10485760) {
                            wx.showToast({
                                title: '图片太大，无法上传！',
                                icon: 'none',
                                duration: 3000
                            });
                            return;
                            that.data.overimagecount++;
                        }
                    }

                    for (var i = 0; i < res.tempFiles.length; i++) {
                        image[that.data.selected] = res.tempFilePaths[i];
                        that.data.selected++;
                        if (that.data.selected > 4) break;
                        that.data.select[that.data.selected] = 1;
                        that.data.isimage++;
                    }
                    that.setData({ image_path: image, selected: that.data.selected, select: that.data.select });
                },
            })
    },
    on_click_delete: function(event) {
        var that = this;
        that.blur_group_data(1);
        var image = that.data.image_path;
        var select_buf = that.data.select;
        var id = event.target.id;
        if (id < 4) {
            var index = 0;
            for (index = id; index < 4; index++) {
                image[index] = image[1 * index + 1];
                select_buf[index] = select_buf[1 * index + 1];
            }
            image[4] = '';
            select_buf[4] = 0;
        } else {
            image[4] = '';
            select_buf[4] = 1;
        }
        that.data.isimage--
            that.setData({
                image_path: image,
                select: select_buf,
                selected: that.data.selected - 1
            })
    },
    blur_on_introduction: function(event) {
        var that = this;
        that.blur_group_data(1);
        this.data.bossInfo.site_introduction = event.detail.value;
    },
    blur_on_service: function(event) {
        var that = this;
        that.blur_group_data(1);
        this.data.bossInfo.site_service = event.detail.value;
    },
    on_click_save: function() {
        var that = this;
        that.blur_group_data(1);
        if (that.data.selected_sport_type.length == 0) {
            wx.showToast({
                title: '请至少选择一个类别',
                icon: 'none'
            })
            return;
        }

        if (that.data.bossInfo.site_introduction == undefined) {
            wx.showToast({
                title: '请填写商家介绍',
                icon: 'none'
            })
            return;
        }
        if (that.data.bossInfo.site_service.length == undefined) {
            wx.showToast({
                title: '请填写服务介绍',
                icon: 'none'
            })
            return;
        }
        if (that.data.bossInfo.site_introduction.length == 0) {
            wx.showToast({
                title: '请填写商家介绍',
                icon: 'none'
            })
            return;
        }
        if (that.data.bossInfo.site_service.length == 0) {
            wx.showToast({
                title: '请填写服务介绍',
                icon: 'none'
            })
            return;
        }

        if (that.data.isimage == 0) {
            wx.showToast({
                title: '请上传商家图片',
                icon: 'none'
            })
            return;
        }
        if (that.data.overimagecount != 0) {
            wx.showToast({
                title: '上传的商家图片不能超过5M',
                icon: 'none'
            })
            return;
        }

        if (false && !that.data.weekday_array._find(item => item == 1)) {
            wx.showToast({
                title: '请在营业时间至少选择一个项目',
                icon: 'none'
            })
            return;
        }


        if ((that.data.time_start1[0] > that.data.time_end1[0]) || ((that.data.time_start1[0] == that.data.time_end1[0]) && ((that.data.time_start1[1] > that.data.time_end1[1])))) {
            wx.showToast({
                title: '结束时间必须晚于开始时间',
                icon: 'none'
            })
            return;
        }
        if ((that.data.time_start2[0] > that.data.time_end2[0]) || ((that.data.time_start2[0] == that.data.time_end2[0]) && ((that.data.time_start2[1] > that.data.time_end2[1])))) {
            wx.showToast({
                title: '结束时间必须晚于开始时间',
                icon: 'none'
            })
            return;
        }

        for (let index = 0; index < that.data.room_info_array.length; index++) {
            var item = that.data.room_info_array[index];
            if (item.name == '') {
                wx.showToast({
                    title: '请填写单价',
                    icon: 'none'
                })
                return;
            }
            if (isNaN(item.cost)) {
                wx.showToast({
                    title: '单价必须是一个数',
                    icon: 'none'
                })
                return;
            }
            if (1.0 * item.cost <= 0) {
                wx.showToast({
                    title: '单价必须是一个正数',
                    icon: 'none'
                })
                return;
            }
        }
        if (that.data.isProcessing) return;
        wx.showLoading({
            title: '上传中'
        })
        that.data.isProcessing = true;
        //set site_type and site_detail
        var all_type = that.get_all_type();
        var first_index = all_type.indexOf(that.data.selected_sport_type[0]);
        var site_type_detail = '' + first_index;
        var site_type = first_index;
        if (that.data.selected_sport_type.length > 1) {
            site_type = 31;
            for (let index = 1; index < that.data.selected_sport_type.length; index++) {
                var item = that.data.selected_sport_type[index];
                var sport_index = all_type.indexOf(item);
                site_type_detail = site_type_detail + ',' + sport_index;
            }
        }
        that.data.bossInfo.site_type = site_type;
        that.data.bossInfo.site_type_detail = site_type_detail;

        //set service_time
        var service_array = [];
        for (let index = 0; index < that.data.weekday_array.length; index++) {
            if (that.data.weekday_array[index] == 1) {
                service_array.push(index + 1);
            }
        }
        var service_time = '' + service_array[0];
        if (service_array.length > 1) {
            for (let index = 1; index < service_array.length; index++) {
                var weekday_index = service_array[index];
                service_time = service_time + ',' + weekday_index
            }
        }
        that.data.bossInfo.service_time = service_time;

        //set start1,end1,start2,end2
        var timeArray = that.data.timeArray;
        var time_start1 = that.data.time_start1;
        var time_end1 = that.data.time_end1;
        var time_start2 = that.data.time_start2;
        var time_end2 = that.data.time_end2;
        var start1 = timeArray[0][time_start1[0]] + ':' + timeArray[1][time_start1[1]] + ':00';
        var end1 = timeArray[0][time_end1[0]] + ':' + timeArray[1][time_end1[1]] + ':00';
        var start2 = timeArray[0][time_start2[0]] + ':' + timeArray[1][time_start2[1]] + ':00';
        var end2 = timeArray[0][time_end2[0]] + ':' + timeArray[1][time_end2[1]] + ':00';
        start2 = end1;
        end2 = end1;
        that.data.bossInfo.start1 = start1;
        that.data.bossInfo.end1 = end1;
        that.data.bossInfo.start2 = start2;
        that.data.bossInfo.end2 = end2;

        //set service unit
        var service_unit = that.data.booking_units[that.data.booking_unit_index].value;
        that.data.bossInfo.service_unit = service_unit;

        //set cancel_time
        var cancel_time = that.data.type_units[that.data.type_unit_index].value;
        that.data.bossInfo.cancel_time = cancel_time;


        // prepare uploading Group Data
        var groupData = that.data.group_info_array;
        var uploadImgList = [];
        for (var i = 0; i < groupData.length; i++) {
            var groupItem = groupData[i];
            var dt = that.data.dateArray;
            var base = that.data.baseDate;
            var st = groupItem.start;
            var end = groupItem.end;
            groupItem.start = dt[0][st[0] - base[0]] + '-' + dt[1][st[1] - base[1]] + '-' + dt[2][st[2] - base[2]];
            groupItem.end = dt[0][end[0] - base[0]] + '-' + dt[1][end[1] - base[1]] + '-' + dt[2][end[2] - base[2]];
            groupItem.boss_id = app.globalData.userInfo.user_id;
            for (var j = 0; j < groupItem.group_desc.length; j++) {
                var groupDesc = groupItem.group_desc[j];
                if (groupDesc.text == '' && groupDesc.img == '') {
                    groupItem.group_desc.splice(j, 1);
                    break;
                }
                if (groupDesc.img.indexOf(app.globalData.uploadURL) > -1) {
                    var path = groupDesc.img.split('/');
                    groupDesc.img = path[path.length - 1];
                } else {
                    uploadImgList.push({
                        no: groupItem.no,
                        subId: j,
                        img: groupDesc.img
                    });
                }
            }
        }

        //upload booking array to the server
        wx.request({
            url: app.globalData.mainURL + 'api/datamanage/updateRoom',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'roomInfo': that.data.room_info_array,
                'user_id': app.globalData.userInfo.user_id
            },
            success: function() {}
        });
        wx.request({
            url: app.globalData.mainURL + 'api/editSiteInfo1',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'bossInfo': that.data.bossInfo,
                'user_id': app.globalData.userInfo.user_id,
                'bossGroup': that.data.group_info_array
            },
            success: function(ret) {
                console.log(ret);
                if (ret.data.status) {
                    for (var index = 0; index < that.data.image_path.length; index++) {
                        var tempFilePath = that.data.image_path[index];
                        var index_buf = 0
                        if (tempFilePath) {
                            if (that.data.image_buf._find(item => (item == tempFilePath))) {
                                //add only url in the database
                                var path = tempFilePath.split('/');
                                var fileName = path[path.length - 1];
                                wx.request({
                                    url: app.globalData.mainURL + 'api/addSitePictureURL',
                                    method: 'POST',
                                    header: {
                                        'content-type': 'application/json'
                                    },
                                    data: {
                                        'user_id': app.globalData.userInfo.user_id,
                                        'image': fileName,
                                        'id': index
                                    }
                                })
                            } else {
                                //upload image
                                wx.uploadFile({
                                    url: app.globalData.mainURL + 'api/addSitePicture',
                                    filePath: tempFilePath,
                                    name: 'file',
                                    formData: {
                                        'user_id': app.globalData.userInfo.user_id,
                                        'id': index
                                    }
                                })
                            }
                        }
                    }
                    for (var i = 0; i < ret.data.group_info.length; i++) {
                        var groupItem = ret.data.group_info[i];
                        for (var j = 0; j < groupItem.group_desc.length; j++) {
                            var groupDesc = groupItem.group_desc[j];
                            var tempFilePath = groupDesc.img;

                            if (uploadImgList._find(item => (item.img == tempFilePath))) {
                                //upload image
                                wx.uploadFile({
                                    url: app.globalData.mainURL + 'api/datamanage/addGroupPicture',
                                    filePath: tempFilePath,
                                    name: 'file',
                                    formData: {
                                        'no': groupItem.no,
                                        'subid': j
                                    }
                                })
                            }
                        }
                    }
                    setTimeout(function() {
                        app.globalData.have_stadium = 1
                        wx.setStorageSync("have_stadium", 1)
                        wx.switchTab({
                            url: '../profile',
                        })
                        that.data.isProcessing = false;
                    }, 3000)
                }
            },
            complete: function() {
                wx.hideLoading({});
            }
        })
    }
})
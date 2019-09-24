/*
 fileName:
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute


var globalData = {
    data: {
        curDate: 0,
        priceDateList: [],
        sellDateList: [],
        roomList: [],
        timeList: [],
        priceList: [],
        bookList: [],
        weekStr: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        stStr: {
            disabled: 0,
            booked: 1,
            enabled: 2,
            cancelled: 3,
            activated: 4,
            selected: 5,
            mine: 0,
            nouser: -1
        },
    },

    setDigit: function (num, length) {
        var r = "" + num;
        while (r.length < length) {
            r = "0" + r;
        }
        return r;
    },
};
$(function () {
    var that = globalData;

    that.data.curBossId = $('input[name="boss_id"]').val();
    that.data.curUserId = $('input[name="boss_id"]').val();
    that.data.curDate = new Date();
    var saveDate = readSelectedDate();
    if (saveDate) {
        saveDate = saveDate.replace(/-/g, '/');
        that.data.curDate = new Date(saveDate);
    }
    var futureWeekArr = [];
    for (var i = 0; i <= 52; i++) {
        futureWeekArr.push(i);
    }
    that.data.futureWeekArr = futureWeekArr;
    that.data.site = {
        site: JSON.parse($('.siteInfo').val()),
        site_room: JSON.parse($('.roomDataInfo').val()),
        site_booking: JSON.parse($('.bookingDataInfo').val()),
        boss_room: JSON.parse($('.bossRoomInfo').val()),
    };

    $('input[name="bookTimeSelector"]').val(that.data.curDate.getFullYear()
        + '-' + (that.data.curDate.getMonth() + 1)
        + '-' + (that.data.curDate.getDate())
    );
    $('select[name="priceTimeSelector"]').val(that.data.curDate.getDay());
    $(".datepicker-inline").datepicker({
        format: 'yyyy-mm-dd'
    });
    makeListData();

    $('.scripts').remove();
});

function makeListData() {
    var that = globalData;
    var da = new Date();
    // da.setFullYear(da.getFullYear()-1);
    var data = that.data.site;
    var cur = that.data.curDate;
    that.data.refDate = that.data.curDate.toDateString() + ' ';
    var weekStr = that.data.weekStr;
    that.data.dateList = [];
    var site = data.site[0];
    var service_time = site.service_time.split(',');
    var isFirstDate = true;
    for (var index = 0; index < 365; index++) {
        var year = da.getFullYear();
        var month = da.getMonth() + 1;
        var day = da.getDate();
        var isExist = false;
        for (var mm = 0; mm < service_time.length; mm++) {
            if (da.getDay() == (parseInt(service_time[mm]) % 7)) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            if (isFirstDate && that.data.curDate.toDateString() == da.toDateString()) {
                da.setDate(da.getDate() + 1);
                that.data.curDate = new Date(da.toDateString());
                that.data.refDate = that.data.curDate.toDateString() + ' ';
            } else {
                da.setDate(da.getDate() + 1);
            }
            continue;
        }
        isFirstDate = false;
        var str = '';
        var isToday = '';
        if (day == (new Date()).getDate() && month == (new Date()).getMonth() + 1) {
            str += '今天 (';
        }
        if (day == that.data.curDate.getDate() && month == that.data.curDate.getMonth() + 1) {
            isToday = 'cur';
        }

        str += year + '年' + month + '月' + day + '日';
        if (day == (new Date()).getDate() && month == (new Date()).getMonth() + 1) {
            str += ')';
        }
        that.data.dateList.push({
            date: str,
            dateIndex: index,
            istoday: isToday,
            weekday: weekStr[da.getDay()]
        });

        da.setDate(da.getDate() + 1);
    }
    // console.log(that.data.dateList);
    that.data.priceDateList = [];
    da = new Date();
    for (var i = 0; i < 7; i++) {
        var isExist = false;
        for (var mm = 0; mm < service_time.length; mm++) {
            if (i == (parseInt(service_time[mm]) % 7)) {
                isExist = true;
                break;
            }
        }
        if (!isExist) continue;
        var isToday = '';
        if (i == that.data.curDate.getDay()) {
            isToday = 'cur';
        }
        that.data.priceDateList.push({
            date: '',
            dateIndex: i,
            istoday: isToday,
            weekday: weekStr[i]
        })
    }

    that.data.cancel_time = site.cancel_time;
    var room = data.site_room;
    var booking = data.site_booking;
    var boss_room = data.boss_room;

    var start1_time = new Date(that.data.refDate + ' ' + site.start1);
    var end1_time = new Date(that.data.refDate + site.end1);
    var start2_time = new Date(that.data.refDate + site.start2);
    var end2_time = new Date(that.data.refDate + site.end2);
    var diff1 = end1_time.getHours() - start1_time.getHours();
    var diff2 = end2_time.getHours() - start2_time.getHours();
    var time_step = parseFloat(site.service_unit); // unit:hour

    that.data.timeList = [];

    var tmp = new Date(start1_time.toString());
    for (var i = 0; i < diff1 + time_step; i += time_step) {
        if (tmp > end1_time) tmp = new Date(end1_time.toString());
        var hr = tmp.getHours();
        var min = tmp.getMinutes();
        that.data.timeList.push(that.setDigit(hr, 2) + ':' + that.setDigit(min, 2));
        tmp.setTime(tmp.getTime() + time_step * 3600000);
    }
    var tmp = new Date(start2_time.toString());
    for (var i = 0; i < diff2 + time_step; i += time_step) {
        if (i == 0 && site.end1 == site.start2) {
            tmp.setTime(tmp.getTime() + time_step * 3600000);
            continue;
        }
        if (tmp > end2_time) tmp = new Date(end2_time.toString());
        var hr = tmp.getHours();
        var min = tmp.getMinutes();
        that.data.timeList.push(that.setDigit(hr, 2) + ':' + that.setDigit(min, 2));
        tmp.setTime(tmp.getTime() + time_step * 3600000);
    }

    that.data.roomList = [];
    that.data.bookList = [];
    that.data.priceList = [];

    for (var i = 0; i < room.length; i++) {
        that.data.roomList.push(room[i].room_name);
    }

    that.data.totalPrice = 0;
    var ST = that.data.stStr;
    for (var kk = 0; kk < that.data.timeList.length - 1; kk++) {
        var arr = [];
        var arr1 = [];
        for (var i = 0; i < room.length; i++) {
            var cost = room[i].cost;
            var priceUserId = room[i].user_id;
            var priceStatus = ST.enabled;
            var priceCost = cost + '';

            var status = ST.disabled; // 0 - disabled, 1- booked, 2- enabled, 4- active time

            var curstart = new Date(that.data.refDate + that.data.timeList[kk]);
            var curend = new Date(that.data.refDate + that.data.timeList[kk + 1]);

            // if current time is in service period then change status to booked
            if (curstart >= start1_time && curend <= end1_time) {
                status = ST.booked;
                room[i].user_id = ST.nouser;
            }
            if (curstart >= start2_time && curend <= end2_time) {
                status = ST.booked;
                room[i].user_id = ST.nouser;
            }

            // if current time is service time, then change status to enabled
            if (status != ST.disabled) {
                for (var mm = 0; mm < service_time.length; mm++) {
                    if (curstart.getDay() == (parseInt(service_time[mm]) % 7)) {
                        status = ST.enabled;
                        break;
                    }
                }
            }
            // if current status is booked, then change status to disabled
            if (status == ST.booked) status = ST.disabled;

            // if current cell is already user booked, then change status to disabled
            if (status != ST.disabled) {

                for (var jj = 0; jj < boss_room.length; jj++) {
                    var bookRecord = JSON.parse(boss_room[jj].room_info);
                    if (curstart < (new Date(boss_room[jj].active_date.replace(/-/g, '/') + ' 00:00:00'))
                    || boss_room[jj].info_type != 0
                    ) continue;
                    var isBreak = false;
                    for (var mm = 0; mm < bookRecord.length; mm++) {
                        var item = bookRecord[mm];
                        if (item.room_id != room[i].id) continue; // if current room is not matched then continue

                        // if service time is active time, then change status to active
                        if (curstart >= (new Date(boss_room[jj].active_date.replace(/-/g, '/') + ' ' + item.start_time)) &&
                            curend <= (new Date(boss_room[jj].active_date.replace(/-/g, '/') + ' ' + item.end_time))) {
                            status = ST.activated;
                            cost = item.cost;
                            room[i].user_id = 0;
                            room[i].book_id = boss_room[jj].id;
                            isBreak = true;
                            break;
                        }
                    }
                    if (isBreak) break;
                }

                for (var jj = 0; jj < boss_room.length; jj++) {
                    var bookRecord = JSON.parse(boss_room[jj].room_info);
                    var priceStart = new Date(curstart.toLocaleString());
                    priceStart.setDate(priceStart.getDate() + 7);
                    if (priceStart < (new Date(boss_room[jj].active_date.replace(/-/g, '/') + ' 00:00:00')) ||
                        priceStart.getDay() != (new Date(boss_room[jj].active_date.replace(/-/g, '/') + ' 00:00:00')).getDay() ||
                        boss_room[jj].info_type == 0) continue;
                    var isBreak = false;
                    for (var mm = 0; mm < bookRecord.length; mm++) {
                        var item = bookRecord[mm];
                        if (item.room_id != room[i].id) continue; // if current room is not matched then continue

                        // if service time is active time, then change status to active
                        if (curstart >= (new Date(that.data.refDate + ' ' + item.start_time)) &&
                            curend <= (new Date(that.data.refDate + ' ' + item.end_time))) {
                            priceCost = item.cost;
                            if (curstart >= (new Date(boss_room[jj].active_date.replace(/-/g, '/') + ' 00:00:00'))) {
                                cost = priceCost;
                            }
                            priceUserId = ST.mine;
                            priceStatus = ST.disabled;
                            isBreak = true;
                            break;
                        }
                    }
                    if (isBreak) break;
                }

                for (var jj = 0; jj < booking.length; jj++) {
                    var bookRecord = JSON.parse(booking[jj].book_info);
                    var isBreak = false;
                    if (booking[jj].state == ST.cancelled) continue; // if order is cancelled then continue
                    for (var mm = 0; mm < bookRecord.length; mm++) {
                        var item = bookRecord[mm];
                        if (item.room_id != room[i].id) continue; // if current room is not matched then continue
                        if (item.state == ST.cancelled) continue; // if cell status is canceled then continue

                        // if service time is active time, then change status to active
                        if (curstart >= (new Date(item.start_time.replace(/-/g, '/'))) &&
                            curend <= (new Date(item.end_time.replace(/-/g, '/')))) {
                            status = ST.activated;
                            cost = -cost;
                            room[i].user_id = item.user_id;
                            room[i].book_id = booking[jj].id;
                            isBreak = true;
                            break;
                        }
                    }
                    if (isBreak) break;
                }
            }

            // if cell's end time is passed now, then change status to disabled
            if (curend < new Date()) {
                // status = ST.disabled;
                // room[i].user_id = ST.nouser;
            }

            // if already booked by other person or active time, then change status to disabled
            if ((status == ST.booked || status == ST.activated) && room[i].user_id != that.data.curUserId)
                status = ST.disabled;

            var rD = new Date(that.data.refDate);
            var dateString = rD.getFullYear() + '年' + (rD.getMonth() + 1) + '月' + rD.getDate() + '日';
            arr.push({
                cost: cost,
                status: status,
                room_id: room[i].id,
                book_id: room[i].book_id,
                user_id: room[i].user_id,
                start_time: curstart.getTime(),
                end_time: curend.getTime()
            });
            arr1.push({
                cost: Math.abs(priceCost * 1).toFixed(2),
                status: priceStatus,
                room_id: room[i].id,
                user_id: priceUserId,
                start_time: curstart.getTime(),
                end_time: curend.getTime()
            });
            if (status == 1) that.data.totalPrice += parseFloat(cost);
        }
        that.data.originalPrice = that.data.totalPrice;

        that.data.bookList.push(arr);
        that.data.priceList.push(arr1);
    }
    that.data.sellDateList = that.data.dateList;
    // if (that.data.main_menu == '1') that.data.dateList = that.data.priceDateList;

    renderData();
}

function renderData() {
    var that = globalData;
    var ST = that.data.stStr;
    var timeList = that.data.timeList;
    var content_html = '';
    for (var i = 0; i < timeList.length; i++) {
        content_html += '<tr><td>' + timeList[i] + '</td></tr>'
    }
    $('.timeTable').html(content_html);

    var roomList = that.data.roomList;
    content_html = '';
    for (var i = 0; i < roomList.length; i++) {
		var _style = '';
		if((roomList[i].split(' ')).length<2) _style = 'word-break: break-all;';
        content_html += '<th style="'+_style+'">' + roomList[i] + '</th>';
    }
    $('.updateTable thead').html(content_html);

    var bookList = that.data.bookList;
    content_html = '';
    console.log(bookList);
    for (var i = 0; i < bookList.length; i++) {
        var rowItem = bookList[i];
        content_html += '<tr>';
        for (var j = 0; j < rowItem.length; j++) {
            var cellItem = rowItem[j];
            var contentStr = '￥' + cellItem.cost;
			var _style = '';
            if (cellItem.status == ST.disabled && cellItem.user_id == ST.mine) { contentStr = '线下已售'; _style='font-size: 10px;'; }
            else if (cellItem.status == ST.disabled && cellItem.user_id == ST.nouser) contentStr = '禁止';
            else if (cellItem.status == ST.disabled) contentStr = '已售';
            else if (cellItem.status == ST.booked) contentStr = '￥' + cellItem.cost;
            else if (cellItem.status == ST.selected) { contentStr = '线下已售'; _style='font-size: 10px;'; }
            else if (cellItem.status == ST.activated) contentStr = '已售';
            else if (cellItem.status == ST.enabled) contentStr = '￥' + cellItem.cost;
			_style = '';
            content_html += '<td ' +
                ' data-type="book" ' +
                ' data-i="' + i + '" ' +
                ' data-j="' + j + '" ' +
                ' data-status="' + cellItem.status + '" ' +
                ' data-bookid="' + cellItem.book_id + '" ' +
                ' data-roomid="' + cellItem.room_id + '" ' +
                ' data-userid="' + cellItem.user_id + '" ' +
                ' data-start="' + cellItem.start_time + '" ' +
                ' data-end="' + cellItem.end_time + '" ' +
                ' onclick="bookRoom(this);"' +
                ' style="'+_style+'">' + contentStr + '</td>'
        }
        content_html += '</tr>';
    }
    $('.updateTable[data-type="book"] tbody').html(content_html);


    var priceList = that.data.priceList;
    content_html = '';
    for (var i = 0; i < priceList.length; i++) {
        var rowItem = priceList[i];
        content_html += '<tr>';
        for (var j = 0; j < rowItem.length; j++) {
            var cellItem = rowItem[j];
            content_html += '<td ' +
                ' data-type="price" ' +
                ' data-i="' + i + '" ' +
                ' data-j="' + j + '" ' +
                ' data-status="' + cellItem.status + '" ' +
                ' data-bookid="' + cellItem.book_id + '" ' +
                ' data-roomid="' + cellItem.room_id + '" ' +
                ' data-userid="' + cellItem.user_id + '" ' +
                ' data-start="' + cellItem.start_time + '" ' +
                ' data-end="' + cellItem.end_time + '" ' +
                ' onclick="bookRoom(this);" ' +
                '>￥' + cellItem.cost + '</td>'
        }
        content_html += '</tr>';
    }
    $('.updateTable[data-type="price"] tbody').html(content_html);
	
    $('.roomInfoNotify').html(that.data.room_info_notify);

	var headHeight1 = parseInt($('.updateTable[data-type="book"]').find('thead th').height());
	var headHeight2 = parseInt($('.updateTable[data-type="price"]').find('thead th').height());
	$($('.timeTable')[0]).css('margin-top', headHeight1 - 15);
	$($('.timeTable')[1]).css('margin-top', headHeight2 - 15);
}

function bookRoom(elem) {
    var that = globalData;
    var elem = $(elem);
    var roomid = elem.attr('data-j') * 1;
    var timeid = elem.attr('data-i') * 1;
    var changeType = elem.attr('data-type');
    var start = that.data.timeList[timeid];
    var end = that.data.timeList[timeid + 1];
    var room = that.data.bookList[timeid][roomid];
    if (changeType == 'price') room = that.data.priceList[timeid][roomid];
    var ST = that.data.stStr;
    switch (room.status) {
        case ST.activated: // if current cell is in activated time
        case ST.disabled: // if old disabled
            if (room.user_id == ST.mine || changeType == 'price') {
                room.status = ST.selected; // change status to selected
            }
            break;
        case ST.selected: // if old booked
            if (room.user_id == ST.mine || room.user_id == that.data.curUserId) {
                room.status = ST.disabled; // change status to enabled
            }
            break;
        case ST.booked: // if old booked
            if (room.user_id == ST.mine || room.user_id == that.data.curUserId) {
                room.status = ST.enabled; // change status to enabled
            }
            break;
        case ST.enabled: // if old available
            room.status = ST.booked;
            room.user_id = ST.mine;
            room.book_id = (!room.book_id) ? '' : room.book_id;
            break;
    }
    that.data.room_info_notify = '';
    console.log('room status : ', room.status);
    renderData();
    var selectedCnt = 0;
    var selectedRoom = {};
    for (var i = 0; i < that.data.bookList.length; i++) {
        for (var j = 0; j < that.data.bookList[i].length; j++) {
            if (that.data.bookList[i][j].status == ST.selected || that.data.bookList[i][j].status == ST.booked) {
                selectedCnt++;
                selectedRoom = that.data.bookList[i][j];
            }
        }
    }
    if (selectedCnt != 1) return;
    console.log(selectedRoom);
    var boss_room = that.data.site.boss_room;
    var total_start = '';
    var total_end = '';
    var total_dates = [];
    var baseDate = '2000/01/01 ';
    for (var i = 0; i < boss_room.length; i++) {
        var item = boss_room[i];
        if (item.info_type == 1) continue;
        var room_info = JSON.parse(item.room_info);
        var roomItem = room_info.find(function (a) {
            return a.room_id == selectedRoom.room_id &&
                (new Date(selectedRoom.start_time)).toTimeString() == (new Date(baseDate + a.start_time)).toTimeString() &&
                (new Date(selectedRoom.end_time)).toTimeString() == (new Date(baseDate + a.end_time)).toTimeString()
        });
        if (roomItem) {
            var actDate = new Date(item.active_date.replace(/-/g, '/'));
            total_dates.push({
                date: actDate.getFullYear() + '年' + (actDate.getMonth() + 1) + '月' + actDate.getDate() + '日',
                cmp: actDate,
                dayNum: actDate.getDay(),
                desc: (roomItem.desc) ? roomItem.desc : ''
            });
        }
    }
    var room_info_notify = '';
    if (total_dates.length > 0) {
        var filtered = total_dates.filter(function (a) {
            return a.dayNum == that.data.curDate.getDay();
        });
        if (filtered.length > 0) room_info_notify += filtered[0].date;
        var k = 0;
        var totWeeks = 0;
        for (var i = 0; i < filtered.length - 1; i++) {
            var item = filtered[i];
            var stt = item.cmp.setDate(item.cmp.getDate() + 7);
            var ent = filtered[i + 1].cmp.getTime();
            k++;
            if (stt == ent && filtered[i].desc == filtered[i+1].desc) continue;

            if (k == 1) {
                if (filtered[i].desc != '') room_info_notify += ', ' + filtered[i].desc;
                room_info_notify += ', 1周';
                if (room_info_notify != '') room_info_notify += '; ';
                totWeeks++;
                room_info_notify += filtered[i + 1].date;
            } else {
                room_info_notify += ' ~ ' + filtered[i].date;
                if (filtered[i].desc != '') room_info_notify += ',' + filtered[i].desc;
                room_info_notify += ', ' + (k) + '周';
                totWeeks += k;
                room_info_notify += '; ' + filtered[i + 1].date;
            }
            k = 0;
        }
        if (k >= 1) {
            room_info_notify += '~' + filtered[filtered.length - 1].date;
            if (filtered[filtered.length - 1].desc != '') room_info_notify += ', ' + filtered[filtered.length - 1].desc;
            room_info_notify += ', ' + (k + 1) + '周';
            totWeeks += k + 1;
        } else {
            if (filtered[filtered.length - 1].desc != '') room_info_notify += ', ' + filtered[filtered.length - 1].desc;
            room_info_notify += ', 1周';
            totWeeks++;
        }
        room_info_notify += '; (共' + totWeeks + '周)';

    }

    if (room_info_notify == '') room_info_notify = '可出售';
    that.data.room_info_notify = room_info_notify;
    renderData();
}

function selectDate(elem) {
    var that = globalData;
    elem = $(elem);
    var type = elem.attr('data-type');
    if (!that.data.site) return;
    var curDate = $('input[name="bookTimeSelector"]').val();
    storeSelectedDate(curDate);
    curDate = curDate.replace(/-/g, '/');
    that.data.curDate = new Date(curDate);
    if (type == 'price') {
        var id = elem.val() * 1 - (new Date()).getDay() + 7;
        if (id < 7) id += 7;
        curDate = (new Date()).setDate((new Date()).getDate() + id);
        curDate = new Date(curDate);
        curDate = curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + curDate.getDate();
        $('input[name="bookTimeSelector"]').val(curDate);
        that.data.curDate = new Date(curDate);
    }

    $('select[name="priceTimeSelector"]').val(that.data.curDate.getDay());

    makeListData();
}

function storeSelectedDate(content) {
    localStorage.setItem('curSelDate', content);
}

function readSelectedDate(content) {
    return localStorage.getItem('curSelDate');
}

function confirmUpdate(elem) {
    var that = globalData;
	var todayDate = new Date();
	todayDate = todayDate.getFullYear() + '/' + (todayDate.getMonth()+1) +'/' + todayDate.getDate();
	todayDate = new Date(todayDate);
    if(that.data.curDate < todayDate) {
        alert('设置不能更新');
        return;
    }
    var elem = $(elem);
    var ST = that.data.stStr;
    var type = elem.attr('data-type');
    var price = parseFloat($('input[name="updatedPrice"]').val());
    if (!price) price = '0';
    else price = price.toFixed(2);
    that.data.priceInput = price;
    that.data.futureWeek = parseInt($('select[name="futureWeek"]').val()) + 1;
    var bookList = that.data.bookList;
    if (type == 'price') bookList = that.data.priceList;
    if (type == 'removebook') {
        that.data.futureWeek = 1;
        // for (var i = 0; i < bookList.length; i++) {
        //     var rowItem = bookList[i];
        //     for (var j = 0; j < rowItem.length; j++) {
        //         var item = rowItem[j];
        //         if (item.user_id == ST.mine && item.status == ST.booked) {
        //             item.status = ST.enabled;
        //         }
        //         if (item.user_id == ST.mine && item.status == ST.selected) {
        //             item.status = ST.enabled;
        //         }
        //     }
        // }
    } else if (type == 'price') {
        for (var i = 0; i < bookList.length; i++) {
            var rowItem = bookList[i];
            for (var j = 0; j < rowItem.length; j++) {
                var item = rowItem[j];
                if (item.user_id == ST.mine && (item.status == ST.booked || item.status == ST.selected)) {
                    item.cost = price;
                    // if (type == 'update') {
                    // item.status = ST.disabled;
                    // }
                }
            }
        }
    }

    renderData();
    applyBooking(type);
}

function applyBooking(type) {
    var that = globalData;
    var bookData = that.data.bookList;
    if (type == 'price') bookData = that.data.priceList;
    var uploads = [];
    var curTime = new Date();
    var ST = that.data.stStr;

    for (var i = 0; i < bookData.length; i++) {
        var element = [];
        element.push(bookData[i]);
        element = element[0];
        for (var j = 0; j < element.length; j++) {
            var item = [];
            item.push(element[j]);
            item = item[0];
            // if (item.user_id == app.globalData.userInfo.user_id && (item.status == 1 || item.status == 4)) {
            if (item.user_id == ST.mine && (item.status == ST.selected || item.status == ST.booked)) {
                var start = new Date(item.start_time);
                var end = new Date(item.end_time);
                var uploadItem = {};
                uploadItem.room_id = item.room_id;
                uploadItem.start_time = start.getHours() + ':' + start.getMinutes() + ':' + start.getSeconds();
                uploadItem.end_time = end.getHours() + ':' + end.getMinutes() + ':' + end.getSeconds();
                uploadItem.cost = item.cost;
                uploadItem.desc = $('input[name="bookListDescription"]').val();
                uploads.push(uploadItem);
            }
        }
    }
    uploads.sort(function (a, b) {
        return (parseInt(a.room_id) > parseInt(b.room_id)) ? 1 : -1;
    });
    uploads.sort(function (a, b) {
        if (parseInt(a.room_id) > parseInt(b.room_id)) return 1;
        else if (parseInt(a.room_id) < parseInt(b.room_id)) return -1;
        else
            return (a.start_time > b.start_time) ? 1 : -1;
    });
    order_booking(uploads, type);
}

function order_booking(room_info, type) {
    var that = globalData;
    var active_date = new Date(that.data.refDate + ' 08:00:00');
    var clear_date = new Date(that.data.refDate + ' 08:00:00');
    var info_type = 0;
    var infoLen = that.data.futureWeek - 1;
    if (type == 'price') {
        active_date.setDate(active_date.getDate() + 7);
        info_type = 1;
        infoLen = 1;
    }
    var dbItems = [];
    var clearItems = [];
    var removeCnt = 52;
    if (type == 'removebook') {
        removeCnt = 1;
        infoLen = 0;
    }
    for (var i = 0; i < removeCnt; i++) {
        clearItems.push({
            boss_id: that.data.curBossId,
            info_type: info_type,
            active_date: clear_date.getTime(),
            room_info: room_info,
        })
        clear_date.setDate(clear_date.getDate() + 7);
    }
    for (var i = 0; i < infoLen; i++) {
        dbItems.push({
            boss_id: that.data.curBossId,
            info_type: info_type,
            active_date: active_date.getTime(),
            room_info: room_info,
        })
        active_date.setDate(active_date.getDate() + 7);
    }

    $.ajax({
        type: 'post',
        url: baseURL + 'api/datamanage/bossRoomBooking',
        contentType: 'application/json',
        dataType: 'application/json',
        data: JSON.stringify({room_info: dbItems, clear_info: clearItems}),
        complete: function (res) {
            if (type == 'price') {
                $('.notifyTag').html('1周后价格设置会生效')
            } else if(type=='removebook') {
                $('.notifyTag').html('可售设置已生效')
            }else {
                $('.notifyTag').html('已售设置已生效')
            }
            $('.notifyTag').fadeIn('fast');
            setTimeout(function () {
                $('.notifyTag').fadeOut('fast', function () {
                    location.reload();
                });
            }, 1500);
            // location.reload();
//                        if (res.status == 'success') {
//                            alert('取消成功!');
//                            location.reload();
//                        } else {
//                            alert('取消失败!');
//                        }
        }
    });
}

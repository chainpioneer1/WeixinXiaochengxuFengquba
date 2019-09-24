function withData(param) {
    return param < 10 ? '0' + param : '' + param;
}

function getLoopArray(start, end, step) {
    var start = start || 0;
    var end = end || 1;
    var array = [];
    if (step == undefined) step = 1;
    for (var i = start; i <= end; i += step) {
        array.push(withData(i));
    }
    return array;
}

function getNewDateArry() {
    // 当前时间的处理
    var newDate = new Date();
    newDate.setTime(newDate.getTime() + 300000)
    var hour = withData(newDate.getHours());
    var minu = withData(newDate.getMinutes());
    return [hour, minu];
}

function timePicker() {
    // 返回默认显示的数组和联动数组的声明
    var time = getNewDateArry();
    var timeArray = [
        [],
        []
    ];
    timeArray[0] = getLoopArray(0, 23);
    timeArray[1] = getLoopArray(0, 59, 5);
    return {
        timeArray: timeArray,
        time: time
    }
}
module.exports = {
    timePicker: timePicker
}
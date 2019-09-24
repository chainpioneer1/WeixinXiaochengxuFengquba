/*
 fileName: map.js
 description: process AMap function and manage Tourist areas
 */

// variables for AMap
var map = null; // AMap pointer
var imageLayer = null;
var state = 'new';
// selected position
var leftBottom = [];
var rightTop = [];

// current position
var currentLocation = [];

// flag for MouseTool
var isFirst = true;
var base_url = "";
//list for Attraction Mark
var markList = [];
var markerId = 100;

var district, polygons = [], citycode;

var citySelect, districtSelect, areaSelect;

var opts;


/* function: initMap
 description: Init AMap using center position and add AMap.MouseTool plugin
 param: center // center position of current map view
 */
function initMap(center) {

    map = new AMap.Map('custom-map-container', {
        resizeEnable: true,
        zoom: 16,
        center: center//地图中心点
    });

    citySelect = document.getElementById('city');
    districtSelect = document.getElementById('district');
    areaSelect = document.getElementById('street');
//行政区划查询
    opts = {
        subdistrict: 1,   //返回下一级行政区
        showbiz: false  //最后一级返回街道信息
    };
    district = new AMap.DistrictSearch(opts);//注意：需要使用插件同步下发功能才能这样直接使用
    district.search('中国', function (status, result) {
        if (status == 'complete') {
            getData(result.districtList[0]);
        }
    });

    var mouseTool = new AMap.MouseTool(map); //在地图中添加MouseTool插件
    var drawRectangle = mouseTool.rectangle(); //用鼠标工具画矩形
    isFirst = true;
    AMap.event.addListener(mouseTool, 'draw', function (e) {
        if (!isFirst) return;
        mouseTool.close();
        isFirst = false;
        var path = e.obj.getPath();
        leftBottom = [path[3].lng, path[3].lat];
        rightTop = [path[1].lng, path[1].lat];

        var arr = [leftBottom, rightTop];
        console.log(e.obj.getPath());//获取路径
        $('#area-position').val(JSON.stringify(arr));
    });


}


function getData(data, level) {
    var bounds = data.boundaries;
    if (bounds) {
        for (var i = 0, l = bounds.length; i < l; i++) {
            var polygon = new AMap.Polygon({
                map: map,
                strokeWeight: 1,
                strokeColor: '#CC66CC',
                fillColor: '#CCF3FF',
                fillOpacity: 0.5,
                path: bounds[i]
            });
            polygons.push(polygon);
        }
        map.setFitView();//地图自适应
    }


    //清空下一级别的下拉列表
    if (level === 'province') {
        citySelect.innerHTML = $("#cityName").html();
        districtSelect.innerHTML = $("#districtName").html();
        areaSelect.innerHTML = '';
    } else if (level === 'city') {
        districtSelect.innerHTML = '';
        areaSelect.innerHTML = '';
    } else if (level === 'district') {
        areaSelect.innerHTML = '';
    }

    var subList = data.districtList;
    var contentSub, curlevel, curList;
    if ($("#provinceName").html() != '') {
        contentSub = new Option($("#provinceName").html());
        curList = document.querySelector('#province');
        curList.add(contentSub);
    }
    if ($("#cityName").html() != '') {
        contentSub = new Option($("#cityName").html());
        curList = document.querySelector('#city');
        curList.add(contentSub);
    }
    if ($("#districtName").html() != '') {
        contentSub = new Option($("#districtName").html());
        curList = document.querySelector('#district');
        curList.add(contentSub);
    }

    if (subList) {
        contentSub = new Option('--请选择--');
        curlevel = subList[0].level;
        curList = document.querySelector('#' + curlevel);
        curList.add(contentSub);
        for (var i = 0, l = subList.length; i < l; i++) {
            var name = subList[i].name;
            var levelSub = subList[i].level;
            var cityCode = subList[i].citycode;
            contentSub = new Option(name);
            contentSub.setAttribute("value", levelSub);
            contentSub.center = subList[i].center;
            contentSub.adcode = subList[i].adcode;
            curList.add(contentSub);
        }
    }

}
function search(obj) {
    //清除地图上所有覆盖物
    for (var i = 0, l = polygons.length; i < l; i++) {
        polygons[i].setMap(null);
    }
    var option = obj[obj.options.selectedIndex];
    var keyword = option.text; //关键字
    var adcode = option.adcode;
    console.log(JSON.stringify(option.value));
    district.setLevel(option.value); //行政区级别
    if (option.value == 'province') $("#provinceName").html(keyword);
    else if (option.value == 'city') $("#cityName").html(keyword);
    else if (option.value == 'district') $("#districtName").html(keyword);
    district.setExtensions('all');
    //行政区查询
    //按照adcode进行查询可以保证数据返回的唯一性
    district.search(adcode, function (status, result) {
        if (status === 'complete') {
            getData(result.districtList[0], obj.id);
        }
    });
}
function setCenter(obj) {
    map.setCenter(obj[obj.options.selectedIndex].center)
}

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {

    var position = $('#area-position').val();
    if (position != '' && position != undefined) {
        currentLocation = [116.403322, 39.900255];
        initMap(currentLocation);
        var positionObj = JSON.parse(position);
        var url = $('#custom-base-url').val();
        base_url = url;

        leftBottom = positionObj[0];
        rightTop = positionObj[1];

        var overlay = $('#area-overlay').val();
        var imageLayer = new AMap.ImageLayer({
            url: url + 'uploads/' + overlay,
            bounds: new AMap.Bounds(
                leftBottom,   //左下角
                rightTop    //右上角
            ),
            zooms: [5, 18]
        });

        map = new AMap.Map('custom-map-container', {
            resizeEnable: true,
            center: leftBottom,
            zoom: 16,
            layers: [
                new AMap.TileLayer(),
                imageLayer
            ]
        });

        addPointFromArea(url);
    }
    else {
        // init AMap
        currentLocation = [116.403322, 39.900255];
        initMap(currentLocation);
    }
    //
    //$(function () {
    //    imageLayer = new AMap.ImageLayer({
    //        url: base_url + 'uploads/jiaoyu.jpg',
    //        bounds: new AMap.Bounds(
    //            leftBottom,     //左下角
    //            rightTop        //右上角
    //        ),
    //        zooms: [15, 18],
    //        map: map,
    //        draggable: true
    //    });
    //
    //    var mapMarker = new AMap.Marker({
    //        map: map,
    //        position: currentLocation,
    //        draggable: true
    //    });
    //    var dragging = false;
    //    mapMarker.on('dragstart', function (e) {
    //        dragging = true;
    //    });
    //    mapMarker.on('dragend', function () {
    //        dragging = false;
    //    });
    //    mapMarker.on('mousemove', function (e) {
    //        if (dragging) {
    //            var target = e['target']['G'];
    //            var position = [e['lnglat']['lng'], e['lnglat']['lat']];
    //            // calculate moving amount
    //            var dx = position[0] - currentLocation[0];
    //            var dy = position[1] - currentLocation[1];
    //            currentLocation = position;
    //            // move overlay
    //            leftBottom[0] += dx;
    //            leftBottom[1] += dy;
    //            rightTop[0] += dx;
    //            rightTop[1] += dy;
    //
    //            imageLayer.setBounds(new AMap.Bounds(leftBottom, rightTop));
    //        }
    //    });
    //});

    /*
     Event code that find string for Search of Tourist Area
     */
    AMap.plugin('AMap.Autocomplete', function () {//回调函数
        var autoOptions = {
            city: "", //城市，默认全国
            input: "city_Name"//使用联想输入的input的id
        };
        var autocomplete = new AMap.Autocomplete(autoOptions);

        AMap.event.addListener(autocomplete, "select", function (data) {
            console.log(data);
            currentLocation = [data['poi']['location']['lng'], data['poi']['location']['lat']];
            initMap(currentLocation);
        });
    });
    /*
     Event code that upload overlay image to Tourist Area
     */
    var files;
    $('#upload-overlay').on('change', prepareUpload);
    function prepareUpload(event) {
        event.stopPropagation(); // Stop stuff happening
        event.preventDefault(); // Totally stop stuff happening
        files = event.target.files;
        if (this.files[0].type != "image/jpeg" && this.files[0].type != "image/png") {
            window.alert("图片格式不正确.");
            return;
        }
        if (this.files[0].size > 10000000) {
            window.alert("图片要不超过10M.");
            return;
        }

        var data = new FormData();
        $.each(files, function (key, value) {
            data.append(key, value);
        });

        $.ajax({
            url: base_url + 'api/Areas/upload',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function (data, textStatus, jqXHR) {
                if (typeof data.error === 'undefined') {
                    if (data['status'] == true) {
                        $('#area-overlay').val(data['file']);
                        if (map == null) {
                            map = new AMap.Map('custom-map-container', {
                                resizeEnable: true,
                                center: currentLocation,
                                zoom: 16,
                            });
                        }

                        if (imageLayer != null) {
                            imageLayer.setMap(null);
                        }
                        imageLayer = new AMap.ImageLayer({
                            url: base_url + 'uploads/' + data['file'],
                            bounds: new AMap.Bounds(
                                leftBottom,   //左下角
                                rightTop    //右上角
                            ),
                            zooms: [5, 18],
                            draggable: true
                        });
                        imageLayer.setMap(map);
                    }
                }
                else {
                    // Handle errors here
                    console.log('ERRORS: ' + data.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle errors here
                console.log('ERRORS: ' + textStatus);
                // STOP LOADING SPINNER
            }
        });

    }


    //upload image for attraction
    $('#upload-point-image').on('change', uploadPointImage);
    function uploadPointImage(event) {
        event.stopPropagation(); // Stop stuff happening
        event.preventDefault(); // Totally stop stuff happening
        files = event.target.files;
        if (this.files[0].type != "image/jpeg" && this.files[0].type != "image/png") {
            window.alert("图片格式不正确.");
            return;
        }
        if (this.files[0].size > 10000000) {
            window.alert("图片要不超过10M.");
            return;
        }
        var data = new FormData();
        $.each(files, function (key, value) {
            data.append(key, value);
        });

        $.ajax({
            url: base_url + 'api/Areas/upload',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function (data, textStatus, jqXHR) {
                if (typeof data.error === 'undefined') {
                    if (data['status'] == true) {
                        var url = base_url + 'uploads/' + data['file'];
                        $("#point-item-image").attr("src", url);
                        $("#pointimage").val(data['file']);
                    }
                }
                else {
                    // Handle errors here
                    console.log('ERRORS: ' + data.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle errors here
                console.log('ERRORS: ' + textStatus);
                // STOP LOADING SPINNER
            }
        });

    }

    //upload audio for attraction
    $('#upload-point-audio').on('change', uploadPointAudio);
    function uploadPointAudio(event) {
        event.stopPropagation(); // Stop stuff happening
        event.preventDefault(); // Totally stop stuff happening
        files = event.target.files;
        if (this.files[0].type != "audio/mp3" && this.files[0].type != "audio/wav") {
            window.alert("录音格式不正确.");
            return;
        }
        if (this.files[0].size > 60000000) {
            window.alert("录音要不超过60M.");
            return;
        }

        $("#pointaudio_view").html('录音上传中...');

        var data = new FormData();
        $.each(files, function (key, value) {
            data.append(key, value);
        });

        $.ajax({
            url: base_url + 'api/Areas/upload',
            type: 'POST',
            data: data,
//            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function (data, textStatus, jqXHR) {
                if (typeof data.error === 'undefined') {
                    if (data['status'] == true) {
                        $("#pointaudio").val(data['file']);
                        $("#pointaudio_view").html(data['file']);
                    }
                }
                else {
                    // Handle errors here
                    console.log('ERRORS: ' + data.error);
                    $("#pointaudio_view").html(data.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle errors here
                console.log('ERRORS: ' + textStatus);
                $("#pointaudio_view").html(textStatus);
                // STOP LOADING SPINNER
            }
        });

    }

    //upload audio for attraction
    $('#upload-area-audio').on('change', uploadAreaAudio);
    function uploadAreaAudio(event) {

        event.stopPropagation(); // Stop stuff happening
        event.preventDefault(); // Totally stop stuff happening
        files = event.target.files;
        if (this.files[0].type != "audio/mp3" && this.files[0].type != "audio/wav") {
            window.alert("录音格式不正确.");
            return;
        }
        if (this.files[0].size > 60000000) {
            window.alert("录音要不超过60M.");
            return;
        }

        $("#area-audio-file").html('录音上传中...');

        var data = new FormData();
        $.each(files, function (key, value) {
            data.append(key, value);
        });

        $.ajax({
            url: base_url + 'api/Areas/upload',
            type: 'POST',
            data: data,
//            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function (data, textStatus, jqXHR) {
                if (typeof data.error === 'undefined') {
                    if (data['status'] == true) {
                        $("#area-audio-file").html(data['file']);
                    }
                }
                else {
                    // Handle errors here
                    console.log('ERRORS: ' + data.error);

                    $("#area-audio-file").html(data.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle errors here
                console.log('ERRORS: ' + textStatus);
                $("#area-audio-file").html(textStatus);
                // STOP LOADING SPINNER
            }
        });

    }
});
var isNewPoint = 0;
function showAddPoint() {

    showPointMarker();
    isNewPoint = 1;
    $('.point-add-view').show();
    $('.point-list-view').hide();

    $('#pointname').val('');
    $('#pointdescription').val('');
    $('#pointprice').val('');
    $('#point-view-index').val('0');
    $("#point-item-image").attr("src", '');
    $("#pointimage").val('');
    $("#pointfree").attr("checked", false);


}
var marker = null;

function showPointMarker() {

    markerId = markerId + 1;
    marker = new AMap.Marker({ //添加自定义点标记
        map: map,
        position: map.getCenter(), //基点位置
        offset: new AMap.Pixel(-17, -42), //相对于基点的偏移位置
        draggable: true,
        id: markerId
    });
}
// Add attraction to Tourist Area
function addPointFromArea(url) {

    var areaid = $('#point-list').val();
    $.post(url + "api/Areas/edit/" + areaid, '', function (result) {
        console.log(result);

        var objList = JSON.parse(result['point_list']);
        console.log(objList);
        for (var i = 0; i < objList.length; i++) {
            var obj = objList[i];
            var pointName = obj['name'];
            var pointDescription = obj['description'];
            var pointPrice = obj['price'];
            var pointImage = obj['image'];
            var pointAudio = obj['audio_1'];

            var pointFree = obj['trial'];
            var pointPosition = JSON.parse(obj['position']);

            markerId = markerId + 1;
            var marker = new AMap.Marker({ //添加自定义点标记
                map: map,
                position: pointPosition, //基点位置
                offset: new AMap.Pixel(-17, -42), //相对于基点的偏移位置
                draggable: true,
                id: markerId
            });

            marker.on('dragend', function (e) {
                var target = e['target']['G'];
                var position = [e['lnglat']['lng'], e['lnglat']['lat']];
                $('#pointposition-' + target['id']).val(JSON.stringify(position));
                console.log(e);
            });

            marker.on('click', function (e) {
                var target = e['target']['G'];
                var targetId = target['id'];
                showEditPoint(targetId);
                console.log(e);
            });

            markList.push(marker);

            $("#pointList").append("<li id='pointitem-" + markerId + "'><div class='col-sm-6'>" + pointName + "</div>" +
                "<input style='display: none;' value='" + pointDescription + "'/>" +
                "<input style='display: none;' value='" + pointPrice + "'/>" +
                "<input id='pointposition-" + markerId + "' style='display: none;' value='" + JSON.stringify(pointPosition) + "'/>" +
                "<input style='display: none;' value='" + pointImage + "'/>" +
                "<input style='display: none;' value='" + pointAudio + "'/>" +
                "<input style='display: none;' value='" + pointFree + "'/>" +
                "<div class='col-sm-3' data-id='" + markerId + "' onclick='editPoint(this);'><a>编辑</a></div>" +
                "<div class='col-sm-3' data-id='" + markerId + "' onclick='deletePoint(this);'><a >删除</a></div>" +
                "</li>");
        }
    });
}

function addPoint(param) {
    var pointName = $('#pointname').val();
    var pointDescription = $('#pointdescription').val();
    var pointPrice = $('#pointprice').val();
    var pointImage = $('#pointimage').val();
    var pointAudio = $('#pointaudio').val();

    var pointFree = ($('#pointfree').is(":checked") == true) ? '1' : '0';

    $('.point-add-view').hide();
    $('.point-list-view').show();
    console.log(pointImage + ',' + pointAudio);

    if (param == 1) {

        var pointIndex = $('#point-view-index').val();
        var ptCenter = map.getCenter();

        if (pointIndex == '0') {

            marker.on('dragend', function (e) {
                var target = e['target']['G'];
                var position = [e['lnglat']['lng'], e['lnglat']['lat']];
                $('#pointposition-' + target['id']).val(JSON.stringify(position));
                console.log(e);
            });

            marker.on('click', function (e) {
                isNewPoint = 0;
                var target = e['target']['G'];
                var targetId = target['id'];
                showEditPoint(targetId);
                console.log(e);
            });

            markList.push(marker);

            $("#pointList").append("<li id='pointitem-" + markerId + "'><div class='col-sm-6'>" + pointName + "</div>" +
                "<input style='display: none;' value='" + pointDescription + "'/>" +
                "<input style='display: none;' value='" + pointPrice + "'/>" +
                "<input id='pointposition-" + markerId + "' style='display: none;' value='" + JSON.stringify([ptCenter['lng'], ptCenter['lat']]) + "'/>" +
                "<input style='display: none;' value='" + pointImage + "'/>" +
                "<input style='display: none;' value='" + pointAudio + "'/>" +
                "<input style='display: none;' value='" + pointFree + "'/>" +
                "<div class='col-sm-3' data-id='" + markerId + "' onclick='editPoint(this);'><a>编辑</a></div>" +
                "<div class='col-sm-3' data-id='" + markerId + "' onclick='deletePoint(this);'><a>删除</a></div>" +
                "</li>");
        }
        else {
            var pointInfo = $('#pointitem-' + pointIndex).children();
            $(pointInfo[0]).text(pointName);
            $(pointInfo[1]).val(pointDescription);
            $(pointInfo[2]).val(pointPrice);
            $(pointInfo[4]).val(pointImage);
            $(pointInfo[5]).val(pointAudio);
            $(pointInfo[6]).val(pointFree);
        }
    } else {
        if (isNewPoint == 1)
            marker.setMap(null);
    }
    return marker;
}
// edit Attraction
function editPoint(e) {
    isNewPoint = 0;
    var targetId = $(e).attr('data-id');
    showEditPoint(targetId);
}

//show Point Edit window
function showEditPoint(targetId) {

    var pointInfo = $('#pointitem-' + targetId).children();
    var pointName = $(pointInfo[0]).text();
    var pointDescription = $(pointInfo[1]).val();
    var pointPrice = $(pointInfo[2]).val();
    var pointImage = $(pointInfo[4]).val();
    var pointAudio = $(pointInfo[5]).val();
    var pointFree = $(pointInfo[6]).val();

    $('#pointname').val(pointName);
    $('#pointdescription').val(pointDescription);
    $('#pointprice').val(pointPrice);
    $('#point-view-index').val(targetId);

    $("#point-item-image").attr("src", base_url + 'uploads/' + pointImage);
    $("#pointaudio_view").html(pointAudio);
    $("#pointimage").val(pointImage);
    $("#pointaudio").val(pointAudio);
    if (pointFree == '1') { // 1-trial, 0-need pay

        $('#pointfree')[0].checked = true;
    } else {

        $('#pointfree')[0].checked = false;
    }

    $('.point-add-view').show();
    $('.point-list-view').hide();
}

// delete Attraction
function deletePoint(e) {
    var targetId = $(e).attr('data-id');
    for (var i = 0; i < markList.length; i++) {
        var maker = markList[i];
        var makerId = maker['G']['id'];
        if (targetId == makerId) {
            map.remove(maker);
            markList.splice(i, 1);
            break;
        }
    }
    $(e).parent().remove();
}

function addTouristArea(url, isEdit) {
    var area = $("#areaname").val();
    var rate = parseFloat($("#arearate").val()) / 100;
    var overlay = $('#area-overlay').val();
    var provinceText = $('#provinceName').html();
    var cityText = $('#cityName').html();
    var districtText = $('#districtName').html();
    var pointText = $('#city_Name').val();
    if (districtText == '' || cityText == '' || provinceText == '') {
        window.alert("Please select address correctly.");
        return;
    }
    var address = provinceText + "," +
        cityText + "," + districtText + "," + pointText;

    if (area == '') {
        window.alert("Please enter area name.");
        return;
    }

    var info = {
        overay: overlay,
        position: $('#area-position').val() != 0 ? JSON.parse($('#area-position').val()) : '',
        audio: $('#area-audio-file').html()
    };

    var attraction_list = getAttractions();
    var price = 0;
    for (var i = 0; i < attraction_list.length; i++) {
        if (attraction_list[i].trial == '1') continue;
        price += parseInt(attraction_list[i].price);
    }

    var touristArea = {
        name: area,
        discount_rate: rate,
        address: address,
        status: 0,
        type: 2, // 1-course,     2-area
        price: price,
        info: JSON.stringify(info),
        point_list: JSON.stringify(attraction_list)
    };
    console.log(touristArea);

    var area_id = $('#point-list').val();
    var url_suffix = (area_id == undefined) ? "" : ("/" + area_id);
    $.post(url + "api/Areas/save" + url_suffix, touristArea, function (result) {
        window.alert("Area data saved succefully.");
        location.href = url + 'area';
    });
}

function getAttractions() {
    var ret = [];
    var area_id = $('#point-list').val();
    var list = document.getElementById('pointList');
    var pointList = list.getElementsByTagName('li');

    for (var i = 0; i < pointList.length; i++) {
        var pointInfo = $(pointList[i]).children();
        var pointName = $(pointInfo[0]).text();
        var pointDescription = $(pointInfo[1]).val();
        var pointPrice = $(pointInfo[2]).val();
        var pointPosition = $(pointInfo[3]).val();
        var pointImage = $(pointInfo[4]).val();
        var pointAudio = $(pointInfo[5]).val();
        var pointFree = $(pointInfo[6]).val();
        var point = {
            id: area_id + "_" + (i + 1),
            name: pointName,
            description: pointDescription,
            price: pointPrice == '' ? '0' : pointPrice,
            discount_rate: '1',
            image: pointImage,
            audio_1: pointAudio,
            audio_2: pointAudio,
            audio_3: pointAudio,
            trial: pointFree,
            position: pointPosition
        };
        ret.push(point);
    }
    return ret;//JSON.stringify(ret);
}

function deleteAreaConfirm(id) {
    $('#custom-confirm-delete-view').show();
    $('#current-areaid').val(id);
}

function deleteArea(url, type) {

    $('#custom-confirm-delete-view').hide();
    if (type == 1) {
        $.post(url + "api/Areas/remove/" + $('#current-areaid').val(), function (result) {
            location.href = url + 'area';
        });
    }
}

function deployAreaConfirm(id) {

    $('#custom-confirm-deploy-view').show();
    $('#current-areaid').val(id);
    $('#current-areastatus').val(1);
}

function undeployAreaConfirm(id) {

    $('#custom-confirm-deploy-view').show();
    $('#current-areaid').val(id);
    $('#current-areastatus').val(0);
}

function deployArea(url, type) {

    $('#custom-confirm-deploy-view').hide();
    if (type == 1) { //if ok button clicked

        var touristArea = {
            id: $('#current-areaid').val(),
            status: $('#current-areastatus').val()
        };

        $.post(url + "api/Areas/save/" + touristArea['id'], touristArea, function (result) {
            location.href = url + 'area';
        });
    }
}

function uploadOverlay() {
    $('#upload-overlay').click();
}
function uploadPointImage() {
    $('#upload-point-image').click();
}
function uploadPointAudio() {
    $('#upload-point-audio').click();
}
function uploadAreaAudio() {
    $('#upload-area-audio').click();
}
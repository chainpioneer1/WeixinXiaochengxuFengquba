/*
 fileName: map.js
 description: process AMap function and manage Tourist areas
 */

// variables for googleMap
var map = null; // googleMap pointer
// selected position
var leftBottom = [39.913155, 116.391541];
var rightTop = [39.92223931, 116.402635];

// current position
var currentLocation = [];

// flag for MouseTool
var isFirst = true;
//list for Attraction Mark
var markList = [];
var markerId = 100;

//var opts;
var mapMarker = null;
var mapMarker1 = null;
var cornerLocation = [];
var zoom_data;

// searchBox datas
var search_autocomplete;

MyImageOverlay.prototype = new google.maps.OverlayView();

var imageLayer = null;


/* function: initMap
 description: Init AMap using center position and add AMap.MouseTool plugin
 param: center // center position of current map view
 */
function initMap(center) {
    zoom_data = parseInt($("#map_zoom_data").val());
    if ($("#map_zoom_data").val() == undefined) zoom_data = 13;
}

function initAutocomplete() {

    var option = {
        types: ['(regions)']
    };
    // Create the search box and link it to the UI element.
    var input = document.getElementById('city_Name');
    search_autocomplete = new google.maps.places.Autocomplete(input, option);

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    search_autocomplete.addListener('place_changed', function () {
        var place = search_autocomplete.getPlace();
        console.log(place);
        map.panTo(place.geometry.location);
        setLayerPosition(place.geometry.location, 0);
        mapMarker.setPosition(place.geometry.location);
    });
}

function setLayerPosition(pos, mode) {

    var position = [pos.lat(), pos.lng()];
    var pos1 = [];
    var markPosition = [];
    if (mode == 0) { // move center point
        // calculate moving amount
        var dx = position[0] - currentLocation[0];
        var dy = position[1] - currentLocation[1];
        currentLocation = position;
        // move overlay
        leftBottom[0] += dx;
        leftBottom[1] += dy;
        rightTop[0] += dx;
        rightTop[1] += dy;
        for (var i = 0; i < markList.length; i++) {

            pos1 = JSON.parse($('#pointposition-' + markList[i].id).val());

            markPosition = [pos1[0] + dx, pos1[1] + dy];

            $('#pointposition-' + markList[i].id).val(JSON.stringify(markPosition));

            markList[i].setPosition(new google.maps.LatLng(markPosition[0], markPosition[1]));
        }
        cornerLocation = [leftBottom[0], rightTop[1]];
        mapMarker1.setPosition(new google.maps.LatLng(cornerLocation[0], cornerLocation[1]));
    } else if (mode == 1) {
        // move overlay
        originalLocation = [leftBottom[0], rightTop[1]];
        leftBottom[0] = position[0];
        rightTop[1] = position[1];
        rightTop[0] = currentLocation[0] + (currentLocation[0] - position[0]);
        leftBottom[1] = currentLocation[1] - (position[1] - currentLocation[1]);

        var rate = [(originalLocation[0] - currentLocation[0]) / (position[0] - currentLocation[0]),
            (originalLocation[1] - currentLocation[1]) / (position[1] - currentLocation[1])];

        for (var i = 0; i < markList.length; i++) {

            pos1 = JSON.parse($('#pointposition-' + markList[i].id).val());
            markPosition = [currentLocation[0] + (pos1[0] - currentLocation[0]) / rate[0],
                currentLocation[1] + (pos1[1] - currentLocation[1]) / rate[1]];
            //if(pos1[0]-currentLocation[0]<.0001) markPosition[0] = pos1[0];
            //if(pos1[1]-currentLocation[1]<.000001) markPosition[1] = pos1[1];
            $('#pointposition-' + markList[i].id).val(JSON.stringify(markPosition));
            markList[i].setPosition(new google.maps.LatLng(markPosition[0], markPosition[1]));
        }
    }
    var swBound = new google.maps.LatLng(leftBottom[0], leftBottom[1]);
    var neBound = new google.maps.LatLng(rightTop[0], rightTop[1]);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);
    imageLayer.updateBounds(bounds);
    var arr = [leftBottom, rightTop];
    $('#area-position').val(JSON.stringify(arr));
}

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {

    mapMarker = null;
    mapMarker1 = null;
    imageLayer = null;
    // dragging = false;
    // dragging1 = false;
    cornerLocation = [];
    map = null;

    currentLocation = [(leftBottom[0] + rightTop[0]) / 2, (leftBottom[1] + rightTop[1]) / 2];
    cornerLocation = [leftBottom[0], rightTop[1]];
    var position = $('#area-position').val();
    $("#page_loaded_status").val('1');
    initMap(currentLocation);
    //return;
    if (position != '' && position != undefined) {
        var positionObj = JSON.parse(position);
        var url = $('#custom-base-url').val();

        leftBottom = positionObj[0];
        rightTop = positionObj[1];
        cornerLocation = [leftBottom[0], rightTop[1]];
        currentLocation = [(leftBottom[0] + rightTop[0]) / 2, (leftBottom[1] + rightTop[1]) / 2];

        addPointFromArea(baseURL);

        var overlay = $('#area-overlay').val();
        initMap(currentLocation);
        map = new google.maps.Map(document.getElementById('custom-map-container'), {
            center: new google.maps.LatLng(currentLocation[0], currentLocation[1]),
            zoom: zoom_data,
            scrollWheel: true
        });
        initAutocomplete();
        var swBound = new google.maps.LatLng(leftBottom[0], leftBottom[1]);
        var neBound = new google.maps.LatLng(rightTop[0], rightTop[1]);
        var centerPos = new google.maps.LatLng(currentLocation[0], currentLocation[1]);
        var cornerPos = new google.maps.LatLng(leftBottom[0], rightTop[1]);
        var bounds = new google.maps.LatLngBounds(swBound, neBound);

        var srcImage = (overlay == '') ? (baseURL + 'assets/images/transparent.png') : (baseURL + 'uploads/' + overlay);
        imageLayer = new MyImageOverlay(bounds, srcImage, map);

        mapMarker = new google.maps.Marker({
            map: map,
            icon: baseURL + 'assets/images/control.png',
            position: centerPos,
            draggable: true
        });

        google.maps.event.addListener(mapMarker, 'drag', function () {
            setLayerPosition(mapMarker.getPosition(), 0);
        });

        mapMarker1 = new google.maps.Marker({
            map: map,
            icon: baseURL + 'assets/images/control.png',
            position: cornerPos,
            draggable: true
        });

        google.maps.event.addListener(mapMarker1, 'drag', function () {
            setLayerPosition(mapMarker1.getPosition(), 1);
        });
    }
    else {
        // init AMap
        currentLocation = [(leftBottom[0] + rightTop[0]) / 2, (leftBottom[1] + rightTop[1]) / 2];
        cornerLocation = [leftBottom[0], rightTop[1]];
        initMap(currentLocation);
        map = new google.maps.Map(document.getElementById('custom-map-container'), {
            center: new google.maps.LatLng(currentLocation[0], currentLocation[1]),
            zoom: zoom_data,
            scrollWheel: true
        });
        initAutocomplete()
        var swBound = new google.maps.LatLng(leftBottom[0], leftBottom[1]);
        var neBound = new google.maps.LatLng(rightTop[0], rightTop[1]);
        var centerPos = new google.maps.LatLng(currentLocation[0], currentLocation[1]);
        var cornerPos = new google.maps.LatLng(leftBottom[0], rightTop[1]);
        var bounds = new google.maps.LatLngBounds(swBound, neBound);

        var srcImage = baseURL + 'assets/images/transparent.png';

        imageLayer = new MyImageOverlay(bounds, srcImage, map);

        mapMarker = new google.maps.Marker({
            map: map,
            icon: baseURL + 'assets/images/control.png',
            position: centerPos,
            draggable: true
        });

        google.maps.event.addListener(mapMarker, 'drag', function () {
            setLayerPosition(mapMarker.getPosition(), 0);
        });

        mapMarker1 = new google.maps.Marker({
            map: map,
            icon: baseURL + 'assets/images/control.png',
            position: cornerPos,
            draggable: true
        });

        google.maps.event.addListener(mapMarker1, 'drag', function () {
            setLayerPosition(mapMarker1.getPosition(), 1);
        });
    }
    /*
     Event code that find string for Search of Tourist Area
     */

    /////////////////////////////////////////////////////

    var country_list = (JSON.parse($('#countryList').val()));
    $('#searchContinent').on('change', function () {
        var continent = parseInt($('#searchContinent').val());
        var country_html = '<option value="0" selected>选择国家</option>';
        for (var i = 1; i <= country_list.length; i++) {
            if (parseInt(country_list[i - 1].continent) == continent) {
                if (country_list[i - 1].country == '中国') continue;
                country_html += '<option value="' + i + '" >' + country_list[i - 1].country + '</option>';
            }
        }
        $('#searchCountry').html(country_html);
    })

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

        $("#area-image-message").html('图片上传中...');

        $.ajax({
            url: baseURL + 'api/Areas/upload',
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
                            map = new google.maps.Map(document.getElementById('custom-map-container'), {
                                center: new google.maps.LatLng(currentLocation[0], currentLocation[1]),
                                zoom: zoom_data,
                            });
                        }

                        if (imageLayer != null) {
                            imageLayer.setMap(null);
                            imageLayer = null;
                        }
                        var swBound = new google.maps.LatLng(leftBottom[0], leftBottom[1]);
                        var neBound = new google.maps.LatLng(rightTop[0], rightTop[1]);
                        var centerPos = new google.maps.LatLng(currentLocation[0], currentLocation[1]);
                        var cornerPos = new google.maps.LatLng(leftBottom[0], rightTop[1]);
                        var bounds = new google.maps.LatLngBounds(swBound, neBound);

                        var srcImage = baseURL + 'uploads/' + data['file'];

                        imageLayer = new MyImageOverlay(bounds, srcImage, map);

                    }
                    $("#area-image-message").html('');
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

    //upload image for Thumb
    $('#upload-thumb-file').on('change', uploadThumbImage);

    function uploadThumbImage(event) {
        event.stopPropagation(); // Stop stuff happening
        event.preventDefault(); // Totally stop stuff happening
        files = event.target.files;
        if (this.files[0].type != "image/jpeg" && this.files[0].type != "image/png") {
            window.alert("图片格式不正确.");
            return;
        }
        if (this.files[0].size > 1000000) {
            window.alert("图片要不超过10M.");
            return;
        }
        var data = new FormData();
        $.each(files, function (key, value) {
            data.append(key, value);
        });

        $("#upload-thumb-msg").html('图片上传中...');
        $("#upload-thumb-msg").show();

        $.ajax({
            url: baseURL + 'api/Areas/imgupload',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function (data, textStatus, jqXHR) {
                if (typeof data.error === 'undefined') {
                    if (data['status'] == true) {
                        var url = baseURL + 'uploads/' + data['file'];
                        console.log(url);
                        $("#area-thumb-img").attr("src", url);
                    }
                    $("#upload-thumb-msg").html(data['file']);
                    $("#upload-thumb-msg").hide();
                }
                else {
                    // Handle errors here
                    console.log('ERRORS: ' + data.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#upload-thumb-msg").html('');
                $("#upload-thumb-msg").hide();
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
        if (this.files[0].size > 1000000) {
            window.alert("图片要不超过1M.");
            return;
        }
        var data = new FormData();
        $.each(files, function (key, value) {
            data.append(key, value);
        });

        $("#point-image-message").html('图片上传中...');
        $("#point-image-message").show();

        $.ajax({
            url: baseURL + 'api/Areas/upload',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function (data, textStatus, jqXHR) {
                if (typeof data.error === 'undefined') {
                    if (data['status'] == true) {
                        var url = baseURL + 'uploads/' + data['file'];
                        $("#point-item-image").attr("src", url);
                        $("#point-item-image").show();
                        $("#pointimage").val(data['file']);

                        $("#point-image-message").html('');
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

        $("#pointaudio_view").show();
        $("#pointaudio_view").html('录音上传中...');

        var data = new FormData();
        $.each(files, function (key, value) {
            data.append(key, value);
        });

        $.ajax({
            url: baseURL + 'api/Areas/upload',
            type: 'POST',
            data: data,
//            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                $('#upload-point-audio').val('');
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

        $("#area-audio-file").show();
        $("#area-audio-file").html('录音上传中...');

        var data = new FormData();
        $.each(files, function (key, value) {
            data.append(key, value);
        });
        console.log(data);

        $.ajax({
            url: baseURL + 'api/Areas/upload',
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

    if ($("#page_id").html() == '新增景区' || $("#page_id").html() == '编辑景区') {
        $("#page_loaded_status").val("1");
    }
    if ($('#cityName').val() != '') {
        var cityName = $('#cityName').val().split(',');
        var continent_view = $('#searchContinent').children();
        var cur_cont = 0;
        for (var i = 0; i < 6; i++) {
            if (cityName[0] == $(continent_view[i]).html()) {
                cur_cont = i;
            }
            $(continent_view[i])[0].selected = false;
        }
        $(continent_view[cur_cont])[0].selected = true;
        var country_view = '';
        country_view += '<option value="0">选择国家</option>';
        country_view += '<option value="1" selected>' + cityName[1] + '</option>';
        $('#searchCountry').html(country_view);
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

    $("#point-item-image").hide();
    $("#pointaudio_view").html('');
}

var marker = null;

function showPointMarker() {

    markerId = markerId + 1;
    marker = new google.maps.Marker({ //添加自定义点标记
        map: map,
        position: map.getCenter(), //基点位置
        icon: baseURL + 'assets/images/point.png',
        draggable: true,
        id: markerId
    });
    var position = map.getCenter();
    console.log(position);
    $('#point-position-temp').val(JSON.stringify([position.lat(), position.lng()]));
    google.maps.event.addListener(marker, 'mouseup', function () {
        //marker.on('dragend', function (e) {
        //var target = e['target']['G'];
        var position = [marker.getPosition().lat(), marker.getPosition().lng()];
        $('#point-position-temp').val(JSON.stringify(position));
        console.log($('#point-position-temp').val());
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
            var marker = new google.maps.Marker({ //添加自定义点标记
                map: map,
                position: new google.maps.LatLng(pointPosition[0], pointPosition[1]), //基点位置
                icon: baseURL + 'assets/images/point.png',
                draggable: true,
                id: markerId
            });

            google.maps.event.addListener(marker, 'mouseup', function () {
                //marker.on('dragend', function (e) {
                //var target = e['target']['G'];
                var position = [this.getPosition().lat(), this.getPosition().lng()];
                $('#pointposition-' + this.id).val(JSON.stringify(position));
                console.log(marker.id);
            });

            google.maps.event.addListener(marker, 'click', function () {
                //marker.on('click', function (e) {
                //var target = e['target']['G'];
                var targetId = this.id;
                showEditPoint(targetId);
                console.log(targetId);
            });

            markList.push(marker);

            $("#pointList").append("<li id='pointitem-" + markerId + "'><div class='col-sm-6'>" + pointName + "</div>" +
                "<input style='display: none;' value='" + pointDescription + "'/>" +
                "<input style='display: none;' value='" + pointPrice + "'/>" +
                "<input id='pointposition-" + markerId + "' style='display: none;' value='" + JSON.stringify(pointPosition) + "'/>" +
                "<input style='display: none;' value='" + pointImage + "'/>" +
                "<input style='display: none;' value='" + pointAudio + "'/>" +
                "<input style='display: none;' value='" + pointFree + "'/>" +
                "<div class='col-sm-3' data-id='" + markerId + "' onclick='editPoint(this);'><a >编辑</a></div>" +
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
    if (pointName.length > 10) {
        window.alert("景点名称要不超过10个字符");
        return;
    }
    if (pointDescription.length > 500) {
        window.alert("景点简述要不超过500个字符");
        return;
    }

    $('.point-add-view').hide();
    $('.point-list-view').show();
    console.log(pointImage + ',' + pointAudio);

    if (param == 1) {

        var pointIndex = $('#point-view-index').val();
        var ptCenter = JSON.parse($('#point-position-temp').val());
        console.log(ptCenter + ",,," + pointIndex);
        $('#point-position-temp').val('');
        if (pointIndex == '0') {
            //console.log(marker);
            google.maps.event.addListener(marker, 'mouseup', function () {
                //marker.on('dragend', function (e) {
                //var target = e['target']['G'];
                var position = [this.getPosition().lat(), this.getPosition().lng()];
                $('#pointposition-' + this.id).val(JSON.stringify(position));
                console.log(this.id + ',,' + JSON.stringify(position));
            });

            google.maps.event.addListener(marker, 'click', function () {
                //marker.on('click', function (e) {
                isNewPoint = 0;
                //var target = e['target']['G'];
                var targetId = this.id;
                showEditPoint(targetId);
                console.log(targetId);
            });

            markList.push(marker);

            $("#pointList").append("<li id='pointitem-" + markerId + "'><div class='col-sm-6'>" + pointName + "</div>" +
                "<input style='display: none;' value='" + pointDescription + "'/>" +
                "<input style='display: none;' value='" + pointPrice + "'/>" +
                "<input id='pointposition-" + markerId + "' style='display: none;' value='" + JSON.stringify([ptCenter[0], ptCenter[1]]) + "'/>" +
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
    console.log(targetId);
    $('#point-position-temp').val($('#pointposition-' + targetId).val());

    $('#pointname').val(pointName);
    $('#pointdescription').val(pointDescription);
    $('#pointprice').val(pointPrice);
    $('#point-view-index').val(targetId);

    $("#pointimage").val(pointImage);
    $("#pointaudio").val(pointAudio);
    if (pointFree == '1') { // 1-trial, 0-need pay

        $('#pointfree')[0].checked = true;
    } else {

        $('#pointfree')[0].checked = false;
    }

    $('.point-add-view').show();
    $('.point-list-view').hide();
    if (pointImage != '') {
        $("#point-item-image").attr("src", baseURL + 'uploads/' + pointImage);
        $("#point-item-image").show();
    }
    $("#pointaudio_view").html(pointAudio);
    $("#pointaudio_view").show();
}

// delete Attraction
function deletePoint(e) {
    var targetId = $(e).attr('data-id');
    for (var i = 0; i < markList.length; i++) {
        var maker = markList[i];
        var makerId = maker.id;
        if (targetId == makerId) {
            //map.remove(maker);
            maker.setMap(null);
            markList.splice(i, 1);
            break;
        }
    }
    $(e).parent().remove();
}

function addTouristArea(url, isEdit) {
    var area = $("#areaname").val();
    var rate = (parseFloat($("#arearate").val())) / 100;
    var thumb = $('#upload-thumb-msg').html();
    var overlay = $('#area-overlay').val();
    var provinceText = $('#searchContinent :selected').text();
    var cityText = $('#searchCountry :selected').text();
    var pointText = $('#city_Name').val();
    var audioText = $('#area-audio-file').html();
    if(audioText=='录音上传中...') {
        window.alert('请稍候，录音文件正在上传');
        return;
    }
    if (provinceText == '选择洲' || cityText == '选择国家') {
        window.alert("请选择地址");
        return;
    }

    if (area == '') {
        window.alert("请请输入名称");
        return;
    }

    if (area.length > 10) {
        $("#custom-error-areaname").show();
        return;
    } else $("#custom-error-areaname").hide();

    var info = {
        pointText: pointText,
        overay: overlay,
        thumbnail: thumb,
        position: (($('#area-position').val() != '') ? JSON.parse($('#area-position').val()) : ''),
        audio: $('#area-audio-file').html(),
        zoom: map.getZoom()
    };
    console.log(info);

    var attraction_list = getAttractions(0);

    var price = 0;
    for (var i = 0; i < attraction_list.length; i++) {
        if (attraction_list[i].trial == '1') continue;
        price += parseFloat(attraction_list[i].price);
    }

    var touristArea = {
        name: area,
        discount_rate: rate,
        address: provinceText,
        address_1: cityText,
        status: 0,
        type: 2, // 1-course,     2-area
        isforeign: 2, // 1-inside,     2-foreign
        price: price,
        info: JSON.stringify(info),
        point_list: JSON.stringify(attraction_list)
    };

    var area_id = $('#point-list').val();
    var url_suffix = (area_id == undefined) ? "" : ("/" + area_id);
    $.post(url + "api/Areas/save" + url_suffix, touristArea, function (result) {
        if ((result.id) != undefined) {
            $('#point-list').val(result.id);
            touristArea['point_list'] = JSON.stringify(getAttractions(parseInt(result.id)));
            $.post(url + "api/Areas/save/" + result.id, touristArea, function (result) {

            });
        }
        window.alert("景区保存成功。");
        location.href = baseURL + 'area_foreign';
    });
}

function getAttractions(id) {
    var ret = [];
    var area_id = id == 0 ? $('#point-list').val() : id;
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
    if ($("#page_loaded_status").val() == '1') {
        $('#upload-overlay').val('');
        $('#upload-overlay').click();
    } else {
        alert("Google地图加载中. 请等一下.");
    }
}

function uploadThumb() {
    if ($("#page_loaded_status").val() == '1') {
        $('#upload-thumb-file').val('');
        $('#upload-thumb-file').click();
    } else {
        alert("Google地图加载中. 请等一下.");
    }
}

function deleteThumb() {
    $('#upload-thumb-msg').html('');
    $("#area-thumb-img").attr("src", baseURL + 'assets/images/default.png');
}

function uploadPointImage() {
    if ($("#page_loaded_status").val() == '1') {
        $('#upload-point-image').val('');
        $('#upload-point-image').click();
    } else {
        alert("Google地图加载中. 请等一下.");
    }
}

function uploadPointAudio() {
    if ($("#page_loaded_status").val() == '1') {
        $('#upload-point-audio').val('');
        $('#upload-point-audio').click();
    } else {
        alert("Google地图加载中. 请等一下.");
    }
}

function uploadAreaAudio() {
    if ($("#page_loaded_status").val() == '1') {
        $('#upload-area-audio').val('');
        $('#upload-area-audio').click();
    } else {
        alert("Google地图加载中. 请等一下.");
    }
}

function searchMapArea() {
    var city = $("#city_Name").val();
    $("#city_Name").val('');
    $('#detail_editing_panel').show();
    $("#city_Name").val(city);
}


function MyImageOverlay(bounds, image, map) {

    this.bounds_ = bounds;
    this.image_ = image;
    this.map_ = map;
    this.div_ = null;
    this.setMap(map);
}

MyImageOverlay.prototype.onAdd = function () {

    var div = document.createElement('div');
    div.style.borderStyle = 'none';
    div.style.borderWidth = '0px';
    div.style.position = 'absolute';
    var img = document.createElement('img');
    img.src = this.image_;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.opacity = '.85';
    img.style.position = 'absolute';
    img.style.border = '3px solid #38abff';
    img.style.borderRadius = '15px'
    div.appendChild(img);
    this.div_ = div;
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(div);
};

MyImageOverlay.prototype.draw = function () {
    var overlayProjection = this.getProjection();
    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
    var div = this.div_;
    div.style.left = sw.x + 'px';
    div.style.top = ne.y + 'px';
    div.style.width = (ne.x - sw.x) + 'px';
    div.style.height = (sw.y - ne.y) + 'px';
};

MyImageOverlay.prototype.updateBounds = function (bounds) {
    this.bounds_ = bounds;
    this.draw();
};

MyImageOverlay.prototype.onRemove = function () {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
};
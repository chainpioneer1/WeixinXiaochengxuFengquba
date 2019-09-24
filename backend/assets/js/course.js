/*
 fileName: course.js
 description: process Tourist Course
 */

var currentSelectedArea = 0; // current selected area in tourist areas list
var currentSelectedCourseItem = null; // current selected area in area list of course

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {
    if ($('#page_Id').html() == '旅游线路列表') {
        searchCourse(baseURL);
        return;
    }
    setTimeout(function () {
        if ($('#searchCountry :selected').html() == '中国') {
            $('#detail_addr').show();
        } else {
            $('#detail_addr').hide();
            //showAreaList($('#searchContinent :selected').html(), $('#searchCountry :selected').html(), 2)
        }
        showAreaList('', '', 1)
    }, 100);
    $('#searchContinent').on('change', function () {
        var country_list = $('#countryList').val();
        var continent = parseInt($('#searchContinent').val());
        var country_html = '<option value="0" selected>选择国家</option>';
        country_list = JSON.parse(country_list);
        for (var i = 1; i <= country_list.length; i++) {
            if (parseInt(country_list[i - 1].continent) == continent) {
                //if (country_list[i - 1].country == '中国') continue;
                country_html += '<option value="' + i + '" >' + country_list[i - 1].country + '</option>';
            }
        }
        $('#searchCountry').html(country_html);
        if ($('#searchCountry :selected').html() == '中国') $('#detail_addr').show();
        else $('#detail_addr').hide();
    });

    $('#searchCountry').on('change', function () {
        if ($('#searchCountry :selected').html() == '中国') {
            $('#detail_addr').show();
            showAreaList('', '', 1)
        } else {
            $('#detail_addr').hide();
            showAreaList($('#searchContinent :selected').html(), $('#searchCountry :selected').html(), 2)
        }

    });

    if ($('#address_2').val() != '') {
        var address_2 = $('#address_2').val().split(',');
        console.log(address_2)
        if (address_2[2] == '1') {
            $('#detail_addr').show();
            var continent_view = $('#searchContinent').children();
            var cur_cont = 0;
            var country_view = '';
            country_view += '<option value="0">选择国家</option>';
            country_view += '<option value="1" selected>中国</option>';
            $('#searchCountry').html(country_view);
        } else {
            var continent_view = $('#searchContinent').children();
            var cur_cont = 0;
            for (var i = 0; i < 6; i++) {
                if (address_2[0] == $(continent_view[i]).html()) {
                    cur_cont = i;
                }
                $(continent_view[i])[0].selected = false;
            }
            $(continent_view[cur_cont])[0].selected = true;
            var country_view = '';
            country_view += '<option value="0">选择国家</option>';
            if (address_2[1] != '')
                country_view += '<option value="1" selected>' + address_2[1] + '</option>';
            $('#searchCountry').html(country_view);
        }
    }

    $('#page_loaded_status').val('1');
});

// select area from Area List
function selectCourse(id) {

    $(".custom-areaitem").removeClass("selected-area");
    $(".custom-courseitem").removeClass("selected-courseitem");
    $('#areaitem-' + id).addClass('selected-area');
    currentSelectedArea = id;
}

// select area from Area List
function showAreaList(address_1, address_2, isforeign, name) {

    var content_html = '';
    if (name == undefined) name = '';
    var all_area_list = JSON.parse($('#all_area_list').val());
    var selected_area_list = JSON.parse(getAreas());
    for (var i = 0; i < all_area_list.length; i++) {
        var area = all_area_list[i];
        var isExist = 0;
        for (var j = 0; j < selected_area_list.length; j++) {
            if (area.id == selected_area_list[j].id) {
                isExist = 1;
                break;
            }
        }
        // if (area.isforeign != isforeign) continue;
        // if (address_1 != '' && area.address != address_1) continue;
        // if (address_2 != '' && area.address_1 != address_2) continue;
        content_html += '<li class="custom-areaitem" id="areaitem-' + area.id + '"';
        if (isExist == 1) content_html += ' style="display:none;"';
        content_html += ' onclick="selectCourse(' + area.id + ');">';
        content_html += '<div id="areatitle-' + area.id + '">' + area.name + '</div>';
        content_html += '<div id="areaprice-' + area.id + '" style="display:none;">';
        content_html += area.price + '</div>';
        content_html += '</li>';

    }
    $('#courseList').html(content_html);
}


// add selected area to course
function addAreaToCourse() {
    if (currentSelectedArea == '') return;
    var areaName = $('#areatitle-' + currentSelectedArea).text();
    $("#courseItems").append("<li class='custom-courseitem' onclick='selectedCourseItem(this)' " +
        "data-id='" + currentSelectedArea + "'><div>" + areaName + "</div></li>");
    var price = 0;
    price = parseFloat($('#courseprice').val() == '' ? '0' : $('#courseprice').val());
    price += parseFloat($('#areaprice-' + currentSelectedArea).html());
    $('#courseprice').val(price);
    currentSelectedArea = '';
    showAreaList('', '', 1);
}

//Select area in Course
function selectedCourseItem(obj) {

    $(".custom-courseitem").removeClass("selected-courseitem");
    $(".custom-areaitem").removeClass("selected-area");
    $(obj).addClass('selected-courseitem');
    currentSelectedCourseItem = obj;
}

//Remove area from course
function removeAreaFromCourse() {

    $(currentSelectedCourseItem).remove();
    var price = parseFloat($('#courseprice').val());
    price -= parseFloat($('#areaprice-' + $(currentSelectedCourseItem).attr('data-id')).html());
    $('#courseprice').val(price);
    showAreaList('', '', 1);
}

//Get area list on Course Add and Edit Page
function getAreas() {

    var ret = [];
    var list = $('#courseItems');
    var areaList = list.children();
    var price = 0;
    for (var i = 0; i < areaList.length; i++) {

        var areaId = $(areaList[i]).attr('data-id');
        var areaTitle = $('#areatitle-' + areaId).text();
        price += parseFloat($('#areaprice-' + areaId).text());
        ret.push({id: areaId, price: parseFloat($('#areaprice-' + areaId).text()), name: areaTitle});
    }
    $("#courseprice").val(price);
    return JSON.stringify(ret);
}

// Search course on Course List Page
function searchCourse(url) {

    var name = $('#searchName').val();
    var status = $('#searchStatus :selected').val();
    name = name == '' ? 'all' : name;

    //location.href = encodeURI(url + 'courseListing/' + name + '/' + status);

    $.ajax({
        type: 'post',
        url: url + 'area/course_listing',
        dataType: 'json',
        data: {name: name, status: status},
        success: function (res) {
            if (res.status == 'success') {

                $('#content_tbl').html(res.data);

            } else {
                alert('search failed!');
                console.log(res.data);
            }
        }
    });
}

// Add and update Tourist Course
function processCourse(url, id) {

    var area = $("#coursename").val();
    var rate = (parseFloat($("#courserate").val())) / 100;
    var thumb = $('#upload-thumb-msg').html();
    var provinceText = $('#provinceName').html();
    var cityText = $('#cityName').html();
    var continent = $('#searchContinent :selected').html();
    var country = $('#searchCountry :selected').html();
    if (continent == '选择洲') continent = '';
    if (country == '选择国家') country = '';

    var price = 0;
    var point_list = '';
    var isforeign = 2;
    if (area == '') {
        window.alert("请输入线路名称");
        return;
    }
    if (area.length > 10) {
        $('#custom-error-coursename').show();
        return;
    } else $('#custom-error-coursename').hide();

    if (country == '中国') {
        if (cityText == '' || provinceText == '') {
            window.alert("请选择地址。");
            return;
        }
        continent = provinceText;
        country = cityText;
        isforeign = 1;
    } else if (country == '' || continent == '') {
        window.alert("请选择国家。");
        return;
    }
    var touristArea = '';
    var reqUrl = '';
    var phone = $('#coursephone').val();
    if (phone.length != 11) {
        window.alert("请输入救援电话");
        return;
    }
    var info = {
        overay: thumb,
        phone: phone
    };
    if (parseInt(id) != 0) {
        point_list = getAreas();
        price = $("#courseprice").attr("value");
        touristArea = {
            id: parseInt(id),
            name: area,
            address: continent,
            address_1: country,
            discount_rate: rate,
            price: price,
            status: 0, // 0-disable,  1-available
            type: 1, // 1-course, 2-area
            info: JSON.stringify(info),
            point_list: point_list,
            isforeign: isforeign
        };
        reqUrl = baseURL + "api/Areas/save/" + id;
    }
    else {
        point_list = getAreas();
        price = $("#courseprice").val();
        touristArea = {
            name: area,
            address: continent,
            address_1: country,
            discount_rate: rate,
            price: price,
            status: 0, // 0-disable,  1-available
            type: 1, // 1-course,  2-area
            info: JSON.stringify(info),
            point_list: point_list,
            isforeign: isforeign
        };
        reqUrl = baseURL + "api/Areas/save";
    }
    console.log(touristArea);
    //return;
    $.post(reqUrl, touristArea, function (result) {
        console.log(result);
        location.href = url + 'course';
    });

    return;
}

// This part is action processing for Course
// delete and deploy Course
function deleteAreaConfirm(id) {

    $('#custom-confirm-delete-view').show();
    $('#current-areaid').val(id);
}

function deleteArea(url, type) {

    $('#custom-confirm-delete-view').hide();
    if (type == 1) { // if ok button clicked

        $.post(url + "api/Areas/remove/" + $('#current-areaid').val(), function (result) {
            searchCourse(url);
        });
    }
}

function deployAreaConfirm(id) {

    $('#custom-confirm-deploy-view').show();
    $('#deployMessage').html("是否要上架此线路?");
    $('#current-areaid').val(id);
    $('#current-areastatus').val(1);
}

function undeployAreaConfirm(id) {

    $('#custom-confirm-deploy-view').show();
    $('#deployMessage').html("是否要下架此线路?");
    $('#current-areaid').val(id);
    $('#current-areastatus').val(0);
}

function deployArea(url, type) {

    $('#custom-confirm-deploy-view').hide();
    if (type == 1) {

        var touristArea = {
            id: $('#current-areaid').val(),
            status: $('#current-areastatus').val()
        };

        $.post(url + "api/Areas/changeCourseStatus/" + touristArea['id'], touristArea, function (result) {
            if (result['status'] == false)
                window.alert(result['message']);
            else
                searchCourse(url);
        });
    }
}

//return previos page
function cancel(url) {
    location.href = url + 'course';
}

//
function findAreaInList(url) {
    var strKey = $('#course-search').val();
    $.ajax({
        type: 'post',
        url: url + 'api/Areas/find',
        dataType: 'json',
        data: {key: strKey},
        success: function (res) {
            if (res != undefined) {

                $("#courseList").empty();
                var areaList = res;
                for (var i = 0; i < areaList.length; i++) {
                    var area = areaList[i];
                    $("#courseList").append("<li class='custom-areaitem' " +
                        "id='areaitem-" + area['id'] + "' onclick='selectCourse(" + area['id'] + ");'>" +
                        "<div id='areatitle-" + area['id'] + "'>" + area['name'] + "</div></li>");
                }

            } else {
                // alert('search failed!');
                console.log(res);
            }
        }
    });


    //
    //$.post(url + "api/Areas/find/" + strKey, function (result) {
    //    $("#courseList").empty();
    //    var areaList = result;
    //    for (var i = 0; i < areaList.length; i++) {
    //        var area = areaList[i];
    //        $("#courseList").append("<li class='custom-areaitem' " +
    //            "id='areaitem-" + area['id'] + "' onclick='selectCourse(" + area['id'] + ");'>" +
    //            "<div id='areatitle-" + area['id'] + "'>" + area['name'] + "</div></li>");
    //    }
    //
    //});
}
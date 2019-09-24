/*
 fileName: area.js
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {
    searchArea_jingqu(baseURL);
    $(".select2").select2();
    $(".select2-selection__arrow").hide();
    //$(".select2").css({'height':30, 'border-radius':'0'});
    var all_list = JSON.parse($('#areaSearchList').val());
    var area_html = '';
    var st = ($('#page_Id').html() == '国外地区') ? 2 : 1;
    var isExist=0;
    for (var i = 0; i < all_list.length; i++) {
        if (parseInt(all_list[i].isforeign) != st) continue;
        console.log(all_list[i].isforeign);
        if (all_list[i].name == $('#hotCourseArea').val()) {
            area_html += '<option selected>' + all_list[i].name + '</option>';
            isExist=1;
        }else {
            area_html += '<option>' + all_list[i].name + '</option>';
        }
    }
    $('#area_name').html(area_html);
    if(isExist ==0) $('#area_name').val('');

    if ($('#page_Id').html() == '国外地区') {
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
    }
});

function onCancelProcess() {
    $('#current-areaid').val('');
    $('#current-areastatus').val('');
    $('#custom-confirm-deploy-view').hide();
    $('#custom-confirm-delete-view').hide();
    $('#custom-generate-auth-view').hide();
}

function deployAreaConfirm_jingqu(id, type) {
    $('#current-areastatus').val(type);
    var msg = (type == 1) ? '线路' : '景区';
    $('#custom-confirm-deploy-view').show();
    $('#deployMessage').html("是否要设为热门" + msg + "?");
    if (type == 3) {
        id = $('#area_name').val();
        if (id == '') {
            $('#deployMessage').html("是否要取消热门线路的关联景区?");
        } else {
            $('#deployMessage').html("是否要设为热门线路的关联景区?");
        }
    }
    $('#current-areaid').val(id);
}

function undeployAreaConfirm_jingqu(id, type) {
    $('#current-areastatus').val(type);
    type = (type == 1) ? '线路' : '景区';
    $('#custom-confirm-deploy-view').show();
    $('#deployMessage').html("是否要取消热门" + type + "?");
    $('#current-areaid').val('');
}

function deployArea_jingqu(url, type) {

    $('#custom-confirm-deploy-view').hide();
    if (type == 1) { // if ok button clicked
        var status = parseInt($('#current-areastatus').val())
        if (status == 1)//course
            var city = {hot_course: $('#current-areaid').val(), type: '0'};
        else if (status == 2)//area
            var city = {hot_area: $('#current-areaid').val(), type: '0'};
        else if (status == 3)
            var city = {hot_area_course: $('#current-areaid').val(), type: '0'};

        $.ajax({
            type: 'post',
            url: url + 'address_inside/updateHotCity',
            dataType: 'json',
            data: {city: JSON.stringify(city)},
            success: function (res) {
                console.log(res);
                if (res.status == true) {
                    searchArea_jingqu(baseURL);
                } else {
                    alert('failed!');
                    console.log(res.data);
                }
            }
        });
    }
}

function deleteAreaConfirm_jingqu(id) {
    $('#custom-confirm-delete-view').show();
    $('#current-areaid').val(id);
}

function deleteArea_jingqu(url, type) {

    $('#custom-confirm-delete-view').hide();
    if (type == 1) {//if ok button clicked
        $.post(url + "address_outside/removeCountry/" + $('#current-areaid').val(), function (result) {

            if (result['status'] == false)
                window.alert(result['message']);
            else
                searchArea_jingqu(baseURL);
        });
    }
}

function editAreaConfirm_jingqu(id, continent, country) {
    $('#custom-generate-auth-view').show();
    $('#country_edit').val(country);
    $('#current-areaid').val(id);

    var continent_view = $('#continent_select').children();
    for (i = 0; i < 5; i++) {
        $(continent_view[i])[0].selected = false;
    }
    $(continent_view[continent - 1])[0].selected = true;
}

function showAddCountryDlg(url) {
    $('#current-areaid').val('');
    $('#custom-generate-auth-view').show();
}

function addCountry() {
    var id = $('#current-areaid').val();
    var continent = $('#continent_select :selected').val()
    var country = $('#country_edit').val()
    if (country == '中国') {
        alert('请进入国内地区菜单。');
        return;
    }
    var stateInfo = {
        'id': id,
        'continent': continent,
        'country': country,
        'type': 2 // 1-inside, 2-foreign
    }
    var reqUrl = baseURL + 'address_outside/addCountry2DB'
    $.post(reqUrl, stateInfo, function (result) {
        result = JSON.parse(result)

        if (result['status'] == true) searchArea_jingqu(baseURL)
        else window.alert(result.message);
    });
}

function searchArea_jingqu(url) {

    var area_name = $('#area_name').val();
    var provinceText = $('#provinceName').html();
    var address = provinceText;
    var pageId = $('#page_Id').html();
    var continent = $('#searchContinent :selected').val();
    var country = $('#searchCountry :selected').html();
    if (country == '选择国家') country = '';
    //console.log(continent + ',' + country);
    if (continent == undefined) continent = '';
    if (country == undefined) country = '';
    if (pageId == '国外地区')
        url = url + 'address_outside/custom_listing'
    else
        url = url + 'address_inside/custom_listing'

    $.ajax({
        type: 'post',
        url: url,
        dataType: 'json',
        data: {address: address, name: '', continent: continent, country: country},
        success: function (res) {
            if (res.status == 'success') {

                $('#content_tbl').html(res.data);

            } else {
                alert('search failed!');
                console.log(res.data);
            }
        }
    });

    onCancelProcess();
}



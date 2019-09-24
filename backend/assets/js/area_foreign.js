/*
 fileName: area.js
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {
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
});

function deleteAreaConfirm_jingqu(id) {
    $('#custom-confirm-delete-view').show();
    $('#current-areaid').val(id);
}

function deleteArea_jingqu(url, type) {

    $('#custom-confirm-delete-view').hide();
    if (type == 1) {//if ok button clicked
        $.post(url + "api/Areas/remove/" + $('#current-areaid').val(), function (result) {
            if (result['status'] == false)
                window.alert(result['message']);
            else
                searchArea_jingqu(baseURL);
        });
    }
}

function deployAreaConfirm_jingqu(id) {

    $('#custom-confirm-deploy-view').show();
    $('#deployMessage').html("是否要上架此景区?");
    $('#current-areaid').val(id);
    $('#current-areastatus').val(1);
}

function undeployAreaConfirm_jingqu(id) {

    $('#custom-confirm-deploy-view').show();
    $('#deployMessage').html("是否要下架此景区?");
    $('#current-areaid').val(id);
    $('#current-areastatus').val(0);
}

function deployArea_jingqu(url, type) {

    $('#custom-confirm-deploy-view').hide();
    if (type == 1) { // if ok button clicked

        var touristArea = {
            id: $('#current-areaid').val(),
            status: $('#current-areastatus').val()
        };

        $.post(url + "api/Areas/changeStatus/" + touristArea['id'], touristArea, function (result) {
            console.log(result);
            if (result['status'] == false)
                window.alert(result['message']);
            else
                searchArea_jingqu(baseURL);
        });
    }
}

function searchArea_jingqu(url) {

    var name = $('#searchName').val();
    var status = $('#searchStatus :selected').val();
    name = name == '' ? 'all' : name;
    var provinceText = $('#provinceName').html();
    var cityText = $('#cityName').html();
    var districtText = $('#districtName').html();
    var continent = $('#searchContinent :selected').html();
    var country = $('#searchCountry :selected').html();
    if (continent == '选择洲') continent = '';
    if (country == '选择国家') country = '';
    //console.log(continent + ',' + country);
    if(continent==undefined) continent='';
    if(country==undefined) country='';
//    location.href = url + 'area/listing/' + name + '/' + JSON.stringify(address) + '/' + status;

    $.ajax({
        type: 'post',
        url: url + 'area_foreign/custom_listing',
        dataType: 'json',
        data: {name: name, continent: continent, country:country, status: status},
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

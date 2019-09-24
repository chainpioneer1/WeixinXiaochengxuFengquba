/*
 fileName: addressSupport.js
 description: process AMap function and manage Tourist areas
 */

// variables for AMap
var state = 'new';

var base_url = "";

var district, polygons = [], citycode;

var citySelect, districtSelect, areaSelect;

var opts;

/* function: initMap
 description: Init AMap using center position and add AMap.MouseTool plugin
 param: center // center position of current map view
 */
function initMap() {

    citySelect = document.getElementById('city');
    districtSelect = document.getElementById('district');
    areaSelect = document.getElementById('street');
//行政区划查询
    opts = {
        subdistrict: 1,   //返回下一级行政区
        showbiz: false  //最后一级返回街道信息
    };
    district = new AMap.DistrictSearch(opts);//注意:需要使用插件同步下发功能才能这样直接使用
    district.search('中国', function (status, result) {
        if (status == 'complete') {
            getData(result.districtList[0]);
        }
    });

}


function getData(data, level) {
    var bounds = data.boundaries;

    //清空下一级别的下拉列表
    if (level === 'province') {
        citySelect.innerHTML = '';
        districtSelect.innerHTML = '';
        areaSelect.innerHTML = '';
    } else if (level === 'city') {
        districtSelect.innerHTML = '';
        areaSelect.innerHTML = '';
    } else if (level === 'district') {
        areaSelect.innerHTML = '';
    }

    var subList = data.districtList;
    var contentSub, curlevel, curList;

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
    var option = obj[obj.options.selectedIndex];
    var keyword = option.text; //关键字
    var adcode = option.adcode;
    console.log(JSON.stringify(option.value));

    if(keyword == '--请选择--'){
        if (obj.id == 'province'){
            $("#provinceName").val('');
            $("#cityName").val('');
            $("#districtName").val('');
            $('#city').html('');
            $('#district').html('')
        }
        else if (obj.id == 'city'){
            $("#cityName").val('');
            $("#districtName").val('');
            $('#district').html('')
        }
        else if (obj.id == 'district') {
            $("#districtName").val('');
        }

        $('#address_district').val($('#provinceName').val() + $('#cityName').val() + $('#districtName').val());
        return;
    }
    district.setLevel(option.value); //行政区级别
    if (option.value == 'province') {
        $("#provinceName").val(keyword);
        $("#cityName").val('');
        $("#districtName").val('');
    }
    else if (option.value == 'city') {
        $("#cityName").val(keyword);
        $("#districtName").val('');
    }
    else if (option.value == 'district') {
        $("#districtName").val(keyword);
    }
    district.setExtensions('all');

    $('#address_district').val($('#provinceName').val() + $('#cityName').val() + $('#districtName').val());

    //行政区查询
    //按照adcode进行查询可以保证数据返回的唯一性
    district.search(adcode, function (status, result) {
        if (status === 'complete') {
            getData(result.districtList[0], obj.id);
        }
    });
}

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {

    var position = $('#area-position').val();
        initMap();

    $status = $("#page_type_name").val();
    if ($("#page_type_name").val() == 'area_add_interface') {
        $("#page_loaded_status").val("1");
    }

    if ($("#provinceName").val() != '') {
        contentSub = new Option($("#provinceName").val());
        curList = document.querySelector('#province');
        curList.add(contentSub);
    }
    if ($("#cityName").val() != '') {
        contentSub = new Option($("#cityName").val());
        curList = document.querySelector('#city');
        curList.add(contentSub);
    }
    if ($("#districtName").val() != '') {
        contentSub = new Option($("#districtName").val());
        curList = document.querySelector('#district');
        curList.add(contentSub);
    }

    $('#address_district').val($('#provinceName').val() + $('#cityName').val() + $('#districtName').val());
});

function searchMapArea() {
    var city = $("#city_Name").val();
    $("#city_Name").val('');
    $('#detail_editing_panel').show();
    $("#city_Name").val(city);
}
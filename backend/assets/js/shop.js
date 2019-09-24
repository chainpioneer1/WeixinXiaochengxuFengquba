/*
 fileName: shop.js
 description: process Shop
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {

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
        if ($('#searchCountry :selected').html() == '中国') $('#detail_addr').show();
        else $('#detail_addr').hide();
    });

    if ($('#page_Id').html() == '商家列表') {
        searchShop(baseURL);
    } else if ($('#page_Id').html() == '编辑商家') {
        if ($('#address_2').val() != '') {
            var address_2 = $('#address_2').val().split(',');
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
    }
});

// Search course on Course List Page
function searchShop(url) {

    var name = $('#searchName').val();
    var status = $('#searchStatus :selected').val();
    //name = name == '' ? 'all' : name;
    var continent = $('#searchContinent :selected').html();
    var country = $('#searchCountry :selected').html();
    if (continent == '选择洲') continent = '';
    if (country == '选择国家') country = '';

    // location.href = url + 'shopListing/' + name + '/' + status;

    $.ajax({
        type: 'post',
        url: url + 'shop/shop_listing',
        dataType: 'json',
        data: {name: name, address: continent + ',' + country, status: status},
        success: function (res) {
            if (res.status == 'success') {

                $('#content_tbl').html(res.data);

            } else {
                alert('search failed!');
                console.log(res.data);
            }
        }
    });
    cancel(baseURL);
}

// Search course on Course List Page
function searchQR(url) {

    var searchType = $('#searchType').val();
    var name = $('#searchName').val();
    var status = $('#searchStatus :selected').val();
    name = name == '' ? 'all' : name;

//    location.href = url + 'qrListing/' + name + '/' + status;

    $.ajax({
        type: 'post',
        url: url + 'qrmanage/qr_listing',
        dataType: 'json',
        data: {name: name, status: status, searchType: searchType},
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

//check if string is number string
function isNumeric(value) {
    return /^\d+$/.test(value);
}

//check if account is valid
function invalidAccount(account) {
    if (account.length != 11) return true;
    if (!isNumeric(account)) return true;
    return false;
}

// Add and update Shop
function processShop(url, id) {

    var name = $("#shopname").val();
    var rate = (parseFloat($("#shoprate").val())) / 100;
    var account = $("#shopid").val();
    var password = $("#shoppassword").val();
    var type = $('#shoptype :selected').val();

    var provinceText = $('#provinceName').html();
    var cityText = $('#cityName').html();
    var continent = $('#searchContinent :selected').html();
    var country = $('#searchCountry :selected').html();
    if (continent == '选择洲') continent = '';
    if (country == '选择国家') country = '';

    var isforeign = 2;
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

    if ($("#shoprate").val() == '' || rate <= 0 || type == '0') {
        window.alert("请填写所有信息!.");
        return;
    }
    if (name.length > 10) {
        $('#custom-error-shopname').show();
        return;
    } else $('#custom-error-shopname').hide();
    if (account.length > 11) {
        $('#custom-error-shopid').show();
        return;
    } else $('#custom-error-shopid').hide();

    if (invalidAccount(account)) {
        $('#custom-error-shopid').show();
        return;
    }

    var shopInfo = '';
    var reqUrl = '';
    if (parseInt(id) != 0) {
        shopInfo = {
            id: parseInt(id),
            name: name,
            phonenumber: account,
            password: password,
            address: continent,
            address_1: country,
            type: type,
            discount_rate: rate,
            status: 0,
            isforeign: isforeign
        };
        reqUrl = url + "api/Shops/saveAccount/" + id;
    }
    else {
        shopInfo = {
            name: name,
            phonenumber: account,
            password: password,
            address: continent,
            address_1: country,
            type: type,
            discount_rate: rate,
            status: 0,
            isforeign: isforeign
        };
        reqUrl = url + "api/Shops/saveAccount";
    }

    $.post(reqUrl, shopInfo, function (result) {
        console.log(result);
        window.alert(result['message']);
        if (result['status'] == true) location.href = baseURL + 'shop';
    });

    return;
}

// This part is action processing for Course
// delete and deploy Course
function deleteShopConfirm(id) {

    $('#custom-confirm-delete-view').show();
    $('#current-areaid').val(id);
}

function deleteShop(url, type) {

    $('#custom-confirm-delete-view').hide();
    if (type == 1) {  // if ok button clicked
        $.post(url + "api/Shops/remove/" + $('#current-areaid').val(), function (result) {
            console.log(result);
            searchShop(baseURL);
        });
    }
}

function deployShopConfirm(id) {

    $('#custom-confirm-deploy-view').show();
    $('#deployMessage').html("是否要禁用此商家?");
    $('#current-areaid').val(id);
    $('#current-areastatus').val(1);
}

function undeployShopConfirm(id) {

    $('#custom-confirm-deploy-view').show();
    $('#deployMessage').html("是否要取消禁用此商家?");
    $('#current-areaid').val(id);
    $('#current-areastatus').val(0);
}

function deployShop(url, type) {

    $('#custom-confirm-deploy-view').hide();
    if (type == 1) {  // if ok button clicked

        var touristArea = {
            id: $('#current-areaid').val(),
            status: $('#current-areastatus').val()
        };

        $.post(url + "api/Shops/save/" + touristArea['id'], touristArea, function (result) {
            searchShop(baseURL);
        });
    }
}

function showGenerateQR(id, isforeign) {

    $('#custom-generate-auth-view').show();
    $('#current-areaid').val(id);
    $('#current-isforeign').val(isforeign);
    $('#current-codetype').val('qr');
}

function showGenerateAuth(id) {

    $('#custom-generate-auth-view').show();
    $('#current-areaid').val(id);
    $('#current-codetype').val('auth');
}

function changeAuthType() {
    var type = $('#auth-select :selected').val();
    if (type == 2) { // 1-course, 2-area
        $('#custom-auth-area-view').show();
        $('#custom-auth-course-view').hide();
        $('#current-type').val(2);
    } else if (type == 1) { //1-course, 2-area
        $('#custom-auth-area-view').hide();
        $('#custom-auth-course-view').show();
        $('#current-type').val(1);
    } else {
        $('#custom-auth-area-view').hide();
        $('#custom-auth-course-view').hide();
        $('#current-type').val(0);
    }
}

function generateAuth(url, confirm) {

    var type = $('#current-type').val();
    var codeType = $('#current-codetype').val();

    var target = '0';
    if (type == 2) { // 1-course, 2-area
        target = $('#auth-select-area :selected').val();
    }
    if (type == 1) { // 1- course, 2-area
        target = $('#auth-select-course :selected').val();
    }
    if (target != '0') {

        $('#current-targetid').val(target);
        if (codeType == 'qr') {
            generateAuthFinal(url, confirm);
        }
        else {
            $('#custom-generate-auth-count-view').show();
            $('#custom-generate-auth-view').hide();
        }
    }
}

function showQR(url_suffix) {
    $('#custom-generate-qr-view').show();
    console.log('http://www.ayoubc.com/tour' + encodeURI(url_suffix));
    $('#qr-view').qrcode({text: 'http://www.ayoubc.com/tour/index.php' + url_suffix});
//    $('#qr-view').qrcode({text: 'http://www.ayoubc.com/test01' + url_suffix});
}

function generateAuthFinal(url, confirm) {
    var authCount = parseInt($('#auth-count').val());
    var codeType = $('#current-codetype').val();
    var target = $('#current-targetid').val();
    var isforeign = parseInt($('#current-isforeign').val());
    var type = $('#current-type').val();
    var shopid = $('#current-areaid').val();
    var targetname;

    console.log('code ' + codeType + 'tar ' + target + ' type ' + type + ' shop ' + shopid + ' count ' + authCount);

    if (codeType == 'qr') {

        var data = 'http://www.ayoubc.com/tour/index.php?shopid=' + shopid
            + '&type=' + type + '&targetid=' + target + '&map_type=' + (isforeign - 1);
        var authInfo = {
            shopid: shopid,
            type: type,
            targetid: target,
            data: data
        };
        console.log(url);
        $.post(url + "api/Shops/generateQR", authInfo, function (result) {
            console.log(result);
            $('#custom-generate-qr-view').show();
            $('#custom-generate-auth-view').hide();

            $('#qr-view').qrcode({text: data});

            searchShop(baseURL);
        });

    } else {
        if (authCount > 0) {
            if (codeType == 'auth') {

                var authInfo = {
                    shopid: shopid,
                    status: 0,  // 0-usual,  1- unusual
                    type: type,
                    targetid: target,
                    codecount: authCount
                };

                $.post(url + "api/Shops/generateAuth", authInfo, function (result) {
                    console.log(result);
                    searchShop(baseURL);
                });
            }
        }
    }
}

//return previos page
function cancel(url) {
    $('#custom-generate-auth-view').hide();
    $('#custom-confirm-deploy-view').hide();
    $('#custom-generate-auth-count-view').hide();
    $('#qr-view').html('');
    $('#custom-generate-qr-view').hide();
}

//return previos page
function cancelQR(url) {
    $('#qr-view').html('');
    $('#custom-generate-qr-view').hide();
    //location.href = url + 'qrmanage';
}

function findShopInList(url) {
    var strKey = $('#course-search').val();
    $.post(url + "api/Shops/find/" + strKey, function (result) {

        console.log(result);
        $("#courseList").empty();
        var areaList = result;
        for (var i = 0; i < areaList.length; i++) {
            var area = areaList[i];
            $("#courseList").append("<li class='custom-areaitem' id='areaitem-" + area['id'] + "' onclick='selectCourse(" + area['id'] + ");'>" +
                "<div id='areatitle-" + area['id'] + "'>" + area['name'] + "</div></li>");
        }

    });
}

/* End of file shop.js */
/* Location: ./assets/js/shop.js */
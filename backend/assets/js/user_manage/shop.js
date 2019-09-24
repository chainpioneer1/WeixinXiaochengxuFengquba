/*
 fileName:
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute

$(document).ready(function () {
    var pageName = $("#page_Name").val();
    switch (pageName) {
        case 'shop':
            showLists(1);
            //loadShipMans();
            break;
        case 'shop_add':
            break;
    }
});


function showLists(id) {
    var province = $("#provinceName").val();
    var city = $("#cityName").val();
    var district = $("#districtName").val();
    var address = '';
    if (province != '') address += province;
    if (city != '') address += (',' + city);
    if (district != '') address += (',' + district);
    var data = {
        searchType: $("#searchType :selected").val(), //  0-shop, 1-name, 2-address,4-saleman
        searchName: $("#searchName").val(),
        address: address,
        searchStatus: $("#searchStatus :selected").val(), //0-all, 1-available, 2-disable
        searchShoptype : $('#searchShoptype :selected').val(), // 0-all, 1-便利店, 2-中型超市, 3-餐饮店, 4-其他业态
        searchAuth : $('#searchAuth :selected').val(),  // 0-认证状态, 1-未认证, 2-待认证, 3-认证通过, 4-认证失败
        start_date: start_date,
        end_date:end_date,
    };
    $.ajax({
        type: 'post',
        url: baseURL + 'user_manage/shop_controller/item_listing',
        dataType: 'json',
        data: {id: id, searchData: data},
        success: function (res) {
            if (res.status == 'success') {
                $('#header_tbl').html(res.header);
                $('#content_tbl').html(res.content);
                $('#footer_tbl').html(res.footer);
                executionPageNation();
                start_date = '';
                end_date = '';
            } else {
                alert('search failed!');
                console.log(res.data);
            }
        }
    });
}

function loadShipMans() {
    $.ajax({
        type: 'post',
        url: baseURL + 'user_manage/shop_controller/ship_manlist',
        dataType: 'json',
        success: function (res) {
            $('#ship_header_tbl').html(res.header);
            $('#ship_footer_tbl').html(res.footer);

            var content_html = '';
            for( var i = 0; i < res.content.length; i++){
                content_html += '<tr>';
                content_html += '<td>'+ (i+1)+'</td>';
                content_html += '<td>'+ res.content[i]['username']+'</td>';
                content_html += '<td>'+ res.content[i]['contact_phone']+'</td>';
                content_html += '<td><img src="' + baseURL + res.content[i]['more_data']+'" style="width: 50px; height: 50px; border-radius: 50%;"></td>';
                content_html += '<td><a id="item_'+res.content[i]['id']+'" href="#" onclick="userItem('+ res.content[i]['id']+')">选择</a></td>';
                content_html += '</tr>';
            }

            $('#ship_content_tbl').html(content_html);
        }
    });
}

function userConfirm(id, shop_id){
    $('#item_'+ id).css({display : 'none'});
    $("#item_id").val(shop_id);
    loadShipMans();

    $('#confirm_user').show();
}

function userItem(ship_id) {
    $('#confirm_user').hide();
    //$('#item_'+ id).css({display :'block'});

    var itemInfo = {
        'id': $("#item_id").val(),
        'ship_man' : ship_id
    };

    $.ajax({
        url: baseURL + "user_manage/shop_controller/addItem2DB",
        type: "POST",
        data: {'itemInfo': itemInfo},
        success: function (result) {
            console.log(result);
            if (result != 0)
                showLists(1);
            else
                window.alert("Item cannot be seted.");
        }
    });
}

function deployConfirm(id, status) {
    if (status == 1)// status=0-disable, 1-available
        $("#confirm-deploy-message").html("确定要取消禁用？");
    else
        $("#confirm-deploy-message").html("确定要禁用？");
    $("#item_id").val(id);
    $("#item_status").val(status); // status=0-disable, 1-available
    $("#confirm_deploy").show();
}

function deployItem() {
    var id = $("#item_id").val();
    $("#confirm_deploy").hide();

    var itemInfo = {
        'userid': id,
        'status': $("#item_status").val() // status=0-disable, 1-available
    };

    $.ajax({
        url: baseURL + "user_manage/shop_controller/addItem2DB",
        type: "POST",
        data: {'itemInfo': itemInfo},
        success: function (result) {
            console.log(result);
            if (result != 0)
                showLists(1);
            else
                window.alert("禁用失败.");
        }
    });
}

function authConfirm(id) {
    $("#item_id").val(id);
    $('#reason').val('');
    $("#confirm_auth").show();
}

$('input[name="radio_auth_type"]').click(function () {
    switch($(this).val()){
        case "1":  // 认证通过
            $('#auth_reason').css({'display':'none'});
            break;
        case "2":  // 认证失败
            $('#auth_reason').css({'display':'block'});
            break;
    }
});

function authItem() {
    var id = $("#item_id").val();
    var type = $("input[name='radio_auth_type']:checked").val();
    var itemInfo = {
        'userid': id,
        'auth' : parseInt(type) + 2
    };

    switch (parseInt(type)){
        case 1:
            itemInfo['reason'] = '认证通过';
            // add shop authorized message to message list
            break;
        case 2:
            itemInfo['reason'] = '\'' + $('#reason').val() + '\'';
            if(itemInfo['reason'] == ''){
                //alert('请输入失败原因');
                return;
            }
            break;
    }

    $("#confirm_auth").hide();
    $.ajax({
        url: baseURL + "user_manage/shop_controller/setAuthFromDB",
        type: "POST",
        data: {'itemInfo': itemInfo},
        success: function (result) {
            console.log(result);
            if (result != 0)
                showLists(1);
            else
                window.alert("Item cannot be deleted.");
        }
    });
}
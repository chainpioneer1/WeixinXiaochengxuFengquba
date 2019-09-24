/*
fileName:
description: process Tourist Area
*/

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
var page_type = 0;
var model_data = [];
$(document).ready(function () {
    var pageName = $("#page_Name").val();
    switch (pageName) {
        case 'product_type':
            showLists(1);
            break;
        case 'product_unit':
            showLists(2);
            break;
        case 'product_brand':
            showLists(3);
            break;
        case 'product_brand_add':
            //upload company logo image
            $('#upload_product_logo').on('change', uploadSingleImage);
            break;
    }
});

function showLists(id) {
    var data = {searchName:'1'};

    if(id == 3)
        data = { searchName: $("#searchName").val()};

    $.ajax({
        type: 'post',
        url: baseURL + 'product_manage/product_util_controller/item_listing',
        dataType: 'json',
        data: {id: id, searchData: data},
        success: function (res) {
            if (res.status == 'success') {
                $('#header_tbl').html(res.header);
                $('#content_tbl').html(res.content);
                $('#footer_tbl').html(res.footer);
                model_data = res.data;

                executionPageNation();
            } else {
                alert('search failed!');
                console.log(res.data);
            }
        }
    });
}

function ModifyImage(index) {
    $('#upload_company_brand' + index).trigger('click');
}

function uploadSingleImage(event) {
    event.stopPropagation(); // Stop stuff happening
    event.preventDefault(); // Totally stop stuff happening

    files = event.target.files;
    if (this.files[0].type != "image/jpeg" && this.files[0].type != "image/png") {
        window.alert("图片格式错误，要求是jpg、jpeg、png格式。");
        return;
    }
    if (this.files[0].size > 10000000) {
        window.alert("图片不超过10M。");
        return;
    }
    var data = new FormData();
    $.each(files, function (key, value) {
        data.append(key, value);
    });

    $("#" + str + "_filename").html('图片上传中...');
    $("#" + str + "_filename").show();

    var str = event.target.id;
    str = str.substr(7, str.length - 7);

    $.ajax({
        url: baseURL + "api/ImgProcessor/uploadAnyData",
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
                    $("#" + str + "_image").attr("src", url);
                    $("#" + str + "_image").show();
                    $("#" + str + "_filename").html(data['originfile']);
                    $("#" + str + "_src").val('uploads/' + data['file']);
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

function deleteConfirm(id, type) {
    $("#item_id").val(id);
    $("#item_status").val(type); // 1-product_type, 2-product_unit, 3-product_brand
    $("#confirm_delete").show();
}

function deployConfirm(id, type) {
    // id : 0-add, none zero- update
    // type : 1-product_type, 2-ptoduct_unit
    var actStr = (id == 0) ?'新增' : '编辑';
    var propStr = (type == 1) ?  '分类名称' : '单位名称';
    $('#confirm_title').html(actStr + propStr);
    $("#confirm-deploy-message").html(propStr);

    var type_name = '';
    for(var i =0; i < model_data.length; i++){
        switch (type){
            case 1:
                if( id == parseInt(model_data[i]['id']) ) type_name = model_data[i]['type'];
                break;
            case 2:
                if(id == parseInt(model_data[i]['id'])) type_name = model_data[i]['name'];
                break;
        }
    }
    $('#name').val(type_name);
    $('#add_alert_message').html('');
    $("#item_id").val(id);
    $("#item_status").val(type); // status=0-disable, 1-available
    $("#confirm_deploy").show();
}

function alert_show(type){
    switch (type){
        case 1:
            $('#alert_message').html('该分类已关联商品，不能删除。');
            break;
        case 3:
            $('#alert_message').html('该品牌已关联商品，不能删除。');
            break;
        case 2:
            $('#alert_message').html('该单位已关联商品，不能删除。');
            break;
    }

    $('#alert_delete').show();
}


function deployItem() {
    var id = $("#item_id").val();
    var str = $('#name').val();
    if( str == "") return;
    if(str.length > 6){
        $('#add_alert_message').html('不超过6个字符.');
        $('#alert_add').show();
        return;
    }

    var type = $("#item_status").val() // status=0-product_type, 2-product_unit
    for( var i = 0; i < model_data.length; i++) {
        switch (type) {
            case '1':
                if(str == model_data[i]['type']) {
                    $('#add_alert_message').html('名称不允许相同。');
                    $('#alert_add').show();
                    return;
                }
                break;
            case '2':
                if(str == model_data[i]['name']) {
                    $('#add_alert_message').html('名称不允许相同。');
                    $('#alert_add').show();
                    return;
                }
                break;
        }
    }
    $('#add_alert_message').html('');
    $("#confirm_deploy").hide();
    var itemInfo = {
        'id': id,
        'type' : type,
        'name' : str
    };

    $.ajax({
        url: baseURL + "product_manage/product_util_controller/addItem2DB",
        type: "POST",
        data: {'itemInfo': itemInfo, 'type' : type},
        success: function (result) {
            console.log(result);
            if (result != 0)
                showLists(type);
            else
                window.alert("modify failed.");
        }
    });

}

function deleteItem() {
    var id = $("#item_id").val();
    var type = $('#item_status').val();
    $("#confirm_delete").hide();

    var itemInfo = {
        'id': id,
        'type':type
    };

    $.ajax({
        url: baseURL + "product_manage/product_util_controller/deleteItemFromDB",
        type: "POST",
        data: {'itemInfo': itemInfo},
        success: function (result) {
            console.log(result);
            if (result != 0)
                showLists(type);
            else
                window.alert("Item cannot be deleted.");
        }
    });

}
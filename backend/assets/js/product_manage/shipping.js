/*
 fileName:
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute

$(document).ready(function () {
    var pageName = $("#page_Name").val();
    switch (pageName) {
        case 'shipman':
            showLists(1);
            break;
        case 'shipman_manage':
            showLists(2);
            break;
        case 'shipman_add':
            $('#upload_product_logo').on('change', uploadSingleImage);
            break;
        case 'shipman_show':
            break;
        case 'shipping':
            $('#start_month').on('change', function () {
                var month = $("#start_month :selected").val()
                monthSelected(month, 'start_day');
            });
            $('#end_month').on('change', function () {
                var month = $("#end_month :selected").val()
                monthSelected(month, 'end_day');
            });
            showLists(4);
            break;
    }
});

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
                    $("#" + str + "_filename").hide();
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

function showLists(id) {
    var data;
    switch (id) {
        case 1:
            var province = $("#provinceName").val();
            var city = $("#cityName").val();
            var district = $("#districtName").val();
            var address = '';
            if (province != '') address += province;
            if (city != '') address += (',' + city);
            if (district != '') address += (',' + district);
            data = {
                searchType: $("#searchType :selected").val(), // 0-account, 1-name, 2-contact, 3-recommend
                searchName: $("#searchName").val(),
                address: address,
                searchStatus: 0 //0-all, 1-available, 2-disable
            };
            break;
        case 2:
            data={
                searchType: '0',
                searchName: '',
                address: '',
                searchStatus: '0'
            };
            break;
        case 4:
            var start_month = $("#start_month :selected").val();
            var start_day = $("#start_day :selected").val();
            var end_month = $("#end_month :selected").val();
            var end_day = $("#end_day :selected").val();

            if( start_month != '0' && start_day == '0') start_day = 1;
            if( end_month != '0' && end_day == '0') end_day = getDaysOfMonth(end_month);

            var data = {
                searchType: $("#searchType").val(),
                searchName: $("#searchName").val(),
                searchStatus: $("#searchStatus").val(),
                start_month: start_month,
                start_day: start_day,
                end_month: end_month,
                end_day: end_day
            };
            break;
    }
    $.ajax({
        type: 'post',
        url: baseURL + 'product_manage/shipping_controller/item_listing',
        dataType: 'json',
        data: {id: id, searchData: data},
        success: function (res) {
            if (res.status == 'success') {
                $('#header_tbl').html(res.header);
                $('#content_tbl').html(res.content);
                $('#footer_tbl').html(res.footer);
                executionPageNation();
            } else {
                alert('search failed!');
                console.log(res.data);
            }
        }
    });
}


function getDaysOfMonth(month) {
    var year = new Date().getFullYear();
    return new Date(year, month, 0).getDate();
}

function monthSelected(month, id) {
    var days = getDaysOfMonth(month);
    if (month == 0) days = 0;

    var content_html = '<option value="0">选择日</option>'
    for (var i = 1; i <= days; i++) {
        content_html += '<option value="' + i + '">' + i + '</option>';
    }
    $('#' + id).html(content_html);
}

function passwordConfirm(id) {
    $("#item_id").val(id);
    $("#confirm_password").show();
}

function passwordItem() {
    var id = $("#item_id").val();
    var passwd = $('#passwd').val();
    var cpasswd = $('#cpasswd').val();
    if( passwd.length<6 || passwd.length > 20) {
        alert('密码会有6-20字符。');
        return;
    }
    if( passwd != cpasswd){
        alert('新密码与确认密码不同。');
        return;
    }
    $("#confirm_password").hide();

    var itemInfo = {
        'id': id,
        'orderID': passwd
    };

    $.ajax({
        url: baseURL + "product_manage/shipping_controller/addItem2DB",
        type: "POST",
        data: {'itemInfo': itemInfo},
        success: function (result) {
            console.log(result);
            if (result != 0)
                showLists(1);
        }
    });

}

function deleteConfirm(id) {
    $("#item_id").val(id);
    $("#confirm_delete").show();
}

function deployConfirm(id) {
    $("#item_id").val(id);
    $("#confirm_deploy").show();
}

function deployItem() {
    var id = $("#item_id").val();
    $("#confirm_deploy").hide();


    var itemInfo = {
        'id': id,
        'state': 2 // status=0-disable, 1-available
    };

    $.ajax({
        url: baseURL + "product_manage/shipping_controller/addItem2DB",
        type: "POST",
        data: {'itemInfo': itemInfo},
        success: function (result) {
            //console.log(result);
            if (result != 0)
                showLists(4);
        }
    });

}

function deleteItem() {
    var id = $("#item_id").val();
    $("#confirm_delete").hide();

    var itemInfo = {
        'userId': id,
    };

    $.ajax({
        url: baseURL + "product_manage/shipping_controller/deleteItemFromDB",
        type: "POST",
        data: {'itemInfo': itemInfo},
        success: function (result) {
            console.log(result);
            if (result != 0)
                showLists(2);
            // else
            //     window.alert("Item cannot be deleted.");
        }
    });

}
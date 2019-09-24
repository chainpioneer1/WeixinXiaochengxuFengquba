/*
 fileName:
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute

$(document).ready(function () {
    var pageName = $("#page_Name").val();
    switch (pageName) {
        case 'provider':
            showLists(1);
            break;
        case 'provider_add':
        case 'provider_edit':
            //upload company logo image
            $('#upload_company_logo').on('change', uploadSingleImage);
            $('#upload_company_cert').on('change', uploadSingleImage);

            $('.company_brand').hover(function () {
                $('.item_group').show();
            }, function () {
                $('.item_group').hide();
            });

            $('#upload_company_brand').on('change', uploadImageAndInsertTag);
            break;
    }
});

function ModifyImage(index) {
    $('#upload_company_brand' + index).trigger('click');
    $('#upload_company_brand' + index).on('change', change_image);
}

function change_image(){
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
                    $("#" + str + "_src").val(JSON.stringify([data['originfile'], 'uploads/' + data['file']]));
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

function delete_image(index){
    $('#company_brand'+index).remove();
    var n = parseInt($('#brand_count').val());
    for( var i = index+1; i <= n; i++){
        $('#company_brand' + i + ' .close_item').attr('onclick', 'delete_item(' +(i-1) + ')');
        $('#company_brand' + i + ' .modify_item').attr('onclick', 'ModifyImage(' +(i-1) + ')');

        $('#company_brand' + i + '_image').attr('id','#company_brand' + (i-1) + '_image');
        $('#upload_company_brand' + i).attr('id','#upload_company_brand' + (i-1));
        $('#upload_company_brand' + i).attr('id','#upload_company_brand' + (i-1));
        $('#company_brand'+ i+'_src' ).attr('name','#brand'+ (i-1));
        $('#company_brand'+ i+'_src' ).attr('id','#company_brand'+ (i-1)+'_src');
        $('#company_brand' + i + '_filename').attr('id','#company_brand' + (i-1) + '_filename');

        $('#company_brand' + i).attr('id','#company_brand' + (i-1));
    }
    $('#brand_count').attr('value', n-1);
}

function uploadSingleImage(event) {
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
                    $("#" + str + "_src").val(JSON.stringify([data['originfile'], 'uploads/' + data['file']]));
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

function uploadImageAndInsertTag(event) {
    event.stopPropagation(); // Stop stuff happening
    event.preventDefault(); // Totally stop stuff happening

    var index = document.getElementById('company_brand_content').children[0].children.length + 1;
    if (index > 10) {
        alert('代理品牌LOGO不超过10张。');
        return;
    }
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
                    $('#brand_count').val(index);
                    console.log($('#brand_count').val());
                    // insert tag
                    var content_html = $('#company_brand_content div').html();
                    content_html += '<div class="company_brand" id="company_brand' + index + '" style="float: left; position: relative">' +
                        '    <img id="company_brand' + index + '_image" src="' + url + '"' +
                        '         onclick="ModifyImage(' + index + ');"' +
                        '         alt="user image" class="online" style="height: 130px; width:180px; padding: 20px; padding-bottom:2px;"><br>' +
                        '    <input id="upload_company_brand' + index + '" class="upload_company_brand" type="file" style="display: none"/>' +
                        '    <input name="brand' + index + '" id="company_brand' + index + '_src" type="text" style="display: none"' +
                        '           value=\'' + JSON.stringify([data['originfile'], 'uploads/' + data['file']]) + '\'>' +
                        '    <span id="company_brand' + index + '_filename" style="display: none;">' + data['originfile'] + '</span>' +
                        '<div class="item_group">' +
                        '    <div class="close_item" onclick="delete_image('+index+')">' +
                        '        <i class="fa fa-fw fa-close"></i></div>' +
                        '    <span class="modify_item" onclick="ModifyImage('+index+')">修改</span>' +
                        '</div></div>'
                    $('#company_brand_content div').html(content_html);

                    $('.company_brand').hover(function () {
                        $('.item_group').show();
                    }, function () {
                        $('.item_group').hide();
                    })

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
    var province = $("#provinceName").val();
    var city = $("#cityName").val();
    var district = $("#districtName").val();
    var address = '';
    if (province != '') address += province;
    if (city != '') address += (',' + city);
    if (district != '') address += (',' + district);
    var data = {
        searchType: $("#searchType :selected").val(), // 0-account, 1-name, 2-contact, 3-recommend
        searchName: $("#searchName").val(),
        address: address,
        searchStatus: $("#searchStatus :selected").val() //0-all, 1-available, 2-disable
    };
    $.ajax({
        type: 'post',
        url: baseURL + 'user_manage/provider_controller/item_listing',
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

$('#item_add_submit').on('click', function () {
    var image_name = $("#image_filename").html().trim();
    if (image_name == 'logo.png') {
        alert("请选择图片并裁剪.");
        return;
    }
    var type = $("input[name='radio_caro_type']:checked").val();
    var sort = $("#sort_number").val();
    if (sort == '' || sort == '0') {
        sort = 1000;
    } else if (parseFloat(sort) <= 0) {
        alert("排序不允许为0.");
        return;
    }

    var itemInfo = {
        'image': image_name,
        'type': type,
        'sort': sort,
        'status': 0 // 0-disable, 1-available
    };

    $.ajax({
        url: baseURL + "provider_controller/addItem2DB",
        type: "POST",
        data: {'itemInfo': itemInfo},
        success: function (result) {
            console.log(result);
            if (result != 0)
                location.href = baseURL + 'carousel';
            else
                window.alert("Item cannot be added");
        }
    });
});

function spinnerChange(val) {
    var sort = $("#sort_number").val();
    if (val == 1) sort++;
    else if (sort > 0) sort--; else sort = 0;
    $("#sort_number").val(sort);
}

function deleteConfirm(id) {
    $("#item_id").val(id);
    $("#confirm_delete").show();
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
        url: baseURL + "user_manage/provider_controller/addItem2DB",
        type: "POST",
        data: {'itemInfo': itemInfo},
        success: function (result) {
            console.log(result);
            if (result != 0)
                showLists(1);
            else
                window.alert("上架数量最多才5张.");
        }
    });

}

function deleteItem() {
    var id = $("#item_id").val();
    $("#confirm_delete").hide();

    var itemInfo = {
        'userid': id,
    };

    $.ajax({
        url: baseURL + "user_manage/provider_controller/deleteItemFromDB",
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
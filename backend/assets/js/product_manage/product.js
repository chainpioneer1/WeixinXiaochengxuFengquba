/*
fileName:
description: process Tourist Area
*/

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute

$(document).ready(function () {
    var pageName = $("#page_Name").val();
    switch (pageName) {
        case 'product':
            $('#searchKind').on('change', function () {
                var type = $("#searchKind :selected").val()
                typeSelected(type);
            });
            showLists(1);
            break;
        case 'product_add':
            $('#searchKind').on('change', function () {
                var type = $("#searchKind :selected").val()
                typeSelected(type);
            });
            $('#searchBrand').on('change', function () {
                var brand = $("#searchBrand :selected").val()
                brandSelected(brand);
            });
            $('#product_name').on('change', function () {
                var product_id = $("#product_name :selected").val()
                productSelected(product_id);
            });
            break;
    }
});

function productSelected(product_id) {
    $.ajax({
        type: 'post',
        url: baseURL + 'product_manage/product_controller/getProductDetailInfo',
        dataType: 'json',
        data: {id: product_id},
        success: function (res) {
            if (res.status == 'success') {
                $('#barcode').html(res.content.barcode);
                $('#standard').html(res.content.standard);

                $('#unit').html(res.content.unit_name);
                $('#product_logo_image').attr('src', baseURL + JSON.parse(res.content.cover)[1]);

                var imgs_content = '<div class="form-group text-center" style="padding: 0px 20px;">';
                var img_list = JSON.parse(res.content.images);
                for (var i = 0; i < img_list.length; i++) {
                    imgs_content += '<div class="product_imgs" style="float: left;">' +
                        '    <img id="product_imgs' + (i + 1) + '_image"' +
                        '        src="' + baseURL + img_list[i][1] + '"' +
                        '        alt="user image" class="online"' +
                        '        style="height: 130px; width:180px; padding: 20px; padding-bottom:2px;"><br>' +
                        '</div>'
                }
                imgs_content += '</div>';
                $('#product_imgs_content').html(imgs_content);

                $('#contents').html(res.content.contents);

            } else {
                $('#barcode').html('');
                $('#standard').html('');

                $('#unit').html('');
                $('#product_logo_image').html('');

                var imgs_content = '<div class="form-group text-center" style="padding: 0px 20px;">';
                imgs_content += '</div>';
                $('#product_imgs_content').html(imgs_content);

                $('#contents').html('');

                if(res.error == '1'){
                    $('#alert_delete').show();
                }
            }
        }
    });
}

function typeSelected(type) {
    $.ajax({
        type: 'post',
        url: baseURL + 'product_manage/product_controller/getBrandListByTypeID',
        dataType: 'json',
        data: {type: type},
        success: function (res) {
            var content_html = '<option value="0">请选择</option>';
            if (res.status == 'success') {
                for (var i = 0; i < res.content.length; i++) {
                    content_html += '<option value="' + res.content[i].id + '">' + res.content[i].name + '</option>';
                }
            } else {

            }
            $('#searchBrand').html(content_html);
        }
    })
}

function brandSelected(brand) {
    $.ajax({
        type: 'post',
        url: baseURL + 'product_manage/product_controller/getPorductNamesByBrand',
        dataType: 'json',
        data: {
            type: $("#searchKind :selected").val(),
            brand: brand
        },
        success: function (res) {
            var content_html = '<option value="0">请选择</option>';
            if (res.status == 'success') {
                for (var i = 0; i < res.content.length; i++) {
                    content_html += '<option value="' + res.content[i].id + '">' + res.content[i].name + '</option>';
                }
            } else {

            }
            $('#product_name').html(content_html);
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

    var index = document.getElementById('product_imgs_content').children[0].children.length + 1;
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
                    $('#image_count').val(index);
                    console.log($('#image_count').val());
                    // insert tag
                    var content_html = $('#product_imgs_content div').html();
                    content_html += '<div class="company_brand" style="float: left;">' +
                        '    <img id="company_brand' + index + '_image" src="' + url + '"' +
                        '         onclick="ModifyImage(' + index + ');"' +
                        '         alt="user image" class="online" style="height: 130px; width:180px; padding: 20px; padding-bottom:2px;"><br>' +
                        '    <input id="upload_company_brand' + index + '" class="upload_company_brand" type="file" style="display: none"/>' +
                        '    <input name="brand' + index + '" id="company_brand' + index + '_src" type="text" style="display: none"' +
                        '           value=\'' + JSON.stringify([data['originfile'], 'uploads/' + data['file']]) + '\'>' +
                        '    <span id="company_brand' + index + '_filename">' + data['originfile'] + '</span>' +
                        '</div>'
                    $('#product_imgs_content div').html(content_html);
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
    var data = {
        searchType: $("#searchType :selected").val(), // 0-account, 1-name, 2-contact, 3-recommend
        searchName: $("#searchName").val(),
        searchKind: $("#searchKind :selected").val(),
        searchBrand: $("#searchBrand :selected").val() //0-all, 1-brand 1, 2-brand 2
    };
    $.ajax({
        type: 'post',
        url: baseURL + 'product_manage/product_controller/item_listing',
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
        url: baseURL + "product_controller/addItem2DB",
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
        $("#confirm-deploy-message").html("确定要解除禁用吗?");
    else
        $("#confirm-deploy-message").html("确定要禁用吗?");
    $("#item_id").val(id);
    $("#item_status").val(status); // status=0-disable, 1-available
    $("#confirm_deploy").show();
}

function deployItem() {
    var id = $("#item_id").val();
    $("#confirm_deploy").hide();


    var itemInfo = {
        'userId': id,
        'status': $("#item_status").val() // status=0-disable, 1-available
    };

    $.ajax({
        url: baseURL + "product_manage/product_controller/addItem2DB",
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
        'userId': id,
    };

    $.ajax({
        url: baseURL + "product_manage/product_controller/deleteItemFromDB",
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
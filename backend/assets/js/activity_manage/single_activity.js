/*
fileName:
description: process Tourist Area
*/

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute

$(document).ready(function () {
    var pageName = $("#page_Name").val();
    switch (pageName) {
        case 'single_activity':
            showLists(1);
            break;
        case 'single_activity_add':
            $(".form_datetime").datetimepicker({language: 'zh-CN'});
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
    if($('#activity_id').val() == '0')
        $('#activity_name').val($("#product_name :selected").html());
    $.ajax({
        type: 'post',
        url: baseURL + 'activity_manage/single_activity_controller/getProductDetailInfo',
        dataType: 'json',
        data: {id: product_id},
        success: function (res) {
            if (res.status == 'success') {
                $('#barcode').html(res.content.barcode);
                $('#standard').html(res.content.standard);
                $('#cost').html(res.content.cost);
                $('#origin_cost').val(res.content.cost);
                $('#store').html(res.content.store);

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
                $('#single_activity_logo_image').html('');

                var imgs_content = '<div class="form-group text-center" style="padding: 0px 20px;">';
                imgs_content += '</div>';
                $('#single_activity_imgs_content').html(imgs_content);

                $('#contents').html('');
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
        url: baseURL + 'activity_manage/single_activity_controller/getPorductNamesByBrand',
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

function showLists(id) {
    var data = {
        searchType: $("#searchType :selected").val(), // 0-account, 1-name, 2-contact, 3-recommend
        searchName: $("#searchName").val(),
        searchStatus: $("#searchStatus :selected").val()
    };

    if ($("#searchOrder").html() != undefined) {
        data['searchOrder'] = $("#searchOrder :selected").val();
    }
    if ($("#searchRecommend").html() != undefined) {
        data['searchRecommend'] = $("#searchRecommend :selected").val();
    }

    $.ajax({
        type: 'post',
        url: baseURL + 'activity_manage/single_activity_controller/item_listing',
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


function deployConfirm(id, type, status) {
    switch (type) {
        case 1:     //推荐
            if (status == 1)// status=0-disable, unequal to 0-available
                $("#confirm-deploy-message").html("确定推荐？");
            else
                $("#confirm-deploy-message").html("确定取消推荐？");
            break;
        case 2:     //置顶
            if (status == 3)// status=0-disable, unequal to 0-available
                $("#confirm-deploy-message").html("确定一键成团？");
            else
                $("#confirm-deploy-message").html("确定再拼团？");
            break;
        case 3:
            $("#confirm-deploy-message").html("确定取消置顶吗？");
            break;
    }
    $("#item_id").val(id);
    $("#item_status").val(status); // status=0-disable, 1-available
    $("#item_type").val(type); // status=1 - 推荐, 2 - 一键成团, 3 - 取消置顶
    $("#confirm_deploy").show();
}

function deployItem() {
    var id = $("#item_id").val();
    var type = $("#item_type").val();

    $("#confirm_deploy").hide();

    var itemInfo;
    switch (type) {
        case '1':
            itemInfo = {
                'id': id,
                'recommend_status': $("#item_status").val() // status=0-disable, 1-available
            };
            break;
        case '2':
            itemInfo = {
                'id': id,
                'status': $("#item_status").val()
            };
            break;
        case  '3':
            itemInfo = {
                'id': id,
                'order': 1000
            };
            break;
    }

    $.ajax({
        url: baseURL + "activity_manage/single_activity_controller/addItem2DB",
        type: "POST",
        data: {'itemInfo': itemInfo},
        success: function (result) {
            console.log(result);
            if (result != 0)
                showLists(1);
        }
    });
}

function orderConfirm(id, status) {
    $("#item_id").val(id);
    $('#order_value').val('0');
    $("#confirm_order").show();
}

function orderItem() {
    var id = $("#item_id").val();
    $("#confirm_order").hide();

    var itemInfo = {
        'id': id,
        'order': parseInt($("#order_value").val())
    };

    $.ajax({
        url: baseURL + "activity_manage/single_activity_controller/addItem2DB",
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

function deleteItem() {
    var id = $("#item_id").val();
    $("#confirm_delete").hide();

    var itemInfo = {
        'id': id,
    };

    $.ajax({
        url: baseURL + "activity_manage/single_activity_controller/deleteItemFromDB",
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
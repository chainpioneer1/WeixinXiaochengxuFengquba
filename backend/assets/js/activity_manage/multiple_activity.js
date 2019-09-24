/*
fileName:
description: process Tourist Area
*/

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
var selectedProducts = [];
$(document).ready(function () {
    var pageName = $("#page_Name").val();
    switch (pageName) {
        case 'multiple_activity':
            showLists(1);
            break;
        case 'multiple_activity_add':
            $(".form_datetime").datetimepicker({language: 'zh-CN'});
            display_product_table();

            $('.product_imgs').hover(function () {
                $('.item_group').show();
            }, function () {
                $('.item_group').hide();
            });
            $('#upload_product_logo').on('change', uploadSingleImage);
            $('#upload_product_imgs').on('change', uploadImageAndInsertTag);
            break;
        case 'multiple_activity_detail':
            display_product_table();
            break;
    }

});

function display_product_table() {
    $.ajax({
        type: 'post',
        url: baseURL + 'activity_manage/multiple_activity_controller/product_list',
        dataType: 'json',
        data: {
            ids: $('#product_list').val()
        },
        success: function (res) {
            if (res.status == 'success') {
                $('#header_tbl').html(res.header);
                $('#footer_tbl').html(res.footer);

                var product_list = res.content;
                var buy_cnt = JSON.parse($('#buy_cnt').val());

                var content_html = '';
                var cur_cost = 0.00;
                var cur_cnt = 1;
                var origin_cost = 0;
                var total_cost = 0;


                if (product_list != null) {
                    if($('#activity_id').val() == '0')
                        $('#activity_name').val(product_list[0]['name']+ '-' + product_list.length);

                    for (var i = 0; i < product_list.length; i++) {
                        if (buy_cnt.length > i) {
                            cur_cost = buy_cnt[i]['cost'];
                            cur_cnt = buy_cnt[i]['count'];
                        } else {
                            cur_cost = 0;
                            cur_cnt = 1;
                        }
                        origin_cost += parseFloat(product_list[i]['cost']) * parseFloat(cur_cnt);
                        total_cost += parseFloat(cur_cost) * parseFloat(cur_cnt);

                        content_html += '<tr>';
                        content_html += '<td>' + product_list[i]['barcode'] + '</td>';
                        content_html += '<td>';
                        content_html += '<img src="' + baseURL + JSON.parse(product_list[i]['cover'])[1] + '" style="width:100px;height:50px;">';
                        content_html += '</td>';
                        content_html += '<td>' + product_list[i]['name'] + '</td>';
                        content_html += '<td id="origin_' + product_list[i]['id'] + '">' + (parseFloat(product_list[i]['cost'])).toFixed(2) + '</td>';
                        if ($("#page_Name").val() == 'multiple_activity_detail') {
                            content_html += '<td>' + (parseFloat(cur_cost)).toFixed(2) + '</td>';
                            content_html += '<td>' + cur_cnt + '</td>';
                        } else {
                            content_html += '<td><input onchange="calculate_group_cost()" id="cost_' + product_list[i]['id'] + '" value="' + (parseFloat(cur_cost)).toFixed(2) + '"/></td>';
                            content_html += '<td><input onchange="calculate_group_cost()" id="cnt_' + product_list[i]['id'] + '" value="' + cur_cnt + '"/></td>';
                        }
                        content_html += '</tr>';
                    }
                }
                $('#content_tbl').html(content_html);
                $('#origin_cost').html(origin_cost.toFixed(2));
                $('#origin_cost_input').val(origin_cost.toFixed(2));
                $('#group_cost').html(total_cost.toFixed(2));
                $('#group_cost_input').val(total_cost.toFixed(2));
                calculate_group_cost();
            } else {
                alert('search failed!');
                console.log(res.data);
            }
        }
    });
}

function calculate_group_cost() {
    var ids = JSON.parse('[' + $('#product_list').val() + ']');
    var total_cost = 0;
    var origin_cost = 0;
    var buy_cnt = '[';
    for (var i = 0; i < ids.length; i++) {
        var cnt = $('#cnt_' + ids[i]).val();
        if (cnt.length > 2) {
            alert('彩购数量不超过2位数');
            $('#cnt_' + ids[i]).val(cnt.substring(0, 2));
        }
        total_cost += parseFloat($('#cost_' + ids[i]).val()) * parseFloat($('#cnt_' + ids[i]).val());
        origin_cost += parseFloat($('#origin_' + ids[i]).html()) * parseFloat($('#cnt_' + ids[i]).val());

        if (i > 0) buy_cnt += ',';
        buy_cnt += '{ "cost":"' + $('#cost_' + ids[i]).val() + '", "count":"' + $('#cnt_' + ids[i]).val() + '"}';
    }
    buy_cnt += ']';
    $('#origin_cost').html(origin_cost.toFixed(2));
    $('#origin_cost_input').val(origin_cost.toFixed(2));
    $('#group_cost').html(total_cost.toFixed(2));
    $('#group_cost_input').val(total_cost.toFixed(2));
    $('#buy_cnt').val(buy_cnt);
}

function selectProduct() {
    selectedProducts = JSON.parse('[' + $('#product_list').val() + ']');

    $.ajax({
        type: 'post',
        url: baseURL + 'activity_manage/multiple_activity_controller/all_products',
        dataType: 'json',
        success: function (res) {
            if (res.status == 'success') {
                $('#dlg_header_tbl').html(res.header);
                $('#dlg_footer_tbl').html(res.footer);

                var product_list = res.content;
                var buy_cnt = JSON.parse($('#buy_cnt').val());

                var content_html = '';
                var cur_cost = 0.00;
                var cur_cnt = 1;
                if (product_list != null) {
                    for (var i = 0; i < product_list.length; i++) {
                        if (buy_cnt.length > i) {
                            cur_cost = buy_cnt[i]['cost'];
                            cur_cnt = buy_cnt[i]['count'];
                        } else {
                            cur_cost = 0;
                            cur_cnt = 1;
                        }

                        content_html += '<tr>';
                        content_html += '<td>' + product_list[i]['barcode'] + '</td>';
                        content_html += '<td>';
                        content_html += '<img src="' + baseURL + JSON.parse(product_list[i]['cover'])[1] + '" style="width:100px;height:50px;">';
                        content_html += '</td>';
                        content_html += '<td>' + product_list[i]['name'] + '</td>';
                        content_html += '<td>' + product_list[i]['store'] + '</td>';
                        content_html += '<td>' + (parseFloat(product_list[i]['cost'])).toFixed(2) + '</td>';

                        var flag = 0;
                        for (var j = 0; j < selectedProducts.length; j++) {
                            if (product_list[i]['id'] == selectedProducts[j]) {
                                flag = 1;
                                break;
                            }
                        }
                        if (flag == 0) {
                            content_html += '<td><a href="#" id="a_' + product_list[i]['id'] + '" onclick="changeState(' + product_list[i]['id'] + ')">加入</a></td>';
                        } else {
                            content_html += '<td><a href="#"  id="a_' + product_list[i]['id'] + '"  onclick="changeState(' + product_list[i]['id'] + ')">移出</a></td>';
                        }
                        content_html += '</tr>';
                    }
                }
                $('#dlg_content_tbl').html(content_html);

                $('#confirm_deploy').show();
                calculate_group_cost();
            } else {
                alert('search failed!');
                console.log(res.data);
            }
        }
    });
}

function changeState(id) {
    var state = $('#a_' + id).html();
    if (state == "加入") {
        $('#a_' + id).html("移出");
        selectedProducts.push(id);
    } else if (state == "移出") {
        $('#a_' + id).html("加入");
        selectedProducts = jQuery.grep(selectedProducts, function (value) {
            return value != id;
        });
    }
}

function setProduts() {
    if (selectedProducts.length < 2) {
        alert('您需要选择2种以上的产品。');
        return;
    }
    var str = "";
    for (var i = 0; i < selectedProducts.length; i++) {
        if (i > 0) str += ",";
        str += selectedProducts[i];
    }
    $('#product_list').val(str);
    $('#confirm_deploy').hide();
    display_product_table();
}

function ModifyImage(index) {
    $('#upload_company_brand' + index).trigger('click');
    $('#upload_product_imgs' + index).on('change', change_image);
}

function change_image() {
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

function delete_image(index) {
    $('#product_imgs' + index).remove();
    var n = parseInt($('#image_count').val());
    for (var i = index + 1; i <= n; i++) {
        $('#product_imgs' + i + ' .close_item').attr('onclick', 'delete_item(' + (i - 1) + ')');
        $('#product_imgs' + i + ' .modify_item').attr('onclick', 'ModifyImage(' + (i - 1) + ')');

        $('#product_imgs' + i + '_image').attr('id', '#product_imgs' + (i - 1) + '_image');
        $('#upload_product_imgs' + i).attr('id', '#upload_product_imgs' + (i - 1));
        $('#upload_product_imgs' + i).attr('id', '#upload_product_imgs' + (i - 1));
        $('#product_imgs' + i + '_src').attr('name', '#brand' + (i - 1));
        $('#product_imgs' + i + '_src').attr('id', '#product_imgs' + (i - 1) + '_src');
        $('#product_imgs' + i + '_filename').attr('id', '#product_imgs' + (i - 1) + '_filename');

        $('#product_imgs' + i).attr('id', '#product_imgs' + (i - 1));
    }
    $('#image_count').attr('value', n - 1);
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
                    content_html += '<div class="company_brand"  id="company_brand' + index + '"style="float: left; position: relative;">' +
                        '    <img id="company_brand' + index + '_image" src="' + url + '"' +
                        '         onclick="ModifyImage(' + index + ');"' +
                        '         alt="user image" class="online" style="height: 130px; width:180px; padding: 20px; padding-bottom:2px;"><br>' +
                        '    <input id="upload_company_brand' + index + '" class="upload_company_brand" type="file" style="display: none"/>' +
                        '    <input name="brand' + index + '" id="company_brand' + index + '_src" type="text" style="display: none"' +
                        '           value=\'' + JSON.stringify([data['originfile'], 'uploads/' + data['file']]) + '\'>' +
                        '    <span id="company_brand' + index + '_filename" style="display: none;">' + data['originfile'] + '</span>' +
                        '<div class="item_group">' +
                        '    <div class="close_item" onclick="delete_image(' + index + ')">' +
                        '        <i class="fa fa-fw fa-close"></i></div>' +
                        '    <span class="modify_item" onclick="ModifyImage(' + index + ')">修改</span>' +
                        '</div></div>'
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
        url: baseURL + 'activity_manage/multiple_activity_controller/item_listing',
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
        url: baseURL + "activity_manage/multiple_activity_controller/addItem2DB",
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
        url: baseURL + "activity_manage/multiple_activity_controller/deleteItemFromDB",
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
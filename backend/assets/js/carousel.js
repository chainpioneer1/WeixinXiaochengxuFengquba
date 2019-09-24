/*
 fileName:
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute

$(document).ready(function () {
    var pageName = $("#page_Name").val();
    switch (pageName) {
        case 'carousel':
            showLists(1);
            break;
        case 'carousel_add':
        case 'carousel_edit':
            loadSettings();
            break;
    }
});

function showLists(id) {

    $.ajax({
        type: 'post',
        url: baseURL + 'carousel_controller/item_listing',
        dataType: 'json',
        data: {id: id},
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

$('input[name="radio_caro_type"]').click(function () {
    switch($(this).val()){
       case "1":  // hide active name select item
           $('#select_active_group').css({'display':'none'});
           break;
       case "2":  // 单品活动
           loadActivities(1);
           $('#select_active_group').css({'display':'block'});
           break;
       case "3":  //餐装活动
           loadActivities(2);
           $('#select_active_group').css({'display':'block'});
           break;
       case "4":  //区域总代理
           loadProviders();
           $('#select_active_group').css({'display':'block'});
           break;
   }
});

function loadActivities(type){
    var data = {
        'searchType' : 0,
        'searchName' : '',
        'searchStatus' : 2,
        'provider_id' : 0,
        'kind' : type
    };
    $.ajax({
        url: baseURL + "carousel_controller/getActivities",
        type: 'post',
        dataType:'json',
        data: {'data': data},
        success: function (res) {
            console.log(res);
            var activities = res.content;
            var content_html = '';
            for(var i = 0; i < activities.length; i++){
                content_html += '<option value="'+activities[i]['id']+'">'+activities[i]['name']+'</option>';
            }

            $('#select_active_list').html(content_html);

            var id = sessionStorage.getItem('sel_id');
            var name = sessionStorage.getItem('sel_name');
            if( id == null || parseInt(id) == type) return;

            $('#select_active_list').val(id);
            $('#select2-select_active_list-container')[0].innerHTML = name;
            $($('#select2-select_active_list-container')[0]).attr('title', name)
            sessionStorage.removeItem('sel_id');
            sessionStorage.removeItem('sel_name');
        }
    });
}

function loadProviders(){
    var data = {
        'searchType' : 0,
        'searchName' : '',
        'searchStatus' : 1,
        'address' : '',
    };
    $.ajax({
        url: baseURL + "carousel_controller/getProviders",
        type: 'post',
        dataType:'json',
        data: {'data': data},
        success: function (res) {
            console.log(res);
            var activities = res.content;
            var content_html = '';
            for(var i = 0; i < activities.length; i++){
                content_html += '<option value="'+activities[i]['id']+'">'+activities[i]['username']+'</option>';
            }

            $('#select_active_list').html(content_html);

            var id = sessionStorage.getItem('sel_id');
            var name = sessionStorage.getItem('sel_name');
            if( id == null) return;

            $('#select_active_list').val(id);
            $('#select2-select_active_list-container')[0].innerHTML = name;
            $($('#select2-select_active_list-container')[0]).attr('title', name)
            sessionStorage.removeItem('sel_id');
            sessionStorage.removeItem('sel_name');
        }
    });
}

function saveSetting(){
    sessionStorage.setItem('sel_type', $('input[name="radio_caro_type"]:checked').val());
    sessionStorage.setItem('sel_id', $('#select_active_list').val());
    sessionStorage.setItem('sel_name', $('#select2-select_active_list-container')[0].innerHTML);
    sessionStorage.setItem('order_num', $('#sort_number').val());
}

function loadSettings() {
    var type = sessionStorage.getItem('sel_type');
    var order_num = sessionStorage.getItem('order_num');

    if(type != null) {
        $($('input[name="radio_caro_type"]')[0]).removeAttr('checked');
        $($('input[name="radio_caro_type"]')[parseInt(type) - 1]).trigger('click');
    }

    if(order_num != null) {
        $('#sort_number').val(order_num);
    }

    sessionStorage.removeItem('sel_type');
    sessionStorage.removeItem('order_num');
}

$('#carousel_add_submit').on('click', function () {
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

    var activity = $('#select_active_list').val();

    var itemInfo = {
        'image': 'uploads/' + image_name,
        'type': type,
        'sort': sort,
        'activity': activity,
        'status': 0 // 0-disable, 1-available
    };

    $.ajax({
        url: baseURL + "carousel_controller/addItem2DB",
        type: "POST",
        data: {'itemInfo': itemInfo},
        success: function (result) {
            console.log(result);
            if (result != 0)
                location.href = baseURL + 'carousel';
            else
                window.alert("Database is not responding.");
        }
    });
});


function spinnerChange(val) {
    var sort = $("#sort_number").val();
    if (val == 1) sort++;
    else if (sort > 0) sort--; else sort=0;
    $("#sort_number").val(sort);
}

function deleteConfirm(id) {
    $("#item_id").val(id);
    $("#confirm_delete").show();
}

function deployConfirm(id, status) {
    if(status == 0)// status=0-disable, 1-available
        $("#confirm-deploy-message").html("确定要下架吗？");
    else
        $("#confirm-deploy-message").html("确定要上架吗？");
    $("#item_id").val(id);
    $("#item_status").val(status); // status=0-disable, 1-available
    $("#confirm_deploy").show();
}

function deployItem() {
    var id = $("#item_id").val();
    $("#confirm_deploy").hide();


    var itemInfo = {
        'id': id,
        'status': $("#item_status").val() // status=0-disable, 1-available
    };

    $.ajax({
        url: baseURL + "carousel_controller/addItem2DB",
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
        'id': id,
    };

    $.ajax({
        url: baseURL + "carousel_controller/deleteItemFromDB",
        type: "POST",
        data: {'itemInfo': itemInfo},
        success: function (result) {
            console.log(result);
            if (result != 0)
                showLists(1);
            else
                window.alert("Database is not responding.");
        }
    });

}
/*
 fileName:
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute

$(document).ready(function () {
    var pageName = $("#page_Name").val();
    switch (pageName) {
        case 'userlist':
            showLists(1);
            break;
    }
});

function showLists(id) {
    var data;
    switch (id) {
        case 1:
            data = {
                searchType: $("#searchType :selected").val(), // 0-account, 1-name
                searchName: $("#searchName").val(),
            };
            break;
    }

    $.ajax({
        type: 'post',
        url: baseURL + 'user_manage/user_controller/item_listing',
        dataType: 'json',
        data: {id: id, searchData: data},
        success: function (res) {
            if (res.status == 'success') {
                $('#header_tbl').html(res.header);
                $('#content_tbl').html(res.content);
                $('#footer_tbl').html(res.footer);
            } else {
                alert('查看失败!');
                console.log(res.data);
            }
        }
    });
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

    $.ajax({
        url: baseURL + "user_manage/user_controller/updateUserPassword",
        type: "POST",
        dataType: 'json',
        data: {'id': id, 'password': passwd},
        success: function (result) {
            //console.log(result);
            if (result.status == true)
                alert('密码更改成功.')
            else
                alert('密码更改失败.')
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
        url: baseURL + "user_manage/user_controller/deleteItemFromDB",
        type: "POST",
        data: {'id': id},
        success: function (result) {
            console.log(result);
            if (result == true)
                showLists(1);
            else
                window.alert("该业务员已关联了区域总代理，先去更换区域总代理的业务员吧。");
        }
    });

}
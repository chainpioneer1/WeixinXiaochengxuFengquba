/*
fileName:
description: process Tourist Area
*/

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute

$(document).ready(function () {
    var pageName = $("#page_Name").val();
    switch (pageName) {
        case 'withdraw':
            showLists(1);
            break;
        case 'withdraw_add':
            $($('.radio').find('label')[0]).trigger('click');
            break;
    }
});

$('input[name="radio_caro_type"]').click(function () {
    switch($(this).val()){
        case "2":  // 提现成功
            $('#option_status').val('2');
            break;
        case "3":  // 提现失败
            $('#option_status').val('3');
            break;
    }
});
function showLists(id) {
    var data = {
        searchType: $("#searchType :selected").val(), // 0-account, 1-name, 2-contact, 3-recommend
        searchName: $("#searchName").val(),
        searchStatus: $("#searchStatus :selected").val()
    };
    $.ajax({
        type: 'post',
        url: baseURL + 'transaction_manage/withdraw_controller/item_listing',
        dataType: 'json',
        data: {id: id, searchData: data},
        success: function (res) {
            if (res.status == 'success') {
                $('#header_tbl').html(res.header);
                $('#content_tbl').html(res.content);
                $('#footer_tbl').html(res.footer);
                executionPageNation();

                if(sms_error != '' || sms_error.error != undefined) alert('【短信错误】 ' +sms_error.error[0]);
            } else {
                // alert('search failed!');
                console.log(res.data);
            }
        }
    });
}

function  OnShowMessage() {
    var type = $('#option_status').val();

    switch (type){
        case '2':
            $('#alert_message').html('是否确认打款成功？');
            break;
        case '3':
            $('#alert_message').html('是否确认打款失败？');
            break;
    }

    $('#confirm_delete').show();
}
function onConfirm() {
    $('form').submit();
}
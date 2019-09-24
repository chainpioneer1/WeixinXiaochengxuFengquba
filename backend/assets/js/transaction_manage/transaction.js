/*
fileName: 
description: process Tourist Area
*/

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute

$(document).ready(function () {
    var pageName = $("#page_Name").val();
    switch (pageName) {
        case 'transaction':
            $(".form_datetime").datetimepicker({language: 'zh-CN'});
            showLists(1);
            break;
        case 'transaction_add':
            break;
    }
});

function showLists(id) {
    var data = {
        searchType: $("#searchType :selected").val(), // 0-account, 1-name, 2-contact, 3-recommend
        searchName: $("#searchName").val(),
        start_time : $('#start_time').val(),
        end_time : $('#end_time').val()
    };

    $.ajax({
        type: 'post',
        url: baseURL + 'transaction_manage/transaction_controller/item_listing',
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

/*
fileName:
description: process Tourist Area
*/

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute

$(document).ready(function () {
    var pageName = $("#page_Name").val();
    switch (pageName) {
        case 'coupon':
            showLists(1);
            break;
        case 'coupon_add':

            break;
    }
});

function showLists(id) {
    var data = {
        searchStatus: $("#searchStatus :selected").val()
    };
    $.ajax({
        type: 'post',
        url: baseURL + 'coupon_controller/item_listing',
        dataType: 'json',
        data: {id: id, searchData: data},
        success: function (res) {
            if (res.status == 'success') {
                $('#header_tbl').html(res.header);
                $('#content_tbl').html(res.content);
                $('#footer_tbl').html(res.footer);
            } else {
                alert('search failed!');
                console.log(res.data);
            }
        }
    });
}

/*
fileName: 
description: process Tourist Area
*/

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
var selectedProducts = [];
$(document).ready(function () {
    var pageName = $("#page_Name").val();
    switch (pageName) {
        case 'order':
            showLists(1);
            break;
        case 'order_detail':
            // display_product_table();
            break;
    }
});

function showLists(id) {
    var data = {
        searchType: $("#searchType :selected").val(), // 0-account, 1-name, 2-contact, 3-recommend
        searchName: $("#searchName").val(),
        searchStatus: $("#searchStatus :selected").val(),
        searchMethod: $("#searchMethod :selected").val()
    };

    $.ajax({
        type: 'post',
        url: baseURL + 'order_controller/item_listing',
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
    $("#item_id").val(id);
    $("#confirm_deploy").show();
}

function deployItem() {
    var id = $("#item_id").val();

    $("#confirm_deploy").hide();

    var itemInfo = {
        'id': id,
        'ship_status': 1 // status=0-disable, 1-available
    };
    $.ajax({
        url: baseURL + "order_controller/setShipping",
        type: "POST",
        dataType : 'json',
        data: {'itemInfo': itemInfo},
        success: function (result) {
            console.log(result);
            if(result.status == true) {
                showLists(1);
            }else{
                alert(result.data);
            }
        }
    });
}


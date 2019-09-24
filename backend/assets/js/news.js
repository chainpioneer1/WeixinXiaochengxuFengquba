/*
fileName:
description: process Tourist Area
*/

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute

$(document).ready(function () {
    var pageName = $("#page_Name").val();
    switch (pageName) {
        case 'news':
            showLists(1);
            break;
    }
});

function allchecked(state){
    var items = document.getElementsByClassName('news_check');
    for( var i = 0; i < items.length; i++){
        items[i].checked=state;
    }
}

function delete_messages(){
    var ids = '';
    var items = document.getElementsByClassName('news_check');
    for( var i = 0; i < items.length; i++){
        var id = items[i].id.substring(4);
        if( items[i].checked) ids +=',' + id;
    }
    ids = ids.substring(1);
    if(ids == '') return;

    $.ajax({
        type: 'post',
        url: baseURL + 'news_controller/delete_messages',
        dataType: 'json',
        data: {ids: ids},
        success: function (res) {
            showLists(1);
            chkMessage();
        }
    });
}

function showLists(id) {
    $.ajax({
        type: 'post',
        url: baseURL + 'news_controller/item_listing',
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


function deployConfirm(id) {
    $("#item_id").val(id);

    $("#confirm_deploy").show();
}

function deployItem() {
    var id = $("#item_id").val();
    $("#confirm_deploy").hide();

    var  itemInfo = {
           'id': id,
           'status': 1 // status=0-disable, 1-available
    };
    $.ajax({
        url: baseURL + "news_controller/addItem2DB",
        type: "POST",
        data: {'itemInfo': itemInfo},
        success: function (result) {
            console.log(result);
            if (result != 0)
                showLists(1);
            chkMessage();
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
        url: baseURL + "news_controller/deleteItemFromDB",
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
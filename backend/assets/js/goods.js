/*
 fileName: area.js
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {
});

function confirmDelete(id) {
    $('#goodId').html(id);
    $('#custom-confirm-delete-view').show();
}

function deleteGood(url) {
    var goodId = $('#goodId').text();
    $.ajax({
        type: 'POST',
        url: url + 'goodsmanage/deleteGood',
        dataType: 'json',
        data: {
            'goodId': goodId,
        },
        success: function (data, textStatus, jqXHR) {
            if (JSON.parse(data['status']))
                location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle errors here
            console.log('ERRORS: ' + textStatus);
            // STOP LOADING SPINNER
        }
    });
}

function confirmUpDown(id, state) {
    $('#goodId').html(id);
    if(state==1)
    {
        $("#caption").text("确定要下架？");
    }
    else
    {
        $("#caption").text("确定要上架？");
    }
    $('#custom-generate-auth-view').show();
}

function changeState(url) {
    var goodId = $('#goodId').text();
    var state = $('#state').text();
    $.ajax({
        type: 'POST',
        url: url + 'goodsmanage/changeState',
        dataType: 'json',
        data: {
            'goodId': goodId
        },
        success: function (data, textStatus, jqXHR) {
            if (JSON.parse(data['status']))
                location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle errors here
            console.log('ERRORS: ' + textStatus);
            // STOP LOADING SPINNER
        }
    });
}

function confirmAdd(id) {
    $('#goodId').html(id);
    $('#custom-confirm-deploy-view').show();
}

function changeAmount(url) {
    var goodId = $('#goodId').text();
    var amount = $('#amount').val();
    $.ajax({
        type: 'POST',
        url: url + 'goodsmanage/changeAmount',
        dataType: 'json',
        data: {
            'goodId': goodId,
            'amount': amount
        },
        success: function (data, textStatus, jqXHR) {
            if (JSON.parse(data['status']))
                location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle errors here
            console.log('ERRORS: ' + textStatus);
            // STOP LOADING SPINNER
        }
    });
}
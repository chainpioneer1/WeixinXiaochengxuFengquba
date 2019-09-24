/*
 fileName: area.js
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {
});

function showConfirm(id) {
    $('#exchangeId').html(id);
    $('#custom-confirm-delete-view').show();
}

function send(url) {
    var exchangeId = $('#exchangeId').text();
    var company = $('#company').val();
    var company_id = $('#company_id').val();
    $.ajax({
        type: 'POST',
        url: url + 'exchange/sendGoods',
        dataType: 'json',
        data: {
            'exchangeId': exchangeId,
            'company':company,
            'company_id':company_id
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
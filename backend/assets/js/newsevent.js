/*
 fileName: area.js
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {
});

function confirmDelete(id) {
    $('#eventId').html(id);
    $('#custom-confirm-delete-view').show();
}

function deleteEvent(url) {
    var eventId = $('#eventId').text();
    $.ajax({
        type: 'POST',
        url: url + 'eventmanage/deleteEvent',
        dataType: 'json',
        data: {
            'eventId': eventId,
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
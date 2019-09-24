/*
 fileName: area.js
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {
});

function setOnTop(id) {
    $.ajax({
        type: 'POST',
        url: baseURL + 'api/datamanage/setEventOnTop',
        dataType: 'json',
        data: {
            'event_id': id,
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
function confirmDelete(id) {
    $('#eventId').html(id);
    $('#custom-confirm-delete-view').show();
}

function deleteEvent(url) {
    var eventId = $('#eventId').text();
    $.ajax({
        type: 'POST',
        url: url + 'api/datamanage/cancelEvent',
        dataType: 'json',
        data: {
            'event_id': eventId,
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
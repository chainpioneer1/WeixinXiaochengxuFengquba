/*
 fileName: area.js
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {
});

function confirmForbidden(id, action) {
    $('#userId').html(id);
    $('#userAction').html("确定要" + action + "?");
    $('#custom-confirm-delete-view').show();
}

function changeForbidden(url) {
    var userId = $('#userId').text();
    console.log(url);
    $.ajax({
        type: 'POST',
        url: url + 'usermanage/changeForbidden',
        dataType: 'json',
        data: {
            'userId': userId
        },
        success: function (data, textStatus, jqXHR) {
            if (JSON.parse(data['status']))
                location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle errors here
            console.log('ERRORS: ' + errorThrown);
            // STOP LOADING SPINNER
        }
    });
}

function confirmState(id, name, phone) {
    $('#userId').html(id);
    $('#name').html("真实姓名：  " + name);
    $('#phone').html("联系方式：  " + phone);
    $('#custom-generate-auth-view').show();
}

function changeState(state, url) {
    var userId = $('#userId').text();
    $.ajax({
        type: 'POST',
        url: url + 'usermanage/updateUserState',
        dataType: 'json',
        data: {
            'userId': userId,
            'state': state
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

function addNewBoss() {
    location.href = baseURL + "usermanage/addNewBossUser";
}
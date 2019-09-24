/*
 fileName:
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {
});

function readAlarm(id, url)
{
    $.ajax({
        type: 'POST',
        url: url + 'alarm/readAlarm',
        dataType: 'json',
        data: {
            'id': id
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
    $('#userid').html(id);
    $('#custom-confirm-delete-view').show();
}
function deleteUser(url) {
    location.href = url + 'deleteUser/' + $('#userid').html();

}
function confirmPassword(id) {
    $('#userid').html(id);
    $('#custom-generate-auth-view').show();
}
function showPassword() {
    $('#custom-generate-auth-view').hide();
    $('#custom-generate-auth-count-view').show();
}
function resetPassword(url) {
    var passwd = $('#passwd').val();
    var cpasswd = $('#cpasswd').val();
    var msg = '';
    var id = $('#userid').html();
    if (passwd == '' || cpasswd == '' || passwd != cpasswd
        || passwd.length < 6 || passwd.length > 20) {
        msg = '不允许为空，密码6-20字符，<br>密码与确认密码，两次输入的必须一致.';
        $('#alertpwd').html(msg);
        $('#alertpwd').show();
        return;
    } else {
        msg = '';
        $('#alertpwd').html(msg);
        $('#alertpwd').hide();
    }
    $.ajax({
        type: 'POST',
        url: url + 'systemmanage/updateUserPassword',
        dataType: 'json',
        data: {
            'password': passwd,
            'id': id
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
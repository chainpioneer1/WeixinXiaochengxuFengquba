/*
 fileName:
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {
    if(provider_id == '0')
        showTopLists(1);
    else
        showTopLists(2);
});

function showTopLists(id) {

    $.ajax({
        type: 'post',
        url: baseURL + 'home_controller/home_listing',
        dataType: 'json',
        data: {id: id},
        success: function (res) {
            console.log(res);
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


function test_api() {
    var phone = '12345678901';
    var activity = ["2105111112408099","1105111109264238"];
    var count = [2,2];
    var type = 1;
    var ids = [2006301908,101506350114,201506347949];
    //for( var i =0; i < 3; i++) {
        $.ajax({
            type: 'POST',
            url: 'http://192.168.2.15/huiliancai/backend/api/orderInfos',
            dataType: 'json',
            data: {
                'phone': phone,
            },
            success: function (data, textStatus, jqXHR) {
                alert('aaa');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle errors here
                console.log('ERRORS: ' + textStatus);
                // STOP LOADING SPINNER
            }
        });
    //}
}

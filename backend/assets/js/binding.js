/*
fileName:
description: process binding credit card
*/

$(document).ready(function () {

});

$('input[name="radio_caro_type"]').click(function () {
    switch($(this).val()){
        case "1":  // 提现成功
            $('#option_status').val('1');
            break;
        case "2":  // 提现失败
            $('#option_status').val('2');
            break;
    }
});

function  OnShowMessage() {
    var type = $('#option_status').val();
    if(type=='1'){
                $('#alert_message').html('是否确认打款成功？');
        $('#confirm_delete').show();
    }
    else if (type=='2'){
                $('#alert_message').html('是否确认打款失败？');
        $('#confirm_delete').show();

    }
    else{
        alert("请选择提现状态");
    }
}
function onConfirm() {
        $('form').submit();
}
/*
fileName: 
description: process Tourist Area
*/

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute

$(document).ready(function () {
    var pageName = $("#page_Name").val();
    $($('#donate').find('label')[0]).trigger('click');
    $('input:radio[name="toggleButton"]').change(
        function(){
            if (this.checked && this.value == 'on') {
                var id = this.id;
                sessionStorage.setItem('curItem', id);
                var content_html = "";
                if(id>1){
                    content_html = "                <div class=\"col-xs-12 col-sm-4 form-inline\" style=\"padding-right: 0px;\">\n" +
                        "                    <div class=\"form-group\">\n" +
                        "                        <select class=\"form-control\" id=\"searchType\">\n" +
                        "                            <option value=\"0\" selected>终端便利店账号</option>\n" +
                        "                            <option value=\"1\">终端便利店</option>\n" +
                        "                        </select>\n" +
                        "                        <input type=\"text\" id=\"searchName\" style=\"width: 150px\"\n" +
                        "                               value=\"\" class=\"form-control\">\n" +
                        "                    </div>\n" +
                        "                </div>\n" +
                        "                <div class=\"col-xs-12 col-sm-6 form-inline\" style=\"margin-top: 0px;padding: 0px;\">\n" +
                        "                    <span> 交易时间 </span>\n" +
                        "                    <div class=\"input-group date form_datetime margin\"\n" +
                        "                         data-date=\"\"\n" +
                        "                         data-date-format=\"yyyy-mm-dd\" data-link-field=\"dtp_input1\"\n" +
                        "                         style=\"width: 180px;\">\n" +
                        "                        <input id=\"start_time\" class=\"form-control\" size=\"16\" type=\"text\" value=\"\" readonly=\"\"\n" +
                        "                               style=\"padding: 0px 20px;margin: 0px;\">\n" +
                        "                        <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-th\"></span></span>\n" +
                        "                    </div>\n" +
                        "                    <span> 至 </span>\n" +
                        "                    <div class=\"input-group date form_datetime margin\"\n" +
                        "                         data-date=\"\"\n" +
                        "                         data-date-format=\"yyyy-mm-dd\" data-link-field=\"dtp_input1\"\n" +
                        "                         style=\"width:180px;\">\n" +
                        "                        <input id=\"end_time\" class=\"form-control\" size=\"16\" type=\"text\" value=\"\" readonly=\"\"\n" +
                        "                               style=\"padding: 0px 20px;margin: 0px;\">\n" +
                        "                        <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-th\"></span></span>\n" +
                        "                    </div>\n" +
                        "                </div>\n" +
                        "                <div class=\"col-xs-12 col-sm-1 form-inline\">\n" +
                        "                    <div class=\"form-group\">\n" +
                        "                        <a href=\"#\" class=\"btn btn-primary\" onclick=\"showLists(1);\">查询</a>\n" +
                        "                    </div>\n" +
                        "                </div>";
                }
                $('#searchTool').html(content_html);
                $(".form_datetime").datepicker();
                $('#btnIndex').val(parseInt(id)+1);
                showLists();
            }
        });

    switch (pageName) {
        case 'transaction':
            $(".form_datetime").datepicker({language: 'zh-CN'});
            showLists();
            var id = sessionStorage.getItem('curItem');
            if( id == null || id == undefined){
                id = 1;
            }
            $($('#donate').find('label')[id-1]).trigger('click');
            break;
        case 'transaction_add':
            break;
    }
});

function showLists() {
    var data = {};
    var id = parseInt($('#btnIndex').val());
    if(id>2){
        data = {
            searchType: $("#searchType :selected").val(), // 0-account, 1-name, 2-contact, 3-recommend
            searchName: $("#searchName").val(),
            start_time : $('#start_time').val(),
            end_time : $('#end_time').val()
        };
    }else{
        data = {
            searchType: 0, // 0-account, 1-name
            searchName: "",
            start_time : "",
            end_time : ""
        };
    }

    $.ajax({
        type: 'post',
        url: baseURL + 'transaction_manage/transaction_controller/item_listing',
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


function deployConfirm(id, balance) {
    $("#item_id").val(id);
    $("#item_status").val(balance); // status=0-disable, 1-available
    $("#confirm_deploy").show();
}

function deployItem() {
    var id = $("#item_id").val();
    var balance = parseFloat($("#item_status").val());
    var req_money = parseFloat($('#req_money').val());

    if( req_money > balance){
        alert('已超出余额');
        return;
    }else if(req_money < 100) {
        alert('提现金额要100元起');
        return;
    }

    $("#confirm_deploy").hide();

    var itemInfo = {
        'status' : 1,
        'money' : req_money
    };

    $.ajax({
        url: baseURL + "transaction_manage/withdraw_controller/addItem2DB",
        type: "POST",
        data: {'itemInfo': itemInfo},
        success: function (result) {
            console.log(result);
            if (result != 0){
                showLists();
                $('#confirm_delete').show();
            }
        }

    });

}

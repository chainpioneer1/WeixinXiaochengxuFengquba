/*
fileName:
description: process Tourist Area
*/

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
var selectedProducts = [];
$(document).ready(function () {
    var pageName = $("#page_Name").val();

    switch (pageName) {
        case 'shipman_statistics':
            $('#start_month').on('change', function () {
                var month = $("#start_month :selected").val()
                monthSelected(month, 'start_day');
            });
            $('#end_month').on('change', function () {
                var month = $("#end_month :selected").val()
                monthSelected(month, 'end_day');
            });
            $('input:radio[name="toggleButton"]').change(
                function(){
                    if (this.checked && this.value == 'on') {
                        var id = this.id;
                        $('#btnIndex').val(parseInt(id));
                        shipman_list();
                    }
                });

            shipman_list();
            break;
        case 'productsale':
            productsale_list();
            break;
        case 'shop_statistics':
            $('#start_month').on('change', function () {
                var month = $("#start_month :selected").val()
                monthSelected(month, 'start_day');
            });
            $('#end_month').on('change', function () {
                var month = $("#end_month :selected").val()
                monthSelected(month, 'end_day');
            });

            shop_statistics();
            break;
        case 'provider_statistics':
            var year = new Date().getFullYear();
            var content_html = '<option value="0" >选择年份</option>';
            content_html += '<option value="' + year + '" >' + year + '</option>';
            $('#start_month').html(content_html);
            $('#end_month').html(content_html);
            provider_statistics();
            break;
        case 'brand_statistics':
            loadBrandData();
            brand_statistics();
            break;
        case 'type_statistics':
            loadTypeData();
            type_statistics();
            break;
        case 'sale_performance':
            var year = new Date().getFullYear();
            var content_html = '<option value="0" >选择年份</option>';
            content_html += '<option value="' + year + '" >' + year + '</option>';
            $('#start_month').html(content_html);
            $('#end_month').html(content_html);
            sale_performance();
            break;
        case 'recommend_provider':
            $('#start_month').on('change', function () {
                var month = $("#start_month :selected").val()
                monthSelected(month, 'start_day');
            });
            $('#end_month').on('change', function () {
                var month = $("#end_month :selected").val()
                monthSelected(month, 'end_day');
            });

            recommend_provider();
            break;
        case 'recommend_shop':
            $('#start_month').on('change', function () {
                var month = $("#start_month :selected").val()
                monthSelected(month, 'start_day');
            });
            $('#end_month').on('change', function () {
                var month = $("#end_month :selected").val()
                monthSelected(month, 'end_day');
            });

            recommend_shop();
            break;
    }
});

function getDaysOfMonth(month) {
    var year = new Date().getFullYear();
    return new Date(year, month, 0).getDate();
}

function monthSelected(month, id){
    var days = getDaysOfMonth(month);
    if(month == 0) days = 0;

    var content_html = '<option value="0">选择日</option>'
    for( var i = 1; i <= days; i++){
        content_html += '<option value="' + i + '">'+ i +'</option>';
    }
    $('#' + id).html(content_html);
}

function shipman_list() {
    var start_month = $("#start_month :selected").val();
    var start_day = $("#start_day :selected").val();
    var end_month = $("#end_month :selected").val();
    var end_day = $("#end_day :selected").val();

    if( start_month != '0' && start_day == '0') start_day = 1;
    if( end_month != '0' && end_day == '0') end_day = getDaysOfMonth(end_month);

    var id = parseInt($('#btnIndex').val());
    var data = {
        searchType: 0,
        searchName: $("#searchName").val(),
        start_month: start_month,
        start_day: start_day,
        end_month: end_month,
        end_day: end_day
    };

    $.ajax({
        type: 'post',
        url: baseURL + 'statistics_controller/item_listing',
        dataType: 'json',
        data: {id: 1, pay_type:id, searchData: data},
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

function productsale_list() {
    var data = {
        searchType: $("#searchType").val(),
        searchName: $("#searchName").val(),
    };

    $.ajax({
        type: 'post',
        url: baseURL + 'statistics_controller/item_listing',
        dataType: 'json',
        data: {id: 2, searchData: data},
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

function shop_statistics() {
    var start_month = $("#start_month :selected").val();
    var start_day = $("#start_day :selected").val();
    var end_month = $("#end_month :selected").val();
    var end_day = $("#end_day :selected").val();

    if( start_month != '0' && start_day == '0') start_day = 1;
    if( end_month != '0' && end_day == '0') end_day = getDaysOfMonth(end_month);

    var pay_type = 0;
    if($('#pay_type') != undefined){
        pay_type = $('#pay_type :selected').val();
    }

    var data = {
        pay_type : pay_type,
        searchType: $("#searchType").val(),
        searchName: $("#searchName").val(),
        start_month: start_month,
        start_day: start_day,
        end_month: end_month,
        end_day: end_day
    };

    $.ajax({
        type: 'post',
        url: baseURL + 'statistics_controller/item_listing',
        dataType: 'json',
        data: {id: 3, searchData: data},
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

function provider_statistics() {
    var start_year = $("#start_month :selected").val();
    var start_month = $("#start_day :selected").val();
    var end_year = $("#end_month :selected").val();
    var end_month = $("#end_day :selected").val();

    if( start_year != '0' && start_month == '0') start_month = 1;
    if( end_year != '0' && end_month == '0') end_month = 12;

    var data = {
        searchType: $("#searchType").val(),
        searchName: $("#searchName").val(),
        start_month: start_month,
        start_year: start_year,
        end_month: end_month,
        end_year: end_year
    };

    $.ajax({
        type: 'post',
        url: baseURL + 'statistics_controller/item_listing',
        dataType: 'json',
        data: {id: 4, searchData: data},
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

function brand_statistics() {
    var data = {
        searchType: $("#searchType").val()
    };

    $.ajax({
        type: 'post',
        url: baseURL + 'statistics_controller/item_listing',
        dataType: 'json',
        data: {id: 5, searchData: data},
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

function type_statistics() {
    var data = {
        searchType: $("#searchType").val()
    };

    $.ajax({
        type: 'post',
        url: baseURL + 'statistics_controller/item_listing',
        dataType: 'json',
        data: {id: 6, searchData: data},
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

function sale_performance() {
    var start_year = $("#start_month :selected").val();
    var start_month = $("#start_day :selected").val();
    var end_year = $("#end_month :selected").val();
    var end_month = $("#end_day :selected").val();

    if( start_year != '0' && start_month == '0') start_month = 1;
    if( end_year != '0' && end_month == '0') end_month = 12;

    var data = {
        start_month: start_month,
        start_year: start_year,
        end_month: end_month,
        end_year: end_year
    };

    $.ajax({
        type: 'post',
        url: baseURL + 'statistics_controller/item_listing',
        dataType: 'json',
        data: {id: 7, searchData: data},
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

function recommend_provider() {
    var start_month = $("#start_month :selected").val();
    var start_day = $("#start_day :selected").val();
    var end_month = $("#end_month :selected").val();
    var end_day = $("#end_day :selected").val();

    if( start_month != '0' && start_day == '0') start_day = 1;
    if( end_month != '0' && end_day == '0') end_day = getDaysOfMonth(end_month);

    var data = {
        searchName: $("#searchName").val(),
        start_month: start_month,
        start_day: start_day,
        end_month: end_month,
        end_day: end_day
    };

    $.ajax({
        type: 'post',
        url: baseURL + 'statistics_controller/item_listing',
        dataType: 'json',
        data: {id: 8, searchData: data},
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

function recommend_shop() {
    var start_month = $("#start_month :selected").val();
    var start_day = $("#start_day :selected").val();
    var end_month = $("#end_month :selected").val();
    var end_day = $("#end_day :selected").val();

    if( start_month != '0' && start_day == '0') start_day = 1;
    if( end_month != '0' && end_day == '0') end_day = getDaysOfMonth(end_month);

    var data = {
        searchName: $("#searchName").val(),
        start_month: start_month,
        start_day: start_day,
        end_month: end_month,
        end_day: end_day
    };

    $.ajax({
        type: 'post',
        url: baseURL + 'statistics_controller/item_listing',
        dataType: 'json',
        data: {id: 9, searchData: data},
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

function loadBrandData(){
    $.ajax({
       type: 'post',
       url : baseURL + 'statistics_controller/allBrandInfo',
       dataType: 'json',
       success: function (data) {
           var content_html = '<option value="0">品牌</option>';
           if( data != null){
                for( var i = 0; i < data.length; i++){
                    content_html += '<option value="'+ data[i]['id'] +'">' + data[i]['name'] + '</option>';
                }
           }

           $('#searchType').html(content_html);
       }
    });
}

function loadTypeData(){
    $.ajax({
       type: 'post',
       url : baseURL + 'statistics_controller/allTypeInfo',
       dataType: 'json',
       success: function (data) {
           var content_html = '<option value="0">分类</option>';
           if( data != null){
                for( var i = 0; i < data.length; i++){
                    content_html += '<option value="'+ data[i]['id'] +'">' + data[i]['type'] + '</option>';
                }
           }

           $('#searchType').html(content_html);
       }
    });
}

function exportTable2xls(){
    $(".table").table2excel({
        exclude: ".noExl",
        name: "Excel Document Name",
        filename: $('#pageTitle').val(),
        fileext: ".xls",
        exclude_img: true,
        exclude_links: true,
        exclude_inputs: true
    });
}
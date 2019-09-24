/*
 fileName: shop.js
 description: process Shop
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {

});

// Search course on Course List Page
function searchBuyOrder(url) {
    var searchType = $("#searchType :selected").val();
    var name = $('#searchName').val();
    var stDate = $('#startDate').val();
    var enDate = $('#endDate').val();
    name = name == '' ? 'ALL' : name;
    stDate = stDate == '' ? '0' : stDate;
    enDate = enDate == '' ? '0' : enDate;

//    location.href = url + 'settlebuyListing/' + searchType + '/' +
//        name + '/' + stDate + '/' + enDate;

    $.ajax({
        type: 'post',
        url: url + 'settlemanage/buy_listing',
        dataType: 'json',
        data: {searchType: searchType, name: name, stDate: stDate, enDate: enDate},
        success: function (res) {
            if (res.status == 'success') {

                $('#content_tbl_1').html(res.data);

            } else {
                alert('search failed!');
                console.log(res.data);
            }
        }
    });

}

// Search course on Course List Page
function searchAuthOrder(url) {
    var searchType = $("#searchTypeAuth :selected").val();
    var name = $('#searchNameAuth').val();
    var stDate = $('#startDateAuth').val();
    var enDate = $('#endDateAuth').val();
    name = name == '' ? 'ALL' : name;
    stDate = stDate == '' ? '0' : stDate;
    enDate = enDate == '' ? '0' : enDate;

//    location.href = url + 'settleAuthListing/' + searchType + '/' +
//        name + '/' + stDate + '/' + enDate;

    $.ajax({
        type: 'post',
        url: url + 'settlemanage/auth_listing',
        dataType: 'json',
        data: {searchType: searchType, name: name, stDate: stDate, enDate: enDate},
        success: function (res) {
            if (res.status == 'success') {

                $('#content_tbl_2').html(res.data);

            } else {
                alert('search failed!');
                console.log(res.data);
            }
        }
    });
}

// Search course on Course List Page
function settleBuyDetail(url, id) {
    var searchType = $("#searchType :selected").val();
    var name = $('#searchName').val();
    var stDate = $('#startDate').val();
    var enDate = $('#endDate').val();
    name = name == '' ? 'ALL' : name;
    stDate = stDate == '' ? '0' : stDate;
    enDate = enDate == '' ? '0' : enDate;

    location.href = url + 'settleBuyDetail/' + searchType + '/' +
        name + '/' + stDate + '/' + enDate + '/' + id;
}

// Search course on Course List Page
function settleAuthDetail(url, id) {
    var searchType = $("#searchTypeAuth :selected").val();
    var name = $('#searchNameAuth').val();
    var stDate = $('#startDateAuth').val();
    var enDate = $('#endDateAuth').val();
    name = name == '' ? 'ALL' : name;
    stDate = stDate == '' ? '0' : stDate;
    enDate = enDate == '' ? '0' : enDate;

    console.log(stDate + ',' + enDate);

    location.href = url + 'settleAuthDetail/' + searchType + '/' +
        name + '/' + stDate + '/' + enDate + '/' + id;
}

// Search course on Course List Page
function performBuySettle(url) {
    var mon_name = $('#current-month-name').val();
    var id = $('#current-shop-id').val();
    location.href = url + 'performBuySettle/' + mon_name + '/' + id;
}

// Search course on Course List Page
function performAuthSettle(url) {
    var mon_name = $('#current-month-name').val();
    var id = $('#current-shop-id').val();
    var money = $('#auth-count').val();
    location.href = url + 'performAuthSettle/' + mon_name + '/' + id + '/' + money;
}

//return previos page
function showMoney() {
    $('#custom-generate-auth-view').hide();
    $('#custom-generate-auth-count-view').show();
}

//return previos page
function showConfirmBuy(mon_name, id) {
    $('#current-month-name').val(mon_name);
    $('#current-shop-id').val(id);
    $('#custom-confirm-deploy-view').show();
}

//return previos page
function showConfirmAuth(mon_name, id) {
    $('#current-month-name').val(mon_name);
    $('#current-shop-id').val(id);
    $('#custom-generate-auth-view').show();
}

//return previos page
function cancel(url, page) {
    if (url == '')
        window.history.back();
    else
        location.href = url + (page == 1 ? 'settlemanage/' : 'settleAuthListing/0/ALL/0/0');
}
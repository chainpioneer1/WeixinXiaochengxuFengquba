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
    var status = $('#searchStatus :selected').val();
    name = name == '' ? 'ALL' : name;
    stDate = stDate == '' ? '0' : stDate;
    enDate = enDate == '' ? '0' : enDate;

//    location.href = url + 'buyListing/' + searchType + '/' +
//        name + '/' + stDate + '/' + enDate + '/' + status;

    $.ajax({
        type: 'post',
        url: url + 'ordermanage/buy_listing',
        dataType: 'json',
        data: {searchType: searchType, name:name, stDate:stDate, enDate:enDate, status: status},
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
    var status = $('#searchStatusAuth :selected').val();
    name = name == '' ? 'ALL' : name;
    stDate = stDate == '' ? '0' : stDate;
    enDate = enDate == '' ? '0' : enDate;

    console.log(stDate + ',' + enDate);

//    location.href = url + 'orderListing/' + searchType + '/' +
//        name + '/' + stDate + '/' + enDate + '/' + status;

    $.ajax({
        type: 'post',
        url: url + 'ordermanage/auth_listing',
        dataType: 'json',
        data: {searchType: searchType, name:name, stDate:stDate, enDate:enDate, status: status},
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
function authDetail(url) {
    var name = $('#searchName').val();
    var status = $('#searchStatus :selected').val();
    name = name == '' ? 'all' : name;

    location.href = url + 'authDetail/' + name + '/' + status;
}

// Search course on Course List Page
function authOrderItem(url, id) {
    location.href = url + 'authOrderDetail/' + id;
}

// Search course on Course List Page
function addMoney(url) {
    var money = $('#auth-count').val();
    var id = $('#savingId').html();
    location.href = url + 'authAdd/' + money + '/' + id;
}

//return previos page
function showMoney() {
    $('#custom-generate-auth-view').hide();
    $('#custom-generate-auth-count-view').show();
}

//return previos page
function showSelect(id) {
    $('#custom-generate-auth-view').show();
    $('#savingId').html(id);
}

//return previos page
function cancel(url) {
    if (url == '')
        window.history.back();
    else
        location.href = url + 'authmanage';
}

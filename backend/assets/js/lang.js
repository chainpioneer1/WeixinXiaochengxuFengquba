/*
 fileName: area.js
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {
    searchLanguage(baseURL);
//upload image for Thumb
    $('#upload-thumb-file').on('change', uploadThumbImage);
    $("#page_loaded_status").val("1");
});

function deleteItemConfirm(id) {
    $('#custom-confirm-delete-view').show();
    $('#current-areaid').val(id);
}

function deleteItem(url, type) {
    $('#custom-confirm-delete-view').hide();
    if (type == 1) {//if ok button clicked

        $.ajax({
            type: 'post',
            url: url + 'langmanage/editItem',
            dataType: 'json',
            data: {'id': $('#current-areaid').val()},
            success: function (res) {
                console.log(res);
                if (res.status == 'success') {
                    $('#content_tbl').html(res.data);
                    $('#lang-select').html(res.all_data);

                } else {
                    alert('Delete failed!');
                    console.log(res.data);
                }
            }
        });
    }
}

function editItem(id) {

    $('#custom-confirm-deploy-view').show();
    if (id == 0 || $('#lang_flag_' + id).val() == "") {
        $('#area-thumb-img').attr('src', 'assets/images/default.png');
    } else {
        $('#area-thumb-img').attr('src', baseURL + "/" + $('#lang_flag_' + id).val());
    }
    $('#lang-select').val(id);
    $('#current-areaid').val(id);
    if (id != 0) {
        $('#lang-select').attr('disabled', 'true');
        $('.added_lang_1').show();
    } else {
        $('#lang-select').removeAttrs('disabled');
        $('.added_lang_1').hide();
    }
}

function updateItem(url, type) {

    $('#custom-confirm-deploy-view').hide();
    if (type == 1) { // if ok button clicked

        $.ajax({
            type: 'post',
            url: url + 'langmanage/editItem',
            dataType: 'json',
            data: {
                'id': $('#lang-select').val(),
                'status': 1,
                'flag': $('#upload-thumb-msg').html()
            },
            success: function (res) {
                console.log(res);
                if (res.status == 'success') {
                    console.log(res);
                    $('#content_tbl').html(res.data);
                    $('#lang-select').html(res.all_data);

                } else {
                    alert('Delete failed!');
                    console.log(res.data);
                }
            }
        });

    }
}

function searchLanguage(url) {

    var name = $('#searchName').val();
    var status = $('#searchStatus :selected').val();
    name = name == '' ? 'all' : name;
    var provinceText = $('#provinceName').html();
    var cityText = $('#cityName').html();
    var districtText = $('#districtName').html();
    var continent = $('#searchContinent :selected').html();
    var country = $('#searchCountry :selected').html();
    if (continent == '选择洲') continent = '';
    if (country == '选择国家') country = '';
    //console.log(continent + ',' + country);
    if (continent == undefined) continent = '';
    if (country == undefined) country = '';
//    location.href = url + 'area/listing/' + name + '/' + JSON.stringify(address) + '/' + status;

    $.ajax({
        type: 'post',
        url: url + 'langmanage/custom_listing',
        dataType: 'json',
        data: {country: ""},
        success: function (res) {
            if (res.status == 'success') {
                console.log(res);
                $('#content_tbl').html(res.data);
                $('#lang-select').html(res.all_data);

            } else {
                alert('search failed!');
                console.log(res.data);
            }
        }
    });
}


function uploadThumbImage(event) {
    event.stopPropagation(); // Stop stuff happening
    event.preventDefault(); // Totally stop stuff happening
    files = event.target.files;
    if (this.files[0].type != "image/jpeg" && this.files[0].type != "image/png") {
        window.alert("图片格式不正确.");
        return;
    }
    if (this.files[0].size > 1000000) {
        window.alert("图片要不超过1M.");
        return;
    }
    var data = new FormData();
    $.each(files, function (key, value) {
        data.append(key, value);
    });
    console.log(data);

    $("#upload-thumb-msg").html('图片上传中...');
    $("#upload-thumb-msg").show();

    $.ajax({
        url: baseURL + 'api/Areas/upload',
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        success: function (data, textStatus, jqXHR) {
            if (typeof data.error === 'undefined') {
                if (data['status'] == true) {
                    var url = baseURL + 'uploads/' + data['file'];
                    $("#area-thumb-img").attr("src", url);
                    $("#upload-thumb-msg").html(data['file']);
                    $("#upload-thumb-msg").hide();
                }
            }
            else {
                // Handle errors here
                console.log('ERRORS: ' + data.error);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle errors here
            console.log('ERRORS: ' + textStatus);
            // STOP LOADING SPINNER
        }
    });

}

function uploadThumb() {
    if ($("#page_loaded_status").val() == '1') {
        $('#upload-thumb-file').val('');
        $('#upload-thumb-file').click();
    } else {
        alert("页加载中. 请等一下.");
    }
}

function deleteThumb() {
    $('#upload-thumb-msg').html('');
    $("#area-thumb-img").attr("src", baseURL + 'assets/images/default.png');
}
/*
 fileName:
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute

var uploadCrop;
$(document).ready(function () {
    var pageName = $("#page_Name").val();

    uploadCrop = $("#upload-origin").croppie({
        enableExif: true,
        viewport: {
            width: 500,
            height: 300,
            type: 'rectangle'
        },
        boundary: {
            width: 650,
            height: 400
        }
    });
});

$('#upload').on('change', function () {
    var reader = new FileReader();
    var type = this.files[0]['type'];
    if (type != 'image/png' && type != 'image/jpeg') {
        alert("图片格式错误，要求是jpg、jpeg、png格式。");
        return;
    }
    reader.onload = function (e) {
        uploadCrop.croppie('bind', {
            url: e.target.result
        }).then(function () {
            console.log('jQuery bind complete');
            refreshTargetImg();
        });

    };
    reader.readAsDataURL(this.files[0]);
});

$('#upload-origin').on('mouseup', function () {
    refreshTargetImg();
});

function refreshTargetImg() {
    uploadCrop.croppie('result', {
        type: 'canvas',
        size: 'viewport'
    }).then(function (resp) {
        html = '<img id="uploaded-data" src="' + resp + '" style="width:100%; height:100%; "/>';
        $("#upload-destination").html(html);
    });
}
$('#upload-complete').on('click', function () {
    var data = $("#uploaded-data").attr('src');
    if (data == undefined) {
        alert("请选择图片并裁剪.");
        return;
    }
    var ret_URL = $("#ret_Url").val();
    console.log(ret_URL);
    $.ajax({
        url: baseURL + "api/ImgProcessor/uploadImgData",
        type: "POST",
        data: {'imageData': data},
        success: function (result) {
            console.log(result);
            if (result['status'] == true)
                location.href = encodeURI(baseURL + ret_URL + "/" + result['data']);
            else
                window.alert(result['data']);
        }
    });

});
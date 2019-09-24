<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>商家设置</title>
    <link rel="shortcut icon" href="<?php echo base_url(); ?>assets/images/logo.png" type="image/x-icon"/>
    <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
    <!-- Bootstrap 3.3.4 -->
    <link href="<?php echo base_url(); ?>assets/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
    <!-- FontAwesome 4.3.0 -->
    <link href="<?php echo base_url(); ?>assets/font-awesome/css/font-awesome.min.css" rel="stylesheet"
          type="text/css"/>
    <link rel="stylesheet" href="<?php echo base_url(); ?>assets/plugins/datetimepicker/bootstrap-datetimepicker.css">
    <link href="<?php echo base_url(); ?>assets/dist/css/AdminLTE.min.css" rel="stylesheet">
    <link href="<?php echo base_url(); ?>assets/plugins/datepicker/bootstrap-datepicker3.min.css" rel="stylesheet">
    <link href="<?php echo base_url(); ?>assets/plugins/datepickk/datepickk.css" rel="stylesheet">
    <!-- AdminLTE Skins. Choose a skin from the css/skins
         folder instead of downloading all of them to reduce the load. -->
    <link href="<?php echo base_url(); ?>assets/dist/css/skins/_all-skins.css" rel="stylesheet">
    <link href="<?php echo base_url(); ?>assets/dist/css/custom.css" rel="stylesheet">

    <style>
        .error {
            color: red;
            font-weight: normal;
        }

        .header-item {
            width: auto;
            padding: 5px 10px;
            border: 1px solid #888;
            border-radius: 5px;
            display: inline-block;
            margin: 10px 20px;
            cursor: pointer;
        }
    </style>
    <!-- jQuery 2.1.4 -->
    <script src="<?php echo base_url(); ?>assets/js/jQuery-2.1.4.min.js"></script>
    <script src="<?php echo base_url(); ?>assets/bootstrap/js/bootstrap.min.js"></script>
</head>
<style type="text/css">

    input, select {
        padding: 0 5px !important;
    }

    label {
        width: auto !important;
        margin: 0 10px;

    }
</style>
<?php
$type = '商家';
?>
<body id="main_page_body" class="skin-blue sidebar-mini">
<div class="content-wrapper" style="min-height: 100%;margin-left:0;">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            <center><?= $title; ?></center>
        </h1>
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container" style="width: 100%;text-align: center;">
            <a class="header-item" href="<?= base_url() . 'bossmanage' ?>">商家信息</a>
            <a class="header-item" href="<?= base_url() . 'bossmanage/room' ?>">订场设置</a>
            <a class="header-item" href="<?= base_url() . 'bossmanage/coupon' ?>" style="background: white;">团购设置</a>
            <a class="header-item" href="<?= base_url() . 'logout' ?>">退出</a>
        </div>
        <div class="container">
            <div>
                <form id="groupInfoUpdateForm" action=""
                      method="post" accept-charset="utf-8" enctype="multipart/form-data">

                    <input type="hidden" name="id" value="<?= $site[0]->no ?>"/>
                    <input type="hidden" name="boss_id" value="<?= $site[0]->boss_id ?>"/>
                    <input type="hidden" name="uploadBossgroupInfo" value=""/>

                    <label> 团购设置 : </label>
                    <div class="row form-inline" data-type="coupon-container" style="text-align: center;">
                    </div>
                    <div class="row form-inline"><a href="javascript:;" onclick="makeCouponItem();"><i
                                    class="fa fa-plus"></i>添加团购</a></div>
                    <div class="row form-inline">
                        <div class="row" style="padding-left: 200px;">
                            <div class="col-xs-12 col-sm-12 form-inline">
                                <input type="submit" class="btn btn-primary form-control" value="保存">
                                <a class="btn btn-default form-control"
                                   href="javascript:location.reload();"><span>取消</span></a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <script>
            function submit_form() {
                $('form').submit();
            }
        </script>
        <form id="uploadImageForm" style="display:none;" action="" role="form"
              method="post" enctype="multipart/form-data" accept-charset="utf-8">
            <input type="file" name="uploadImg">
        </form>

    </section>
</div>
<script src="<?php echo base_url(); ?>assets/dist/jquery.js" type="text/javascript"></script>
<footer class="main-footer" style="border: none; background-color: #ecf0f5">
    <div class="pull-right hidden-xs" style="opacity: 0;">
        Cloud Shop System | Version 1.0
    </div>
</footer>

<script src="<?php echo base_url(); ?>assets/plugins/datepicker/bootstrap-datepicker.min.js"></script>
<script src="<?php echo base_url(); ?>assets/plugins/datetimepicker/bootstrap-datetimepicker.js"></script>
<script src="<?php echo base_url(); ?>assets/plugins/datetimepicker/bootstrap-datetimepicker.zh-CN.js"></script>

<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->

<div class="scripts" style="display: none;" hidden>
    <input class="bossgroupInfo" value='<?= json_encode($bossgroup) ?>'>
    <script>
        var bossgroupInfo = JSON.parse($('.bossgroupInfo').val());
        var isFirst = true;
        $(function () {
            // var pics = $('input[name="item_pics"]').val();
            // if (pics != '') {
            //     pics = pics.split(',');
            //     for (var i = 0; i < pics.length; i++) {
            //         $('.img_preview[itemid="' + (i + 1) + '"]').attr('src', baseURL + pics[i]);
            //     }
            // }
            refreshPage();
        });

        function refreshPage() {
            $('div[data-type="coupon-container"]').html('');

            for (var i = 0; i < bossgroupInfo.length; i++) {
                if (isFirst) bossgroupInfo[i].isUpdate = false;
                makeCouponItem(bossgroupInfo[i]);
            }
            isFirst = false;
            $('input[name="uploadBossgroupInfo"]').val(JSON.stringify(bossgroupInfo));
            $('input').off('input');
            $('input[type="text"]').off('change');
            $('input[type="radio"]').off('change');
            $('input').on('input change', function () {
                var that = $(this);
                if (that.attr('type') == 'file') return;
                var id = that.attr('data-id') * 1;
                var key = that.attr('data-type');
                bossgroupInfo[id][key] = that.val();
                console.log(that.val());
            })

            $(".datepicker-inline").datepicker({
                format: 'yyyy-mm-dd'
            });
        }

        function makeCouponItem(item) {
            var id = $('div[data-type="coupon-item"]').length;
            if (item == undefined) {
                var curDate = new Date();
                curDate = curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + curDate.getDate();
                item = {
                    no: -1,
                    group_name: '团购' + (id + 1),
                    group_package: '',
                    group_price: '',
                    group_inprice: '',
                    group_desc: '[{"text":"","textLen":"","img":""}]',
                    start: curDate,
                    end: curDate,
                    limit: "",
                    condition: 0,
                    isUpdate: true
                }
                bossgroupInfo.push(item);
                refreshPage();
                return;
            }
            var updateSt = ''
            if (!item.isUpdate) updateSt = ' disabled ';
            var content_html = '';
            content_html += '<div class="row form-inline col-lg-8 col-md-10 col-sm-12 col-xs-12" data-type="coupon-item" data-id="' + id + '" ' +
                ' style="border:1px solid #e0e0e0;border-radius:5px;background:white;float:none;display:inline-block;text-align:left;"> ';

            content_html += ' <div class="row form-inline"> ' +
                ' <div class="col-md-12"> ' +
                ' <input readonly data-type="group_name" ' + ' data-id="' + id + '" ' +
                ' style="border:none;outline:none;background:transparent;width:50px;font-weight:bold;" ' +
                ' value="' + item.group_name + '"/> : ' +
                ' <a class="btn btn-danger" style="float: right;" href="javascript:;" onclick="removeCouponItem(this)" data-id="' + id + '">' +
                '<i class="fa fa-minus-circle"></i></a> ' +
                ' </div> ' +
                ' </div> ';
            content_html += ' <div class="row form-inline"> ' +
                ' <label> 套餐名称 ：</label> ' +
                ' <div class="input-group margin"> ' +
                ' <input ' + updateSt + 'data-type="group_package" type="text" class="form-control" placeholder="请输入" ' + ' data-id="' + id + '" ' +
                ' style="margin: 0 ; padding: 0px 10px;width:600px;min-width:600px;max-width:600px;" value="' + item.group_package + '"/> ' +
                ' </div> ' +
                ' </div> ';
            content_html += ' <div class="row form-inline"> ' +
                ' <label> 团购价格 : </label> ' +
                ' <div class="input-group margin"> ' +
                ' <input ' + updateSt + 'data-type="group_price" type="number" class="form-control" placeholder="请输入" ' + ' data-id="' + id + '" ' +
                ' value="' + item.group_price + '" maxlength="30" ' +
                ' style="width: 25%; display: inline-block;float:none;"/> 元 ' +
                ' <label> 门市价格 : </label> ' +
                ' <input ' + updateSt + 'data-type="group_inprice" type="number" class="form-control" placeholder="请输入" ' + ' data-id="' + id + '" ' +
                ' value="' + item.group_inprice + '" maxlength="30" ' +
                ' style="width: 25%; display: inline-block;float:none;"/> 元 ' +
                ' </div> ' +
                ' </div> '
            content_html += ' <div class="row form-inline"> ' +
                ' <label> 有效期 : </label> ' +
                ' <div class="input-group margin"> ' +
                ' <input ' + updateSt + 'data-type="start" class="datepicker-inline form-control" size="16" ' + ' data-id="' + id + '" ' +
                ' placeholder="请选择" style="display: inline-block; width: 45%; float: none;" ' +
                ' type="text" value="' + item.start + '" ' +
                ' readonly="">  到 ' +
                ' <input ' + updateSt + 'data-type="end" class="datepicker-inline form-control" size="16" ' + ' data-id="' + id + '" ' +
                ' placeholder="请选择" style="display: inline-block; width: 45%; float: none;" ' +
                ' type="text" value="' + item.end + '" ' +
                ' readonly=""> ' +
                ' </div> ' +
                ' </div> ';
            content_html += ' <div class="row form-inline"> ' +
                ' <label> 数量限制 : 每个用户最多可购买 </label> ' +
                ' <div class="input-group margin"> ' +
                ' <input ' + updateSt + 'data-type="limit" type="number" class="form-control" placeholder="请输入" ' + ' data-id="' + id + '" ' +
                ' value="' + item.limit + '" maxlength="30" ' +
                ' style="margin: 0 ; padding: 0px 20px;"/> ' +
                ' </div> ' +
                ' </div> ';
            content_html += ' <div class="row form-inline"> ' +
                ' <label> 购买须知 ：</label> ' +
                ' <div class="desc-row-item" style="border:1px solid #ddd;"> '
            if (typeof item.group_desc == 'string')
                item.group_desc = JSON.parse(item.group_desc);
            for (var i = 0; i <= item.group_desc.length; i++) {
                var desc = {text: "", textLen: 0, img: ""};
                if (i < item.group_desc.length) desc = item.group_desc[i];
                content_html += ' <div class="input-group margin" data-id="' + id + '" data-subid="' + i + '"> ';
                if (desc.text != '' || item.isUpdate) {
                    content_html += ' <textarea ' + updateSt + 'name="group_package' + id + '' + i + '" type="text" class="form-control" placeholder="请输入" ' +
                        ' style="margin: 0 ; padding: 0px 10px;width:400px;min-width:400px;max-width:400px;min-height: 50px;max-height:120px;" ' +
                        ' '+((item.isUpdate)?'oninput="updateText(this);"':'')+'>' + desc.text + '</textarea> ';
                }
                if (desc.img != '') {
                    content_html += ' <a style="display: block;position:relative;" data-type="modifyImg">' +
                        '<img src="' + baseURL + 'uploads/' + desc.img + '" style="display: inline-block; vertical-align: top;" '+((item.isUpdate)?'onclick="updateImage(this,\'update\');"':'')+'/> '
                    if (item.isUpdate)
                        content_html += '<span style="right:0;top:0; display: inline-block; vertical-align: top" onclick="removeDescriptionImg(this);"><i class="fa fa-close"></i></span>'
                    content_html += '</a> ';
                } else if (item.isUpdate) {
                    content_html += ' <a style="display:block ;" class="btn btn-default" data-type="addDescImgBtn" ' +
                        ' data-id="' + id + '" data-subid="' + i + '" data-type="addImg" onclick="updateImage(this,\'add\');">' +
                        ' <i class="fa fa-plus"></i>添加图片 </a> ';
                }

                content_html += ' </div> ';
                if (desc.img == '' && desc.text == '') break;
            }
            content_html += ' </div> ' +
                ' </div> ';
            content_html += ' <div class="row form-inline"> ' +
                ' <label> 退订条件 : </label> ' +
                ' <div class="input-group margin" style="display: inline-block;"> ' +
                ' <input ' + updateSt + 'type="radio" name="condition' + id + '" data-type="condition" value="0" ' + ' data-id="' + id + '" ' +
                (item.condition == 0 ? 'checked' : '') + '>不可退 ' +
                ' </div> ' +
                ' <div class="input-group margin" style="display: inline-block;"> ' +
                ' <input ' + updateSt + 'type="radio" name="condition' + id + '" data-type="condition" value="1" ' + ' data-id="' + id + '" ' +
                (item.condition == 1 ? 'checked' : '') + '>可随时退、过期退 ' +
                ' </div> ' +
                ' </div> ';
            content_html += ' </div>';

            $('div[data-type="coupon-container"]').append(content_html);
            return content_html;
        }

        function removeCouponItem(elem) {
            var that = $(elem);
            var id = that.attr('data-id') * 1;
            bossgroupInfo.splice(id, 1);
            refreshPage();
            // $('div[data-type="coupon-item"][data-id="' + id + '"]').remove();

            // console.log(that, id);
        }

        function removeDescriptionItem(elem) {
            var that = $(elem);
            var id = that.parent().parent().attr('data-id');
            var subid = that.parent().parent().attr('data-subid');
            $('.desc-row-item div[data-id="' + id + '"][data-subid="' + subid + '"]').remove();
        }

        function removeDescriptionImg(elem) {
            var that = $(elem);
            var id = that.parent().parent().attr('data-id') * 1;
            var subid = that.parent().parent().attr('data-subid') * 1;

            var groupElem = bossgroupInfo[id];
            var groupDescElem = groupElem.group_desc[subid];
            groupDescElem.img = "";
            // groupElem.group_desc = JSON.stringify(groupElem.group_desc);
            refreshPage();
        }

        function updateImage(elem, type) {
            var that = $(elem);
            var parentElem = that.parent();
            if (type == 'update') parentElem = parentElem.parent();
            var id = parentElem.attr('data-id');
            if(!bossgroupInfo[id*1].isUpdate) return;
            $('#uploadImageForm').attr('data-id', id);

            $('#uploadImageForm').attr('data-subid', parentElem.attr('data-subid'));
            $('#uploadImageForm').attr('data-type', parentElem.attr('data-type'));
            $('input[name="uploadImg"]').val('');
            $('input[name="uploadImg"]')[0].click();
        }

        function updateText(elem, type) {
            var that = $(elem);
            var parentElem = that.parent();
            if (type == 'update') parentElem = parentElem.parent();
            var id = parentElem.attr('data-id') * 1;
            var subid = parentElem.attr('data-subid') * 1;

            var groupElem = bossgroupInfo[id];
            var groupDescElem = groupElem.group_desc[subid];

            if (!groupDescElem) {
                groupElem.group_desc.push({
                    text: "", textLen: "", img: ""
                });
                groupDescElem = groupElem.group_desc[subid];
            }

            groupDescElem.text = that.val();
        }

        $('input[name="uploadImg"]').on('change', function (e) {
            var that = $('#uploadImageForm');
            that.attr('data-name', this.files[0].name);
            var fdata = new FormData(document.getElementById('uploadImageForm'));
            fdata.append('filename', that.attr('data-name'));
            $.ajax({
                url: baseURL + "bossmanage/uploadFile",
                type: "POST",
                data: fdata,
                contentType: false,
                cache: false,
                processData: false,
                async: true,
                xhr: function () {
                    //upload Progress
                    var xhr = $.ajaxSettings.xhr();
                    if (xhr.upload) {
                        xhr.upload.addEventListener('progress', function (event) {
                            var percent = 0;
                            var position = event.loaded || event.position;
                            var total = event.total;
                            if (event.lengthComputable) {
                                percent = Math.ceil(position / total * 100);
                            }
                        }, true);
                    }
                    return xhr;
                },
                mimeType: "multipart/form-data"
            }).done(function (res) { //
                var ret;
                try {
                    ret = JSON.parse(res);
                } catch (e) {
                    alert('操作失败 : ' + JSON.stringify(e));
                    console.log(e);
                    return;
                }
                if (ret.status == 'success') {
                    var id = that.attr('data-id') * 1;
                    var subid = that.attr('data-subid') * 1;
                    console.log('-- id : ', id, subid);

                    var groupElem = bossgroupInfo[id];
                    var groupDescElem = groupElem.group_desc[subid];

                    if (!groupDescElem) {
                        groupElem.group_desc.push({
                            text: "", textLen: "", img: ""
                        });
                        groupDescElem = groupElem.group_desc[subid];
                    }
                    groupDescElem.img = ret.data;

                    refreshPage();


                } else//failed
                {
                    alert('操作失败 : ' + ret.data);
                    // jQuery('#ncw_edit_modal').modal('toggle');
                    // alert(ret.data);
                }
            });
        });


        $('#groupInfoUpdateForm').submit(function (e) {
            e.preventDefault();
            var that = $(this);
            $('input[name="uploadBossgroupInfo"]').val(JSON.stringify(bossgroupInfo));
            var fdata = new FormData(document.getElementById('groupInfoUpdateForm'));
            $.ajax({
                url: baseURL + "bossmanage/updateBossGroupInfo",
                type: "POST",
                data: fdata,
                contentType: false,
                cache: false,
                processData: false,
                async: true,
                xhr: function () {
                    //upload Progress
                    var xhr = $.ajaxSettings.xhr();
                    if (xhr.upload) {
                        xhr.upload.addEventListener('progress', function (event) {
                            var percent = 0;
                            var position = event.loaded || event.position;
                            var total = event.total;
                            if (event.lengthComputable) {
                                percent = Math.ceil(position / total * 100);
                            }
                        }, true);
                    }
                    return xhr;
                },
                mimeType: "multipart/form-data"
            }).done(function (res) { //
                var ret;
                console.log(res);
                try {
                    ret = JSON.parse(res);
                } catch (e) {
                    alert('操作失败 : ' + JSON.stringify(e));
                    console.log(e);
                    return;
                }
                if (ret.status == 'success') {
                    alert('操作成功 : ' + ret.data);
                    location.reload();
                } else//failed
                {
                    alert('操作失败 : ' + ret.data);
                    // jQuery('#ncw_edit_modal').modal('toggle');
                    // alert(ret.data);
                }
            });
        });

        function exportTable() {
            $(".table tbody td").append('<span>&nbsp;</span>');
            $(".table").table2excel({
                exclude: ".noExl",
                name: "Excel Document Name",
                filename: $('#pageTitle').val(),
                fileext: ".xls",
                exclude_img: true,
                exclude_links: true,
                exclude_inputs: true
            });
            $(".table tbody td span").remove();
        }

        var baseURL = "<?php echo base_url(); ?>";
        var loginID = "<?php echo $name; ?>";

        var windowURL = window.location.href;
        pageURL = windowURL.substring(0, windowURL.lastIndexOf('/'));
        var x = $('a[href="' + pageURL + '"]');
        x.addClass('active');
        x.parent().addClass('active');
        var y = $('a[href="' + windowURL + '"]');
        y.addClass('active');
        y.parent().addClass('active');

        $(document).one('ajaxloadstart.page', function (e) {
            autosize.destroy('textarea[class*=autosize]');

            $('.limiterBox,.autosizejs').remove();
            $('.daterangepicker.dropdown-menu,.colorpicker.dropdown-menu,.bootstrap-datetimepicker-widget.dropdown-menu').remove();
        });

        $(document).ready(function () {
            var main_page_width = document.body.clientWidth
                || document.documentElement.clientWidth
                || window.innerWidth;

            if (false && main_page_width <= 1450)
                $("#main_page_body").addClass("sidebar-collapse");
            else
                $("#main_page_body").removeClass("sidebar-collapse");

            $(window).resize(function () {
                var main_page_width = document.body.clientWidth
                    || document.documentElement.clientWidth
                    || window.innerWidth;

                if (false && main_page_width <= 1450)
                    $("#main_page_body").addClass("sidebar-collapse");
                else
                    $("#main_page_body").removeClass("sidebar-collapse");
            });

        });
        $('.scripts').remove();
    </script>
</div>

</body>
</html>

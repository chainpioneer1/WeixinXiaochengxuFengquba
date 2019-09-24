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
        html, body{
            background: #ecf0f5;
        }
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
</style>
<?php
$type = '商家';
?>
<body id="main_page_body" class="skin-blue sidebar-mini" style="overflow-x:auto;">
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
            <a class="header-item" href="<?= base_url() . 'bossmanage/room' ?>" style="background: white;">订场设置</a>
            <a class="header-item" href="<?= base_url() . 'bossmanage/coupon' ?>">团购设置</a>
            <a class="header-item" href="<?= base_url() . 'logout' ?>">退出</a>
        </div>
        <div class="container" style="text-align: center;">
            <div style="display:inline-block; text-align: left; width: 1000px;">
                <form class="roomInfoUpdateForm" action="<?= base_url() . 'bossmanage/updateBossRoomInfo'; ?>"
                      method="post"
                      accept-charset="utf-8" enctype="multipart/form-data">

                    <input type="hidden" name="id" value="<?= $site[0]->no ?>"/>
                    <input type="hidden" name="boss_id" value="<?= $site[0]->boss_id ?>"/>

                    <div class="row form-inline">
                        <label> 营业时间 : </label>
                        <div class="input-group margin" style="width: 600px;">
                            <?php
                            $j = 0;
                            $weekStr = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
                            $serviceTime = explode(',', $site[0]->service_time);
                            foreach ($weekStr as $item) {
                                $j++;
                                $isExist = false;
                                foreach ($serviceTime as $serviceItem) {
                                    if ($serviceItem == $j) $isExist = true;
                                }
                                ?>
                                <label style="width: 12%; text-align:left;margin-left:0;margin-right:0;padding:0;"
                                       class="margin">
                                    <input type="checkbox" class="service_time_item"
                                           itemid="<?= $j ?>" <?= $isExist ? 'checked' : '' ?>
                                           onclick="setServiceTime(this)" style="margin: 0 5px;"><?= $item; ?>
                                </label>
                            <?php } ?>
                            <input type="text" name="service_time" value="" style="display: none;">
                        </div>
                        <script>
                            function setServiceTime(elem) {
                                var typeItem = $('input.service_time_item');
                                var dest = $('input[name="service_time"]');
                                var site_type_detail = '';
                                var j = 0;
                                for (var i = 0; i < typeItem.length; i++) {
                                    var item = typeItem[i];
                                    if (item.checked) {
                                        j++;
                                        if (site_type_detail != '') site_type_detail += ',';
                                        site_type_detail += item.getAttribute('itemid');
                                    }
                                }
                                dest.val(site_type_detail);
                            }

                            setServiceTime();
                        </script>
                    </div>
                    <div class="row form-inline">
                        <label> 每天营业时间 : </label>
                        <div class="input-group margin" style="width: 600px;">
                            <?php
                            $startTime = $site[0]->start1;
                            $endTime = $site[0]->end1;
                            ?>
                            <select name="startH">
                                <?php for ($i = 0; $i < 24; $i++) {
                                    echo '<option value="' . $i . '">' . $i . '</option>';
                                } ?>
                            </select>点
                            <select name="startM">
                                <?php for ($i = 0; $i < 60; $i++) {
                                    echo '<option value="' . $i . '">' . $i . '</option>';
                                } ?>
                            </select>分&nbsp;&nbsp;&nbsp;到&nbsp;&nbsp;&nbsp;
                            <select name="endH">
                                <?php for ($i = 0; $i < 24; $i++) {
                                    echo '<option value="' . $i . '">' . $i . '</option>';
                                } ?>
                            </select>点
                            <select name="endM">
                                <?php for ($i = 0; $i < 60; $i++) {
                                    echo '<option value="' . $i . '">' . $i . '</option>';
                                } ?>
                            </select>分
                        </div>
                    </div>

                    <div class="row form-inline">
                        <label> 订场单位 : </label>
                        <div class="input-group margin">
                            <select name="service_unit">
                                <option value="0.5">半小时</option>
                                <option value="1">一小时</option>
                                <option value="2">两小时</option>
                                <option value="12">上下午</option>
                                <option value="24">全天</option>
                            </select>
                        </div>
                        <script>
                            $('select[name="startH"]').val(parseInt('<?=substr($startTime, 0, 2);?>'));
                            $('select[name="startM"]').val(parseInt('<?=substr($startTime, 3, 2);?>'));
                            $('select[name="endH"]').val(parseInt('<?=substr($endTime, 0, 2);?>'));
                            $('select[name="endM"]').val(parseInt('<?=substr($endTime, 3, 2);?>'));
                            $('select[name="service_unit"]').val(parseFloat('<?=$site[0]->service_unit?>'));
                        </script>
                    </div>

                    <div class="row form-inline">
                        <label> 订场设置 : </label>
                        <style>
                            .room-item * {
                                margin: 3px 10px;
                            }

                            .room-item > label {
                                width: auto;
                            }

                            .room-item > input.form-control {
                                display: inline-block;
                                float: none;
                                margin: 0;
                                padding: 0px 20px;
                                width: 80px;
                                vertical-align: middle;
                            }
                        </style>
                        <div class="input-group margin roomDataArea">
                            <label style="color: #888;width: 100%;text-align: left;">*如果场地名称6文字以上，那么请使用空白文字为换行。</label>
                            <div>
                                <?php
                                $jj = -1;
                                foreach ($roomData as $item) {
                                    $jj++;
                                    ?>
                                    <div class="room-item">
                                        <label>场地名称:</label>
                                        <input name="name<?= $jj ?>" type="text" class="form-control" placeholder="请输入"
                                               value="<?= $item->room_name; ?>" maxlength="10"/>
                                        <label> 单价:</label>
                                        <input name="cost<?= $jj ?>" type="number" class="form-control"
                                               placeholder="请输入"
                                               value="<?= $item->cost; ?>"/>
                                        <label style="width: auto; line-height: 2.5"> 元 </label>
                                        <a class="removeRoomBtn">删除</a>
                                    </div>
                                <?php } ?>
                                <input name="roomCnt" value="<?= count($roomData); ?>" style="display: none;">
                            </div>
                            <div><a class="addRoomBtn"><i class="fa fa-plus"></i>新增场地 </a></div>
                            <script>
                                function removeBtnRefresh() {
                                    $('.removeRoomBtn').off('click');
                                    $('.removeRoomBtn').on('click', function (e) {
                                        $(this).parent().remove();
                                        var cnt = parseInt($('input[name="roomCnt"]').val());
                                        $('input[name="roomCnt"]').val(cnt - 1);
                                        var roomItems = $('.room-item');
                                        for (var i = 0; i < roomItems.length; i++) {
                                            var item = $(roomItems[i]);
                                            item.find('input')[0].setAttribute('name', 'name' + i);
                                            item.find('input')[1].setAttribute('cost', 'name' + i);
                                        }
                                    });
                                }

                                $('.addRoomBtn').on('click', function (e) {
                                    var content_html = '';
                                    var cnt = parseInt($('input[name="roomCnt"]').val());
                                    content_html += '<div class="room-item">' +
                                        '<label>场地名称:</label> ' +
                                        '<input name="name' + cnt + '" type="text" class="form-control" placeholder="请输入" ' +
                                        'style="margin: 0 ; padding: 0px 20px; width: 80px; vertical-align: middle"/> ' +
                                        '<label> 单价:</label> ' +
                                        '<input name="cost' + cnt + '" type="number" class="form-control" placeholder="请输入" ' +
                                        'style="margin: 0 ; padding: 0px 20px; width: 80px; vertical-align: middle"/> ' +
                                        '<label style="width: auto; line-height: 2.5"> 元 </label> ' +
                                        '<a class="removeRoomBtn">删除</a>' +
                                        '</div>';
                                    $('div.roomDataArea > div:nth-child(2)').append(content_html);
                                    $('input[name="roomCnt"]').val(cnt + 1);
                                    removeBtnRefresh();
                                });
                                removeBtnRefresh();

                            </script>
                        </div>
                    </div>

                    <div class="row form-inline">
                        <div class="row form-inline">
                            <label> 退订设置 : </label>
                            <div class="input-group margin">
                                <select name="cancel_time" value="<?= $site[0]->cancel_time ?>">
                                    <option value="72">开始前72小时可退</option>
                                    <option value="48">开始前48小时可退</option>
                                    <option value="24">开始前24小时可退</option>
                                    <option value="12">开始前12小时可退</option>
                                    <option value="6">开始前6小时可退</option>
                                    <option value="0">开始前都可退</option>
                                    <option value="10000">不可退订</option>
                                </select>
                            </div>
                            <script>
                                $('select[name="cancel_time"]').val(parseInt('<?= $site[0]->cancel_time?>'));
                            </script>
                        </div>
                    </div>
                    <div class="row form-inline">
                        <div class="row" style="padding-left: 200px;">
                            <div class="col-xs-12 col-sm-12 form-inline">
                                <input type="submit" class="btn btn-primary form-control" value="保存"
                                       style="width: 80px;">
                                <a class="btn btn-default form-control" href="javascript:location.reload();"
                                   style="width: 80px;">取消</a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div style="display:inline-block; text-align: left; width: 1000px;">
                <label style="font-size:larger;"> 已售/可售设置 : </label>
                <form class="bookInfoUpdateForm" action=""
                      method="post" accept-charset="utf-8" enctype="multipart/form-data">

                    <input type="hidden" name="id" value="<?= $site[0]->no ?>"/>
                    <input type="hidden" name="boss_id" value="<?= $site[0]->boss_id ?>"/>

                    <div class="row form-inline">
                        <div class="input-group margin" style="width: 600px;text-align: center;">
                            <input name="bookTimeSelector" class="datepicker-inline form-control" size="16"
                                   placeholder="请选择" style="display: inline-block; width: 45%; float: none;"
                                   onchange="selectDate(this);"
                                   data-type="book"
                                   type="text" value="<?= date("Y-m-d") ?>" readonly="">
                        </div>
                    </div>
                    <style>
                        table.timeTable {
                            float: left;
                            width: 50px;
                            margin-top: 5px;
                        }

                        table.updateTable {
                            width: calc(100% - 60px);
                            text-align: center;
                            float: left;
                        }

                        .updateTable th {
                            border: none;
                            background: transparent;
                            color: black;
                            text-align: center;
                            -webkit-user-select: none;
                            -moz-user-select: none;
                            -ms-user-select: none;
                            user-select: none;
                            word-break: keep-all;
                        }

                        .timeTable td, .updateTable td {
                            border: 1px solid white;
                            background: green;
                            color: white;
                            -webkit-user-select: none;
                            -moz-user-select: none;
                            -ms-user-select: none;
                            user-select: none;
                            cursor: pointer;
                            height: 30px;
                            line-height: 30px;
							padding: 0;
							overflow: hidden;
							white-space: nowrap;
							word-break: keep-all;
							text-overflow: ellipsis;
                        }

                        .timeTable td {
                            background: transparent;
                            color: black;
                            border-color: transparent;
                        }

                        .updateTable td[data-status="0"],
                        .updateTable td[data-status="4"] {
                            background: lightgrey;
                            color: black;
                        }

                        .updateTable td[data-status="0"][data-userid="-1"] {
                            background: grey;
                            color: black;
                        }

                        .updateTable td[data-status="1"],
                        .updateTable td[data-status="5"] {
                            background: #fff359;
                            color: black;
                        }
                    </style>
                    <div class="row form-inline">
                        <div class="input-group margin" style="width: 1000px;">
                            <table class="timeTable"></table>
                            <table class="updateTable" data-type="book">
                                <thead></thead>
                                <tbody></tbody>
                            </table>
                        </div>
                        <div class="input-group margin" style="display: block;">
                            <label> 备注 : </label>
                            <div class="roomInfoNotify"
                                 style="display: inline-block; float: none;width:500px;"></div>
                            <br>
                            <label> 自定义备注 : </label>
                            <input name="bookListDescription" class="form-control"
                                   placeholder="请输入" style="display: inline-block; float: none;width: 500px;"
                                   type="text" value="">
                        </div>
                        <div class="input-group margin" style="display: block;">
                            <label> 选择已售有效期 : 未来</label>
                            <select class="form-control" name="futureWeek"
                                    style="display: inline-block; width: 80px; float: none;">
                                <?php
                                for ($i = 0; $i < 72; $i++) {
                                    echo '<option value="' . $i . '">' . $i . '</option>';
                                }
                                ?>
                            </select>
                            周
                        </div>
                    </div>

                    <div class="row form-inline">
                        <div class="row" style="padding-left: 200px;">
                            <div class="col-xs-12 col-sm-12 form-inline">
                                <a class="btn btn-primary form-control" data-type="book"
                                   style="width: 120px;" onclick="confirmUpdate(this)">设置为已售</a>
                                <a class="btn btn-default form-control" data-type="removebook"
                                   style="width: 120px;" onclick="confirmUpdate(this)">设置为可售</a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div style="display:inline-block; text-align: left; width: 1000px;margin-top:30px;">
                <label style="font-size:larger;"> 修改价格 : </label>
                <form class="priceInfoUpdateForm" action=""
                      method="post"
                      accept-charset="utf-8" enctype="multipart/form-data">

                    <input type="hidden" name="id" value="<?= $site[0]->no ?>"/>
                    <input type="hidden" name="boss_id" value="<?= $site[0]->boss_id ?>"/>

                    <div class="row form-inline" style="text-align: center;">
                        <select onchange="selectDate(this)" data-type="price" name="priceTimeSelector">
                            <?php
                            $weekStr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                            for ($i = 0; $i < 7; $i++) {
                                echo '<option value="' . $i . '">' . $weekStr[$i] . '</option>';
                            }
                            ?>
                        </select>
                    </div>

                    <div class="row form-inline">
                        <div class="input-group margin" style="width: 1000px;">
                            <table class="timeTable"></table>
                            <table class="updateTable" data-type="price">
                                <thead></thead>
                                <tbody></tbody>
                            </table>
                        </div>
                        <div class="input-group margin">
                            <label> 修改价格 : </label>
                            <input name="updatedPrice" class="form-control"
                                   placeholder="请输入" style="display: inline-block; float: none;width: 200px;"
                                   type="number" value="">
                        </div>

                    </div>

                    <div class="row form-inline">
                        <div class="row" style="padding-left: 200px;">
                            <div class="col-xs-12 col-sm-12 form-inline">
                                <a class="btn btn-primary form-control" data-type="price"
                                   onclick="confirmUpdate(this)">确定</a>
                                <a class="btn btn-default form-control" href="javascript:location.reload();"
                                   style="width: 80px;">取消</a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>


    </section>
</div>
<div class="notifyTag" style="position:fixed;left:40%;top:45%;width: 20%;height:40px;line-height: 40px;z-index:100;
    background: rgba(0,0,0,0.7);border-radius: 5px;color:white;text-align:center;display:none;">设置已生效
</div>
<script src="<?php echo base_url(); ?>assets/dist/jquery.js" type="text/javascript"></script>

<footer class="main-footer" style="border: none; background-color: #ecf0f5">
    <div class="pull-right hidden-xs" style="opacity: 0;">
        Cloud Shop System | Version 1.0
    </div>
</footer>
<div class="scripts" hidden style="display:none;">

    <script type="text/javascript" src="<?php echo base_url(); ?>assets/js/tbl_pagination.js" charset="utf-8"></script>

    <script src="<?php echo base_url(); ?>assets/plugins/datepicker/bootstrap-datepicker.min.js"></script>
    <script src="<?php echo base_url(); ?>assets/plugins/datetimepicker/bootstrap-datetimepicker.js"></script>
    <script src="<?php echo base_url(); ?>assets/plugins/datetimepicker/bootstrap-datetimepicker.zh-CN.js"></script>
    <script src="<?php echo base_url(); ?>assets/plugins/timepicker/bootstrap-timepicker.min.js"></script>


    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <input class="siteInfo" value='<?= json_encode($site) ?>' style="display: none;">
    <input class="roomDataInfo" value='<?= json_encode($roomData) ?>' style="display: none;">
    <input class="bossRoomInfo" value='<?= json_encode($bossRoom) ?>' style="display: none;">
    <input class="bookingDataInfo" value='<?= json_encode($bookingData) ?>' style="display: none;">
    <input class="userInfo" value='<?= json_encode($userInfo) ?>' style="display: none;">
    <script type="text/javascript">
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

    </script>
    <script src="<?php echo base_url(); ?>assets/js/bossRoomManage.js"></script>
</div>
</body>
</html>

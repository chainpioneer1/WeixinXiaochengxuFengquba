<link rel="stylesheet" href="<?php echo base_url(); ?>assets/dist/css/jquery.jcrop.css" type="text/css"/>
<link rel="stylesheet" href="<?php echo base_url(); ?>assets/editor/css/froala_editor.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>assets/editor/css/froala_style.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>assets/editor/css/plugins/code_view.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>assets/editor/css/plugins/colors.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>assets/editor/css/plugins/emoticons.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>assets/editor/css/plugins/image_manager.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>assets/editor/css/plugins/image.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>assets/editor/css/plugins/line_breaker.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>assets/editor/css/plugins/table.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>assets/editor/css/plugins/char_counter.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>assets/editor/css/plugins/video.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>assets/editor/css/plugins/fullscreen.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>assets/editor/css/plugins/file.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.3.0/codemirror.min.css">
<link rel="stylesheet" href="https://cache.amap.com/lbs/static/main.css?v=1.0?v=1.0"/>

<style type="text/css">

    #tip {
        background-color: transparent;
        border: transparent;
        padding: 0 10px;
        position: relative;
        font-size: inherit;
        left: 0px;
        top: 0px;
        border-radius: 3px;
        line-height: 36px;
    }

    #tip select {
        width: 100px;
        height: 30px;
    }

    .amap-indoor-map .label-canvas {
        position: absolute;
        top: 0;
        left: 0
    }

    .amap-indoor-map .highlight-image-con * {
        pointer-events: none
    }

    .amap-indoormap-floorbar-control {
        position: absolute;
        margin: auto 0;
        bottom: 165px;
        right: 12px;
        width: 35px;
        text-align: center;
        line-height: 1.3em;
        overflow: hidden;
        padding: 0 2px
    }

    .amap-indoormap-floorbar-control .panel-box {
        background-color: rgba(255, 255, 255, .9);
        border-radius: 3px;
        border: 1px solid #ccc
    }

    .amap-indoormap-floorbar-control .select-dock {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        box-sizing: border-box;
        height: 30px;
        border: solid #4196ff;
        border-width: 0 2px;
        border-radius: 2px;
        pointer-events: none;
        background: linear-gradient(to bottom, #f6f8f9 0, #e5ebee 50%, #d7dee3 51%, #f5f7f9 100%)
    }

    .amap-indoor-map .transition {
        transition: opacity .2s
    }

    ,
    .amap-indoormap-floorbar-control .transition {
        transition: top .2s, margin-top .2s
    }

    .amap-indoormap-floorbar-control .select-dock:after, .amap-indoormap-floorbar-control .select-dock:before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        left: 0;
        top: 10px;
        border: solid transparent;
        border-width: 4px;
        border-left-color: #4196ff
    }

    .amap-indoormap-floorbar-control .select-dock:after {
        right: 0;
        left: auto;
        border-left-color: transparent;
        border-right-color: #4196ff
    }

    .amap-indoormap-floorbar-control.is-mobile {
        width: 37px
    }

    .amap-indoormap-floorbar-control.is-mobile .floor-btn {
        height: 35px;
        line-height: 35px
    }

    .amap-indoormap-floorbar-control.is-mobile .select-dock {
        height: 35px;
        top: 36px
    }

    .amap-indoormap-floorbar-control.is-mobile .select-dock:after, .amap-indoormap-floorbar-control.is-mobile .select-dock:before {
        top: 13px
    }

    .amap-indoormap-floorbar-control.is-mobile .floor-list-box {
        height: 105px
    }

    .amap-indoormap-floorbar-control .floor-list-item .floor-btn {
        color: #555;
        font-family: "Times New Roman", sans-serif, "Microsoft Yahei";
        font-size: 16px
    }

    .amap-indoormap-floorbar-control .floor-list-item.selected .floor-btn {
        color: #000
    }

    .amap-indoormap-floorbar-control .floor-btn {
        height: 28px;
        line-height: 28px;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none
    }

    .amap-indoormap-floorbar-control .floor-btn:hover {
        background-color: rgba(221, 221, 221, .4)
    }

    .amap-indoormap-floorbar-control .floor-minus, .amap-indoormap-floorbar-control .floor-plus {
        position: relative;
        text-indent: -1000em
    }

    .amap-indoormap-floorbar-control .floor-minus:after, .amap-indoormap-floorbar-control .floor-plus:after {
        content: "";
        position: absolute;
        margin: auto;
        top: 9px;
        left: 0;
        right: 0;
        width: 0;
        height: 0;
        border: solid transparent;
        border-width: 10px 8px;
        border-top-color: #777
    }

    .amap-indoormap-floorbar-control .floor-minus.disabled, .amap-indoormap-floorbar-control .floor-plus.disabled {
        opacity: .3
    }

    .amap-indoormap-floorbar-control .floor-plus:after {
        border-bottom-color: #777;
        border-top-color: transparent;
        top: -3px
    }

    .amap-indoormap-floorbar-control .floor-list-box {
        max-height: 153px;
        position: relative;
        overflow-y: hidden
    }

    .amap-indoormap-floorbar-control .floor-list {
        margin: 0;
        padding: 0;
        list-style: none
    }

    .amap-indoormap-floorbar-control .floor-list-item {
        position: relative
    }

    .amap-indoormap-floorbar-control .floor-btn.disabled, .amap-indoormap-floorbar-control .floor-btn.disabled *, .amap-indoormap-floorbar-control.with-indrm-loader * {
        -webkit-pointer-events: none !important;
        pointer-events: none !important
    }

    .amap-indoormap-floorbar-control .with-indrm-loader .floor-nonas {
        opacity: .5
    }

    .amap-indoor-map-moverf-marker {
        color: #555;
        background-color: #FFFEEF;
        border: 1px solid #7E7E7E;
        padding: 3px 6px;
        font-size: 12px;
        white-space: nowrap;
        display: inline-block;
        position: absolute;
        top: 1em;
        left: 1.2em
    }

    .amap-indoormap-floorbar-control .amap-indrm-loader {
        -moz-animation: amap-indrm-loader 1.25s infinite linear;
        -webkit-animation: amap-indrm-loader 1.25s infinite linear;
        animation: amap-indrm-loader 1.25s infinite linear;
        border: 2px solid #91A3D8;
        border-right-color: transparent;
        box-sizing: border-box;
        display: inline-block;
        overflow: hidden;
        text-indent: -9999px;
        width: 13px;
        height: 13px;
        border-radius: 7px;
        position: absolute;
        margin: auto;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0
    }

    @-moz-keyframes amap-indrm-loader {
        0% {
            -moz-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -moz-transform: rotate(360deg);
            transform: rotate(360deg)
        }
    }

    @-webkit-keyframes amap-indrm-loader {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg)
        }
    }

    @keyframes amap-indrm-loader {
        0% {
            -moz-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg)
        }
        100% {
            -moz-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg)
        }
    }

    .fr-box {
        width: 400px;
        left: 180px;
    }

    input, select {
        padding: 0 5px !important;
    }
</style>
<?php
$is_train = $this->session->userdata('event_infos')['is_train'];
$type = '赛事';
if ($is_train == 1)
    $type = '活动';
else $is_train = 0;
?>

<div class="content-wrapper" style="min-height: 100%">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            <span class="head-selected">新增<?= $type; ?>
        </h1>
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div>
                <?php echo form_open_multipart(base_url() . 'eventmanage/addEvent'); ?>

                <input type="text" name="is_train" hidden value="<?= $is_train ?>">
                <div class="row form-inline">
                    <label> *封面图片 : </label>
                    <input hidden name="item_pics" value="<?= (isset($item_pics)) ? $item_pics : '' ?>">
                    <div class="form-group text-center" style="padding: 0px 5px;">
                        <img class="img_preview" src="<?php echo base_url(); ?>assets/images/picture.png"
                             alt="user image" class="online" itemid="1"
                             style="height: 100px; width:150px;cursor:pointer;"><br>
                        <input name="img1" type="file" style="display: none" itemid="1" accept=".png,.jpg,.bmp,.gif"/>
                    </div>
                    <div class="form-group text-center" style="padding: 0px 5px;">
                        <img class="img_preview" src="<?php echo base_url(); ?>assets/images/picture.png"
                             alt="user image" class="online" itemid="2"
                             style="height: 100px; width:150px; cursor:pointer;"><br>
                        <input name="img2" type="file" style="display: none" itemid="2" accept=".png,.jpg,.bmp,.gif"/>
                    </div>
                    <div class="form-group text-center" style="padding: 0px 5px;">
                        <img class="img_preview" src="<?php echo base_url(); ?>assets/images/picture.png"
                             alt="user image" class="online" itemid="3"
                             style="height: 100px; width:150px; cursor:pointer;"><br>
                        <input name="img3" type="file" style="display: none" itemid="3" accept=".png,.jpg,.bmp,.gif"/>
                    </div>

                    <div class="input-group margin"
                         style="color: red;"><?php if (isset($error_pic)) echo $error_pic; ?></div>
                    <script>
                        $('.img_preview').on('click', function () {
                            var id = $(this).attr('itemid');
                            $('input[name="img' + id + '"]').trigger('click');
                        })
                        $('input[type="file"]').on('change', function () {
                            var id = $(this).attr('itemid');
                            preview_image($('.img_preview[itemid="' + id + '"]'), this.files[0]);
                        })

                        function preview_image(item, file) {
                            var previewer = item;
                            var reader = new FileReader();
                            reader.onloadend = function () {
                                previewer.attr('src', reader.result)
                            };
                            if (file) {
                                reader.readAsDataURL(file);//reads the data as a URL
                            } else {
                                previewer.css({
                                    background: '#f0f0f0'
                                })
                            }
                        }
                    </script>
                </div>

                <input type="hidden" name="id" value=""/>
                <div class="row form-inline">
                    <label> *<?= $type ?>名称 : </label>
                    <div class="input-group margin">
                        <input name="name" type="text" class="form-control" placeholder="请输入"
                               value="<?php if (isset($item_name)) echo $item_name; ?>" maxlength="30"
                               style="margin: 0 ; padding: 0px 20px;"/>
                    </div>
                    <div class="input-group margin"
                         style="color: red;"><?php if (isset($error_name)) echo $error_name; ?></div>
                </div>
                <div class="row form-inline">
                    <label> *报名费 : </label>
                    <div class="input-group margin">
                        <input name="cost" type="text" class="form-control" placeholder="请输入"
                               value="<?php if (isset($item_cost)) echo $item_cost; ?>" maxlength="10"
                               style="margin: 0 ; padding: 0px 20px; width: 80px; vertical-align: middle"/>
                        <label style="width: auto; line-height: 2.5"> 元 / 人 </label>
                    </div>
                    <div class="input-group margin"
                         style="color: red;"><?php if (isset($error_cost)) echo $error_cost; ?></div>
                </div>
                <div class="row form-inline">
                    <label> *<?=($is_train==0?'比赛':$type)?>地点 : </label>
                    <div class="input-group margin">
                        <input name="address" type="text" class="form-control" placeholder="请选择" readonly
                               onclick="$('.map-select').toggle();"
                               value="<?php if (isset($item_address)) echo $item_address; ?>" maxlength="50"
                               style="margin: 0 ; padding: 0px 20px; display: inline-block; width:150px;"/>
                        <input name="detail_addr" type="text" id="detail_addr_input" class="form-control"
                               placeholder="请输入详细地址"
                               style="margin: 0 ; padding: 0px 20px; display: inline-block; width:150px;">
                    </div>
                    <div style="display: none;">
                        <input name="province"/>
                        <input name="city"/>
                        <input name="area"/>
                        <input name="longitude"/>
                        <input name="latitude"/>
                    </div>
                    <div class="input-group margin"
                         style="color: red;"><?php if (isset($error_address)) echo $error_address; ?></div>
                </div>
                <div class="map-select" style="position: absolute; top:50%;left:75%; display: none;
                    -webkit-transform: translate(-50%,-50%);-moz-transform: translate(-50%,-50%);
                    -ms-transform: translate(-50%,-50%);-o-transform: translate(-50%,-50%);transform: translate(-50%,-50%);
                    width:40%;height:40%;">
                    <div id="custom-map-container" style="width:100%;height:100%;"></div>
                    <div class="main-point" style="width: 20px;height:20px; left:50%;top:50%;position: absolute;
                        -webkit-transform: translate(-50%,-50%);-moz-transform: translate(-50%,-50%);
                        -ms-transform: translate(-50%,-50%);-o-transform: translate(-50%,-50%);transform: translate(-50%,-50%);
                        background:rgba(255,255,255,.5);border-radius:50%;pointer-events: none;border:3px solid dodgerblue;">
                    </div>
                </div>
                <div class="row form-inline">
                    <label> *<?=($is_train==0?'比赛':$type)?>时间 : </label>
                    <div class="input-group margin">
                        <input id="fromTime" name="fromTime" class="datepicker-inline form-control" size="16"
                               placeholder="请选择" style="display: inline-block; width: 45%; float: none;"
                               type="text" value="<?php if (isset($item_fromTime)) echo $item_fromTime; ?>" readonly="">到
                        <input id="toTime" name="toTime" class="datepicker-inline form-control" size="16"
                               placeholder="请选择" style="display: inline-block; width: 45%; float: none;"
                               type="text" value="<?php if (isset($item_toTime)) echo $item_toTime; ?>" readonly="">
                    </div>
                    <div class="input-group margin"
                         style="color: red;"><?php if (isset($error_fromTime)) echo $error_fromTime; ?></div>
                </div>
                <div class="row form-inline">
                    <label> *报名截止时间 : </label>
                    <div class="input-group margin">
                        <input id="endTime" name="endTime" class="datepicker-inline form-control" size="16"
                               placeholder="请选择"
                               type="text" value="<?php if (isset($item_endTime)) echo $item_endTime; ?>" readonly="">
                    </div>
                    <div class="input-group margin"
                         style="color: red;"><?php if (isset($error_endTime)) echo $error_endTime; ?></div>
                </div>
                <div class="row form-inline">
                    <label> *联系电话 : </label>
                    <div class="input-group margin">
                        <input id="agent_phone" name="agent_phone" class="form-control" size="16"
                               placeholder="请输入"
                               type="text" value="<?php if (isset($item_phone)) echo $item_phone; ?>"
                               style="margin: 0 ; padding: 0px 20px;">
                    </div>
                    <div class="input-group margin"
                         style="color: red;"><?php if (isset($error_phone)) echo $error_phone; ?></div>
                </div>
                <div class="row form-inline">
                    <label> *人数上限 : </label>
                    <div class="input-group margin">
                        <input name="limit" type="number" class="form-control" placeholder="请输入"
                               value="<?php if (isset($item_limit)) echo $item_limit; ?>" maxlength="10"
                               style="margin: 0 ; padding: 0px 20px; width: 80px; vertical-align: middle"/>
                        <label style="width: auto; line-height: 2.5"> 人 </label>
                    </div>
                    <div class="input-group margin"
                         style="color: red;"><?php if (isset($error_limit)) echo $error_limit; ?></div>
                </div>
                <div class="row form-inline">
                    <label> *支付方式 : </label>
                    <div class="input-group margin">
                        <label style="width: auto" class="margin">
                            <input type="checkbox" name="payOption1" itemid="0" onclick="setPayMode(0)"
                                <?php if (isset($item_payMode) && ($item_payMode == '1' || $item_payMode == '2')) echo 'checked="checked"'; ?>>
                            线上
                        </label>
                        <label style="width: auto" class="margin">
                            <input type="checkbox" name="payOption2" itemid="1" onclick="setPayMode(0)"
                                <?php if (isset($item_payMode) && ($item_payMode == '0' || $item_payMode == '2')) echo 'checked="checked"'; ?>>
                            线下
                        </label>
                        <input type="text" name="payMode" hidden class="payMode"
                               value="<?= (isset($item_payMode)) ? $item_payMode : ''; ?>">
                    </div>
                    <div class="input-group margin"
                         style="color: red;"><?php if (isset($error_payMode)) echo $error_payMode; ?></div>
                    <script>
                        function setPayMode(id) {
                            var pay1 = $('input[name="payOption1"]')[0].checked;
                            var pay2 = $('input[name="payOption2"]')[0].checked;
                            var dest = $('input[name="payMode"]')
                            if (pay1 && pay2) dest.val('2')
                            else if (pay1) dest.val('1')
                            else if (pay2) dest.val('0')
                            else dest.val('-1')
                        }
                    </script>
                </div>

                <div class="row form-inline">
                    <label> *<?= $type ?>类型 : </label>
                    <div class="input-group margin">
                        <select class="form-control" name="eventtype"
                                value="<?= (isset($item_type)) ? $item_type : '0'; ?>">
                            <?php
                            for ($index = 0; $index < count($eventType); $index++) {
                                ?>
                                <option value="<?= $index; ?>"><?= $eventType[$index]; ?></option>
                                <?php
                            }
                            ?>
                        </select>
                    </div>
                    <div class="input-group margin"
                         style="color: red;"><?php if (isset($error_type)) echo $error_payMode; ?></div>
                </div>
                <?php
                $limit = ['姓名', '电话', '单位', '俱乐部', '性别', '身份证号', '所在城市', '所在大学院系', '职业', '地址', '邮箱', '上传图片'];
                ?>
                <div class="row form-inline">
                    <label> *报名限制 : </label>
                    <?php
                    $j = 0;

                    $len = (isset($item_limit1)) ? count($item_limit1) : 0;

                    foreach ($limit as $item) {

                        echo '<div class="row" style="line-height: 1;">';
                        echo '<label style="font-size:13px;"> ' . $item . '</label>';
                        echo '<div class="input-group" style="line-height: 1;">
                                <label style="width: auto" class="margin">
                                    <input type="radio" name="selOption' . $j . '" item_type="' . $j . '" value="1"';
                        if ($len > $j)
                            echo(($item_limit1[$j] == '1') ? ' checked' : '');
                        echo '/>必填项
                                </label>
                                <label style="width: auto" class="margin">
                                    <input type="radio" name="selOption' . $j . '" item_type="' . $j . '" value="0"';
                        if ($len > $j)
                            echo(($item_limit1[$j] == '0') ? ' checked' : '');
                        echo '/>选填项
                                </label>
                              </div>';
                        echo '</div>';
                        $j++;
                    }
                    ?>
                    <input name="condition" style="display: none;" value="-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1"/>
                    <script>
                        $('input[type="radio"]').on('click', function () {
                            var ctrls = $('input[type="radio"]');
                            var target = $('input[name="condition"]');
                            var curStatus = target.val().split(',');
                            var id = parseInt($(this).attr('item_type'));
                            if (curStatus[id] == $(this).val()) this.checked = false;
                            var txt = ''
                            for (var ii = 0; ii < ctrls.length - 1; ii += 2) {
                                if (ii != 0) txt += ',';
                                if (!ctrls[ii].checked && !ctrls[ii + 1].checked) {
                                    txt += '-1';
                                } else if (ctrls[ii].checked) {
                                    txt += '1';
                                } else {
                                    txt += '0';
                                }
                            }
                            target.val(txt);
                        })
                    </script>
                </div>
                <div class="row form-inline">
                    <label> *图片提示文字 : </label>
                    <div class="input-group margin">
                        <input name="imgprompt" type="text" class="form-control" placeholder="请输入"
                               value="<?php if (isset($item_imgprompt)) echo $item_imgprompt; ?>" maxlength="50"
                               style="margin: 0 ; padding: 0px 20px; width: 160px; vertical-align: middle"/>
                    </div>
                    <div class="input-group margin"
                         style="color: red;"><?php if (isset($error_imgprompt)) echo $error_imgprompt; ?></div>
                </div>

                <div class="row form-inline">
                    <label> *<?= $type ?>介绍 : </label>
                    <div name="summernote" id="summernote_1"></div>
                    <div class="input-group margin">
                        <textarea name="contents" style="height: 500px;"
                                  maxlength="500"><?php if (isset($comment)) echo $comment; ?></textarea>
                    </div>
                    <div class="input-group margin"
                         style="color: red;"><?php if (isset($error_comment)) echo $error_comment; ?></div>
                </div>

                <div class="row form-inline">
                    <div class="row" style="padding-left: 200px;">
                        <div class="col-xs-12 col-sm-12 form-inline">
                            <a class="btn btn-default form-control"
                               href="<?php echo base_url(); ?>newseventmanage">
                                <span>取消</span>
                            </a>
                            <input class="btn btn-primary form-control" value="确认发布" onclick="submit_form()"
                                   style="width: 80px;">
                        </div>
                    </div>
                </div>
                <?php echo "</form>" ?>
            </div>
        </div>
        <script>
            function submit_form() {
                $('form').submit();
            }
        </script>

        <div class="col-md-3 col-md-offset-7" style="position: absolute; top: 125px">
            <?php
            $this->load->helper('form');
            $error = $this->session->flashdata('error');
            if ($error) {
                ?>
                <div class="alert alert-danger alert-dismissable">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                    <?php echo $this->session->flashdata('error'); ?>
                </div>
            <?php } ?>
            <?php
            $success = $this->session->flashdata('success');
            if ($success) {
                ?>
                <div class="alert alert-success alert-dismissable" style="display:none;">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                    <input type="text" value="<?php echo $this->session->flashdata('success'); ?>"
                           id="success_message" style="display:none;">
                </div>
            <?php } ?>

            <div class="row">
                <div class="col-md-12">
                    <?php echo validation_errors('<div class="alert alert-danger alert-dismissable">',
                        ' <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button></div>'); ?>
                </div>
            </div>
        </div>
    </section>
</div>
<div id="crop-image-panel" style="display: none;">
    <div style="display:none;overflow:hidden" id="div_avatar">
        <div style="overflow:hidden;float:left;" id="picture_original"><img alt="" src=""/></div>
        <div id="picture_200" style="float:left;margin-left:20px"></div>
        <input type="hidden" id="x1" name="x1" value="0"/>
        <input type="hidden" id="y1" name="y1" value="0"/>
        <input type="hidden" id="cw" name="cw" value="0"/>
        <input type="hidden" id="ch" name="ch" value="0"/>
        <input type="hidden" id="imgsrc" name="imgsrc"/>
        <input type="button" value="裁剪上传" id="btnCrop"/>
    </div>
</div>
<script src="<?php echo base_url(); ?>assets/dist/jquery.js" type="text/javascript"></script>

<script src="https://webapi.amap.com/maps?v=1.3&key=0250860ccb5953fa5d655e8acf40ebb7&plugin=AMap.Geolocation,AMap.DistrictSearch,AMap.CitySearch,AMap.Autocomplete,AMap.PlaceSearch"></script>
<script src="https://webapi.amap.com/ui/1.0/main.js?v=1.0.10"></script>

<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/map.js" charset="utf-8"></script>

<script src="<?php echo base_url(); ?>assets/dist/jquery.ajaxfileupload.js" type="text/javascript"></script>
<script src="<?php echo base_url(); ?>assets/dist/jquery.jcrop.js" type="text/javascript"></script>
<script src="<?php echo base_url(); ?>assets/dist/avatarCutter.js" type="text/javascript"></script>

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.3.0/codemirror.min.js"></script>
<script type="text/javascript"
        src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.3.0/mode/xml/xml.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/froala_editor.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/align.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/code_beautifier.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/code_view.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/colors.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/draggable.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/emoticons.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/font_size.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/font_family.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/image.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/file.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/image_manager.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/line_breaker.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/link.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/lists.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/paragraph_format.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/paragraph_style.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/video.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/table.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/url.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/entities.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/char_counter.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/inline_style.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/save.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/plugins/fullscreen.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/editor/js/languages/zh_cn.js"></script>
<script>
    $(function () {
        var pics = $('input[name="item_pics"]').val();
        if (pics != '') {
            pics = pics.split(',');
            for (var i = 0; i < pics.length; i++) {
                $('.img_preview[itemid="' + (i + 1) + '"]').attr('src', baseURL + pics[i]);
            }
        }
        $('textarea').froalaEditor({
            tabSpaces: 4,
            language: 'zh_cn',
            imageUploadURL: '<?php echo base_url();?>upload_image.php'
        })
    });

    var jcrop_api;
    var type = 1;

    function getFileSize(fileName) {
        var byteSize = 0;
        console.log($("#" + fileName).val());
        if ($("#" + fileName)[0].files) {
            var byteSize = $("#" + fileName)[0].files[0].size;
        }
        byteSize = Math.ceil(byteSize / 1024) //KB
        return byteSize;//KB
    }

    function upload(filename, type, dest_width, dest_height) {
        var allowImgageType = ['jpg', 'jpeg', 'png'];
        var file = $('#' + filename).val();
        //获取大小
        var byteSize = getFileSize(filename);
        //获取后缀
        if (file.length > 0) {
            if (byteSize > 10000) {
                alert("上传的附件文件不能超过10M");
                $('#crop-image-panel').hide();
                return;
            }
            var pos = file.lastIndexOf(".");
            //截取点之后的字符串
            var ext = file.substring(pos + 1).toLowerCase();
            //console.log(ext);
            if ($.inArray(ext, allowImgageType) != -1) {
                ajaxFileUpload(filename, type, dest_width, dest_height);
            } else {
                alert("请选择jpg,jpeg,png类型的图片");
                $('#crop-image-panel').hide();
            }
        }
        else {
            alert("请选择jpg,jpeg,png类型的图片");
            $('#crop-image-panel').hide();
        }
    }

    function ajaxFileUpload(filename, type, dest_width, dest_height) {
        var url = '';
        if (type == 2) {
            url = '<?php echo base_url(); ?>goodsmanage/picUpload';
        }
        else {
            url = '<?php echo base_url(); ?>goodsmanage/logoUpload';
        }
        $.ajaxFileUpload({
            url: url, //用于文件上传的服务器端请求地址
            secureuri: false, //一般设置为false
            fileElementId: filename, //文件上传空间的id属性  <input type="file" id="file" name="file" />
            dataType: 'json', //返回值类型 一般设置为json
            success: function (data, status)  //服务器成功响应处理函数
            {
                console.log(data);
                //var json = eval('(' + data + ')');
                //alert(data);
                $("#picture_original>img").attr({src: data.src, width: data.width, height: data.height});
                $('#imgsrc').val(data.path);
                //alert(data.msg);

                //同时启动裁剪操作，触发裁剪框显示，让用户选择图片区域
                var cutter = new jQuery.UtrialAvatarCutter({
                        //主图片所在容器ID
                        content: "picture_original",
                        //缩略图配置,ID:所在容器ID;width,height:缩略图大小
                        purviews: [{id: "picture_200", width: dest_width, height: dest_height}, {
                            id: "picture_50",
                            width: 50,
                            height: 50
                        }, {id: "picture_30", width: 30, height: 30}],
                        //选择器默认大小
                        selector: {width: 750, height: 380},
                        cropattrs: {boxWidth: 750, boxHeight: 380},
                        aspectRatio: dest_width / dest_height,
                        showCoords: function (c) { //当裁剪框变动时，将左上角相对图片的X坐标与Y坐标 宽度以及高度
                            $("#x1").val(c.x);
                            $("#y1").val(c.y);
                            $("#cw").val(c.w);
                            $("#ch").val(c.h);
                        },
                    }
                );
                cutter.reload(data.src);
                $('#div_avatar').show();
            },
            error: function (data, status, e)//服务器响应失败处理函数
            {
                alert(e);
            }
        })
        return false;
    }

    $('#btnCrop').click(function () {
        $.getJSON('<?php echo base_url(); ?>goodsmanage/picCrop', {
            x: $('#x1').val(),
            y: $('#y1').val(),
            w: $('#cw').val(),
            h: $('#ch').val(),
            src: $('#imgsrc').val()
        }, function (data) {
            console.log(data);
            if (type == 1) {
                $("#product_logo_image").attr("src", "<?php echo base_url(); ?>uploads/" + data.file);
                $("#product_logo_src").val(data.file);
            }
            else {
                $("#product_image").attr("src", "<?php echo base_url(); ?>uploads/" + data.file);
                $("#product_img_src").val(data.file);
            }

        });
        $('#crop-image-panel').hide();
        return false;
    });

    $(function () {
        $(".datepicker-inline").datetimepicker({
            format: 'yyyy-mm-dd hh:ii'
        });
    });

    function cleanTime() {
        $("#fromTime").val("");
        console.log("here");
        $("#toTime").val("");
    }
</script>

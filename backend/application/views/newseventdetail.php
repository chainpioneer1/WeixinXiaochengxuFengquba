<!--<link rel="stylesheet" href="--><?php //echo base_url(); ?><!--assets/dist/css/jquery.jcrop.css" type="text/css"/>-->
<!--<link rel="stylesheet" href="--><?php //echo base_url(); ?><!--assets/editor/css/froala_editor.css">-->
<!--<link rel="stylesheet" href="--><?php //echo base_url(); ?><!--assets/editor/css/froala_style.css">-->
<!--<link rel="stylesheet" href="--><?php //echo base_url(); ?><!--assets/editor/css/plugins/code_view.css">-->
<!--<link rel="stylesheet" href="--><?php //echo base_url(); ?><!--assets/editor/css/plugins/colors.css">-->
<!--<link rel="stylesheet" href="--><?php //echo base_url(); ?><!--assets/editor/css/plugins/emoticons.css">-->
<!--<link rel="stylesheet" href="--><?php //echo base_url(); ?><!--assets/editor/css/plugins/image_manager.css">-->
<!--<link rel="stylesheet" href="--><?php //echo base_url(); ?><!--assets/editor/css/plugins/image.css">-->
<!--<link rel="stylesheet" href="--><?php //echo base_url(); ?><!--assets/editor/css/plugins/line_breaker.css">-->
<!--<link rel="stylesheet" href="--><?php //echo base_url(); ?><!--assets/editor/css/plugins/table.css">-->
<!--<link rel="stylesheet" href="--><?php //echo base_url(); ?><!--assets/editor/css/plugins/char_counter.css">-->
<!--<link rel="stylesheet" href="--><?php //echo base_url(); ?><!--assets/editor/css/plugins/video.css">-->
<!--<link rel="stylesheet" href="--><?php //echo base_url(); ?><!--assets/editor/css/plugins/fullscreen.css">-->
<!--<link rel="stylesheet" href="--><?php //echo base_url(); ?><!--assets/editor/css/plugins/file.css">-->
<!--<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.3.0/codemirror.min.css">-->
<style type="text/css">
    .fr-box {
        width: 400px;
        left: 180px;
    }

    input {
        pointer-events: none;
        background: lightgrey;
        line-height: 1;
        vertical-align: middle !important;
        height: 25px !important;
        line-height: 25px !important;
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
            <span class="head-selected"><?= $type; ?>详情
        </h1>
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div>
                <?php echo form_open_multipart(base_url() . 'eventmanage/addEvent');
                $item = $eventDetail[0];
                $limitStr = ['姓名', '电话', '单位', '俱乐部', '性别', '身份证号', '所在城市', '所在大学院系', '职业', '地址', '邮箱', '上传图片(' . $item->imgprompt . ')'];
                ?>

                <div class="row form-inline">
                    <label> *封面图片 : </label>
                    <input hidden name="item_pics" value="<?= $item->pic ?>">
                    <div class="form-group text-center" style="padding: 0px 5px;">
                        <img class="img_preview" src="<?php echo base_url(); ?>assets/images/picture.png"
                             alt="user image" class="online" itemid="1"
                             style="height: 100px; width:150px;cursor:pointer;"><br>
                    </div>
                    <div class="form-group text-center" style="padding: 0px 5px;">
                        <img class="img_preview" src="<?php echo base_url(); ?>assets/images/picture.png"
                             alt="user image" class="online" itemid="2"
                             style="height: 100px; width:150px; cursor:pointer;"><br>
                    </div>
                    <div class="form-group text-center" style="padding: 0px 5px;">
                        <img class="img_preview" src="<?php echo base_url(); ?>assets/images/picture.png"
                             alt="user image" class="online" itemid="3"
                             style="height: 100px; width:150px; cursor:pointer;"><br>
                    </div>
                </div>

                <input type="hidden" name="id" value="<?= $item->id ?>"/>
                <div class="row form-inline">
                    <label> *<?= $type ?>名称 : </label>
                    <div class="input-group margin">
                        <input name="name" type="text" class="form-control" placeholder="请输入"
                               value="<?= $item->eventName ?>" maxlength="30"
                               style="margin: 0 ; padding: 0px 20px;"/>
                    </div>
                </div>
                <div class="row form-inline">
                    <label> *报名费 : </label>
                    <div class="input-group margin">
                        <input name="cost" type="number" class="form-control" placeholder="请输入"
                               value="<?= $item->cost ?>" maxlength="10"
                               style="margin: 0 ; padding: 0px 20px; width: 80px; vertical-align: middle"/>
                        <label style="width: auto; line-height: 2.5"> 元 / 人 </label>
                    </div>
                </div>
                <div class="row form-inline">
                    <label> *<?= ($is_train == 0 ? '比赛' : $type) ?>地点 : </label>
                    <div class="input-group margin">
                        <input name="address" type="text" class="form-control" placeholder="请输入"
                               value="<?= $item->detail_address ?>" maxlength="10"
                               style="margin: 0 ; padding: 0px 20px;"/>
                    </div>
                </div>
                <div class="row form-inline">
                    <label> *<?= ($is_train == 0 ? '比赛' : $type) ?>时间 : </label>
                    <div class="input-group margin">
                        <input id="fromTime" name="fromTime" class="datepicker-inline form-control" size="16"
                               placeholder="请选择" style="display: inline-block; width: 45%;float: none;"
                               type="text" value="<?= $item->start_time; ?>" readonly="">
                        <div style="display: inline-block;">到</div>
                        <input id="toTime" name="toTime" class="datepicker-inline form-control" size="16"
                               placeholder="请选择" style="display: inline-block; width: 45%;float: none;"
                               type="text" value="<?= $item->end_time ?>" readonly="">
                    </div>
                </div>
                <div class="row form-inline">
                    <label> *报名截止时间 : </label>
                    <div class="input-group margin">
                        <input id="endTime" name="toTime" class="datepicker-inline form-control" size="16"
                               placeholder="请选择"
                               type="text" value="<?= $item->final_time ?>" readonly="">
                    </div>
                </div>
                <div class="row form-inline">
                    <label> *联系方式 : </label>
                    <div class="input-group margin">
                        <input id="toTime" name="toTime" class="datepicker-inline form-control" size="16"
                               placeholder="请选择"
                               type="text" value="<?= $item->agent_phone ?>" readonly="">
                    </div>
                </div>
                <div class="row form-inline">
                    <label> *人数上限 : </label>
                    <div class="input-group margin">
                        <input id="toTime" name="toTime" class="datepicker-inline form-control" size="16"
                               placeholder="请选择"
                               type="text" value="<?= $item->limit ?>" readonly="">
                    </div>
                </div>
                <div class="row form-inline">
                    <label> *支付方式 : </label>
                    <div class="input-group margin">
                        <label style="width: auto" class="margin"><?php
                            if ($item->pay_type == '0') echo '线下支付';
                            else if ($item->pay_type == '1') echo '线上支付';
                            else echo '线上支付 / 线下支付';
                            ?>
                        </label>
                    </div>
                </div>

                <div class="row form-inline">
                    <label> *<?= $type ?>类型 : </label>
                    <div class="input-group margin"><?= $eventType[$item->type]; ?>
                    </div>
                </div>

                <div class="row form-inline">
                    <label> *报名限制 : </label>
                    <?php
                    $limit = $item->condition . ',-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1';
                    $limit = explode(',', $limit); ?>
                    <?php
                    $j = 0;
                    foreach ($limitStr as $cond) {
                        echo '<div class="row" style="line-height: 1;">';
                        echo '<label style="font-size:13px;"> ' . $cond . '</label>';
                        echo '<div class="input-group" style="line-height: 1;">
                                    <label style="width: auto; margin:0 20px;"><input type="radio" disabled ' . ($limit[$j] == 1 ? 'checked' : '') . ' value="' . ($j * 2) . '">必填项</label>
                                    <label style="width: auto; margin:0 20px;"><input type="radio" disabled ' . ($limit[$j] == 0 ? 'checked' : '') . ' value="' . ($j * 2 + 1) . '">选填项</label>
                                </div>';
                        echo '</div>';
                        $j++;
                    }
                    ?>
                </div>

                <div class="row form-inline">
                    <label> 图片提示文字 : </label>
                    <div class="input-group margin"><?= $item->imgprompt; ?>
                    </div>
                </div>

                <div class="row form-inline">
                    <label> *阅览量 : </label>
                    <div class="input-group margin"><?= $item->read_count; ?>
                    </div>
                </div>
                <div class="row form-inline">
                    <label> *点赞数 : </label>
                    <div class="input-group margin"><?= $favourite_amount; ?>
                    </div>
                </div>
                <!--<div class="row form-inline">
                    <label> *转发量 : </label>
                    <div class="input-group margin"><?= (($shared_amount == null) ? '0' : $shared_amount); ?>
                    </div>
                </div>-->
                <div class="row form-inline">
                    <label style="vertical-align: top;"> *<?= $type ?>介绍 : </label>
                    <div class="input-group margin">
                        <div>
                            <?= $item->comment; ?>
                        </div>
                    </div>
                </div>

                <div class="row form-inline">
                    <label> *报名人数 : </label>
                    <div class="input-group margin">
                        <div>
                            <?= count($booking); ?>人
                        </div>
                    </div>
                </div>
                <div class="row custom-info-row">
                    <div class="col-sm-12">
                        <table class="table table-bordered area-result-view">
                            <thead>
                            <tr style="background-color: lightslategrey;">
                                <th>昵称</th>
                                <?php
                                $opt = $limitStr;
                                $condition = explode(',', $item->condition);
                                $jj = 0;
                                foreach ($condition as $it) {
                                    if ($it != '-1') {
                                        if ($jj == 0)
                                            echo '<th width="70px">' . $opt[$jj] . '</th>';
                                        else
                                            echo '<th>' . $opt[$jj] . '</th>';
                                    }
                                    $jj++;
                                }
                                ?>
                                <!--                                <th>身份证号</th>-->
                                <th width="100px;">支付方式</th>
                                <th>使用蜂蜜优惠</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <style>
                                td a, td div {
                                    display: inline-block;
                                    margin: 0 10px;
                                }
                            </style>
                            <tbody id="content_tbl">
                            <?php
                            foreach ($booking as $it) {

                                ?>
                                <tr>
                                    <td><?php echo $it->name; ?></td>
                                    <?php

                                    $book_info = json_decode($it->book_info);
                                    $genderStr = ['男', '女'];
                                    $kk = 0;
                                    foreach ($condition as $cond) {
                                        if ($cond != '-1') {
                                            if ($kk == 4) {
                                                if ($book_info[$kk] > 1) $book_info[$kk]--;
                                                echo '<td>' . $genderStr[(($book_info[$kk] == '') ? 0 : $book_info[$kk])] . '</td>';
                                            } else if ($kk == 11) {
                                                echo '<td><a href="' . base_url('uploads/' . $book_info[$kk]) . '" download="' . $it->name . date('Y-m-d H:i:s') . '.png" target="_blank"><img style="height: 50px;" src="' . base_url('uploads/' . $book_info[$kk]) . '"/></a></td>';
                                            } else
                                                echo '<td>' . $book_info[$kk] . '</td>';
                                        }
                                        $kk++;
                                    }
                                    ?>
                                    <!--                                    <td>-->
                                    <?php //echo $item->id_no; ?><!--</td>-->
                                    <td><?php echo ($it->pay_type == 0) ? '线下已支付' : '线上已支付'; ?></td>
                                    <td><?php echo ($it->pay_honey == 0) ? '未使用' : ($it->pay_honey . 'ml'); ?></td>
                                    <td>
                                        <?php
                                        echo '<a href="' . base_url() . 'userDetail/' . (($it->state == 2) ? $it->cancel_user : $it->user_id) . '">查看用户</a>';
                                        if ($it->state == 0)
                                            echo '<a href="#" onclick="cancel_booking(\'' . $it->id . '\','
                                                . '\'' . $it->user_id . '\','
                                                . '\'' . $it->open_id . '\','
                                                . '\'' . $it->out_trade_no . '\','
                                                . '\'' . $it->pay_online . '\','
                                                . ')">取消报名</a>';
                                        else if ($it->state == 2)
                                            echo '<div>已取消</div>';
                                        else
                                            echo '<div>进行中</div>';; ?>
                                    </td>
                                </tr>
                                <?php
                            }
                            ?>
                            </tbody>
                        </table>

                        <div class="row" style="padding-left: 200px;">
                            <div class="col-xs-12 col-sm-12 form-inline">
                                <a class="btn btn-default form-control"
                                   href="javascript:;" <?= (count($booking) > 0 ? '' : 'disabled') ?>
                                   onclick="<?= (count($booking) > 0 ? 'exportTable()' : '') ?>">
                                    <span>导出<?= $type ?>列表</span>
                                </a>
                            </div>
                        </div>
                        <div class="clearfix"></div>

                    </div>
                </div>

                <div class="row form-inline">
                    <div class="row" style="padding-left: 200px;">
                        <div class="col-xs-12 col-sm-12 form-inline">
                            <a class="btn btn-default form-control"
                               href="<?php echo base_url(); ?>newseventmanage">
                                <span>返回<?= $type ?>列表</span>
                            </a>
                        </div>
                    </div>
                </div>
                <?php echo "</form>" ?>
            </div>
        </div>

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
                    <?php echo validation_errors('<div class="alert alert-danger alert-dismissable">', ' <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button></div>'); ?>
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
                $('.img_preview[itemid="' + (i + 1) + '"]').attr('src', baseURL + 'uploads/' + pics[i]);
            }
        }
        $('textarea').froalaEditor({
            tabSpaces: 4,
            language: 'zh_cn',
            imageUploadURL: '<?php echo base_url();?>upload_image.php'
        })
    });
</script>
<script type="text/javascript">

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

</script>
<script>

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

    function cancel_booking(id, user_id, open_id, trade_no, fee) {
        if (confirm('是否取消此用户的报名?')) {
            var refund_no = '1500220062' + Date.now();
            if (parseFloat(fee) > 0) {
                $.ajax({
                    type: 'post',
                    url: baseURL + 'api/refund',
                    contentType: 'application/json',
                    dataType: 'application/json',
                    data: JSON.stringify({
                        id: open_id,
                        user_id: user_id,
                        fee: fee,
                        out_trade_no: trade_no,
                        out_refund_no: refund_no
                    }),
                    complete: function (res) {
                        $.ajax({
                            type: 'post',
                            url: baseURL + 'api/datamanage/cancelBooking',
                            contentType: 'application/json',
                            dataType: 'application/json',
                            data: JSON.stringify({booking_id: id, out_refund_no: refund_no}),
                            complete: function (res) {
                                location.reload();
//                                if (res.status == 'success') {
//                                    alert('取消成功!');
//
//                                } else {
//                                    alert('取消失败!');
//                                }
                            }
                        });
                    }
                });
            } else {
                $.ajax({
                    type: 'post',
                    url: baseURL + 'api/datamanage/cancelBooking',
                    contentType: 'application/json',
                    dataType: 'application/json',
                    data: JSON.stringify({booking_id: id, out_refund_no: refund_no}),
                    complete: function (res) {
                        locaton.reload();
//                        if (res.status == 'success') {
//                            alert('取消成功!');
//                            location.reload();
//                        } else {
//                            alert('取消失败!');
//                        }
                    }
                });
            }
        }
    }
</script>


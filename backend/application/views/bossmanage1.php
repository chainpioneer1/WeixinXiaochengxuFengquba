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
    <link href="<?php echo base_url(); ?>assets/dist/css/AdminLTE.min.css" rel="stylesheet">
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
</style>
<?php
$type = '商家';
?>
<body id="main_page_body" class="skin-blue sidebar-mini">
<div class="content-wrapper" style="min-height: 100%;margin-left:0;">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><center><?= $title; ?></center></h1>
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container" style="width: 100%;text-align: center;">
            <a class="header-item" href="<?= base_url() . 'bossmanage' ?>" style="background: white;">商家信息</a>
            <a class="header-item" href="<?= base_url() . 'bossmanage/room' ?>">订场设置</a>
            <a class="header-item" href="<?= base_url() . 'bossmanage/coupon' ?>">团购设置</a>
            <a class="header-item" href="<?= base_url() . 'logout' ?>">退出</a>
        </div>
        <div class="container">
            <div>
                <?php echo form_open_multipart(base_url() . 'bossmanage/updateBossInfo'); ?>

                <input type="hidden" name="id" value="<?= $site[0]->no ?>"/>
                <input type="hidden" name="boss_id" value="<?= $site[0]->boss_id ?>"/>

                <div class="row form-inline">
                    <label> 经营类型 : </label>
                    <div class="input-group margin" style="width: 500px;vertical-align: top;">
                        <?php
                        $j = 0;
                        $site_type = explode(' ', $site[0]->site_type_detail);
                        foreach ($eventType as $item) {
                            $j++;
                            if ($j == 32) continue;
                            $isExist = false;
                            foreach ($site_type as $typeItem) {
								if($typeItem=='' || $typeItem == ' ' || $typeItem==null) continue;
                                if ($item == $typeItem) $isExist = true;
								//var_dump($typeItem);
								//var_dump($item);
                            }
                            ?>
                            <label style="width: 19%; text-align:left;margin-left:0;margin-right:0;padding:0;"
                                   class="margin">
                                <input type="checkbox" class="site_type_item"
                                       itemid="<?= $j - 1 ?>" <?= $isExist ? 'checked' : '' ?>
                                       onclick="setSiteType(this)" style="margin: 0 5px;"><?= $item; ?>
                            </label>
                        <?php } ?>
                        <input type="text" name="site_type_detail" value="" style="display: none">
                    </div>
                    <script>
                        function setSiteType(elem) {
                            var typeItem = $('input.site_type_item');
                            var dest = $('input[name="site_type_detail"]');
                            var site_type_detail = '';
                            var j = 0;
                            for (var i = 0; i < typeItem.length; i++) {
                                var item = typeItem[i];
                                if (item.checked) {
                                    j++;
                                    if (j > 3) {
                                        item.checked = false;
                                        continue;
                                    }
                                    if (site_type_detail != '') site_type_detail += ',';
                                    site_type_detail += item.getAttribute('itemid');
                                }
                            }
                            dest.val(site_type_detail);
                        }
						setSiteType();
                    </script>
                </div>

                <div class="row form-inline">
                    <label> 商家介绍 : </label>
                    <div class="input-group margin">
                        <textarea name="site_introduction" type="text" class="form-control" placeholder="请输入"
                                  style="margin: 0 ; padding: 0px 10px;width:600px;min-width:600px;max-width:600px;min-height: 50px;max-height:120px;"
                        ><?= $site[0]->site_introduction ?></textarea>
                    </div>
                </div>
                <div class="row form-inline">
                    <label> 服务介绍 : </label>
                    <div class="input-group margin">
                        <textarea name="site_service" type="text" class="form-control" placeholder="请输入"
                                  style="margin: 0 ; padding: 0px 10px;width:600px;min-width:600px;max-width:600px;min-height: 50px;max-height:120px;"
                        ><?= $site[0]->site_service ?></textarea>
                    </div>
                </div>

                <div class="row form-inline">
                    <label> 商家图片 : </label>
                    <input hidden name="item_pics" value=''>
                    <?php
                    for ($i = 0; $i < 5; $i++) {
                        $isExist = false;
                        if (count($picture) > 0) {
                            foreach ($picture as $item) {
                                if ($i == $item->order) {
                                    showImg('uploads/' . $item->picture, $i);
                                    $isExist = true;
                                }
                            }
                        }
                        if(!$isExist) {
                            $img = 'assets/images/picture.png';
                            showImg($img, $i);
                        }
                    }
                    function showImg($img, $i)
                    {
                        echo '<div class="form-group text-center" style="padding: 0px 5px;position:relative;">'
                            . '<img class="img_preview" src=\'' . base_url() . $img .'\' '
                            . ' alt="user image" class="online" itemid="' . ($i + 1) . '" '
                            . ' style="height: 100px; width:150px;cursor:pointer;"><br>'
                            . '<input name="img' . ($i + 1) . '" type="file" style="display: none" itemid="' . ($i + 1) . '" accept=".png,.jpg,.bmp,.gif"/>'
                            . '<input name="img' . ($i + 1) . '_del" type="text" style="display: none" itemid="' . ($i + 1) . '"/>'
                            . '<div style="right:0px;top:0;font-size:20px;width:30px;height:30px;line-height:30px;position:absolute;cursor:pointer;background:white;border-radius:30px;" '
                            .' onclick="removeImg('.($i+1).')"><i class="fa fa-close"></i></div>'
                            . '</div>';
                    }

                    ?>
                    <script>
                        $('.img_preview').on('click', function () {
                            var id = $(this).attr('itemid');
                            $('input[name="img' + id + '"]').trigger('click');
                        });
                        $('input[type="file"]').on('change', function () {
                            var id = $(this).attr('itemid');
                            preview_image($('.img_preview[itemid="' + id + '"]'), this.files[0]);
                        });

                        function preview_image(item, file) {
                            var previewer = item;
                            if(!file){
                                previewer.attr({src: '<?=base_url()?>assets/images/picture.png'});
                                return;
                            }
                            var reader = new FileReader();
                            reader.onloadend = function () {
                                previewer.attr('src', reader.result)
                            };

                                reader.readAsDataURL(file);//reads the data as a URL
                        }
                        function removeImg(id){
                            preview_image($('.img_preview[itemid="' + id + '"]'));
                            $('input[name="img'+id+'_del"]').val('-1');
                        }

                    </script>
                </div>

                <div class="row form-inline">
                    <div class="row" style="padding-left: 200px;">
                        <div class="col-xs-12 col-sm-12 form-inline">
                            <input class="btn btn-primary form-control" value="保存" onclick="submit_form()"
                                   style="width: 80px;">
                            <a class="btn btn-default form-control" href="javascript:location.reload();"
                               style="width: 80px;">取消</a>
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
    </section>
</div>
<script src="<?php echo base_url(); ?>assets/dist/jquery.js" type="text/javascript"></script>

<script>
    $(function () {
        var pics = $('input[name="item_pics"]').val();
        if (pics != '') {
            pics = pics.split(',');
            for (var i = 0; i < pics.length; i++) {
                $('.img_preview[itemid="' + (i + 1) + '"]').attr('src', baseURL + pics[i]);
            }
        }
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
</script>

<footer class="main-footer" style="border: none; background-color: #ecf0f5">
    <div class="pull-right hidden-xs" style="opacity: 0;">
        Cloud Shop System | Version 1.0
    </div>
</footer>

<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->

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
</body>
</html>

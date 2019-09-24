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
<style type="text/css">
    .fr-box {
        width: 400px;
        left: 180px;
    }
</style>
<div class="content-wrapper" style="min-height: 100%">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            <span class="head-selected"><?php echo $pageTitle ?>
        </h1>
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div>
                <?php echo form_open_multipart( base_url().'goodsmanage/addgoods');?>
                    <input type="hidden" name="id" value="<?php echo isset($goods)?$goods[0]->id:''; ?>" />
                    <div class="row form-inline">
                        <label> *商品名称 : </label>
                        <div class="input-group margin">
                            <input name="name" type="text" id="barcode" class="form-control"
                                   value="<?php echo ($goods!=null) ? $goods[0]->name : ''; ?>"
                                   style="margin: 0 ; padding: 0px 20px;" disabled/>
                        </div>

                    </div>
                    <div class="row form-inline">
                        <label> *消耗蜂蜜 : </label>
                        <div class="input-group margin">
                            <input name="price" type="text" id="product_name" class="form-control"
                                   value="<?php echo ($goods!=null) ? $goods[0]->cost : ''; ?>" disabled />
                        </div>
                        <div class="input-group margin">ml</div>
                    </div>
                    <div class="row form-inline">
                        <label> 开始兑换时间 : </label>
                        <div class="input-group margin">
                            <input id="endTime" name="endTime" class="datepicker-inline form-control" size="16"
                                   placeholder="请选择"
                                   type="text" value="<?php echo ($goods!=null) ? $goods[0]->end_time : ''; ?>" disabled>
                        </div>
                    </div>
                    <div class="row form-inline">
                        <label> *商品详情 : </label>
                        <div class="input-group margin">
                            <textarea name="contents" style="width: 400px; height: 200px;" disabled><?php echo ($goods!=null) ? $goods[0]->comment : ''; ?></textarea>
                        </div>
                    </div>
                    <div class="row form-inline">
                        <label> *商品封面 : </label>

                        <div class="input-group margin">
                            <?php
                            $product_logo = ($goods!=null) ? base_url().'uploads/'.$goods[0]->avatar : 'assets/images/picture.png';
                            ?>
                            <img id="product_logo_image" src="<?php echo  $product_logo; ?>"
                                 alt="user image" class="online"
                                 style="height: 200px; width:320px; padding: 20px; padding-bottom:2px;""><br>
                            <input id="upload_product_logo" name="file[]" type="file" style="display: none"/>
                        </div>
                    </div>
                    <div class="row form-inline">
                        <label> *商品图片 : </label>
                            <?php
                            $product_image = ($goods!=null) ? base_url().'uploads/'.$goods[0]->pic : 'assets/images/picture.png';
                            ?>
                        <div id="product_imgs_content" class="input-group margin">
                                <img id="product_image"
                                             src="<?php echo  $product_image; ?>"
                                             alt="user image" class="online"
                                             style="height: 190px; width:375px; padding: 20px; padding-bottom:2px;"><br>
                                <input id="upload_product_imgs" name="file[]" type="file" style="display: none"/>
                        </div>
                    </div>

                    <div class="row form-inline">
                        <div class="row" style="padding-left: 200px;">
                            <div class="col-xs-12 col-sm-12 form-inline">
                                <a class="btn btn-default form-control" href="<?php echo base_url(); ?>goods">
                                    <span>返回</span>
                                </a>
                            </div>
                        </div>
                    </div>
                <?php echo "</form>"?>
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


<!-- Course Management JS-->

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
        $('textarea').froalaEditor({
            tabSpaces: 4,
            language: 'zh_cn',
            imageUploadURL: '<?php echo base_url();?>upload_image.php'
        })
    });
</script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/product_manage/goods.js"
        charset="utf-8"></script>


<div class="content-wrapper" style="min-height: 100%">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            <span class="head-selected"><?= $pageTitle; ?>
        </h1>
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div>
                <?php echo form_open_multipart(base_url() . 'usermanage/addNewBossPost'); ?>

                <div class="row form-inline">
                    <label> 认证角色 : </label>
                    <div class="input-group margin">商家</div>
                </div>
                <div class="row form-inline">
                    <label> 认证状态 : </label>
                    <div class="input-group margin">待认领</div>
                </div>
                <div class="row form-inline">
                    <label> 商家名称 : </label>
                    <div class="input-group margin">
                        <input name="site_name" type="text" class="form-control" placeholder="请输入"
                               value="" maxlength="30"
                               style="margin: 0 ; padding: 0px 10px; width: 200px; vertical-align: middle"/>
                    </div>
                    <div class="input-group margin"
                         style="color: red;"><?php if (isset($error_cost)) echo $error_cost; ?></div>
                </div>

                <div class="row form-inline">
                    <label> *运动类型 : </label>
                    <div class="input-group margin" style="width: 500px;vertical-align: top;">
                        <?php
                        $j = 0;
                        foreach ($eventType as $item) {
                            $j++;
                            if ($j == 32) continue;
                            ?>
                            <label style="width: 19%; text-align:left;margin-left:0;margin-right:0;padding:0;"
                                   class="margin">
                                <input type="checkbox" class="site_type_item" itemid="<?= $j - 1 ?>"
                                       onclick="setSiteType(this)" style="margin: 0 5px;"><?= $item; ?>
                            </label>
                        <?php } ?>
                        <input type="text" name="site_type_detail" value="">
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
                    </script>
                </div>

                <div class="row form-inline">
                    <label> *商家地址 : </label>
                    <div class="input-group margin">
                        <input name="address" type="text" class="form-control" placeholder="请选择" readonly
                               onclick="$('.map-select').toggle();"
                               value="" maxlength="50"
                               style="margin: 0 ; padding: 0px 10px; display: inline-block; width:150px;"/>
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
                         style="color: red;"><?php if (isset($error_address)) echo $error_address; ?>
                    </div>
                    <div class="input-group margin"
                         style="color: red;vertical-align: top;">
                        <div class="map-select" style="position: relative; display: none; top: 0;left: 0;width: 600px;height: 310px;">
                            <div id="custom-map-container" style="width:100%;height:100%;"></div>
                            <div class="main-point" style="width: 20px;height:20px; left:50%;top:50%;position: absolute;
                        -webkit-transform: translate(-50%,-50%);-moz-transform: translate(-50%,-50%);
                        -ms-transform: translate(-50%,-50%);-o-transform: translate(-50%,-50%);transform: translate(-50%,-50%);
                        background:rgba(255,255,255,.5);border-radius:50%;pointer-events: none;border:3px solid dodgerblue;">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row form-inline">
                    <div class="row" style="padding-left: 200px;">
                        <div class="col-xs-12 col-sm-12 form-inline">
                            <a class="btn btn-default"
                               href="<?php echo base_url(); ?>usermanage">
                                <span>取消</span>
                            </a>
                            <input class="btn btn-primary" value="确认发布" onclick="submit_form()"
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
<script src="<?php echo base_url(); ?>assets/dist/jquery.js" type="text/javascript"></script>

<script src="https://webapi.amap.com/maps?v=1.3&key=0250860ccb5953fa5d655e8acf40ebb7&plugin=AMap.Geolocation,AMap.DistrictSearch,AMap.CitySearch,AMap.Autocomplete,AMap.PlaceSearch"></script>
<script src="https://webapi.amap.com/ui/1.0/main.js?v=1.0.10"></script>

<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/map.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/user.js" charset="utf-8"></script>

<script>

    $(function () {
        $(".datepicker-inline").datetimepicker({
            format: 'yyyy-mm-dd hh:ii'
        });
    });

</script>

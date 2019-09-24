<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            订单详情
        </h1>
    </section>
    <?php
    $state = array('待发货', '待收货', '交易成功');
    ?>
    <section class="content">
        <div class="container">
            <div class="row custom-info-row">
                <label class="col-sm-2">订单编号:</label>
                <label class="col-sm-3" id="nickname">
                    <?php
                    $no = "";
                    for ($index = 0; $index < (10 - strlen($exchangeDetail[0]->no . "")); $index++)
                        $no = $no . "0";
                    $no = $no . $exchangeDetail[0]->no;
                    echo $no; ?></label>
                <label class="col-sm-1" style="color:red;"
                       id="nickname"><?php echo $state[$exchangeDetail[0]->state]; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">收货人姓名:</label>
                <label class="col-sm-2" id="nickname"><?php echo $exchangeDetail[0]->name; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">收货人电话:</label>
                <label class="col-sm-2  " id="nickname"><?php echo $exchangeDetail[0]->phone; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">收货地址:</label>
                <label class="col-sm-4"
                       id="nickname"><?php echo $exchangeDetail[0]->detail_address; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">商品清单</label>
            </div>
            <div class="row custom-info-row">
                <div class="col-sm-8">
                    <table class="table table-bordered area-result-view">
                        <thead>
                        <tr style="background-color: lightslategrey;">
                            <th>商品名称</th>
                            <th>商品图片</th>
                            <th>蜂蜜数</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody id="content_tbl">
                        <tr>
                            <td><?php echo $exchangeDetail[0]->good_name; ?></td>
                            <td>
                                <img src="<?php if (!empty($exchangeDetail[0]->pic)) echo base_url() . 'uploads/' . $exchangeDetail[0]->pic; ?>"
                                     style="width: 350px; height: 190px;"/>
                            </td>
                            <td><?php echo $exchangeDetail[0]->cost . "ml"; ?></td>
                            <td>
                                <a href="<?php echo base_url() . 'goodsDetail/' . $exchangeDetail[0]->good_id; ?>">查看</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="clearfix"></div>
                </div>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">留言</label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-4" id="nickname"><?php echo $exchangeDetail[0]->comment; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">兑换时间:</label>
                <label class="col-sm-4" id="nickname"><?php echo $exchangeDetail[0]->submit_time; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">发货时间:</label>
                <label class="col-sm-4" id="nickname">
                    <?php if (!empty($exchangeDetail[0]->send_time)) {
                        echo $exchangeDetail[0]->send_time;
                    } else {
                        echo "无";
                    }
                    ?>
                </label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">收货时间:</label>
                <label class="col-sm-4" id="nickname">
                    <?php if (!empty($exchangeDetail[0]->accept_time)) {
                        echo $exchangeDetail[0]->accept_time;
                    } else {
                        echo "无";
                    }
                    ?>
                </label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">物流名称:</label>
                <label class="col-sm-4" id="site_name"><?php echo $exchangeDetail[0]->company; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">物流编号:</label>
                <label class="col-sm-4" id="site_name"><?php echo $exchangeDetail[0]->company_id; ?></label>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-sm-offset-2 custom-course-control-view">
                    <input type="button" class="btn btn-primary" onclick="location.href=baseURL+'exchange';"
                           value="返回"/>
                </div>
            </div>
        </div>
    </section>
</div>


<!-- Course Management JS-->
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/shop.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/jquery.qrcode.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/qrcode.js" charset="utf-8"></script>
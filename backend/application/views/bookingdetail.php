<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            订单详情
        </h1>
    </section>
    <section class="content">
        <div class="container">
            <div class="row custom-info-row">
                <label class="col-sm-2">订单编号:</label>
                <label class="col-sm-4" id="nickname">
                <?php
                $no = "";
                $statusStr = ['进行中','已完成','已取消'];
                for($index = 0; $index < (10 - strlen($bookingDetail[0]->id."")); $index++)
                    $no = $no."0";
                $no = $no.$bookingDetail[0]->id;
                 echo $no; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2" style="font-size: 24px;">活动信息:</label>
            </div>
            <div class="row custom-info-row">
                <div class="col-sm-8">
                    <table class="table table-bordered area-result-view">
                        <thead>
                        <tr style="background-color: lightslategrey;">
                            <th style="width: 400px;">活动名称</th>
                            <th>发起人</th>
                            <th>角色类型</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody id="content_tbl">
                        <tr>
                            <td><?php echo $eventDetail[0]->name; ?></td>
                            <td><?php echo $eventDetail[0]->username; ?></td>
                            <td><?php echo ($eventDetail[0]->role==1)?"商家":"个人"; ?></td>
                            <td><a href="<?php echo base_url().'eventDetail/'.$eventDetail[0]->id; ?>">查看</a></td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="clearfix"></div>
                </div>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2" style="font-size: 24px;">报名信息</label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">昵称:</label>
                <label class="col-sm-4" id="nickname"><?php echo $bookingDetail[0]->nickname; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">电话:</label>
                <label class="col-sm-4" id="nickname"><?php echo $bookingDetail[0]->phone; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">报名人数:</label>
                <label class="col-sm-4" id="nickname"><?php echo intval($bookingDetail[0]->reg_num); ?>人</label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">支付方式:</label>
                <label class="col-sm-4" id="site_name"><?php echo ($bookingDetail[0]->pay_type==0)?"线下支付":"线上支付"; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">应付金额:</label>
                <label class="col-sm-4" id="site_name"><?php echo floatval($bookingDetail[0]->pay_cost); ?>元</label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">优惠金额:</label>
                <label class="col-sm-4" id="site_name"><?php echo floatval($bookingDetail[0]->pay_honey); ?>元</label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">实付金额:</label>
                <label class="col-sm-4" id="site_name"><?php echo floatval($bookingDetail[0]->pay_online); ?>元</label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">订单状态:</label>
                <label class="col-sm-4" id="site_name"><?php echo $statusStr[$bookingDetail[0]->state]; ?></label>
            </div>
           <?php
                if(true || $eventDetail[0]->role == 1){
            ?>
            <div id="tip" class="row custom-info-row">
                <label class="col-sm-2"> 评分:</label>
                <?php
                    $index=0;
                    if($rating!=null){
                        for(; $index<$rating[0]->point;$index++){
                ?>
                <image src="<?php echo base_url().'assets/images/star_full.png';?>" style="width:20px;height:20px;"/>
                <?php
                        }
                    }
                    for(;$index<5;$index++){
                ?>
                <image src="<?php echo base_url().'assets/images/star_blank.png';?>" style="width:20px;height:20px;"/>
                <?php
                    }
                ?>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">内容:</label>
                <label class="col-sm-2"><?php if($rating!=null) echo $rating[0]->comment;?></label>
            </div>
            <div class="row custom-info-row">
            </div>
           <?php
                }
            ?>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-sm-offset-2 custom-course-control-view">
                    <input type="button" class="btn btn-primary" onclick="history.back();"
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
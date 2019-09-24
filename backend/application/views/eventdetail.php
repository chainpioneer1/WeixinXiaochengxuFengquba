<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            <?=$pageTitle;?>
        </h1>
    </section>
    <section class="content">
        <div class="container">
            <div class="row custom-info-row">
                <?php
                    $imgs =explode(',',$eventDetail[0]->pic);
                    $isCancelStr = ['可以','不可以'];
                    foreach($imgs as $pic){
                ?>
                <img class="col-sm-4" id="avatar" src="<?php echo base_url() . "uploads/" . $pic; ?>"/>
                <?php }?>
            </div>
            <?php
            if ($eventDetail[0]->role == 1) {
                ?>
                <div class="row custom-info-row">
                    <label class="col-sm-2">发起商家:</label>
                    <label class="col-sm-4" id="phone"><?php echo $eventDetail[0]->site_name; ?></label>
                </div>
                <div class="row custom-info-row">
                    <label class="col-sm-2">馆主昵称:</label>
                    <label class="col-sm-4" id="site_address"><?php echo $eventDetail[0]->name; ?></label>
                </div>
                <div class="row custom-info-row">
                    <label class="col-sm-2">联系方式:</label>
                    <label class="col-sm-4" id="allow_pic"><?php echo $eventDetail[0]->agent_phone; ?></label>
                </div>
                <?php
            } else {
                ?>
                <div id="tip" class="row custom-info-row">
                    <label class="col-sm-2"> 发起人:</label>
                    <label class="col-sm-4" id="forbidden"><?php echo $eventDetail[0]->name; ?></label>
                </div>
                <div class="row custom-info-row">
                    <label class="col-sm-2">联系方式:</label>
                    <label class="col-sm-4" id="allow_pic"><?php echo $eventDetail[0]->phone; ?></label>
                </div>
            <?php }
            ?>
            <div class="row custom-info-row" style="border-top:1px solid #d0d0d0;"></div>
            <div class="row custom-info-row">
                <label class="col-sm-2">活动名称:</label>
                <label class="col-sm-4" id="nickname"><?php echo $eventDetail[0]->eventName; ?></label>
            </div>

            <div class="row custom-info-row">
                <label class="col-sm-2">活动类型:</label>
                <label class="col-sm-6" id="nickname"><?php echo $eventType[$eventDetail[0]->type]; ?></label>
                <label class="col-sm-1">阅读量:</label>
                <label class="col-sm-2" id="nickname"><?php echo $eventDetail[0]->read_count; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">活动时间:</label>
                <label class="col-sm-6"
                       id="nickname"><?php echo $eventDetail[0]->start_time . " - " . $eventDetail[0]->end_time; ?></label>
                <label class="col-sm-1">点赞数:</label>
                <label class="col-sm-2" id="nickname"><?php echo $favourite_amount; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">活动地点:</label>
                <label class="col-sm-6"
                       id="site_name"><?php echo  $eventDetail[0]->detail_address; ?></label>
                <!--<label class="col-sm-1">转发量:</label>
                <label class="col-sm-2" id="nickname"><?php echo (($shared_amount==null)?'0':$shared_amount); ?></label>-->
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">人数上限:</label>
                <label class="col-sm-4" id="nickname"><?php echo intval($eventDetail[0]->limit); ?>人</label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">每个用户最多报名人数:</label>
                <label class="col-sm-4" id="nickname"><?php echo intval($eventDetail[0]->person_limit); ?>人</label>
            </div>
            <?php
            if ($eventDetail[0]->role == 1) {
                ?>
                <div class="row custom-info-row">
                    <label class="col-sm-2">活动费用:</label>
                    <label class="col-sm-4" id="nickname"><?php echo $eventDetail[0]->cost; ?>元/人</label>
                </div>
                <?php
            }
            ?>
            <div class="row custom-info-row">
                <label class="col-sm-2">活动简介:</label>
                <label class="col-sm-4" id="nickname"><?php echo $eventDetail[0]->comment; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">是否可取消报名:</label>
                <label class="col-sm-4" id="nickname"><?php echo $isCancelStr[1-$eventDetail[0]->isCancel]; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">报名人数:</label>
                <label class="col-sm-4"
                       id="nickname"> <?php echo (count($booking) > 0) ? intval($eventDetail[0]->current_member) . "人" : "无"; ?></label>
            </div>
            <div class="row custom-info-row">
                <div class="col-sm-6">
                    <table class="table table-bordered area-result-view">
                        <thead>
                        <tr style="background-color: lightslategrey;">
                            <th>头像</th>
                            <th style="width: 100px;">姓名</th>
                            <th style="width: 120px;">联系方式</th>
                            <th style="width: 100px;">报名人数</th>
                            <th style="width: 100px;">支付方式</th>
                        </tr>
                        </thead>
                        <tbody id="content_tbl">
                        <?php
                        $pay_type = array("线下支付", "线上支付");
                        if (count($booking) > 0) {
                            foreach ($booking as $booking_element) {
                                echo "<tr>";
                                echo "<td><image src='" . $booking_element->avatar . "' style='width:50px;height:50px;border-radius:50%;'/></td>";
                                echo "<td>" . $booking_element->name . "</td>";
                                echo "<td>" . $booking_element->phone . "</td>";
                                echo "<td>" . $booking_element->reg_num . "</td>";
                                echo "<td>" . $pay_type[$booking_element->pay_type] . "</td>";
                                echo "</tr>";
                            }
                        }
                        ?>
                        </tbody>
                    </table>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-sm-offset-2 custom-course-control-view">
                    <input type="button" class="btn btn-primary" onclick="location.href=baseURL+'eventmanage';"
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
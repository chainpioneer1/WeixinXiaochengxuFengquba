<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            规则管理
        </h1>
    </section>
    <style>
        input{
            width:50px;
            text-align: right;
            padding:
        }
    </style>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="container">
                <form action="<?php echo base_url().'saveRule';?>" method="POST">
                <div class="row">
                    <table class="table area-result-view table-bordered table-hover">
                        <thead>
                        <tr style="background-color: lightslategrey;">
                            <th style="width: 5vw;">序号</th>
                            <th>规则说明</th>
                            <th>数据</th>
                        </tr>
                        </thead>
                            <tr>
                                <td>1</td>
                                <td>商家创建一次活动，每有一个用户报名，可产生蜂蜜数</td>
                                <td><input type="text" name="rule0" value="<?php echo $rule[0]->value;?>"/>&nbsp;&nbsp;ml</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>个人发起活动，如果活动结束后地图上产生蜂蜜，每有一个用户报名，可产生蜂蜜数</td>
                                <td><input type="text" name="rule1" value="<?php echo $rule[1]->value;?>"/>&nbsp;&nbsp;ml</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>地图上，每一罐蜂蜜可采集的次数，单次采蜜量随机</td>
                                <td><input type="text" name="rule2" value="<?php echo $rule[2]->value;?>"/>&nbsp;&nbsp;次</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>后台给定的步数，每步兑换的蜂蜜</td>
                                <td>1步=&nbsp;<input type="text" name="rule3" value="<?php echo $rule[3]->value;?>"/>&nbsp;&nbsp;ml</td>
                            </tr>
                            <tr>
                                <td>5</td>
                                <td>每一次活动，地图上和后花园产蜜的比例</td>
                                <td><input type="text" name="rule4" value="<?php echo $rule[4]->value;?>"/>&nbsp;&nbsp;:&nbsp;&nbsp;<input type="text" name="rule" value="1"/></td>
                            </tr>
                            <tr>
                                <td>6</td>
                                <td>用户每日在地图采集蜂蜜的上限</td>
                                <td><input type="text" name="rule5" value="<?php echo $rule[5]->value;?>"/>&nbsp;&nbsp;ml</td>
                            </tr>
                            <tr>
                                <td>7</td>
                                <td>用户每日在后花园采集蜂蜜的上限</td>
                                <td><input type="text" name="rule6" value="<?php echo $rule[6]->value;?>"/>&nbsp;&nbsp;ml</td>
                            </tr>
                            <tr>
                                <td>8</td>
                                <td>会员资费</td>
                                <td><input type="text" name="rule7" value="<?php echo $rule[7]->value;?>"/>&nbsp;&nbsp;元/月</td>
                            </tr>
                            <tr>
                                <td>9</td>
                                <td>报名赛事和预定场地时，可使用蜂蜜进行优惠支付，最多可以使用的蜂蜜量以及对应钱数</td>
                                <td>
                                    <input type="text" name="rule8" value="<?php echo $rule[8]->value;?>"/>&nbsp;&nbsp;ml可抵
                                    <input type="text" name="rule9" value="<?php echo $rule[9]->value;?>"/>&nbsp;&nbsp;元

                                </td>
                            </tr>
                            <tr>
                                <td>10</td>
                                <td>报名赛事和预订场地时，可使用蜂蜜进行优惠支付，会员最多可以使用的蜂蜜量以及对应钱数</td>
                                <td>
                                    <input type="text" name="rule10" value="<?php echo $rule[10]->value;?>"/>&nbsp;&nbsp;ml可抵
                                    <input type="text" name="rule11" value="<?php echo $rule[11]->value;?>"/>&nbsp;&nbsp;元

                                </td>
                            </tr>
                            <tr>
                                <td>11</td>
                                <td>报名蜂约时，会员可以使用蜂蜜进行优惠支付，每周一次，每次可使用的蜂蜜量以及对应钱数</td>
                                <td>
                                    <input type="text" name="rule12" value="<?php echo $rule[12]->value;?>"/>&nbsp;&nbsp;ml可抵
                                    <input type="text" name="rule13" value="<?php echo $rule[13]->value;?>"/>&nbsp;&nbsp;元

                                </td>
                            </tr>
                            <tr>
                                <td>12</td>
                                <td>商品开始兑换前（     ）分钟，通过微信活动通知提醒用户</td>
                                <td>
                                    <input type="text" name="rule14" value="<?php echo $rule[14]->value;?>"/>&nbsp;&nbsp;min

                                </td>
                            </tr>
                            <tr>
                                <td>13</td>
                                <td>每次签到获得多少蜂蜜</td>
                                <td>
                                    <input type="text" name="rule15" value="<?php echo $rule[15]->value;?>"/>&nbsp;&nbsp;ml

                                </td>
                            </tr>
                            <tr>
                                <td>14</td>
                                <td>用户每天得到的固定步数为</td>
                                <td>
                                    <input type="text" name="rule16" value="<?php echo $rule[16]->value;?>"/>&nbsp;&nbsp;步

                                </td>
                            </tr>
                            <tr>
                                <td>15</td>
                                <td>预定的商家、参加的蜂约、活动专区开始前（   ）分钟，通过微信活动通知提醒用户</td>
                                <td>
                                    <input type="text" name="rule17" value="<?php echo $rule[17]->value;?>"/>&nbsp;&nbsp;min

                                </td>
                            </tr>
                    </table>
                </div>
                <input class="btn btn-primary" type="submit" value="保存"/>
            </form>
            </div>
        </div>
    </section>
</div>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/common.js" charset="utf-8"></script>
</script>

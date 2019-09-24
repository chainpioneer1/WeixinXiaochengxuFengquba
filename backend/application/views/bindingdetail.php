<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            提现详情
        </h1>
    </section>
    <section class="content">
        <div class="container">
            <div class="row custom-info-row">
                <label class="col-sm-2">提现账号:</label>
                <label class="col-sm-2" ><?php echo $bindingDetail[0]->no; ?></label>
                <label class="col-sm-1" style="background-color: red; color:white;" align="center">
               <?php
                    $state = array("提现中", "提现成功", "提现失败");
                    echo $state[$bindingDetail[0]->state]; 
                ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">申请人</label>
                <label class="col-sm-4" ><?php echo $bindingDetail[0]->name; ?></label>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2">账号余额:</label>
                <label class="col-sm-4" ><?php echo $bindingDetail[0]->wallet; ?>元</label>
            </div>
            <div class="row custom-info-row">
                    <table class="table area-result-view table-bordered table-hover">
                        <thead>
                        <tr style="background-color: lightslategrey;">
                            <th>申请金额</th>
                            <th>申请时间</th>
                            <th>到账时间</th>
                            <th>状态</th>
                        </tr>
                        </thead>
                        <tbody>
                        <?php
                            foreach($bindingDetail as $item){
                                echo '<tr>';
                                echo '<td>'.$item->amount.'元</td>';
                                echo '<td>'.$item->submit_time.'</td>';
                                echo '<td>'.$item->binding_time.'</td>';
                                echo '<td>'.$state[$item->state].'</td>';
                                echo '</tr>';
                            }
                        ?>
                        </tbody>
                    </table>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-sm-offset-2 custom-course-control-view">
                    <input type="button" class="btn btn-primary" onclick="location.href=baseURL+'binding';"
                           value="返回"/>
                </div>
            </div>
        </div>
    </section>
</div>

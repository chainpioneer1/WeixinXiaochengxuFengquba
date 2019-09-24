<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            兑换订单列表
        </h1>
        <input id="pageTitle" value="<?php echo $pageTitle ?>" type="hidden">
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <form action="<?php echo base_url(); ?>exchangeListingByFilter" method="POST" id="searchList">
                        <div class="col-xs-12 col-sm-4 form-inline">
                            <div class="form-group">
                                <select class="form-control" id="searchStatus" name="searchStatus">
                                    <option value="0"<?php if ($searchStatus == 0) echo ' selected'; ?>>订单编号</option>
                                    <option value="1"<?php if ($searchStatus == 1) echo ' selected'; ?>>姓名</option>
                                    <option value="2"<?php if ($searchStatus == 2) echo ' selected'; ?>>手机号码</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <input type="text" id="searchName" name="searchName"
                                       value="<?php echo $searchText == 'all' ? '' : $searchText; ?>"
                                       class="form-control"/>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-2 form-inline">
                            <div class="form-group">
                                <select class="form-control" id="searchState" name="searchState">
                                    <option value="10"<?php if ($searchState == 10) echo ' selected'; ?>>订单状态</option>
                                    <option value="0"<?php if ($searchState == 0) echo ' selected'; ?>>待发货</option>
                                    <option value="1"<?php if ($searchState == 1) echo ' selected'; ?>>待收货</option>
                                    <option value="2"<?php if ($searchState == 2) echo ' selected'; ?>>交易完成</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-1 form-inline">
                            <div class="form-group area-search-control-view">
                                <input type="button" class="btn btn-primary searchList"
                                        onclick="exportTable()" value="导出">
                                </input>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-1 form-inline">
                            <div class="form-group area-search-control-view">
                                <input type="submit" class="btn btn-primary searchList" value="查询">
                                </input>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <table class="table area-result-view table-bordered table-hover">
                        <thead>
                        <tr style="background-color: lightslategrey;">
                            <th width="">订单编号</th>
                            <th>姓名</th>
                            <th>手机号码</th>
                            <th>兑换商品</th>
                            <th>消耗蜂蜜</th>
                            <th width="">订单状态</th>
                            <th>提交时间</th>
                            <th width="">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                       <?php
                        $state = array("待发货", "待收货", "交易完成");
                        if (!empty($exchangeList)) {
                            $i = 0;
                            foreach ($exchangeList as $record) {
                                ?>
                                <tr>
                                    <td>
                                    <?php
                                    $no = "";
                                    for($index = 0; $index < (10 - strlen($record->no."")); $index++)
                                        $no = $no."0";
                                    $no = $no.$record->no;
                                     echo $no; ?></td>
                                    <td><?php echo $record->name; ?></td>
                                    <td><?php echo $record->phone; ?></td>
                                    <td><?php echo $record->good_name; ?></td>
                                    <td><?php echo $record->cost."ml"; ?></td>
                                    <td><?php echo $state[$record->state]; ?></td>
                                    <td><?php echo $record->submit_time; ?></td>
                                    <td class="text-center">
                                        <a href="<?php echo base_url().'exchangeDetail/'.$record->no; ?>">
                                            查看 &nbsp;
                                        </a>
                                       <?php 
                                            if($record->state == 0){
                                        ?>
                                        <a data-userid="<?php echo $record->no; ?>" onclick="showConfirm('<?php echo $record->no;?>')">
                                            发货 &nbsp;
                                        </a>
                                       <?php
                                            }
                                        ?>
                                    </td>
                                </tr>
                               <?php
                            }
                        }
                        ?>
                        </tbody>
                    </table>
                    <div class="form-group">
                        <div id="custom-confirm-delete-view" style="display:none;">
                            <div class="form-group">
                                <label>物流信息</label>
                            </div>
                            <div class="form-group">
                                <label>物流名称： </label>
                                <input type="text" id="company" placeholder="请输入物流公司名称"/>
                            </div>
                            <div class="form-group">
                                <label>物流编号： </label>
                                <input type="text" id="company_id" placeholder="请输入物流编号"/>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-default" onclick="$('#custom-confirm-delete-view').hide();">取消</button>
                                <button class="btn btn-primary" onclick="send('<?php echo base_url(); ?>');">确定</button>
                                <div id="exchangeId" style="display: none;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix">
                       <?php echo $this->pagination->create_links(); ?>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/exchange.js" charset="utf-8"></script>
</script>

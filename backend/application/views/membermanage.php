<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            会员购买订单
        </h1>
        <input id="pageTitle" value="<?php echo $pageTitle ?>" type="hidden">
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <form action="<?php echo base_url(); ?>memberListingByFilter" method="POST" id="searchList">
                        <div class="col-xs-12 col-sm-5 form-inline">
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
                                    <option value="10"<?php if ($searchState == 10) echo ' selected'; ?>>会员状态</option>
                                    <option value="1"<?php if ($searchState == 1) echo ' selected'; ?>>使用中</option>
                                    <option value="2"<?php if ($searchState == 2) echo ' selected'; ?>>已过期</option>
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
                <div class="row table-responsive">
                    <table id="contentInfo_tbl" class="table area-result-view table-bordered table-hover">
                        <thead id="header_tbl">
                        <tr style="background-color: lightslategrey;">
                            <th width="">订单编号</th>
                            <th>姓名</th>
                            <th>手机号码</th>
                            <th>金额</th>
                            <th>会员状态</th>
                            <th>到期时间</th>
                            <th>提交时间</th>
                        </tr>
                        </thead>
                        <tbody id="content_tbl">
                        <?php
                        if (!empty($memberList)) {
                            $i = 0;
                            foreach ($memberList as $record) {
                                $no = "";
                                for ($index = 0; $index < (10 - strlen($record->no . "")); $index++)
                                    $no = $no . "0";
                                $no = $no . $record->no;


                                ?>
                                <tr>
                                    <td><?php echo $no; ?></td>
                                    <td><?php echo $record->name; ?></td>
                                    <td><?php echo $record->phone; ?></td>
                                    <td><?php echo $record->cost; ?></td>
                                    <td><?php echo ($record->state == 1) ? "使用中" : "已过期"; ?></td>
                                    <td><?php echo $record->expire_time; ?></td>
                                    <td><?php echo $record->submit_time; ?></td>
                                </tr>
                                <?php
                            }
                        }
                        ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</div>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/common.js" charset="utf-8"></script>

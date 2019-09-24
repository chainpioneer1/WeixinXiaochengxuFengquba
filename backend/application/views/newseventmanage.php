<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            活动专区列表
        </h1>
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <form action="<?php echo base_url(); ?>newseventListingByFilter" method="POST" id="searchList">
                        <div class="col-xs-2 col-sm-4 form-inline">
                            <div class="form-group">
                                <select class="form-control" id="searchStatus" name="searchStatus">
                                    <option value="0"<?php if ($searchStatus == 0) echo ' selected'; ?>>活动名称</option>
                                    <option value="1"<?php if ($searchStatus == 1) echo ' selected'; ?>>发起人</option>
                                    <option value="2"<?php if ($searchStatus == 2) echo ' selected'; ?>>联系方式</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <input type="text" id="searchName" name="searchName"
                                       value="<?php echo $searchText == 'all' ? '' : $searchText; ?>"
                                       class="form-control"/>
                            </div>
                        </div>
                        <div class="col-xs-2 col-sm-1 form-inline">
                            <div class="form-group">
                                <select class="form-control" id="searchType" name="searchType">
                                    <option value="100"<?php if ($searchType == 100) echo ' selected'; ?>>活动类型</option>
                                    <?php
                                    for ($index = 0; $index < count($eventType); $index++) {
                                        ?>
                                        <option value="<?php echo $index; ?>" <?php if ($searchType == $index) echo ' selected'; ?>><?php echo $eventType[$index]; ?></option>
                                        <?php
                                    }
                                    ?>
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-2 col-sm-1 form-inline">
                            <div class="form-group">
                                <select class="form-control" id="searchRole" name="searchRole">
                                    <option value="10"<?php if ($searchRole == 10) echo ' selected'; ?>>角色类型</option>
                                    <option value="2"<?php if ($searchRole == 0) echo ' selected'; ?>>个人</option>
                                    <option value="1"<?php if ($searchRole == 1) echo ' selected'; ?>>商家</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-2 col-sm-1 form-inline">
                            <div class="form-group">
                                <select class="form-control" id="searchState" name="searchState">
                                    <option value="10"<?php if ($searchState == 10) echo ' selected'; ?>>活动状态</option>
                                    <option value="0"<?php if ($searchState == 0) echo ' selected'; ?>>进行中</option>
                                    <option value="1"<?php if ($searchState == 1) echo ' selected'; ?>>已完成</option>
                                    <option value="2"<?php if ($searchState == 2) echo ' selected'; ?>>已取消</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-1 col-sm-1 form-inline">
                            <div class="form-group area-search-control-view">
                                <a class="btn btn-primary searchList"
                                   onclick="$('#searchList').submit();">查询
                                </a>
                            </div>
                        </div>
                        <div class="col-xs-1 col-sm-1 form-inline">
                            <div class="form-group area-search-control-view">
                                <input type="button" class="btn btn-primary searchList"
                                       onclick="exportTable()" value="导出">
                                </input>
                            </div>
                        </div>
                        <div class="col-xs-1 col-sm-1 form-inline">
                            <div class="form-group area-search-control-view">
                                <a class="btn btn-primary" href="<?= base_url('newseventmanage/addItem') ?>"
                                   onclick="">新增
                                </a>
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
                            <th>序号</th>
                            <th>赛事名称</th>
                            <th>比赛时间</th>
                            <th>类型</th>
                            <th>报名截止时间</th>
                            <th>报名费</th>
                            <th>已报名人数</th>
                            <th>赛事状态</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <?php
                        if (!empty($eventList)) {
                            $i = 0;
                            $eventRole = array('', '商家', '个人');
                            $eventState = array('进行中', '已完成', '已取消');
                            foreach ($eventList as $record) {
                                $i++;
                                ?>
                                <tr>
                                    <td><?php echo $i; ?></td>
                                    <td><?php echo $record->name; ?></td>
                                    <td><?php echo $record->start_time; ?></td>
                                    <td><?php echo $eventType[($record->type)]; ?></td>
                                    <td><?php echo $record->end_time; ?></td>
                                    <td><?php echo $record->cost; ?></td>
                                    <td><?php echo $record->reg_count; ?></td>
                                    <td><?php echo $eventState[$record->state]; ?></td>
                                    <td class="text-center">
                                        <a href="<?php echo base_url() . 'newseventDetail/' . $record->id; ?>">
                                            活动详情
                                        </a>
                                        <a data-eventid="<?php echo $record->id; ?>"
                                           onclick="confirmDelete('<?php echo $record->id; ?>')">
                                            删除
                                        </a>
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
                                <label>是否删除？</label>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-default" onclick="$('#custom-confirm-delete-view').hide();">取消
                                </button>
                                <button class="btn btn-primary" onclick="deleteEvent('<?php echo base_url(); ?>');">确定
                                </button>
                                <div id="eventId" style="display: none;"></div>
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
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/common.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/newsevent.js" charset="utf-8"></script>
</script>

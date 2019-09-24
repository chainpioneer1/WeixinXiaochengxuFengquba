<?php
$type = '蜂约';
if ($pageType == 'news') {
    $type = '活动专区';
    if ($is_train == 0)
        $type = '赛事';
    else if($is_train == 1)
        $type = '活动';
}
?>
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <?php
        if ($pageType != 'news') {
            echo '<h1>蜂约列表</h1>';
        } else {
            ?>
            <h1 style="width: auto; display: inline-block;" class="margin">
                <input type="checkbox" itemid="0"
                    <?php if (isset($is_train) && ($is_train == '0' || $is_train == '2')) echo 'checked="checked"'; ?>>
                赛事列表
            </h1>
            <h1 style="width: auto; display: inline-block;" class="margin">
                <input type="checkbox" itemid="1"
                    <?php if (isset($is_train) && ($is_train == '1' || $is_train == '2')) echo 'checked="checked"'; ?>>
                活动列表
            </h1>
            <?php
        }
        ?>
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <form action="<?php echo base_url() . ($pageType == 'news' ? 'news' : ''); ?>eventListingByFilter"
                          method="POST" id="searchList">
                        <div class="col-xs-2 col-sm-4 form-inline">
                            <div class="form-group">

                                <input type="text" name="is_train" hidden class="is_train"
                                       value="<?= (isset($is_train)) ? $is_train : ''; ?>">
                                <select class="form-control" id="searchStatus" name="searchStatus">
                                    <option value="0"<?php if ($searchStatus == 0) echo ' selected'; ?>><?php echo $type; ?>
                                        名称
                                    </option>
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
                                    <option value="100" <?php if ($searchType == 100) echo ' selected'; ?>><?php echo $type; ?>
                                        类型
                                    </option>
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
                        <?php
                        if ($pageType == 'news') {
                            ?>
                            <div class="col-xs-2 col-sm-1 form-inline">
                                <div class="form-group">
                                    <select class="form-control" id="searchState" name="searchState">
                                        <option value="10"<?php if ($searchState == 10) echo ' selected'; ?>><?php echo $type; ?>
                                            状态
                                        </option>
                                        <option value="0"<?php if ($searchState == 0) echo ' selected'; ?>>进行中</option>
                                        <option value="1"<?php if ($searchState == 1) echo ' selected'; ?>>已结束</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-xs-2 col-sm-1 form-inline">
                                <div class="form-group">
                                    <select class="form-control" id="searchRole" name="searchRole">
                                        <option value="10"<?php if ($searchRole == 10) echo ' selected'; ?>>报名状态
                                        </option>
                                        <option value="2"<?php if ($searchRole == 0) echo ' selected'; ?>>进行中</option>
                                        <option value="1"<?php if ($searchRole == 1) echo ' selected'; ?>>已截止</option>
                                    </select>
                                </div>
                            </div>
                            <?php
                        } else {
                            ?>
                            <div class="col-xs-2 col-sm-1 form-inline">
                                <div class="form-group">
                                    <select class="form-control" id="searchRole" name="searchRole">
                                        <option value="10"<?php if ($searchRole == 10) echo ' selected'; ?>>角色类型
                                        </option>
                                        <option value="2"<?php if ($searchRole == 0) echo ' selected'; ?>>个人</option>
                                        <option value="1"<?php if ($searchRole == 1) echo ' selected'; ?>>商家</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-xs-2 col-sm-1 form-inline">
                                <div class="form-group">
                                    <select class="form-control" id="searchState" name="searchState">
                                        <option value="10"<?php if ($searchState == 10) echo ' selected'; ?>><?php echo $type; ?>
                                            状态
                                        </option>
                                        <option value="0"<?php if ($searchState == 0) echo ' selected'; ?>>进行中</option>
                                        <option value="1"<?php if ($searchState == 1) echo ' selected'; ?>>已完成</option>
                                        <option value="2"<?php if ($searchState == 2) echo ' selected'; ?>>已取消</option>
                                    </select>
                                </div>
                            </div>

                            <?php
                        }
                        ?>
                        <div class="col-xs-12 col-sm-6 form-inline" style="margin-top: 10px;">
                            <div class="form-group">
                                <span> <?php echo(($pageType != 'news') ? '新增' : $type); ?>时间 </span>
                                <input id="fromTime" name="searchStart" class="datepicker-inline form-control" size="16"
                                       type="text" value="<?php echo $searchStart; ?>" readonly="">

                                <span> 至 </span>
                                <input id="toTime" name="searchEnd" class="datepicker-inline form-control" size="16"
                                       type="text" value="<?php echo $searchEnd; ?>" readonly="">
                                <input type="button" class="btn btn-primary searchList"
                                       onclick="cleanTime()" value="清除">
                                </input>
                            </div>
                        </div>
                        <div class="col-xs-1 col-sm-3 form-inline">
                            <div class="form-group area-search-control-view">
                                <button class="btn btn-primary searchList"
                                        onclick="searchArea('<?php echo base_url(); ?>');">查询
                                </button>
                            </div>
                        </div>
                        <div class="col-xs-1 col-sm-1 form-inline">
                            <div class="form-group area-search-control-view">
                                <input type="button" class="btn btn-primary searchList"
                                       onclick="exportTable()" value="导出">
                                </input>
                            </div>
                        </div>
                        <?php
                        if ($pageType == 'news') {
                            ?>
                            <div class="col-xs-1 col-sm-1 form-inline">
                                <div class="form-group area-search-control-view">
                                    <a class="btn btn-primary" href="<?php echo base_url('newseventmanage/add'); ?>"
                                       onclick="">新增
                                    </a>
                                </div>
                            </div>
                            <?php
                        }
                        ?>
                    </form>
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <table class="table area-result-view table-bordered table-hover">
                        <thead>
                        <?php if ($pageType == 'news') {
                            ?>
                            <tr style="background-color: lightslategrey;">
                                <th>序号</th>
                                <th style="width: 200px;"><?=$type?>名称</th>
                                <th>比赛时间</th>
                                <th>类型</th>
                                <th>报名截止时间</th>
                                <th>报名费</th>
                                <th>已报名人数</th>
                                <th><?=$type?>状态</th>
                                <th>报名状态</th>
                                <th>操作</th>
                            </tr>
                            <?php
                        } else {
                            ?>
                            <tr style="background-color: lightslategrey;">
                                <th style="width: 200px;">蜂约名称</th>
                                <th>活动类型</th>
                                <th>发起人</th>
                                <th>联系方式</th>
                                <th>角色类型</th>
                                <th width="">蜂约状态</th>
                                <th>新增时间</th>
                                <th width="">操作</th>
                            </tr>
                            <?php
                        }
                        ?>
                        </thead>
                        <tbody>
                        <?php
                        if (!empty($eventList)) {
                            $i = 0;
                            $eventRole = array('', '商家', '个人');
                            $eventState = array('进行中', '已完成', '已取消');
                            $usedState = array('报名中', '已截止');
                            $newsState = array('进行中', '已结束', '已取消');
                            foreach ($eventList as $record) {
                                $i++;
                                if ($pageType == 'news') {
                                    ?>
                                    <tr>
                                        <td><?php echo $i; ?></td>
                                        <td><?php echo $record->name; ?></td>
                                        <td><?php echo $record->start_time.'到<br>'.$record->end_time; ?></td>
                                        <td><?php echo $eventType[($record->type)]; ?></td>
                                        <td><?php echo $record->final_time; ?></td>
                                        <td><?php echo $record->cost; ?></td>
                                        <td><?php echo($record->current_member == '' ? '0' : $record->current_member); ?></td>
                                        <td><?php echo $newsState[$record->state]; ?></td>
                                        <td><?php echo $usedState[$record->is_used]; ?></td>
                                        <td class="text-center">
                                            <a onclick="setOnTop('<?php echo $record->id; ?>')">
                                                置顶
                                            </a>
                                            <a href="<?php echo base_url() . 'newseventDetail/' . $record->id; ?>">
                                                <?=$type?>详情
                                            </a>
                                            <a href="javascript:;" <?= ($record->state==2)?'style="color:grey"':('onclick="confirmDelete('. $record->id.')"')?>>
                                                删除 &nbsp;
                                            </a>
                                        </td>
                                    </tr>
                                    <?php
                                } else { ?>
                                    <tr>
                                        <td><?php echo $record->name; ?></td>
                                        <td><?php echo $eventType[($record->type)]; ?></td>
                                        <td><?php echo $record->agent_name; ?></td>
                                        <td><?php echo $record->phone; ?></td>
                                        <td><?php echo $eventRole[$record->role]; ?></td>
                                        <td><?php echo $eventState[$record->state]; ?></td>
                                        <td><?php echo $record->reg_time; ?></td>
                                        <td class="text-center">
                                            <a href="<?php echo base_url() . 'eventDetail/' . $record->id; ?>">
                                                蜂约详情 &nbsp;
                                            </a>
                                            <a href="javascript:;" <?= ($record->state==2)?'style="color:grey"':('onclick="confirmDelete('. $record->id.')"')?>>
                                                删除 &nbsp;
                                            </a>
                                        </td>
                                    </tr>
                                    <?php
                                }
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
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/event.js" charset="utf-8"></script>
<script>

    $(function () {
        $(".datepicker-inline").datepicker({
            format: 'yyyy-mm-dd'
        });
    });

    function cleanTime() {
        $("#fromTime").val("");
        console.log("here");
        $("#toTime").val("");
    }

    $('input[type="checkbox"]').on('click', function () {
        var is_train1 = $('input[type="checkbox"]')[0].checked;
        var is_train2 = $('input[type="checkbox"]')[1].checked;
        var res = 3;
        if (is_train1 && is_train2)
            res = 2;
        else if (is_train1)
            res = 0
        else if (is_train2)
            res = 1
        $('input[name="is_train"]').val(res);
        $('form').submit();
    })
</script>

<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><?=$pageTitle;?></h1>
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <form action="<?php echo base_url(); ?>messageListingByFilter" method="POST" id="searchList">
                        <div class="col-xs-12 col-sm-6 form-inline">
                            <div class="form-group">
                                <select class="form-control" id="searchStatus" name="searchStatus">
                                    <option value="0"<?php if ($searchStatus == 0) echo ' selected'; ?>>发起人昵称</option>
                                    <option value="1"<?php if ($searchStatus == 1) echo ' selected'; ?>>活动/赛事名称</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <input type="text" id="searchName" name="searchName"
                                       value="<?php echo $searchText == 'all' ? '' : $searchText; ?>"
                                       class="form-control"/>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-4 form-inline">
                            <div class="form-group area-search-control-view">
                                <button class="btn btn-primary searchList"
                                        onclick="">查询
                                </button>
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
                            <th>发表人</th>
                            <th>发表时间</th>
                            <th>活动/赛事名称</th>
                            <th>留言内容</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                       <?php
                        if (!empty($itemList)) {
                            foreach ($itemList as $record) {
                                $no = "";
                                for($index = 0; $index < (10 - strlen($record->no."")); $index++)
                                    $no = $no."0";
                                $no = $no.$record->no;
                                ?>
                                <tr>
                                    <td><?php echo $record->nickname; ?></td>
                                    <td><?php echo $record->submit_time; ?></td>
                                    <td><?php echo $record->name; ?></td>
                                    <td><?php echo $record->comment; ?></td>
                                    <td class="text-center">
                                        <a onclick="confirmDelete('<?php echo $record->no;?>')">
                                            删除 &nbsp;
                                        </a>
                                    </td>
                                </tr>
                               <?php
                            }
                        }
                        ?>
                        </tbody>
                    </table>
                    <div class="clearfix">
                       <?php echo $this->pagination->create_links(); ?>
                    </div>
                    <div class="form-group">
                        <div id="custom-confirm-delete-view" style="display:none;">
                            <div class="form-group">
                                <label>确定删除？</label>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-default" onclick="$('#custom-confirm-delete-view').hide();">取消</button>
                                <button class="btn btn-primary" onclick="deleteUser('<?php echo base_url(); ?>');">确定</button>
                                <div id="feedbackId" style="display: none;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/common.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/feedback.js" charset="utf-8"></script>
</script>

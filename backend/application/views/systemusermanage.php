<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            人员管理
        </h1>
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <form action="<?php echo base_url(); ?>userListing" method="POST" id="searchList">
                        <div class="col-xs-4 col-sm-4 form-inline">
                            <div class="form-group">
                                <select class="form-control" id="searchStatus" name="searchStatus">
                                    <option value="0"<?php if ($searchStatus == 0) echo ' selected'; ?>>账号</option>
                                    <option value="1"<?php if ($searchStatus == 1) echo ' selected'; ?>>姓名</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <input type="text" id="searchName" name="searchText"
                                       value="<?php echo $searchText == 'all' ? '' : $searchText; ?>"
                                       class="form-control pull-right"
                                       placeholder=""/>
                            </div>
                        </div>
                        <div class="col-xs-2 col-sm-2 form-inline">
                            <div class="form-group area-search-control-view">
                                <button class="btn btn-primary searchList"
                                        onclick="searchArea('<?php echo base_url(); ?>');">查询
                                </button>
                            </div>
                        </div>
                    </form>
                    <div class="col-xs-12 box-header">
                        <a class="btn btn-primary" href="<?php echo base_url(); ?>addNew">
                            添加人员
                        </a>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <table class="table area-result-view table-bordered table-hover">
                        <thead>
                        <tr style="background-color: lightslategrey;">
                            <th width="">序号</th>
                            <th>账号</th>
                            <th>姓名</th>
                            <th width="">角色</th>
                            <th width="">新增时间</th>
                            <th width="">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                       <?php
                        if (!empty($userRecords)) {
                            $i = 0;
                            foreach ($userRecords as $record) {
                                $i++;
                                ?>
                                <tr>
                                    <td><?php echo $i; ?></td>
                                    <td><?php echo $record->name; ?></td>
                                    <td><?php echo $record->email; ?></td>
                                    <td><?php echo $record->role; ?></td>
                                    <td><?php echo $record->createdDtm; ?></td>
                                    <td class="text-center">
                                        <a href="<?php echo base_url() . 'editOld/' . $record->userId; ?>">
                                            编辑 &nbsp;
                                        </a>
                                        <a
                                           data-userid="<?php echo $record->userId; ?>"
                                           onclick="confirmDelete('<?php echo $record->userId; ?>')">
                                            删除 &nbsp;
                                        </a>
                                        <a  data-userid="<?php echo $record->userId; ?>"
                                           onclick="confirmPassword('<?php echo $record->userId; ?>')">
                                            重置密码 &nbsp;
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
                                <label>确定删除？</label>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-default" onclick="$('#custom-confirm-delete-view').hide();">取消</button>
                                <button class="btn btn-primary" onclick="deleteUser('<?php echo base_url(); ?>');">确定</button>
                                <div id="userId" style="display: none;"></div>
                            </div>
                        </div>
                        <div id="custom-generate-auth-view" style="display:none;">
                            <div class="form-group">
                                <label>确定要重置密码？</label>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-default" onclick="$('#custom-generate-auth-view').hide();">取消</button>
                                <button class="btn btn-primary" onclick="showPassword();">确定</button>
                            </div>
                        </div>

                        <div id="custom-generate-auth-count-view" style="display:none;">
                            <div class="form-group form-inline">
                                <label>&nbsp;&nbsp;*新密码 &nbsp;: </label>
                                <input id="passwd" type="password"/>
                            </div>
                            <div class="form-group form-inline">
                                <label>*确认密码 &nbsp;:</label>
                                <input id="cpasswd" type="password"/>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-default" onclick="$('#custom-generate-auth-count-view').hide();">取消</button>
                                <button class="btn btn-primary" onclick="resetPassword('<?php echo base_url(); ?>', );">确认</button>
                            </div>
                            <div class="form-group alert-danger" id="alertpwd" style="display: none;"></div>
                        </div>
                        <div id="savingId" style="display: none;"></div>
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
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/sysuser.js" charset="utf-8"></script>

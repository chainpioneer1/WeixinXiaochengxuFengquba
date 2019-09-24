<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            用户列表
        </h1>
        <input id="pageTitle" value="<?php echo $pageTitle ?>" type="hidden">
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <form action="<?php echo base_url(); ?>userListingByFilter" method="POST" id="searchList">
                        <div class="col-xs-12 col-sm-4 form-inline">
                            <div class="form-group">
                                <select class="form-control" id="searchStatus" name="searchStatus">
                                    <option value="0"<?php if ($searchStatus == 0) echo ' selected'; ?>>昵称</option>
                                    <option value="1"<?php if ($searchStatus == 1) echo ' selected'; ?>>姓名</option>
                                    <option value="2"<?php if ($searchStatus == 2) echo ' selected'; ?>>手机号码</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <input type="text" id="searchName" name="searchName"
                                       value="<?php echo $searchText == 'all' ? '' : $searchText; ?>"
                                       class="form-control"/>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-2 form-inline">
                            <div class="form-group">
                                <select class="form-control" id="searchRole" name="searchRole">
                                    <option value="10"<?php if ($searchRole == 10) echo ' selected'; ?>>认证角色</option>
                                    <option value="0"<?php if ($searchRole == 0) echo ' selected'; ?>>无</option>
                                    <option value="1"<?php if ($searchRole == 1) echo ' selected'; ?>>商家</option>
                                    <option value="2"<?php if ($searchRole == 2) echo ' selected'; ?>>个人</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-2 form-inline">
                            <div class="form-group">
                                <select class="form-control" id="searchState" name="searchState">
                                    <option value="10"<?php if ($searchState == 10) echo ' selected'; ?>>认证状态</option>
                                    <option value="0"<?php if ($searchState == 0) echo ' selected'; ?>>未认证</option>
                                    <option value="1"<?php if ($searchState == 1) echo ' selected'; ?>>认证中</option>
                                    <option value="2"<?php if ($searchState == 2) echo ' selected'; ?>>认证通过</option>
                                    <option value="3"<?php if ($searchState == 3) echo ' selected'; ?>>认证未通过</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-2 form-inline">
                            <div class="form-group">
                                <select class="form-control" id="searchForbidden" name="searchForbidden">
                                    <option value="10"<?php if ($searchForbidden == 10) echo ' selected'; ?>>禁用状态
                                    </option>
                                    <option value="0"<?php if ($searchForbidden == 0) echo ' selected'; ?>>未禁用</option>
                                    <option value="1"<?php if ($searchForbidden == 1) echo ' selected'; ?>>已禁用</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-6 form-inline" style="margin-top: 10px;">
                            <div class="form-group">
                                <span> 认证时间 </span>
                                <input id="fromTime" name="fromTime" class="datepicker-inline form-control" size="16"
                                       type="text" value="<?php echo $fromTime; ?>" readonly="">

                                <span> 至 </span>
                                <input id="toTime" name="toTime" class="datepicker-inline form-control" size="16"
                                       type="text" value="<?php echo $toTime; ?>" readonly="">
                                <input type="button" class="btn btn-primary searchList"
                                       onclick="cleanTime()" value="清除">
                                </input>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-2 form-inline">
                            <div class="form-group area-search-control-view" style="margin-top:8px">
                                <input type="button" class="btn btn-primary searchList"
                                       onclick="exportTable()" value="导出">
                                </input>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-1 form-inline">
                            <div class="form-group area-search-control-view" style="margin-top:8px">
                                <input type="submit" class="btn btn-primary searchList" value="查询">
                                </input>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-1 form-inline">
                            <div class="form-group area-search-control-view" style="margin-top:8px">
                                <input type="button" class="btn btn-primary searchList"
                                       onclick="addNewBoss()" value="新增">
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
                            <th width="">序号</th>
                            <th>头像</th>
                            <th>昵称</th>
                            <th>姓名</th>
                            <th>手机号</th>
                            <th>认证角色</th>
                            <th>现有蜂蜜量</th>
                            <th width="">认证时间</th>
                            <th>认证状态</th>
                            <th>禁用状态</th>
                            <th width="">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <?php
                        if (count($userList) > 0) {
                            $i = 0;
                            $userRole = array('无', '商家', '个人');
                            $userState = array('未认证', '认证中', '认证通过', '认证未通过');
                            for ($i = 0; $i < count($userList); $i++) {
                                if ($userList[$i]->no == '0') continue;
                                ?>
                                <tr>
                                <td><?php echo($i + 1); ?></td>
                                <td><?php if ($userList[$i]->avatar) echo '<image src="' . $userList[$i]->avatar . '" style="width:50px; height:50px; border-radius:50%;"/>'; ?></td>
                                <td><?php echo $userList[$i]->nickname; ?></td>
                                <td><?php echo $userList[$i]->name; ?></td>
                                <td><?php echo $userList[$i]->phone; ?></td>
                                <td><?php echo $userRole[$userList[$i]->role]; ?></td>
                                <td><?php echo $userList[$i]->honey . 'ml'; ?></td>
                                <td><?php echo $userList[$i]->reg_time; ?></td>
                                <td><?php echo $userState[$userList[$i]->state]; ?></td>
                                <td><?php echo $userList[$i]->forbidden ? '已禁用' : '未禁用'; ?></td>
                                <td class="text-center">
                                    <a href="<?php echo base_url() . 'userDetail/' . $userList[$i]->no; ?>">
                                        用户详情 &nbsp;
                                    </a>
                                    <a
                                            data-userid="<?php echo $userList[$i]->no; ?>"
                                            onclick="confirmState('<?php echo $userList[$i]->no; ?>',
                                                    '<?php echo $userList[$i]->name; ?>', '<?php echo $userList[$i]->phone; ?>')"><?php if ($userList[$i]->state == 1) echo "审核"; ?>
                                        &nbsp;
                                    </a>
                                    <a data-userid="<?php echo $userList[$i]->no; ?>"
                                       onclick="confirmForbidden('<?php echo $userList[$i]->no; ?>','<?php echo $userList[$i]->forbidden ? "取消禁用" : "禁用"; ?>')"><?php echo ($userList[$i]->forbidden == 1) ? "取消禁用" : "禁用"; ?>
                                        &nbsp;
                                    </a>
                                </td>
                                </tr><?php
                            }
                        }
                        ?>
                        </tbody>
                    </table>
                    <div class="form-group">
                        <div id="custom-confirm-delete-view" style="display:none;">
                            <div class="form-group">
                                <label id="userAction"></label>
                            </div>
                            <div class="form-group" style="margin-top:50px; margin-bottom: 0px;">
                                <button class="btn btn-default" onclick="$('#custom-confirm-delete-view').hide();">取消
                                </button>
                                <button class="btn btn-primary" style="margin-left:2vw;"
                                        onclick="changeForbidden('<?php echo base_url(); ?>');">确定
                                </button>
                                <div id="userId" style="display: none;"></div>
                            </div>
                        </div>
                        <div id="custom-generate-auth-view" style="display:none;">
                            <div class="form-group">
                                <label id="name"></label>
                            </div>
                            <div class="form-group">
                                <label id="phone"></label>
                            </div>
                            <div class="form-group" style="margin-top:50px; margin-bottom: 0px;">
                                <button class="btn btn-default" onclick="changeState(2,'<?php echo base_url(); ?>')">
                                    通过
                                </button>
                                <button class="btn btn-primary" style="margin-left: 2vw;"
                                        onclick="changeState(3,'<?php echo base_url(); ?>')">不通过
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"><?php echo $this->pagination->create_links(); ?>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/common.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/user.js" charset="utf-8"></script>

<script type="text/javascript">
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
</script>

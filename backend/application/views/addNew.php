<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>添加人员</h1>
    </section>

    <section class="content">
        <div class="container">
            <div class="row">
                <!-- left column -->
                <div class="col-md-4">
                    <!-- form start -->
                    <form role="form" id="addUser" action="<?php echo base_url(); ?>addNewUser" method="post">
<!--                        <form role="form" id="addUser" action="" method="">-->
                            <div class="box-body">
                                <div class="row">
                                    <div class="col-md-12 form-inline">
                                        <div class="form-group" style="margin-bottom: 10px;">
                                            <label for="fname">&nbsp;&nbsp;&nbsp;*账 号 &nbsp;:&nbsp;</label>
                                            <input type="text" class="form-control required fname" id="fname"
                                                   name="fname"
                                                   value="<?php echo isset($fname) ? $fname : ''; ?>">
                                        </div>
                                    </div>
                                    <div class="col-md-12 form-inline">
                                        <div class="form-group" style="margin-bottom: 10px;">
                                            <label for="email">&nbsp;&nbsp;&nbsp;*姓 名 &nbsp;:&nbsp;</label>
                                            <input type="text" class="form-control required" id="email" name="email" value="<?php echo isset($email) ? $email : ''; ?>">
                                        </div>

                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12 form-inline">
                                        <div class="form-group" style="margin-bottom: 10px;">
                                            <label for="password">&nbsp;&nbsp;&nbsp;*密 码 &nbsp;:&nbsp;</label>
                                            <input type="password" class="form-control required" id="password"
                                                   name="password"
                                                   value="<?php echo isset($password) ? $password : ''; ?>">
                                        </div>
                                    </div>
                                    <div class="col-md-12 form-inline">
                                        <div class="form-group" style="margin-bottom: 10px;">
                                            <label for="cpassword">*确认密码 &nbsp;:&nbsp;</label>
                                            <input type="password" class="form-control required equalTo" id="cpassword"
                                                   name="cpassword"
                                                   value="<?php echo isset($cpassword) ? $cpassword : ''; ?>">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12 form-inline">
                                        <div class="form-group" style="margin-bottom: 10px;">
                                            <label for="role">*用户角色 &nbsp;:&nbsp;</label>
                                            <select class="form-control required" id="role" name="role">
                                               <?php
                                                if (!empty($roles)) {
                                                    $i = 0;
                                                    foreach ($roles as $rl) {
                                                        $i++;
                                                        ?>
                                                        <option <?php echo isset($roleId) ? ($rl->roleId == 1 ? 'selected' : '') : ''; ?> value="<?php echo $rl->roleId; ?>"><?php echo $rl->role ?></option>
                                                       <?php
                                                    }
                                                }
                                                ?>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.box-body -->

                            <div class="">
                                <input type="submit" class="btn btn-primary" value="确认" style="margin-left:150px;"/>
                                <input type="reset" class="btn btn-default" value="取消"
                                       onclick="cancel('<?php echo base_url(); ?>');" style="margin-left:50px;"/>
                            </div>
                        </form>
                </div>
                <div class="col-md-4">
                   <?php
                    $this->load->helper('form');
                    $error = $this->session->flashdata('error');
                    if ($error) {
                        ?>
                        <div class="alert alert-danger alert-dismissable">
                            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                           <?php echo $this->session->flashdata('error'); ?>
                        </div>
                   <?php } ?>
                   <?php
                    $success = $this->session->flashdata('success');
                    if ($success) {
                        ?>
                        <div class="alert alert-success alert-dismissable" style="display:none;">
                            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                            <input type="text" value="<?php echo $this->session->flashdata('success'); ?>"
                                   id="success_message" style="display:none;">
                        </div>
                   <?php } ?>

                    <div class="row">
                        <div class="col-md-12">
                           <?php echo validation_errors('<div class="alert alert-danger alert-dismissable">', ' <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button></div>'); ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

</div>
<script src="<?php echo base_url(); ?>assets/js/addUser.js" type="text/javascript"></script>
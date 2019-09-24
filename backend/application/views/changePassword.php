<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>修改密码</h1>
    </section>
    <section class="content">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <!-- general form elements -->
                    <div class="">
                        <!-- form start -->
                        <form role="form" action="<?php echo base_url() ?>changePassword" method="post">
                            <div class="form-group form-inline">
                                <label for="inputPassword1">&nbsp;&nbsp;旧密码 &nbsp; : &nbsp; </label>
                                <input type="password" class="form-control" id="inputOldPassword"
                                       placeholder="" name="oldPassword" maxlength="10"
                                       value="<?php echo isset($oldpwd) ? $oldpwd : ''; ?>" required>
                            </div>
                            <div class="form-group form-inline">
                                <label for="inputPassword1">&nbsp;&nbsp;新密码 &nbsp; : &nbsp; </label>
                                <input type="password" class="form-control" id="inputPassword1"
                                       placeholder="" name="newPassword" maxlength="10"
                                       value="<?php echo isset($newpwd) ? $newpwd : ''; ?>" required>
                            </div>
                            <div class="form-group form-inline">
                                <label for="inputPassword2">确认密码 &nbsp; : &nbsp; </label>
                                <input type="password" class="form-control" id="inputPassword2"
                                       placeholder="" name="cNewPassword" maxlength="10"
                                       value="<?php echo isset($cnewpwd) ? $cnewpwd : ''; ?>" required>
                            </div>
                            <!-- /.box-body -->

                            <div class="form-group form-inline" style="text-align: center">
                                <input type="submit" class="btn btn-primary" value="确定"/>
                                <input type="reset" class="btn btn-default " value="Reset" style="display: none"/>
                            </div>
                        </form>
                    </div>
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
                        <div class="alert alert-success alert-dismissable">
                            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                           <?php echo $this->session->flashdata('success'); ?>
                        </div>
                   <?php } ?>

                   <?php
                    $noMatch = $this->session->flashdata('nomatch');
                    if ($noMatch) {
                        ?>
                        <div class="alert alert-warning alert-dismissable">
                            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                           <?php echo $this->session->flashdata('nomatch'); ?>
                        </div>
                   <?php } ?>

                    <div class="row">
                        <div class="col-md-12">
                           <?php echo validation_errors('<div class="alert alert-danger alert-dismissable">',
                                ' <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button></div>'); ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
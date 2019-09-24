<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>登录</title>
    <link rel="shortcut icon" href="<?php echo base_url(); ?>assets/images/logo.png" type="image/x-icon"/>
    <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
    <link href="<?php echo base_url(); ?>assets/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
    <link href="<?php echo base_url(); ?>assets/dist/css/AdminLTE.min.css" rel="stylesheet" type="text/css"/>

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body class="login-page">
<div class="login-box">
    <!--
    <div class="login-logo">
       <a ><b>CodeInsect</b><br>Admin System</a>
     </div>/.login-logo
     -->
    <div class="login-box-body">
       <?php $this->load->helper('form'); ?>
        <div class="row">
            <div class="col-md-12">
               <?php echo validation_errors('<div class="alert alert-danger alert-dismissable">',
                    ' <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button></div>'); ?>
            </div>
        </div>
       <?php
        $this->load->helper('form');
        $error = $this->session->flashdata('error');
        if ($error) {
            ?>
            <div class="alert alert-danger alert-dismissable">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
               <?php echo $error; ?>
            </div>
       <?php }
        $success = $this->session->flashdata('success');
        if ($success) {
            ?>
            <div class="alert alert-success alert-dismissable">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
               <?php echo $success; ?>
            </div>
       <?php } ?>

        <form action="<?php echo base_url(); ?>loginme" method="post">
            <div class="form-group has-feedback">
                <input type="account" class="form-control" placeholder="账号" name="account" required autocomplete="on"/>
                <span class="glyphicon glyphicon-user form-control-feedback"></span>
            </div>

            <div class="form-group has-feedback">
                <input type="password" class="form-control" placeholder="密码" name="password" required
                       autocomplete="on"/>
                <span class="glyphicon glyphicon-lock form-control-feedback"></span>
            </div>
            <div class="form-group has-feedback">
                <input id='rememberMe' type="checkbox" name="vehicle" value=""/> 记住密码
            </div>
            <div class="row">
                <div class="col-xs-offset-1 col-xs-10">
                    <input type="submit" class="btn btn-primary btn-block btn-flat" value="登录"/>
                </div>
                <!-- /.col -->
            </div>
        </form>

    </div>
    <!-- /.login-box-body -->
</div>
<!-- /.login-box -->

<script src="<?php echo base_url(); ?>assets/js/jQuery-2.1.4.min.js"></script>
<script src="<?php echo base_url(); ?>assets/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script type="text/javascript">
    $(document).ready(function () {
        document.getElementById('rememberMe').checked=JSON.parse(localStorage.getItem('rememberMe'));
        if(localStorage.getItem('rememberMe')=='false') {
            setTimeout(function () {
                $("[name='password']").val('')
            },500)
        }

        $("[name='vehicle']").on('click',function () {
            localStorage.setItem('rememberMe',JSON.stringify(document.getElementById('rememberMe').checked))
        })

        $("[name='account']").on('input',function () {
            if(localStorage.getItem('rememberMe')=='true')
                $("[name='password']").val(localStorage.getItem($("[name='account']").val()))
            else
                $("[name='password']").val('')

        })
        $("[type='submit']").on('click',function () {
            if(localStorage.getItem('rememberMe')=='true')
                localStorage.setItem($("[name='account']").val(),$("[name='password']").val())
            else
                localStorage.removeItem($("[name='account']").val())

        })
    })
</script>
</body>
</html>
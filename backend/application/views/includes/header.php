<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title><?php echo $pageTitle; ?></title>
    <link rel="shortcut icon" href="<?php echo base_url(); ?>assets/images/logo.png" type="image/x-icon"/>
    <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
    <!-- Bootstrap 3.3.4 -->
    <link href="<?php echo base_url(); ?>assets/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
    <!-- FontAwesome 4.3.0 -->
    <link href="<?php echo base_url(); ?>assets/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
    <link rel="stylesheet" href="<?php echo base_url(); ?>assets/plugins/iCheck/all.css">
    <link rel="stylesheet" href="<?php echo base_url(); ?>assets/plugins/colorpicker/bootstrap-colorpicker.min.css">
    <link rel="stylesheet" href="<?php echo base_url(); ?>assets/plugins/timepicker/bootstrap-timepicker.min.css">
    <link rel="stylesheet" href="<?php echo base_url(); ?>assets/plugins/datetimepicker/bootstrap-datetimepicker.css">

    <link rel="stylesheet" href="<?php echo base_url(); ?>assets/plugins/select2/select2.min.css">
    <link href="<?php echo base_url(); ?>assets/dist/css/AdminLTE.min.css" rel="stylesheet">
    <link href="<?php echo base_url(); ?>assets/plugins/datepicker/bootstrap-datepicker3.min.css" rel="stylesheet">
    <link href="<?php echo base_url(); ?>assets/plugins/datepickk/datepickk.css" rel="stylesheet">
    <!-- AdminLTE Skins. Choose a skin from the css/skins
         folder instead of downloading all of them to reduce the load. -->
    <link href="<?php echo base_url(); ?>assets/dist/css/skins/_all-skins.css" rel="stylesheet">
    <link href="<?php echo base_url(); ?>assets/dist/css/custom.css" rel="stylesheet">

    <style>
        .error {
            color: red;
            font-weight: normal;
        }
    </style>
    <!-- jQuery 2.1.4 -->
    <script src="<?php echo base_url(); ?>assets/js/jQuery-2.1.4.min.js"></script>
    <script src="<?php echo base_url(); ?>assets/bootstrap/js/bootstrap.min.js"></script>

</head>
<body id="main_page_body" class="skin-blue sidebar-mini">
<div>
</div>
<div class="wrapper">

    <header class="main-header">
        <!-- Logo -->
        <a href="<?php echo base_url(); ?>" class="logo">
            <!-- mini logo for sidebar mini 50x50 pixels -->
            <span class="logo-mini"><b>蜂</b>体</span>
            <!-- logo for regular state and mobile devices -->
            <span class="logo-lg"><b>蜂体</b></span>
        </a>
        <!-- Header Navbar: style can be found in header.less -->
        <nav class="navbar navbar-static-top" role="navigation">
            <!-- Sidebar toggle button-->
            <a  class="sidebar-toggle" data-toggle="offcanvas" role="button">
                <span class="sr-only">Toggle navigation</span>
            </a>

            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                    <!-- User Account: style can be found in dropdown.less -->
                    <li class="dropdown user user-menu">
                        <a  class="dropdown-toggle" data-toggle="dropdown">
                            <img src="<?php echo base_url(); ?>assets/dist/img/avatar.png" class="user-image"
                                 alt="User Image"/>
                            <span class="hidden-xs"><?php echo $name; ?></span>
                        </a>
                        <ul class="dropdown-menu">
                            <!-- User image -->
                            <li class="user-header">
                                <img src="<?php echo base_url(); ?>assets/dist/img/avatar.png" class="img-circle"
                                     alt="User Image"/>
                                <p>
                                   <?php echo $name; ?>
                                    <small><?php echo $role_text; ?></small>
                                </p>
                            </li>
                            <!-- Menu Footer-->
                            <li class="user-footer">
                                <div class="pull-left">
                                    <a href="<?php echo base_url(); ?>loadChangePass"
                                       class="btn btn-default btn-flat"><i class="fa fa-key"></i>修改密码</a>
                                </div>
                                <div class="pull-right">
                                    <a href="<?php echo base_url(); ?>logout" class="btn btn-default btn-flat"><i
                                                class="fa fa-sign-out"></i>登出</a>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
       <?php
        $menu_acc = isset($menu_access) ? json_decode($menu_access) : '';
        ?>
    </header>
    <!-- Left side column. contains the logo and sidebar -->
    <aside class="main-sidebar">
        <!-- sidebar: style can be found in sidebar.less -->
        <section class="sidebar">
            <!-- sidebar menu: : style can be found in sidebar.less -->
            <ul class="sidebar-menu">
                <li class="treeview"
                    style="<?php echo(($menu_acc != '') ? ($menu_acc->p_10 == '1' ? '' : 'display:none;') : 'display:none'); ?>">
                    <a href="<?php echo base_url(); ?>usermanage">
                        <i class="fa fa-book"></i>
                        <span>用户管理</span>
                    </a>
                </li>
                <li class="treeview"
                    style="<?php echo(($menu_acc != '') ? ($menu_acc->p_20 == '1' ? '' : 'display:none;') : 'display:none'); ?>">
                    <a href="<?php echo base_url(); ?>eventmanage">
                        <i class="fa fa-dashboard"></i>
                        <span>蜂约管理</span>
                    </a>
                </li>
                <li class="treeview"
                    style="<?php echo(($menu_acc != '') ? ($menu_acc->p_20 == '1' ? '' : 'display:none;') : 'display:none'); ?>">
                    <a href="<?php echo base_url(); ?>roombookingmanage">
                        <i class="fa fa-dashboard"></i>
                        <span>订单管理</span>
                    </a>
                </li>
                <li class="treeview"
                    style="<?php echo(($menu_acc != '') ? ($menu_acc->p_20 == '1' ? '' : 'display:none;') : 'display:none'); ?>">
                    <a href="<?php echo base_url(); ?>newseventmanage">
                        <i class="fa fa-dashboard"></i>
                        <span>活动专区管理</span>
                    </a>
                </li>
                <li class="treeview"
                    style="<?php echo(($menu_acc != '') ? ($menu_acc->p_30 == '1' ? '' : 'display:none;') : 'display:none'); ?>">
                    <a href="<?php echo base_url(); ?>bookingmanage">
                        <i class="fa fa-book"></i>
                        <span>蜂约订单管理</span>
                    </a>
                </li>
                <li class="treeview"
                    style="<?php echo(($menu_acc != '') ? ($menu_acc->p_30 == '1' ? '' : 'display:none;') : 'display:none'); ?>">
                    <a href="<?php echo base_url(); ?>message">
                        <i class="fa fa-book"></i>
                        <span>留言管理</span>
                    </a>
                </li>
                <li class="treeview"
                    style="<?php echo(($menu_acc != '') ? ($menu_acc->p_40 == '1' ? '' : 'display:none;') : 'display:none'); ?>">
                    <a href="<?php echo base_url(); ?>member">
                        <i class="fa fa-plane"></i>
                        <span>会员管理</span>
                    </a>
                </li>
                <li class="treeview"
                    style="<?php echo(($menu_acc != '') ? ($menu_acc->p_50 == '1' ? '' : 'display:none;') : 'display:none'); ?>">
                    <a href="<?php echo base_url(); ?>exchange">
                        <i class="fa fa-ticket"></i>
                        <span>兑换管理</span>
                    </a>
                </li>
                <li class="treeview"
                    style="<?php echo(($menu_acc != '') ? ($menu_acc->p_60 == '1' ? '' : 'display:none;') : 'display:none'); ?>">
                    <a href="<?php echo base_url(); ?>binding">
                        <i class="fa fa-th"></i>
                        <span>提现管理</span>
                    </a>
                </li>
                <li class="treeview"
                    style="<?php echo(($menu_acc != '') ? ($menu_acc->p_70 == '1' ? '' : 'display:none;') : 'display:none'); ?>">
                    <a href="<?php echo base_url(); ?>goods">
                        <i class="fa fa-th"></i>
                        <span>商品管理</span>
                    </a>
                </li>
                <li class="treeview"
                    style="<?php echo(($menu_acc != '') ? ($menu_acc->p_80 == '1' ? '' : 'display:none;') : 'display:none'); ?>">
                    <a href="<?php echo base_url(); ?>rating">
                        <i class="fa fa-files-o"></i>
                        <span>评价管理</span>
                    </a>
                </li>
                <li class="treeview"
                    style="<?php echo(($menu_acc != '') ? ($menu_acc->p_90 == '1' ? '' : 'display:none;') : 'display:none'); ?>">
                    <a href="<?php echo base_url(); ?>rulemanage">
                        <i class="fa fa-pie-chart"></i>
                        <span>规则管理</span>
                    </a>
                </li>

                <li class="treeview">
                    <a href="<?php echo base_url(); ?>template">
                        <i class="fa fa-laptop"></i>
                        <span class="pull-left-container">模板管理
                                <i class="fa fa-angle-left pull-right"></i>
                            </span>
                    </a>
                    <ul class="treeview-menu" style="display: none;">
                        <li>
                            <a href="<?php echo base_url(); ?>template/0">
                                <i class="fa fa-users"></i>
                                商家介绍模板
                            </a>
                        </li>
                        <li>
                            <a href="<?php echo base_url(); ?>template/1">
                                <i class="fa fa-users"></i>
                                服务介绍模板
                            </a>
                        </li>
                        <li>
                            <a href="<?php echo base_url(); ?>template/2">
                                <i class="fa fa-users"></i>
                                发布活动模板
                            </a>
                        </li>
                    </ul>
                </li>
               <?php
                if ($role == ROLE_ADMIN) {
                    ?>
                    <li class="treeview">
                        <a href="<?php echo base_url(); ?>userListing">
                            <i class="fa fa-laptop"></i>
                            <span class="pull-left-container">系统管理
                                <i class="fa fa-angle-left pull-right"></i>
                            </span>
                        </a>
                        <ul class="treeview-menu" style="display: none;">
                            <li>
                                <a href="<?php echo base_url(); ?>userListing">
                                    <i class="fa fa-users"></i>
                                    人员管理
                                </a>
                            </li>
                            <li>
                                <a href="<?php echo base_url(); ?>roleListing">
                                    <i class="fa fa-circle-o"></i>
                                    角色管理
                                </a>
                            </li>
                        </ul>
                    </li>
                   <?php
                }
                ?>
                <li class="treeview"
                    style="<?php echo(($menu_acc != '') ? ($menu_acc->p_110 == '1' ? '' : 'display:none;') : 'display:none'); ?>">
                    <a href="<?php echo base_url(); ?>changePassword">
                        <i class="fa fa-files-o"></i>
                        <span>修改密码</span>
                    </a>
                </li>
                <li class="treeview"
                    style="<?php echo(($menu_acc != '') ? ($menu_acc->p_120 == '1' ? '' : 'display:none;') : 'display:none'); ?>">
                    <a href="<?php echo base_url(); ?>alarm">
                        <i class="fa fa-book"></i>
                        <span>系统信息<?php if($news>0){ ?>
                        <span class="badge badge-default">
                        <?php echo $news; ?>
                        </span>
                        <?php } ?></span>
                        
                    </a>
                </li>
            </ul>
            <input id="page_type_name" value="<?php echo isset($page_type_name) ? $page_type_name : ''; ?>"
                   style="display: none;"/>
        </section>
        <!-- /.sidebar -->
    </aside>
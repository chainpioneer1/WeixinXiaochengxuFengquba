<div class="content-wrapper" style="min-height: 100%">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
           <?php echo $pageTitle; ?>
        </h1>
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <input type="text" style="display: none;" id="clicked" value="1"/>
            <div>
                <form role="form" action="<?php echo base_url() ?>bindingConfirmed"
                      method="post">
                    <input name="binding_id" value="<?php echo $bindingDetail[0]->no; ?>" type="hidden"/>
                    <div class="row form-inline">
                        <label>提现账号 : </label>
                        <div class="input-group margin">
                            <span id="barcode"><?php echo $bindingDetail[0]->no; ?></span>
                            <span style="color: white; background-color: red; margin-left: 50px; padding: 5px;">提现中</span>
                        </div>
                    </div>
                    <div class="row form-inline">
                        <label> 持卡人 : </label>
                        <div class="input-group margin">
                            <span id="standard"><?php echo $bindingDetail[0]->name; ?></span>
                        </div>
                    </div>
                    <div class="row form-inline">
                        <label> 身份证号 : </label>
                        <div class="input-group margin">
                            <span id="standard"><?php echo $bindingDetail[0]->id_no; ?></span>
                        </div>
                    </div>
                    <div class="row form-inline">
                        <label> 银行卡号 : </label>
                        <div class="input-group margin">
                            <span id="standard"><?php echo $bindingDetail[0]->credit_no; ?></span>
                        </div>
                    </div>
                    <div class="row form-inline">
                        <label> 银行预留手机号 : </label>
                        <div class="input-group margin">
                            <span id="standard"><?php echo $bindingDetail[0]->bank_phone; ?></span>
                        </div>
                    </div>
                    <div class="row form-inline">
                        <label> 申请金额 : </label>
                        <div class="input-group margin">
                            <span id="standard"><?php echo $bindingDetail[0]->amount; ?></span>
                        </div>
                    </div>
                    <div class="row form-inline">
                        <label> 申请时间 : </label>
                        <div class="input-group margin">
                            <span id="standard"><?php echo $bindingDetail[0]->submit_time; ?></span>
                        </div>
                    </div>
                    <div class="row form-inline">
                        <div class="form-group">
                            <div class="radio form-group">
                                <label>
                                    <input type="radio" name="radio_caro_type" value="1" >
                                    打款成功
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="radio form-group">
                                <label>
                                    <input type="radio" name="radio_caro_type" value="2" >
                                    打款失败
                                </label>
                            </div>
                        </div>
                        <input name="option_status" id="option_status" type="hidden">
                    </div>
                    <div class="row form-inline">
                        <label> *备注 : </label>
                    </div>
                    <div class="row form-inline">
                            <textarea id="comment" name="comment" class="form-control" rows="3" placeholder=""
                                      style="margin-left: 100px; min-width: 400px; max-height: 150px; max-width:400px; "></textarea>
                    </div>

                    <div class="row form-inline">
                        <div class="row" style="padding-left: 200px;">
                            <div class="col-xs-12 col-sm-12 form-inline">
                                <a class="btn btn-default form-control" href="<?php echo base_url(); ?>binding">
                                    <span>返回</span>
                                </a>
                                <input class="btn btn-primary form-control" type="button" value="保存" onclick="OnShowMessage()">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="col-md-3 col-md-offset-7" style="position: absolute; top: 125px">
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
        <div id="confirm_delete" class="modal-dialog text-center" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                            onclick="$('#confirm_delete').hide();">
                        <span aria-hidden="true">×</span></button>
                    <span class="modal-title">提示</span>
                </div>
                <div class="modal-body">
                    <label id="alert_message">是否确认打款成功/打款失败？</label><br><br>
                    <a href="#" class="btn btn-default" onclick="$('#confirm_delete').hide();">取消</a>
                    <a href="#" class="btn btn-primary" onclick="onConfirm();">确定</a>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>

    </section>
</div>


<!-- Course Management JS-->
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/binding.js"
        charset="utf-8"></script>


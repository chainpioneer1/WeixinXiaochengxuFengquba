<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            信息列表
        </h1>
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                        <div class="col-xs-12 col-sm-1 form-inline">
                            <div class="form-group area-search-control-view">
                                <button class="btn btn-primary searchList"
                                        onclick="$('#custom-confirm-delete-view').show()">删除
                                </button>
                            </div>
                        </div>
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <table class="table area-result-view table-bordered table-hover">
                        <thead>
                        <tr style="background-color: lightslategrey;">
                            <th width=""><input id="selectAll" onclick="select()" type="checkbox" value="0"/>全选</th>
                            <th>序号</th>
                            <th>信息类型</th>
                            <th>信息内容</th>
                            <th>状态</th>
                            <th>发起日期</th>
                            <th width="">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                       <?php
                        $alarmType = array('申请','提现','兑换');
                        $alarmContent = array(
                            '发起了身份认证',
                            '发起了提现申请',
                            '在商城兑换了'
                        );
                        if (!empty($alarmList)) {
                            $index = 1;
                            foreach ($alarmList as $record) {
                                ?>
                                <tr>
                                    <td><input class="alarm-select" id="select<?php echo $index; ?>" name="<?php echo $record->no;?>" type="checkbox" value/></td>
                                    <td><?php echo $index; ?></td>
                                    <td><?php echo $alarmType[$record->type]; ?></td>
                                    <td>
                                        <?php
                                            echo (isset($record->nickname)?$record->nickname:'').$alarmContent[$record->type];
                                            if($record->type==2)
                                            {
                                                echo $record->good_name."商品";
                                            }
                                        ?>
                                    </td>
                                    <td><?php echo ($record->is_read==1)?'已读':'未读'; ?></td>
                                    <td><?php echo $record->submit_time; ?></td>
                                    <td class="text-center">
                                        <?php 
                                            if($record->is_read==0){
                                        ?>
                                        <a onclick="readAlarm('<?php echo $record->no;?>','<?php echo base_url();?>')">
                                            阅读 &nbsp;
                                        </a>
                                        <?php
                                            }
                                        ?>
                                    </td>
                                </tr>
                               <?php
                               $index++;
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
                                <button class="btn btn-primary" onclick="deleteAlarm('<?php echo base_url(); ?>');">确定</button>
                                <div id="alarmId" style="display: none;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/common.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/alarm.js" charset="utf-8"></script>
<script type="text/javascript">
    var checked_array = new Array();
    $('#selectAll').on('change',function(){
        if($('#selectAll').is(":checked")){
            $("input").attr('checked', true);
            checked_array = [];
            $("input").each(function(object){
                if($("#select"+object).attr('name')!=null)
                    checked_array.push($("#select"+object).attr('name'));
            });
        }
        else{
            $("input").attr('checked', false);
            checked_array = [];
            console.log(checked_array);
        }
    });
    $("td input").on('change',function(object){
        if(object.currentTarget.checked){
            checked_array.push(object.currentTarget.name);
            console.log(checked_array);
        }
        else
        {
            for(var index = 0; index<checked_array.length; index++){
                if(checked_array[index]==object.currentTarget.name){
                    checked_array.splice(index,1);
                }
            }
            console.log(checked_array.length);
        }
    });
    function deleteAlarm(url)
    {
        $.ajax({
        type: 'POST',
        url: url + 'alarm/deleteAlarm',
        dataType: 'json',
        data: {
            'delete_array': checked_array
        },
        success: function (data, textStatus, jqXHR) {
                location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle errors here
            console.log('ERRORS: ' + textStatus);
            // STOP LOADING SPINNER
        }
    });
    }
</script>


<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            商品列表
        </h1>
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <form action="<?php echo base_url(); ?>goodsListingByFilter" method="POST" id="searchList">
                        <div class="col-xs-12 col-sm-4 form-inline">
                            <div class="form-group">
                                <label>商品名称</label>
                            </div>
                            <div class="input-group">
                                <input type="text" id="searchName" name="searchName"
                                       value="<?php echo $searchText == 'all' ? '' : $searchText; ?>"
                                       class="form-control"/>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-2 form-inline">
                            <div class="form-group">
                                <select class="form-control" id="searchState" name="searchState">
                                    <option value="10"<?php if ($searchState == 10) echo ' selected'; ?>>状态</option>
                                    <option value="0"<?php if ($searchState == 0) echo ' selected'; ?>>已下架</option>
                                    <option value="1"<?php if ($searchState == 1) echo ' selected'; ?>>已上架</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-3 form-inline">
                            <div class="form-group area-search-control-view">
                                <button class="btn btn-primary searchList"
                                        onclick="">查询
                                </button>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-2 form-inline">
                            <a class="btn btn-primary" href="<?php echo base_url(); ?>goodAdd">
                                新增
                            </a>
                        </div>
                    </form>
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <table class="table area-result-view table-bordered table-hover">
                        <thead>
                        <tr style="background-color: lightslategrey;">
                            <th width="">商品名称</th>
                            <th>消耗蜂蜜</th>
                            <th>库存</th>
                            <th>新增时间</th>
                            <th>开始兑换时间</th>
                            <th>状态</th>
                            <th width="">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                       <?php
                        if (!empty($goodsList)) {
                            foreach ($goodsList as $record) {
                                ?>
                                <tr>
                                    <td><?php echo $record->name; ?></td>
                                    <td><?php echo $record->cost; ?></td>
                                    <td><?php echo $record->amount; ?></td>
                                    <td><?php echo $record->add_time; ?></td>
                                    <td><?php echo $record->end_time; ?></td>
                                    <td><?php echo $record->state?"已上架":"已下架"; ?></td>
                                    <td class="text-center">
                                        <a href="<?php echo base_url().'goodsDetail/'.$record->id; ?>">
                                            查看 &nbsp;
                                        </a>
                                       <?php 
                                            if($record->state == 0){
                                        ?>
                                        <a href="<?php echo base_url().'goodsEdit/'.$record->id; ?>">
                                            编辑 &nbsp;
                                        </a>
                                        <a onclick="confirmDelete('<?php echo $record->id; ?>');">
                                            删除 &nbsp;
                                        </a>
                                       <?php
                                            }
                                        ?>
                                        <a onclick="confirmUpDown('<?php echo $record->id; ?>','<?php echo $record->state;?>')">
                                           <?php
                                                echo $record->state?"下架":"上架";
                                            ?> &nbsp;
                                        </a>
                                        <a onclick="confirmAdd('<?php echo $record->id;?>');">
                                            库存 &nbsp;
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
                                <label id="userAction">确定要删除？</label>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-default" onclick="$('#custom-confirm-delete-view').hide();">取消</button>
                                <button class="btn btn-primary" onclick="deleteGood('<?php echo base_url(); ?>');">确定</button>
                                <div id="goodId" style="display: none;"></div>
                            </div>
                        </div>
                        <div id="custom-generate-auth-view" style="display:none;">
                            <div class="form-group">
                                <label id="caption"></label>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-default" onclick="$('#custom-generate-auth-view').hide();">取消</button>
                                <button class="btn btn-primary" onclick="changeState('<?php echo base_url();?>')">确定</button>
                                <div id="state" style="display: none;"></div>
                            </div>
                        </div>
                        <div id="custom-confirm-deploy-view" style="display:none;">
                            <div class="form-group">
                                <label id="name">库存</label>
                                <input id="amount" type="text" placeholder="请输入数量" />
                            </div>
                            <div class="form-group">
                                <button class="btn btn-default" onclick="$('#custom-confirm-deploy-view').hide();">取消</button>
                                <button class="btn btn-primary" onclick="changeAmount('<?php echo base_url();?>')">确定</button>
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
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/goods.js" charset="utf-8"></script>
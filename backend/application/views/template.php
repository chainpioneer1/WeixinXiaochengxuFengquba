<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            <?= $pageTitle; ?>
        </h1>
    </section>
    <style>
        textarea {
            min-width: calc(70vw);
            max-width: calc(70vw);
            min-height:30px;
            text-align: left;
            padding: .5%;
        }
    </style>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="container">
                <form action="<?php echo base_url() . 'saveTemplate'; ?>" method="POST">
                    <div class="row">
                        <input name="template_type" style="display: none" value="<?= $type ?>"/>
                        <table class="table area-result-view table-bordered table-hover">
                            <thead>
                            <tr style="background-color: lightslategrey;">
                                <th>活动类型</th>
                                <th><?= $pageTitle ?></th>
                            </tr>
                            </thead>
                            <tbody>
                            <?php
                            $j=0;
                            foreach ($templates as $item) {
                                ?>
                                <tr>
                                    <td><?=$item->name?></td>
                                    <td>
                                        <textarea name="template<?=$type.$j?>"><?=$item->content?></textarea>
                                    </td>
                                </tr>
                                <?php
                                $j++;
                            }
                            ?>
                        </table>
                    </div>
                    <input class="btn btn-primary" type="submit" value="保存"/>
                </form>
            </div>
        </div>
    </section>
</div>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/common.js" charset="utf-8"></script>
</script>

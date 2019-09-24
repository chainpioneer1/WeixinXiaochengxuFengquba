
<footer class="main-footer" style="border: none; background-color: #ecf0f5">
    <div class="pull-right hidden-xs" style="opacity: 0;">
         Cloud Shop System | Version 1.0
    </div>
</footer>

<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/tbl_pagination.js" charset="utf-8"></script>

<script src="<?php echo base_url(); ?>assets/plugins/select2/select2.full.min.js"></script>
<script src="<?php echo base_url(); ?>assets/plugins/input-mask/jquery.inputmask.js"></script>
<script src="<?php echo base_url(); ?>assets/plugins/input-mask/jquery.inputmask.date.extensions.js"></script>
<script src="<?php echo base_url(); ?>assets/plugins/input-mask/jquery.inputmask.extensions.js"></script>
<!--<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.2/moment.min.js"></script>-->
<script src="<?php echo base_url(); ?>assets/plugins/daterangepicker/daterangepicker.js"></script>
<script src="<?php echo base_url(); ?>assets/plugins/datepicker/bootstrap-datepicker.min.js"></script>
<script src="<?php echo base_url(); ?>assets/plugins/datetimepicker/bootstrap-datetimepicker.js"></script>
<script src="<?php echo base_url(); ?>assets/plugins/datetimepicker/bootstrap-datetimepicker.zh-CN.js"></script>
<script src="<?php echo base_url(); ?>assets/plugins/colorpicker/bootstrap-colorpicker.min.js"></script>
<script src="<?php echo base_url(); ?>assets/plugins/timepicker/bootstrap-timepicker.min.js"></script>
<script src="<?php echo base_url(); ?>assets/plugins/slimScroll/jquery.slimscroll.min.js"></script>
<script src="<?php echo base_url(); ?>assets/plugins/iCheck/icheck.min.js"></script>
<script src="<?php echo base_url(); ?>assets/plugins/fastclick/fastclick.js"></script>
<script src="<?php echo base_url(); ?>assets/dist/js/app.min.js"></script>
<script src="<?php echo base_url(); ?>assets/dist/js/demo.js"></script>

<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->
<script src="<?php echo base_url(); ?>assets/plugins/table2Excel/jquery.table2excel.js" type="text/javascript"></script>
<script src="<?php echo base_url(); ?>assets/js/jquery.validate.js" type="text/javascript"></script>
<script src="<?php echo base_url(); ?>assets/js/validation.js" type="text/javascript"></script>

<script type="text/javascript">
function exportTable(){
    $(".table tbody td").append('<span>&nbsp;</span>');
    $(".table").table2excel({
        exclude: ".noExl",
        name: "Excel Document Name",
        filename: $('#pageTitle').val(),
        fileext: ".xls",
        exclude_img: true,
        exclude_links: true,
        exclude_inputs: true
    });
    $(".table tbody td span").remove();
}
    var baseURL = "<?php echo base_url(); ?>";
    var loginID = "<?php echo $name; ?>";

    var windowURL = window.location.href;
    pageURL = windowURL.substring(0, windowURL.lastIndexOf('/'));
    var x = $('a[href="' + pageURL + '"]');
    x.addClass('active');
    x.parent().addClass('active');
    var y = $('a[href="' + windowURL + '"]');
    y.addClass('active');
    y.parent().addClass('active');

    //Initialize Select2 Elements
    $(".select2").select2();

    //datepicker plugin
    //link
    $('.date-picker').datepicker({
        autoclose: true,
        todayHighlight: true
    });
    $(document).one('ajaxloadstart.page', function (e) {
        autosize.destroy('textarea[class*=autosize]');

        $('.limiterBox,.autosizejs').remove();
        $('.daterangepicker.dropdown-menu,.colorpicker.dropdown-menu,.bootstrap-datetimepicker-widget.dropdown-menu').remove();
    });
    $(document).ready(function () {
        var main_page_width = document.body.clientWidth
            || document.documentElement.clientWidth
            || window.innerWidth;

        if (main_page_width <= 1450)
            $("#main_page_body").addClass("sidebar-collapse");
        else
            $("#main_page_body").removeClass("sidebar-collapse");

         $(window).resize(function () {
            var main_page_width = document.body.clientWidth
                || document.documentElement.clientWidth
                || window.innerWidth;

            if (main_page_width <= 1450)
                $("#main_page_body").addClass("sidebar-collapse");
            else
                $("#main_page_body").removeClass("sidebar-collapse");
        });

    });

</script>
</body>
</html>
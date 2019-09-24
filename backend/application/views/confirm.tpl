<!doctype html>
<html>
<head lang="zh-CN">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!-- Make sure that we can test against real IE8 -->
    <meta http-equiv="X-UA-Compatible" content="IE=8" />
    <title></title>
</head>
<body>

<a href="javascript:callpay();" id="btnOrder">点击支付</a>
</body>
<script type="text/javascript">
    //将数据付给js变量
    var wxJsApiData = {$wxJsApiData};
    function onBridgeReady()
    {
        //格式参考官方文档 https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_7&index=6
        WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                $.parseJSON(wxJsApiData.resultData),
                function(res){
                    if(res.err_msg == "get_brand_wcpay_request:ok" ){
                        window.location.href="/wxpay/paysuccess/"+{$order.sn};
                    }

                }
        );
    }
    function callpay()
    {
        if(!wxJsApiData.resultCode){
            alert(wxJsApiData.resultType+","+wxJsApiData.resultMsg+"!");
            return false;
        }
        if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        }else{
            onBridgeReady();
        }
    }
</script>
</html>
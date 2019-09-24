
<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
	include 'WeixinPay.php';  
$appid='';  
$openid= $_GET['id'];  
$mch_id='';  
$key='';  
$out_trade_no = $mch_id. time();  
$total_fee = $_GET['fee'];  
if(empty($total_fee)) //押金  
{  
    $body = "充值押金";  
    $total_fee = floatval(99*100);  
}  
 else {  
     $body = "充值余额";  
     $total_fee = floatval($total_fee*100);  
 }  
$weixinpay = new WeixinPay($appid,$openid,$mch_id,$key,$out_trade_no,$body,$total_fee);  
$return=$weixinpay->pay();  
  
echo json_encode($return); 
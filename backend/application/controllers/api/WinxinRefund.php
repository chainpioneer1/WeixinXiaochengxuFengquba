<?php

class WinXinRefund{
    protected $SSLCERT_PATH = "/var/www/html/backend/application/controllers/api/apiclient_cert.pem";
    protected $SSLKEY_PATH = "/var/www/html/backend/application/controllers/api/apiclient_key.pem";
    protected $outRefundNo;
    protected $refundFee;
    protected $opUserId = '1234567899';//商户号
    public $appid;  
    public $mch_id;  
    public $key;  
    public $openid;  
    public $outTradeNo;
    public $totalFee;

    function __construct($appid, $mch_id, $openid, $outTradeNo, $totalFee, $outRefundNo, $refundFee, $key)
    {///////////////////////////////////////
        //初始化退款类需要的变量
        $this->appid = $appid;
        $this->mch_id = $mch_id;
        $this->openid = $openid;
        $this->outTradeNo = $outTradeNo;
        $this->totalFee = $totalFee;
        $this->outRefundNo = $outRefundNo;
        $this->refundFee = $refundFee;
        $this->key = $key;
    } 
    public function refund(){
      //对外暴露的退款接口
      $result = $this->wxrefundapi();
      return $result;
    }
    private function wxrefundapi(){
      //通过微信api进行退款流程
      $parma = array(
        'appid'=> $this->appid,
        'mch_id'=> $this->mch_id,
        'nonce_str'=> $this->createNoncestr(),
        'op_user_id'=>$this->mch_id,
        'out_trade_no'=> $this->outTradeNo,
        'out_refund_no'=> $this->outRefundNo,
        'total_fee'=> $this->totalFee,
        'refund_fee'=> $this->refundFee,
      );
      $parma['sign'] = $this->getSign($parma);
      $xmldata = $this->arrayToXml($parma);
      $xmlresult = $this->postXmlSSLCurl($xmldata,'https://api.mch.weixin.qq.com/secapi/pay/refund');
      $result = $this->xmlToArray($xmlresult);
      return $result;
    }

    //作用：产生随机字符串，不长于32位  
    private function createNoncestr($length = 32) {  
        $chars = "abcdefghijklmnopqrstuvwxyz0123456789";  
        $str = "";  
        for ($i = 0; $i < $length; $i++) {  
            $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);  
        }  
        return $str;  
    }  
  
    //需要使用证书的请求
    function postXmlSSLCurl($xml,$url,$second=30)
    {
      $ch = curl_init();
      //超时时间
      curl_setopt($ch,CURLOPT_TIMEOUT,$second);
      //这里设置代理，如果有的话
      //curl_setopt($ch,CURLOPT_PROXY, '8.8.8.8');
      //curl_setopt($ch,CURLOPT_PROXYPORT, 8080);
      curl_setopt($ch,CURLOPT_URL, $url);
      curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,FALSE);
      curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,FALSE);
      //设置header
      curl_setopt($ch,CURLOPT_HEADER,FALSE);
      //要求结果为字符串且输出到屏幕上
      curl_setopt($ch,CURLOPT_RETURNTRANSFER,TRUE);
      //设置证书
      //使用证书：cert 与 key 分别属于两个.pem文件
      //默认格式为PEM，可以注释
      curl_setopt($ch,CURLOPT_SSLCERTTYPE,'PEM');
      curl_setopt($ch,CURLOPT_SSLCERT, $this->SSLCERT_PATH);
      //默认格式为PEM，可以注释
      curl_setopt($ch,CURLOPT_SSLKEYTYPE,'PEM');
      curl_setopt($ch,CURLOPT_SSLKEY, $this->SSLKEY_PATH);
      //post提交方式
      curl_setopt($ch,CURLOPT_POST, true);
      curl_setopt($ch,CURLOPT_POSTFIELDS,$xml);
      $data = curl_exec($ch);
      //返回结果
      if($data){
        curl_close($ch);
        return $data;
      }
      else {
        $error = curl_error($ch);
        echo "curl出错，错误码:$error"."<br>";
        curl_close($ch);
        return false;
      }
    }
//作用：生成签名  
    private function getSign($Obj) {  
        foreach ($Obj as $k => $v) {  
            $Parameters[$k] = $v;  
        }  
        //签名步骤一：按字典序排序参数  
        ksort($Parameters);  
        $String = $this->formatBizQueryParaMap($Parameters, false);  
        //签名步骤二：在string后加入KEY  
        $String = $String . "&key=" . $this->key;  
        //签名步骤三：MD5加密  
        $String = md5($String);  
        //签名步骤四：所有字符转为大写  
        $result_ = strtoupper($String);  
        return $result_;  
    }  

    ///作用：格式化参数，签名过程需要使用  
    private function formatBizQueryParaMap($paraMap, $urlencode) {  
        $buff = "";  
        ksort($paraMap);  
        foreach ($paraMap as $k => $v) {  
            if ($urlencode) {  
                $v = urlencode($v);  
            }  
            $buff .= $k . "=" . $v . "&";  
        }  
        $reqPar;  
        if (strlen($buff) > 0) {  
            $reqPar = substr($buff, 0, strlen($buff) - 1);  
        }  
        return $reqPar;  
    }  
  
    //数组转换成xml  
    private function arrayToXml($arr) {  
        $xml = "<root>";  
        foreach ($arr as $key => $val) {  
            if (is_array($val)) {  
                $xml .= "<" . $key . ">" . arrayToXml($val) . "</" . $key . ">";  
            } else {  
                $xml .= "<" . $key . ">" . $val . "</" . $key . ">";  
            }  
        }  
        $xml .= "</root>";  
        return $xml;  
    }  

    //xml转换成数组  
    private function xmlToArray($xml) {  
  
  
        //禁止引用外部xml实体   
  
  
        libxml_disable_entity_loader(true);  
  
  
        $xmlstring = simplexml_load_string($xml, 'SimpleXMLElement', LIBXML_NOCDATA);  
  
  
        $val = json_decode(json_encode($xmlstring), true);  
  
  
        return $val;  
    }  
}
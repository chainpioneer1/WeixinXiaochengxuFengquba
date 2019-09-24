<?php

class WxWithdraw{
    protected $SSLCERT_PATH = "/var/www/html/backend/application/controllers/api/apiclient_cert.pem";
    protected $SSLKEY_PATH = "/var/www/html/backend/application/controllers/api/apiclient_key.pem";

    public $appid;
    public $secret;
    public $mch_id;
    public $mch_no;
    public $openid;
    public $partner_trade_no;
    public $totalFee;
    public $key;
    function __construct($appid, $secret, $mch_id, $mch_no, $openid, $partner_trade_no, $totalFee, $key){///////////////////////////////////////
      //初始化退款类需要的变量
      $this->appid = $appid;
      $this->secret = $secret;
      $this->mch_id = $mch_id;
      $this->mch_no = $mch_no;
      $this->openid = $openid;
      $this->partner_trade_no = $partner_trade_no;
      $this->totalFee = $totalFee;
      $this->key = $key;
    }
    public function withdraw(){
      //对外暴露的退款接口
      $result = $this->wxwithdrawapi();
      return $result;
    }
    private function wxwithdrawapi(){
      //通过微信api进行退款流程

        $arr = array();
        $arr['mch_appid'] = $this->appid;
        $arr['mchid'] = $this->mch_id;
        $arr['nonce_str'] = $this->createNoncestr(20);//随机字符串，不长于32位
        $arr['partner_trade_no'] = $this->partner_trade_no;//商户订单号
        $arr['openid'] = $this->openid;
        $arr['check_name'] = 'NO_CHECK';//是否验证用户真实姓名，这里不验证
        $arr['amount'] = $this->totalFee;//付款金额，单位为分
        $arr['desc'] = "蜂体提现";//描述信息
        $arr['spbill_create_ip'] = '39.107.226.107';//获取服务器的ip
        $arr['sign'] = $this->getSign($arr);//签名

        $var = $this->arrayToXml($arr);
        $xml = $this->curl_post_ssl('https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers', $var, 30, array(), 1);
        $rdata = simplexml_load_string($xml, 'SimpleXMLElement', LIBXML_NOCDATA);
        $return_code = (string)$rdata->return_code;
        $result_code = (string)$rdata->result_code;
        $return_code = trim(strtoupper($return_code));
        $result_code = trim(strtoupper($result_code));

        if ($return_code == 'SUCCESS' && $result_code == 'SUCCESS') {
            $rdata->status = true;
            $rdata->errmsg = '提现成功';
            $isrr = $rdata;
        } else {
            $rdata->status = false;
            $rdata->errmsg = $rdata->err_code_des;
            $isrr = $rdata;
        }
        return $isrr;
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

    function curl_post_ssl($url, $vars, $second = 30, $aHeader = array())
    {
        $isdir = "/cert/";//证书位置

        $ch = curl_init();//初始化curl

        curl_setopt($ch, CURLOPT_TIMEOUT, $second);//设置执行最长秒数
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//要求结果为字符串且输出到屏幕上
        curl_setopt($ch, CURLOPT_URL, $url);//抓取指定网页
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);// 终止从服务端进行验证
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);//
        curl_setopt($ch, CURLOPT_SSLCERTTYPE, 'PEM');//证书类型
        curl_setopt($ch, CURLOPT_SSLCERT, $isdir . 'apiclient_cert.pem');//证书位置
        curl_setopt($ch, CURLOPT_SSLKEYTYPE, 'PEM');//CURLOPT_SSLKEY中规定的私钥的加密类型
        curl_setopt($ch, CURLOPT_SSLKEY, $isdir . 'apiclient_key.pem');//证书位置
        curl_setopt($ch, CURLOPT_CAINFO, 'PEM');
        curl_setopt($ch, CURLOPT_CAINFO, $isdir . 'rootca.pem');
        if (count($aHeader) >= 1) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $aHeader);//设置头部
        }
        curl_setopt($ch, CURLOPT_POST, 1);//post提交方式
        curl_setopt($ch, CURLOPT_POSTFIELDS, $vars);//全部数据使用HTTP协议中的"POST"操作来发送

        $data = curl_exec($ch);//执行回话
        if ($data) {
            curl_close($ch);
            return $data;
        } else {
            $error = curl_errno($ch);
            echo "call faild, errorCode:$error\n";
            curl_close($ch);
            return false;
        }
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
        $reqPar = '';
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
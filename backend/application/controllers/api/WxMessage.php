<?php

class WxMessage
{
    private $app_id = 'wxea381fb0ca7c2a24';
    private $app_key = 'fengtiWeixin17642518820android12';
    private $app_secret = 'a6209bae994c009eaad5f8da083617af';
    private $openid;
    private $data;

    function __construct($openid, $data)
    {///////////////////////////////////////
        //初始化退款类需要的变量
        $this->openid = $openid;
        $this->data = $data;
    }

    function sendWxMessage()
    {
        $token = $this->getAccessToken();
//        $url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/uniform_send?access_token='.$token;
        $url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='.$token;
        $re = $this->curl_url($url,$this->data);
        return $re;
    }

    /**
     * 获取授权token网页授权
     *
     * @param string $code 通过get_authorize_url获取到的code
     */
    public function getAccessToken()
    {
        $r = file_get_contents("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" . $this->app_id . "&secret=" . $this->app_secret); //返回的是字符串，需要用json_decode转换成数组
        $data = json_decode($r, true);
        return $data['access_token'];
    }


    private function curl_url($url, $json)
    {
        $body = json_encode($json);
        $headers = array("Content-type: application/json;charset=UTF-8", "Accept: application/json", "Cache-Control: no-cache", "Pragma: no-cache");

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $result = curl_exec($ch);
        curl_close($ch);

        return $result;

    }

}


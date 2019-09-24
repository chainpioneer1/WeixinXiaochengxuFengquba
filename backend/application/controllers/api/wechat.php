<?php

class wechat
            {
                  private $app_id = 'wxea381fb0ca7c2a24';
                  private $app_secret = 'fengtiWeixin17642518820android12';
                 private $state='aaaa';
               /**
                 * 获取微信授权链接
                 * 
                 * @param string $redirect_uri 跳转地址
                 * @param mixed $state 参数
                 */
                public function get_authorize_url($redirect_uri = '', $state = '')
                {
                    $redirect_uri = urlencode($redirect_uri);
                    return "https://open.weixin.qq.com/connect/oauth2/authorize?appid={$this->app_id}&redirect_uri={$redirect_uri}&response_type=code&scope=snsapi_userinfo&state={$state}#wechat_redirect";
                }
                 /**
                 * 获取微信openid
                 */
                public function getOpenid($turl)
                {
                    if (!isset($_POST['code'])){
                        //触发微信返回code码
                        
                         $url=$this->get_authorize_url($turl, $this->state);
                        
                        Header("Location: $url");
                        exit();
                    } else {
                        //获取code码，以获取openid
                        $code = $_POST['code'];
                        $access_info = $this->get_access_token($code);
                        return $access_info;
                    }
                    
                }
                /**
                 * 获取授权token网页授权
                 * 
                 * @param string $code 通过get_authorize_url获取到的code
                 */
                public function get_access_token($code = '')
                {
                  $appid=$this->app_id;
                  $appsecret=$this->app_secret;
                  
                    $token_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=".$appid."&secret=".$appsecret."&code=".$code."&grant_type=authorization_code";
                    //echo $token_url;
                    $token_data = $this->http($token_url);
                   // var_dump( $token_data);
                    if($token_data[0] == 200)
                    {
                        $ar=json_decode($token_data[1], TRUE);
                        return $ar;
                    }
                    
                    return $token_data[1];
                }
                
                
                public function http($url, $method='', $postfields = null, $headers = array(), $debug = false)
                {
                    $ci = curl_init();
                    /* Curl settings */
                    curl_setopt($ci, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
                    curl_setopt($ci, CURLOPT_CONNECTTIMEOUT, 30);
                    curl_setopt($ci, CURLOPT_TIMEOUT, 30);
                    curl_setopt($ci, CURLOPT_RETURNTRANSFER, true);
             
                    switch ($method) {
                        case 'POST':
                            curl_setopt($ci, CURLOPT_POST, true);
                            if (!empty($postfields)) {
                                curl_setopt($ci, CURLOPT_POSTFIELDS, $postfields);
                                $this->postdata = $postfields;
                            }
                            break;
                    }
                    curl_setopt($ci, CURLOPT_URL, $url);
                    curl_setopt($ci, CURLOPT_HTTPHEADER, $headers);
                    curl_setopt($ci, CURLINFO_HEADER_OUT, true);
             
                    $response = curl_exec($ci);
                    $http_code = curl_getinfo($ci, CURLINFO_HTTP_CODE);
             
                    if ($debug) {
                        echo "=====post data======\r\n";
                        var_dump($postfields);
             
                        echo '=====info=====' . "\r\n";
                        print_r(curl_getinfo($ci));
             
                        echo '=====$response=====' . "\r\n";
                        print_r($response);
                    }
                    curl_close($ci);
                    return array($http_code, $response);
                }
             
            }


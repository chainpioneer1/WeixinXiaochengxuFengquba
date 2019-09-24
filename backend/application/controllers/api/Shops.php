<?php defined('BASEPATH') OR exit('No direct script access allowed');

require_once('./application/libraries/REST_Controller.php');

/**
 * Shop API controller
 *
 * Validation is missign
 */
class Shops extends REST_Controller
{

    public function __construct()
    {
        parent::__construct();

        $this->load->model('shop_model');
        $this->load->model('auth_model');
        $this->load->model('user_model');
    }

    public function index_get()
    {
        $this->response($this->shop_model->get_all());
    }

    public function find_post($key = '')
    {
        $this->response($this->shop_model->findAreas($key));
    }

    public function edit_post($id = NULL)
    {
        if (!$id) {
            $this->response(array('status' => false, 'error_message' => 'No ID was provided.'), 400);
        }

        $this->response($this->shop_model->getAreaById($id));
    }

    public function save_post($id = NULL)
    {

        if (!$id) {
            $new_id = $this->shop_model->add($this->post());
            $this->response(array('status' => true, 'id' => $new_id, 'message' => sprintf('新增景区成功.', $new_id)), 200);
        } else {
            $this->shop_model->update($this->post(), $id);
            $this->response(array('status' => true, 'message' => sprintf('修改景区成功.', $id)), 200);
        }
    }

    public function saveAccount_post($id = NULL)
    {
        $newShop = $this->post();
        $date_now=new DateTime();
        $newAccount = [
            "email"=>$newShop['phonenumber'],
            "name"=>$newShop['name'],
            "password"=>getHashedPassword($newShop['password']),
            "roleId"=>2, // shop manager
            "isDeleted"=>0, //0-available, 1-deleted
            "createdBy"=>1, // 1- created by admin
            "createdDtm"=>date_format($date_now,"Y-m-d H:i:s"), // 1- created by admin
        ];
        if (!$id) {
            $new_id = $this->user_model->addNewUser($newAccount);
            if($new_id == 0) {
                $this->response(array('status' => false, 'id' => 0, 'message' => sprintf('此账号已存在.', $new_id)), 200);
            }else {
                $new_id = $this->shop_model->add($newShop);
                $this->response(array('status' => true, 'id' => $new_id, 'message' => sprintf('新增商家成功.', $new_id)), 200);
            }
        } else {
            $new_id = $this->user_model->updateUser($newAccount, $newAccount['email']);
            $this->shop_model->update($this->post(), $id);
            $this->response(array('status' => true, 'message' => sprintf('修改商家成功.', $id)), 200);
        }
    }

    public function remove_post($id = NULL)
    {
        $newShop = $this->shop_model->getShopById($id);
        $date_now = new DateTime();
        $newAccount = [
            "email"=>$newShop->phonenumber,
            "name"=>$newShop->name,
            "password"=>getHashedPassword($newShop->password),
            "roleId"=>2, // shop manager
            "isDeleted"=>1, //0-available, 1-deleted
            "createdBy"=>1, // 1- created by admin
            "updatedDtm"=>date_format($date_now,"Y-m-d H:i:s"), // 1- updated by admin
        ];
        if ($this->shop_model->delete($id) && $this->user_model->updateUser($newAccount, $newAccount['email'])) {
            $this->response(array('status' => true, 'message' => sprintf('景区删除成功.', $id)), 200);
        } else {
            $this->response(array('status' => false, 'error_message' => '景区没有了!'), 200);
        }
    }

    public function generateAuth_post($id = NULL)
    {
        $authInfo = $this->post();

        $date = new DateTime();
        $init['code'] = $this->auth_model->getOrderCount($authInfo['shopid']) + 1;
        $init['num'] = $this->auth_model->getCount() + 1;
        $authItem = array(
            "shopid" => $authInfo['shopid'],
            "type" => $authInfo['type'],
            "targetid" => $authInfo['targetid'],
            "status" => $authInfo['status'],
            "price" => '0',
            "codecount" => $authInfo['codecount'],
            "created_time" => $date->format('Y-m-d H:i:s')
        );
        $authid = $this->shop_model->addAuth($authItem);
        for ($i = 0; $i < $authInfo['codecount']; $i++) {
            $date = new DateTime();
            $authOrderItem = array(
                "authid" => sprintf("%d", $authid),
                "value" => sprintf("%'.07d%'.04d", time()%1e7,rand(1000,9999)),
                "userphone" => '0',
                "areaid" => $authInfo['targetid'],
                "status" => '0',
                "code" => sprintf("%'.03d%'.03d%'.06d", rand(100,999), rand(100,999), intval($init['code']) + $i+rand(10000,99999)),
                "ordered_time" => $date->format('Y-m-d H:i:s'),
                "ordertype" => '4'
            );

            $this->shop_model->addAuthOrder($authOrderItem);
        }
        $this->response(array('status' => true, 'message' => sprintf('新增授权码成功.', $authInfo['codecount'])), 200);
    }

    public function generateQR_post($id = NULL)
    {

        $authInfo = $this->post();

        $date = new DateTime();
        $authItem = array(
            "shopid" => $authInfo['shopid'],
            "type" => $authInfo['type'],
            "targetid" => $authInfo['targetid'],
            "created_time" => $date->format('Y-m-d H:i:s'),
            "data" => $authInfo['data']
        );

        $this->shop_model->addQR($authItem);
        $this->response(array('status' => true, 'message' => sprintf('新增二维码成功.')), 200);
    }

////////////////////// External Rest APIs

    public function getMyOrderInfos_post()
    {
        $request = $this->post();
        $id = -1;
        if ($id == -1) $this->response(array('status' => false, 'Orders' => $id), 200);
        else $this->response(array('status' => true, 'Orders' => $id), 200);
    }


}

/* End of file Shops.php */
/* Location: ./application/controllers/api/Shops.php */
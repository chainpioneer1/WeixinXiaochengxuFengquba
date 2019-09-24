<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/basecontroller.php';

/**
 * Class : Shop (ShopController)
 * Area Class to control all shop related operations.
 * @author : The jin hu
 * @version : 1.0
 * @since : 12 August 2017
 */
class bossmanage extends basecontroller
{
    /**
     * This is default constructor of the class
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('user_model');
        $this->load->model('boss_model');
        $this->load->model('room_model');
        $this->load->model('bossgroup_model');
        $this->load->model('rating_model');
        $this->load->model('binding_model');
        $this->load->model('backyard_sign_model');
        $this->load->model('member_state_model');
        $this->isBossLoggedIn();
    }

    /**
     * This function used to load the first screen of the user
     */
    public function index()
    {
        $this->global['title'] = $this->session->userdata('site_name');
        $boss_id = $this->session->userdata('boss_id');
        $user_id = 0;
        $boss_no = 0;

        $this->global['site'] = $this->boss_model->getSiteDetail($boss_id, $user_id, $boss_no);
        $this->global['picture'] = $this->boss_model->getSitePictures($boss_id);
        $this->global['userInfo'] = $this->user_model->getUserDetailById($user_id);

        $this->load->view("bossmanage1", $this->global);
    }

    /**
     * This function used to load the first screen of the user
     */
    public function room()
    {
        $this->global['title'] = $this->session->userdata('site_name');
        $boss_id = $this->session->userdata('boss_id');
        $user_id = 0;
        $boss_no = 0;

        $this->global['site'] = $this->boss_model->getSiteDetail($boss_id, $user_id, $boss_no);
        $this->global['roomData'] = $this->boss_model->getSiteRoomData($boss_id, 'admin');
        $this->global['bossRoom'] = $this->boss_model->getBossBackendRoomData($boss_id);
        $this->global['bookingData'] = $this->boss_model->getSiteBookData($boss_id, $user_id);
        $this->global['userInfo'] = $this->user_model->getUserDetailById($user_id);

        $this->load->view("bossmanage2", $this->global);
    }

    /**
     * This function used to load the first screen of the user
     */
    public function coupon()
    {
        $this->global['title'] = $this->session->userdata('site_name');
        $boss_id = $this->session->userdata('boss_id');
        $user_id = 0;
        $boss_no = 0;

        $this->global['site'] = $this->boss_model->getSiteDetail($boss_id, $user_id, $boss_no);
        $this->global['bossgroup'] = $this->bossgroup_model->getItems(array('boss_id' => $boss_id));
        $this->global['userInfo'] = $this->user_model->getUserDetailById($user_id);

        $this->load->view("bossmanage3", $this->global);
    }

    function updateBossInfo()
    {

        $boss_id = $this->input->post('boss_id');
        $info['site_type_detail'] = $this->input->post('site_type_detail');
        $info['site_introduction'] = $this->input->post('site_introduction');
        $info['site_service'] = $this->input->post('site_service');
		if(count(explode(',',$info['site_type_detail']))>1) $info['site_type'] = 31;
		else $info['site_type'] = $info['site_type_detail'];
		if($info['site_type_detail']=='') {
			$info['site_type']=null;
			$info['site_type_detail'] = null;
		}
        $this->boss_model->addNewBoss($info, $boss_id);

        $upload_root = "uploads/";
        $config['upload_path'] = $upload_root;
        $config['allowed_types'] = '*';
        $this->load->library('upload', $config);

        $fields = ['img1', 'img2', 'img3', 'img4', 'img5', 'ans_img4'];
        $imgs = '';
        $cnt = 0;
        for ($j = 0; $j < 5; $j++) {
            $type = explode('.', $_FILES[$fields[$j]]["name"]);
            $type = $type[count($type) - 1];
            if ($_FILES[$fields[$j]]["name"] != '') {
                //image uploading
                $config['upload_path'] = $upload_root;
                $config['file_name'] = $boss_id . '_' . $fields[$j] . '.' . $type;
                $this->upload->initialize($config, TRUE);
                if (file_exists($upload_root . $config['file_name']))
                    unlink($upload_root . $config['file_name']);
                if ($this->upload->do_upload($fields[$j])) {
                    if ($cnt != 1) $imgs .= ',';
                    $data = $this->upload->data();
                    $img = $config['file_name'];
//			var_dump($img);
                    $this->boss_model->replaceSitePicture($boss_id, $img, $j);
                } else {///show error message
                    $ret['data'] = $this->upload->display_errors();
                    $ret['status'] = 'fail';
                    echo json_encode($ret);
                    return;
                }
            } else if ($this->input->post($fields[$j] . '_del') == '-1') {
                $this->boss_model->replaceSitePicture($boss_id, '', $j);
            }
        }
        redirect('/bossmanage');
    }

    function updateBossRoomInfo()
    {

        $boss_id = $this->input->post('boss_id');
        $info['service_time'] = $this->input->post('service_time');
        $info['service_unit'] = $this->input->post('service_unit');

        $info['start1'] = $this->input->post('startH') . ':' . $this->input->post('startM') . ':00';
        $info['end1'] = $this->input->post('endH') . ':' . $this->input->post('endM') . ':00';
        $info['start2'] = $this->input->post('endH') . ':' . $this->input->post('endM') . ':00';
        $info['end2'] = $this->input->post('endH') . ':' . $this->input->post('endM') . ':00';

        $info['cancel_time'] = $this->input->post('cancel_time');

        $this->boss_model->addNewBoss($info, $boss_id);

        $roomCnt = $this->input->post('roomCnt');

        $roomInfo = null;
        for ($i = 0; $i < $roomCnt; $i++) {
            $roomInfo[$i] = (object)[
                'name' => $this->input->post('name' . $i),
                'cost' => $this->input->post('cost' . $i)
            ];
        }
        $roomData = $this->boss_model->getSiteRoomDataForUpdate($boss_id);
        $isChanged = false;
        $submit_time = '';
        if (count($roomData) > 0) { // if old data is exist
            foreach ($roomData as $oldRoom) {
                $isExist = false;
                if ($roomInfo != null) {
                    foreach ($roomInfo as $item) {
                        if ($oldRoom->room_name == $item->name &&
                            $oldRoom->cost == $item->cost) {
                            $isExist = true;
                            break;
                        }
                    }
                }
                if (!$isExist) {
                    $isChanged = true;
                }
            }
            // if old data are all not changed
            if(!$isChanged) {
//                $submit_time = $roomData[0]->submit_time;
            }
        }
        $updatedRoom = array();
        if ($roomInfo != null) {
            foreach ($roomInfo as $item) {
                $isExist = false;
                if (count($roomData) > 0) {
                    foreach ($roomData as $oldRoom) {
                        if ($oldRoom->room_name == $item->name &&
                            $oldRoom->cost == $item->cost) {
                            $isExist = true;
                            break;
                        }
                    }
                }
                if (!$isExist) {
                    $item->submit_time = $submit_time;
//                    array_push($updatedRoom,$item);
                    $isChanged = true;
                }
            }
        }
        $result = false;
        if ($isChanged) {
//        if (count($updatedRoom)>0) {
//            $result = $this->room_model->updateRoom($boss_id, $updatedRoom, $submit_time);
            $result = $this->room_model->updateRoom($boss_id, $roomInfo, $submit_time);
        }
//        var_dump('<br>isChanged: ', $isChanged);
//        var_dump('<br>roomCount: ',$roomCnt);
//        var_dump('<br>RoomData: ',$roomData);
//        var_dump('<br>RoomInfo: ',$roomInfo);
        redirect('/bossmanage/room');
    }

    public function updateBossGroupInfo()
    {
        $ret = array(
            'data' => '没更新了',
            'status' => 'fail'
        );
        if (!$_POST) {
            echo json_encode($ret);
            return;
        }
        $user_id = $_POST['boss_id'];;
        $bossGroup = $_POST['uploadBossgroupInfo'];
        $bossGroup = json_decode($bossGroup);

        $result = $this->bossgroup_model->getItems(array('boss_id' => $user_id, 'status' => '0'));
        $isUpdate = false;

        if (count($result) != count($bossGroup)) $isUpdate = true;
        if (!$isUpdate) {
            foreach ($bossGroup as $item) {
                $old = $this->bossgroup_model->getItems(array('no' => $item->no));

                if (count($old) <= 0) {
                    $isUpdate = true;
                    break;
                }
                $old = $old[0];
                if ($old->group_name != $item->group_name) $isUpdate = 1;
                if ($old->group_package != $item->group_package) $isUpdate = 2;
                if ($old->group_price != $item->group_price) $isUpdate = 3;
                if ($old->group_inprice != $item->group_inprice) $isUpdate = 4;
                if ($old->start != $item->start) $isUpdate = 5;
                if ($old->end != $item->end) $isUpdate = 6;
                if ($old->group_desc != json_encode($item->group_desc)) $isUpdate = 7;
                if ($old->limit != $item->limit) $isUpdate = 8;
                if ($old->condition != $item->condition) $isUpdate = 9;

                if ($isUpdate) break;
            }
        }
        $updateDate = date('Y-m-d H:i:s');
        if ($isUpdate) {
            $this->bossgroup_model->updateItems(array('boss_id' => $user_id), array('status' => '3'));
            $ii = 0;
            foreach ($bossGroup as $item) {
                $ii++;
                unset($item->isUpdate);
                $item->boss_id = $user_id;
                $item->group_name = '团购' . $ii;
                $item->group_desc = json_encode($item->group_desc);
                $item->update_time = $updateDate;
                $this->bossgroup_model->addNewItem($item, $item->no);
            }
            $ret['data'] = '团购状态已更新';
        }
        $ret['bossgroup'] = $bossGroup;
        $ret['status'] = 'success';
        echo json_encode($ret);
    }

    /*
    * this function is used to upload image
    */
    public function uploadFile()
    {
        $ret = array(
            'data' => '操作失败',
            'status' => 'fail'
        );
        if (!$_POST) {
            echo json_encode($ret);
            return;
        }

        $filename = $_POST['filename'];
        $ext = explode('.', $filename);
        $ext = $ext[count($ext) - 1];
        if (isset($_FILES['uploadImg']['name'])) {
            $config['upload_path'] = './uploads/';
            $config['allowed_types'] = '*';
            $config['remove_spaces'] = true;
            $config['max_size'] = 10000;
            $config['encrypt_name'] = true;
            $tt = date('0ymdHis0') . rand(1000, 9999);
            $config['file_name'] = $tt . '.' . $ext;
            $this->load->library('upload', $config);
            if (!$this->upload->do_upload('uploadImg')) {
                $ret['data'] = $this->upload->display_errors();
                echo json_encode($ret);
                return;
            } else {
                $book = $this->upload->data();
                $ret['data'] = $book["file_name"];
                $ret['status'] = 'success';
            }
        }
        echo json_encode($ret);
    }

    /**
     * This function is used to load the user list by search
     */
    function updateUserState()
    {
        $userId = $this->input->post('userId');
        $state = $this->input->post('state');
        $userInfo = array('state' => $state);
        $alarm['user_id'] = $userId;
        $alarm['type'] = (($state == 2) ? 6 : 7);
        $alarm['submit_time'] = date("Y-m-d H:i:s");
        $this->load->model("alarm_user_model");
        $this->alarm_user_model->addAlarm($alarm);
        $result = $this->user_model->updateStateById($userId, $userInfo);
        if ($result > 0) {
            $this->session->set_flashdata('success', '修改密码成功.');
            echo(json_encode(array('status' => TRUE)));
        } else {
            $this->session->set_flashdata('error', '修改密码失败.');
            echo(json_encode(array('status' => FALSE)));
        }
    }

    function addNewUser()
    {
        $now = time();
        $info['reg_time'] = mdate("%Y-%m-%d %h:%i:%a", $now);
        $info['role'] = $this->input->post('role');
        $info['name'] = $this->input->post('name');
        $info['phone'] = $this->input->post('phone');
        $userId = $this->user_model->addNewUser($info);
        if ($info['role'] == 1) {
            $boss['site_name'] = $this->input->post('site_name');
            $boss['allow_pic'] = $this->input->post('allow_pic');
            $boss['id_no'] = $this->input->post('id_no');
            $boss['id_pic1'] = $this->input->post('id_pic1');
            $boss['id_pic2'] = $this->input->post('id_pic2');
            $boss['site_address'] = $this->input->post('address1') . $this->input->post('address2')
                . $this->input->post('address3') . $this->input->post('address4');
            $boss['boss_id'] = $userId;
            $this->load->model('boss_model');
            $this->boss_model->addNewBoss($boss);
        }
        if ($userId != null) {
            $this->session->set_flashdata('success', '新增成功.');
            echo(json_encode(array('status' => TRUE, 'registration' => true)));
        } else {
            $this->session->set_flashdata('error', '新增失败.');
            echo(json_encode(array('status' => FALSE, 'registration' => false)));
        }
    }

    function addNewBossUser()
    {
        $this->global['pageTitle'] = "新增商家";
        $this->loadViews("useradd", $this->global, NULL);
    }

    function addNewBossPost()
    {
        $now = time();
        $info['boss_status'] = 0;
        $info['site_name'] = $this->input->post('site_name');

        $province = $this->db->query("select id from provinces where province = '" . $this->input->post('province') . "'")->row();
        $city = $this->db->query("select id from cities where city = '" . $this->input->post('city') . "'")->row();
        $area = $this->db->query("select id from areas where AREA = '" . $this->input->post('area') . "'")->row();
        $info['detail_address'] = $this->input->post('address') . $this->input->post('detail_addr');
        $info['province'] = $province->id;
        $info['city'] = $city->id;
        $info['area'] = $area->id;
        $info['latitude'] = $this->input->post('latitude');
        $info['longitude'] = $this->input->post('longitude');

        $info['site_type_detail'] = $this->input->post('site_type_detail');
        $site_type = $info['site_type_detail'];
        if ($site_type != '') {
            $site_type = explode(',', $site_type);
            if (count($site_type) > 1) $site_type = 31;
            else $site_type = $site_type[0];
        }
        $info['site_type'] = $site_type;
        $this->load->model('boss_model');
        $result = false;
        if ($info['site_name'] != '')
            $result = $this->boss_model->addNewBoss($info);

        if ($result) {
            $this->session->set_flashdata('success', '新增成功.');
            redirect('/usermanage');
        } else {
            $this->session->set_flashdata('error', '新增失败.');
            redirect('/usermanage/addNewBossUser');
        }
    }

    /**
     * This function is used to change the forbidden with userId
     */
    function changeForbidden()
    {
        $userId = $this->input->post('userId');
        $result = $this->user_model->getForbiddenById($userId);
        $forbidden = $result[0]->forbidden;
        $forbidden = ($forbidden + 1) % 2;
        $this->user_model->updateForbiddenById($userId, $forbidden);

        echo(json_encode(array('status' => TRUE, 'userId' => $forbidden)));
        /*if ($result > 0) {
            $this->session->set_flashdata('success', '修改密码成功.');
            echo(json_encode(array('status' => TRUE)));
        } else {
            $this->session->set_flashdata('error', '修改密码失败.');
            echo(json_encode(array('status' => FALSE)));
        }*/
    }

    /**
     * This function is used to show the detail of user with userId
     */
    function showUserDetail($userId)
    {
        $data['userDetail'] = $this->user_model->getUserDetailById($userId);
        $data['walletInfo'] = $this->binding_model->getWithdrawInfoById($userId);
        $data['signInfo'] = $this->backyard_sign_model->get_where(array('user_id' => $userId));
        $data['exchange'] = $this->user_model->getExchangeHoneyWasteById($userId);
        $userRole = $this->user_model->getRoleById($userId);
        $data['isMember'] = $this->member_state_model->getStateById($userId);
        $data['typeList'] = $this->user_model->getTypeListById($userId);

        $user_sports = explode(',', $data['userDetail'][0]->sport_type);
        $show_arr = [];
        $j = 0;
        foreach ($user_sports as $sp) {
            $item = array('type' => $sp, 'count' => 0);
            foreach ($data['typeList'] as $unit) {
                if ($unit->type == $item['type']) {
                    $item['count'] = $unit->count;
                    break;
                }
            }
            array_push($show_arr, $item);
            $j++;
        }
        $data['typeList'] = json_decode(json_encode($show_arr));

        if ($userRole->role == 2) {
            $data['event'] = $this->user_model->getEventHoneyWasteById($userId);
        }
        $this->global['pageTitle'] = '用户详情';
        $this->loadViews("userdetail", $this->global, $data, NULL);
    }

    function pageNotFound()
    {
        $this->global['pageTitle'] = '蜂体 : 404 - Page Not Found';

        $this->loadViews("404", $this->global, NULL, NULL);
    }
}

/* End of file usermanage.php */
/* Location: .application/controllers/usermanage.php */


?>
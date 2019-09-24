<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/basecontroller.php';

/**
 * Class : Shop (ShopController)
 * Area Class to control all shop related operations.
 * @author : The jin hu
 * @version : 1.0
 * @since : 12 August 2017
 */
class usermanage extends basecontroller
{
    /**
     * This is default constructor of the class
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('user_model');
        $this->load->model('binding_model');
        $this->load->model('backyard_sign_model');
        $this->load->model('member_state_model');
        $this->isLoggedIn();
    }

    /**
     * This function used to load the first screen of the user
     */
    public function index()
    {
        $sData = $this->session->userdata('search_infos');
        $searchType = null;
        $searchName = '';
        $searchRole = '10';
        $searchState = '10';
        $searchForbidden = '10';
        $fromTime = '';
        $toTime = '';
        if ($sData) {
            $searchType = $sData['searchType'];
            $searchName = $sData['searchName'];
            $searchRole = $sData['searchRole'];
            $searchState = $sData['searchState'];
            $searchForbidden = $sData['searchForbidden'];
            $fromTime = $sData['fromTime'];
            $toTime = $sData['toTime'];
        }
        $this->userCollectListing($searchType, $searchName, $searchRole, $searchState, $searchForbidden, $fromTime, $toTime);
    }

    /**
     * This function is used to load the user list
     */
    function userCollectListing($searchType = null, $searchName = '', $searchRole = 10, $searchStatus = 10, $searchForbidden = 10, $fromTime = "", $toTime = "")
    {
        $this->global['pageTitle'] = '用户管理';
        if ($searchName == 'ALL') $searchName = '';
        $count = $this->user_model->userListingCount($searchType, $searchName, $searchRole, $searchStatus, $searchForbidden, $fromTime, $toTime);
        $returns = $this->paginationCompress("usermanage/", $count, 10);
        $data['userList'] = $this->user_model->userListing($searchType, $searchName, $searchRole, $searchStatus, $searchForbidden, $fromTime, $toTime, $returns['page'], $returns['segment']);
        $this->global['searchStatus'] = $searchType;
        $this->global['searchText'] = $searchName;
        $this->global['searchRole'] = $searchRole;
        $this->global['searchState'] = $searchStatus;
        $this->global['searchForbidden'] = $searchForbidden;
        $this->global['fromTime'] = $fromTime;
        $this->global['toTime'] = $toTime;
        $this->global['pageType'] = 'user';
        $this->loadViews("usermanage", $this->global, $data, NULL);
    }

    /**
     * This function is used to load the user list by search
     */
    function userListingByFilter()
    {
        $searchType = $this->input->post('searchStatus');
        $searchName = $this->input->post('searchName');
        $searchRole = $this->input->post('searchRole');
        $searchState = $this->input->post('searchState');
        $searchForbidden = $this->input->post('searchForbidden');
        $fromTime = $this->input->post('fromTime');
        $toTime = $this->input->post('toTime');
        $this->session->set_userdata('search_infos', array(
            'searchType' => $searchType,
            'searchName' => $searchName,
            'searchRole' => $searchRole,
            'searchState' => $searchState,
            'searchForbidden' => $searchForbidden,
            'fromTime' => $fromTime,
            'toTime' => $toTime
        ));
        $this->userCollectListing($searchType, $searchName, $searchRole, $searchState, $searchForbidden, $fromTime, $toTime);
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

        $province = $this->db->query("select id from provinces where province = '".$this->input->post('province')."'")->row();
        $city = $this->db->query("select id from cities where city = '".$this->input->post('city')."'")->row();
        $area = $this->db->query("select id from areas where AREA = '".$this->input->post('area')."'")->row();
        $info['detail_address'] = $this->input->post('address').$this->input->post('detail_addr');
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
        $data['signInfo'] = $this->backyard_sign_model->get_where(array('user_id'=>$userId));
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
<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/basecontroller.php';

/**
 * Class : Shop (ShopController)
 * Area Class to control all shop related operations.
 * @author : The jin hu
 * @version : 1.0
 * @since : 12 August 2017
 */
class binding extends basecontroller
{
    /**
     * This is default constructor of the class
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('binding_model');
        $this->load->model("goods_model");
        $this->isLoggedIn();
    }

    /**
     * This function used to load the first screen of the binding
     */
    public function index()
    {
        $sData = $this->session->userdata('binding_infos');
        $searchType = null;
        $searchName = '';
        $searchStatus = 10;
        if ($sData) {
            $searchType = $sData['searchType'];
            $searchName = $sData['searchName'];
            $searchStatus = $sData['searchStatus'];
        }
        $this->bindingCollectListing($searchType, $searchName, $searchStatus);
    }

    /**
     * This function is used to load the binding list
     */
    function bindingCollectListing($searchType = null, $searchName = '', $searchStatus = 10)
    {
        $this->global['pageTitle'] = '提现管理';
        $count = $this->binding_model->bindingListingCount($searchType, $searchName, $searchStatus);
        $returns = $this->paginationCompress("binding/", $count, 10);
        $data['bindingList'] = $this->binding_model->bindingListing($searchType, $searchName, $searchStatus, $returns['page'], $returns['segment']);
        $this->global['searchStatus'] = $searchType;
        $this->global['searchText'] = $searchName;
        $this->global['searchState'] = $searchStatus;
        $this->global['pageType'] = 'binding';
        $this->loadViews("bindingmanage", $this->global, $data, NULL);
    }

    /**
     * This function is used to load the binding list by search
     */
    function bindingListingByFilter()
    {
        $searchType = $this->input->post('searchStatus');
        $searchName = $this->input->post('searchName');
        $searchState = $this->input->post('searchState');
        $this->session->set_userdata('binding_infos', array(
        'searchType'=>$searchType,
        'searchName'=>$searchName,
        'searchStatus'=>$searchState,
        ));
        $this->bindingCollectListing($searchType, $searchName, $searchState);
    }

    /**
     * This function is used to show the detail of binding with bindingId
     */
    function showbindingDetail($bindingId)
    {
        $data['bindingDetail'] = $this->binding_model->getBindingDetailById($bindingId);
        $this->global['pageTitle'] = '提现详情';
        $this->loadViews("bindingdetail", $this->global, $data, NULL);
    }

    /**
    * This function is used to show the confirm of the binding
    */
    function bindingShowConfirm($bindingId)
    {
        $data['bindingDetail'] = $this->binding_model->getBindingDetailById($bindingId);
        $this->global['pageTitle'] = '打款';
        $this->loadViews("bindingconfirm", $this->global, $data, NULL);
    }

    /**
    * This function is used to update the state of binding
    */
    function bindingConfirmed()
    {
        $this->load->library('form_validation');

        $this->form_validation->set_rules('note', '备注', 'trim|required|max_length[100]');

        $bindingId = $this->input->post('binding_id');
        $info['comment'] = $this->input->post('comment');
        $info['state'] = $this->input->post('option_status');
        $info['binding_time'] = date("Y-m-d H:i:s");
        $info['binding_man'] = $this->session->userdata('userId');
        $result = $this->binding_model->updateStateById($bindingId, $info);
        $phone = $this->db->query("select user.phone from binding_history, binding, user where binding.no=binding_history.binding_no and binding.user_id=user.no and binding_history.no=".$bindingId)->result();

        $type = $info['state']==1?'247865':'247864';
        //手机号码，替换内容数组，模板ID
        $this->sendTemplateSMS($phone[0]->phone, $type);
        if($result){
            redirect('binding');
        }
    }

    /**
     * 发送模板短信
     * @param to 手机号码集合,用英文逗号分开
     * @param datas 内容数据 格式为数组 例如：array('Marry','Alon')，如不需替换请填 null
     * @param $tempId 模板Id,测试应用和未上线应用使用测试模板请填写1，正式应用上线后填写已申请审核通过的模板ID
     */
    function sendTemplateSMS($to, $tempId)
    {
        include "CCPRestSmsSDK.php";
        // 初始化REST SDK
        global $accountSid, $accountToken, $appId, $serverIP, $serverPort, $softVersion, $sms_code;

        $accountSid = '8a216da8621834ef0162283d6c070c7a';

        //主帐号令牌,对应官网开发者主账号下的 AUTH TOKEN
        $accountToken = '16bc944cf3944154a5f7709f81da1dce';

        //应用Id，在官网应用列表中点击应用，对应应用详情中的APP ID
        //在开发调试的时候，可以使用官网自动为您分配的测试Demo的APP ID // app token = 324e315f686eb507c9235c8ff39be0bc
        $appId = '8a216da8621834ef0162283d6c580c80';

        //请求地址
        //沙盒环境（用于应用开发调试）：sandboxapp.cloopen.com
        //生产环境（用户应用上线使用）：app.cloopen.com
        $serverIP = 'app.cloopen.com';


        //请求端口，生产环境和沙盒环境一致
        $serverPort = '8883';

        //REST版本号，在官网文档REST介绍中获得。
        $softVersion = '2013-12-26';

        $rest = new REST($serverIP, $serverPort, $softVersion);
        $rest->setAccount($accountSid, $accountToken);
        $rest->setAppId($appId);

        // 发送模板短信
        $data = array();
        $result = NULL;
        $result = $rest->sendTemplateSMS($to, array(), $tempId);
        if ($result == NULL) {
            $data = array(result => "error!", error => "Server no response!");
        } else if ($result->statusCode != 0) {
            //TODO 添加错误处理逻辑
            $data['result'] = 'fail';
            $data['error'] = $result->statusMsg;
        } else {
            // 获取返回信息
            $smsmessage = $result->TemplateSMS;
            //TODO 添加成功处理逻辑
            $data['result'] = 'success';
            $data['code'] = $sms_code;
        }
    }

    function pageNotFound()
    {
        $this->global['pageTitle'] = '蜂体 : 404 - Page Not Found';

        $this->loadViews("404", $this->global, NULL, NULL);
    }
}

/* End of file binding.php */
/* Location: .application/controllers/binding.php */


?>
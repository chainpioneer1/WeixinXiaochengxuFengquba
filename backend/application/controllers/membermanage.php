<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/basecontroller.php';

/**
 * Class : Shop (ShopController)
 * Area Class to control all shop related operations.
 * @author : The jin hu
 * @version : 1.0
 * @since : 12 August 2017
 */
class membermanage extends basecontroller
{
    /**
     * This is default constructor of the class
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('member_state_model');
        $this->isLoggedIn();
    }

    /**
     * This function used to load the first screen of the member
     */
    public function index()
    {
        $sData = $this->session->userdata('member_infos');
        $searchType = null;
        $searchName = '';
        $searchStatus = 10;
        if ($sData) {
            $searchType = $sData['searchType'];
            $searchName = $sData['searchName'];
            $searchStatus = $sData['searchStatus'];
        }
        $this->memberCollectListing($searchType, $searchName, $searchStatus);
    }

    /**
     * This function is used to load the member list
     */
    function memberCollectListing($searchType = null, $searchName = '', $searchStatus = 10)
    {
        $this->global['pageTitle'] = '会员订单列表';
        $count = $this->member_state_model->memberListingCount($searchType, $searchName, $searchStatus);
        $returns = $this->paginationCompress("membermanage/", $count, 10);
        $data['memberList'] = $this->member_state_model->memberListing($searchType, $searchName, $searchStatus, $returns['page'], $returns['segment']);
        $this->global['searchStatus'] = $searchType;
        $this->global['searchText'] = $searchName;
        $this->global['searchState'] = $searchStatus;
        $this->global['pageType'] = 'member';
        $this->loadViews("membermanage", $this->global, $data, NULL);
    }

    /**
     * This function is used to load the member list by search
     */
    function memberListingByFilter()
    {
        $searchType = $this->input->post('searchStatus');
        $searchName = $this->input->post('searchName');
        $searchState = $this->input->post('searchState');
        $this->session->set_userdata('member_infos', array(
        'searchType'=>$searchType,
        'searchName'=>$searchName,
        'searchStatus'=>$searchState,
        ));
        $this->memberCollectListing($searchType, $searchName, $searchState);
    }

    function pageNotFound()
    {
        $this->global['pageTitle'] = '蜂体 : 404 - Page Not Found';

        $this->loadViews("404", $this->global, NULL, NULL);
    }
}

/* End of file membermanage.php */
/* Location: .application/controllers/membermanage.php */


?>
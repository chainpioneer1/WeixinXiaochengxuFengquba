<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/basecontroller.php';

/**
 * Class : Shop (ShopController)
 * Area Class to control all shop related operations.
 * @author : The jin hu
 * @version : 1.0
 * @since : 12 August 2017
 */
class exchange extends basecontroller
{
    /**
     * This is default constructor of the class
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('exchange_model');
        $this->load->model("goods_model");
        $this->isLoggedIn();
    }

    /**
     * This function used to load the first screen of the exchange
     */
    public function index()
    {
        $sData = $this->session->userdata('exchange_infos');
        $searchType = null;
        $searchName = '';
        $searchStatus = 10;
        if ($sData) {
            $searchType = $sData['searchType'];
            $searchName = $sData['searchName'];
            $searchStatus = $sData['searchStatus'];
        }
        $this->exchangeCollectListing($searchType, $searchName, $searchStatus);
    }

    /**
     * This function is used to load the exchange list
     */
    function exchangeCollectListing($searchType = null, $searchName = '', $searchStatus = 10)
    {
        $this->global['pageTitle'] = '兑换订单管理';
        $count = $this->exchange_model->exchangeListingCount($searchType, $searchName, $searchStatus);
        $returns = $this->paginationCompress("exchange/", $count, 10);
        $data['exchangeList'] = $this->exchange_model->exchangeListing($searchType, $searchName, $searchStatus, $returns['page'], $returns['segment']);
        $this->global['searchStatus'] = $searchType;
        $this->global['searchText'] = $searchName;
        $this->global['searchState'] = $searchStatus;
        $this->global['pageType'] = 'exchange';
        $this->loadViews("exchange", $this->global, $data, NULL);
    }

    /**
     * This function is used to load the exchange list by search
     */
    function exchangeListingByFilter()
    {
        $searchType = $this->input->post('searchStatus');
        $searchName = $this->input->post('searchName');
        $searchState = $this->input->post('searchState');
        $this->session->set_userdata('exchange_infos', array(
        'searchType'=>$searchType,
        'searchName'=>$searchName,
        'searchStatus'=>$searchState,
        ));
        $this->exchangeCollectListing($searchType, $searchName, $searchState);
    }

    /**
     * This function is used to show the detail of exchange with exchangeId
     */
    function showExchangeDetail($exchangeId)
    {
        $data['exchangeDetail'] = $this->exchange_model->getExchangeDetailById($exchangeId);;
        $this->global['pageTitle'] = '订单详情';
        $this->loadViews("exchangedetail", $this->global, $data, NULL);
    }

    /**
     * This function is used to update the state of exchange
     */
    function sendGoods()
    {
        $exchangeId = $this->input->post('exchangeId');
        $info['company'] = $this->input->post('company');
        $info['company_id'] = $this->input->post('company_id');
        $info['state'] = 1;
        $info['send_time'] = date("Y-m-d H:i:s");
        $result = $this->exchange_model->updateStateById($exchangeId,$info);

        if (count($result)>0) {
            echo(json_encode(array('status' => TRUE)));
        } else {
            echo(json_encode(array('status' => FALSE)));
        }
    }

    function pageNotFound()
    {
        $this->global['pageTitle'] = '蜂体 : 404 - Page Not Found';

        $this->loadViews("404", $this->global, NULL, NULL);
    }
}

/* End of file exchange.php */
/* Location: .application/controllers/exchange.php */


?>
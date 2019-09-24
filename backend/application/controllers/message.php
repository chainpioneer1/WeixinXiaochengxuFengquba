<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/basecontroller.php';


class message extends basecontroller
{
    /**
     * This is default constructor of the class
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('feedback_model');
        $this->isLoggedIn();
    }

    /**
     * This function used to load the first screen of the rating
     */
    public function index()
    {
        $sData = $this->session->userdata('feedback_infos');
        $searchType = null;
        $searchName = '';
        if ($sData) {
            $searchType = $sData['searchType'];
            $searchName = $sData['searchName'];
        }
        $this->itemCollectListing($searchType, $searchName);
    }

    /**
     * This function is used to load the rating list
     */
    function itemCollectListing($searchType = null, $searchName = '')
    {
        $this->global['pageTitle'] = '留言列表';
        $count = $this->feedback_model->itemListingCount($searchType, $searchName);
        $returns = $this->paginationCompress("message", $count, 10);
        $data['itemList'] = $this->feedback_model->itemListing($searchType, $searchName, $returns['page'], $returns['segment']);
        $this->global['searchStatus'] = $searchType;
        $this->global['searchText'] = $searchName;
        $this->global['pageType'] = 'feedback';
        $this->loadViews("feedback", $this->global, $data, NULL);
    }

    /**
     * This function is used to load the rating list by search
     */
    function itemListingByFilter()
    {
        $searchType = $this->input->post('searchStatus');
        $searchName = $this->input->post('searchName');
        $this->session->set_userdata('feedback_infos', array(
            'searchType' => $searchType,
            'searchName' => $searchName,
        ));
        $this->itemCollectListing($searchType, $searchName);
    }

    /**
     * This function is used to delete rating by id
     */
    function deleteItem()
    {
        $id = $this->input->post('id');
        $result = $this->feedback_model->deleteItem($id);
        if ($result == true) {
            $this->session->set_flashdata('success', '删除成功.');
            echo(json_encode(array('status' => TRUE)));
        } else {
            $this->session->set_flashdata('error', '删除失败.');
            echo(json_encode(array('status' => FALSE)));
        }
    }

    function pageNotFound()
    {
        $this->global['pageTitle'] = '蜂体 : 404 - Page Not Found';

        $this->loadViews("404", $this->global, NULL, NULL);
    }
}

/* End of file rating.php */
/* Location: .application/controllers/rating.php */


?>
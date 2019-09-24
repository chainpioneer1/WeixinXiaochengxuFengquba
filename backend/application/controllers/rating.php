<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/basecontroller.php';


class rating extends basecontroller
{
    /**
     * This is default constructor of the class
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('rating_model');
        $this->load->model("goods_model");
        $this->isLoggedIn();
    }

    /**
     * This function used to load the first screen of the rating
     */
    public function index()
    {
        $sData = $this->session->userdata('rating_infos');
        $searchType = null;
        $searchName = '';
        if ($sData) {
            $searchType = $sData['searchType'];
            $searchName = $sData['searchName'];
        }
        $this->ratingCollectListing($searchType, $searchName);
    }

    /**
     * This function is used to load the rating list
     */
    function ratingCollectListing($searchType = null, $searchName = '')
    {
        $this->global['pageTitle'] = '评价列表';
        $count = $this->rating_model->ratingListingCount($searchType, $searchName);
        $returns = $this->paginationCompress("rating/", $count, 10);
        $data['ratingList'] = $this->rating_model->ratingListing($searchType, $searchName, $returns['page'], $returns['segment']);
        $this->global['searchStatus'] = $searchType;
        $this->global['searchText'] = $searchName;
        $this->global['pageType'] = 'rating';
        $this->loadViews("rating", $this->global, $data, NULL);
    }

    /**
     * This function is used to load the rating list by search
     */
    function ratingListingByFilter()
    {
        $searchType = $this->input->post('searchStatus');
        $searchName = $this->input->post('searchName');
        $this->session->set_userdata('rating_infos', array(
        'searchType'=>$searchType,
        'searchName'=>$searchName,
        ));
        $this->ratingCollectListing($searchType, $searchName);
    }

    /**
     * This function is used to delete rating by id
     */
    function deleteRating()
    {
        $id = $this->input->post('id');
        $result = $this->rating_model->deleteRating($id);
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
<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/basecontroller.php';

/**
 * Class : Shop (ShopController)
 * Area Class to control all shop related operations.
 * @author : The jin hu
 * @version : 1.0
 * @since : 12 August 2017
 */
class goodsmanage extends basecontroller
{
    /**
     * This is default constructor of the class
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('goods_model');
        $this->isLoggedIn();
    }

    /**
     * This function used to load the first screen of the goods
     */
    public function index()
    {
        $sData = $this->session->userdata('goods_infos');
        $searchName = '';
        $searchStatus = 10;
        if ($sData) {
            $searchName = $sData['searchName'];
            $searchStatus = $sData['searchStatus'];
        }
        $this->goodsCollectListing($searchName, $searchStatus);
    }

    /**
     * This function is used to load the goods list
     */
    function goodsCollectListing($searchName = '', $searchStatus = 10)
    {
        $this->global['pageTitle'] = '商品管理';
        $count = $this->goods_model->goodsListingCount($searchName, $searchStatus);
        $returns = $this->paginationCompress("goods/", $count, 10);
        $data['goodsList'] = $this->goods_model->goodsListing($searchName, $searchStatus, $returns['page'], $returns['segment']);
        $this->global['searchText'] = $searchName;
        $this->global['searchState'] = $searchStatus;
        $this->global['pageType'] = 'goods';
        $this->loadViews("goodsmanage", $this->global, $data, NULL);
    }

    /**
     * This function is used to load the goods list by search
     */
    function goodsListingByFilter()
    {
        $searchName = $this->input->post('searchName');
        $searchState = $this->input->post('searchState');
        $this->session->set_userdata('goods_infos', array(
            'searchName' => $searchName,
            'searchStatus' => $searchState,
        ));
        $this->goodsCollectListing($searchName, $searchState);
    }

    function picUpload()
    {
        require_once('api/upload.php');
        $type = array('jpg', 'jpeg', 'png', 'gif');
        $path = sprintf('%s/%s/%s/', date('Y'), date('m'), date('d'));

        $upload = new App_Util_Upload("upload_product_imgs", 0, $type);
        //获取上传信息
        $info = $upload->getUploadFileInfo();
        $fileName = time() . rand(1000, 9999) . '.' . $info['suffix'];
        $fullName = $path . $fileName;
        $path = rtrim('upload', DIRECTORY_SEPARATOR) . '/' . $fullName;
        $success = $upload->save($path);
        $width = 0;
        $height = 0;
        if ($success) {
            $attr = getimagesize($path);
            $width = $attr[0];
            $height = $attr[1];
        }
        $msg = $success ? '上传成功' : '上传失败';
        echo json_encode(array('result' => $success, 'msg' => $msg, 'src' => $path, 'width' => $width, 'height' => $height, 'path' => $path));
    }

    function logoUpload()
    {
        require_once('api/upload.php');
        $type = array('jpg', 'jpeg', 'png', 'gif');

        $upload = new App_Util_Upload("upload_product_logo", 0, $type);
        //获取上传信息
        $info = $upload->getUploadFileInfo();
        $fileName = time() . rand(1000, 9999) . '.' . $info['suffix'];
        $fullName = $fileName;
        $path = rtrim('uploads', DIRECTORY_SEPARATOR) . '/' . $fullName;
        $success = $upload->save($path);
        $width = 0;
        $height = 0;
        if ($success) {
            $attr = getimagesize($path);
            $width = $attr[0];
            $height = $attr[1];
        }
        $msg = $success ? '上传成功' : '上传失败';
        echo json_encode(array('result' => $success, 'msg' => $msg, 'src' => $path, 'width' => $width, 'height' => $height, 'path' => $path));
    }

    function picCrop()
    {
        require_once('api/crop.php');

        //$src = 'upload/2014/06/07/14021146715797.jpg';
        $src = $_GET['src'];
        $rs = explode(".", $src);
        $ext = strtolower($rs[count($rs) - 1]);
        $type = array('jpg', 'jpeg', 'png');

        $fileName = time() . rand(1000, 9999) . '.' . $ext;
        $fullName = $fileName;
        $path = rtrim('uploads', DIRECTORY_SEPARATOR) . '/' . $fullName;

        $crop = new App_Util_Crop();
        $crop->initialize($src, $path, $_GET['x'], $_GET['y'], 200, 200, $_GET['w'], $_GET['h']);
        $success = $crop->generate_shot();
        //print_r($success);
        $msg = $success ? '裁剪成功' : '裁剪失败';
        echo json_encode(array('result' => $success, 'msg' => $msg, 'file' => $fullName));
    }

    /**
     * This function is used to load the goods list by search
     */
    function deleteGood()
    {
        $goodId = $this->input->post('goodId');
        $result = $this->goods_model->deleteGood($goodId);
        if ($result) {
            $this->session->set_flashdata('success', '删除成功.');
            echo(json_encode(array('status' => TRUE)));
        } else {
            $this->session->set_flashdata('error', '删除失败.');
            echo(json_encode(array('status' => FALSE)));
        }
    }


    /**
     * This function is used to show the confirm of the goods
     */
    function changeState()
    {
        $id = $this->input->post('goodId');
        $state = $this->goods_model->getStateById($id);
        $info['state'] = ($state[0]->state + 1) % 2;
        $result = $this->goods_model->updateGoods($id, $info);
        if ($result) {
            $this->session->set_flashdata('success', '删除成功.');
            echo(json_encode(array('status' => TRUE)));
        } else {
            $this->session->set_flashdata('error', '删除失败.');
            echo(json_encode(array('status' => FALSE)));
        }
    }

    /**
     * This function is used to add the amount of goods
     */
    function changeAmount()
    {
        $id = $this->input->post('goodId');
        $add = $this->input->post('amount');
        $info['amount'] = $add;
        $result = $this->goods_model->updateGoods($id, $info);
        if ($result) {
            $this->session->set_flashdata('success', '删除成功.');
            echo(json_encode(array('status' => TRUE)));
        } else {
            $this->session->set_flashdata('error', '删除失败.');
            echo(json_encode(array('status' => FALSE)));
        }
    }

    function addGoods()
    {
        $info['name'] = $this->input->post('name');
        $info['comment'] = $this->input->post('contents');
        $info['add_time'] = date("Y-m-d H:i:s");
        $info['cost'] = $this->input->post('price');
        $info['end_time'] = $this->input->post('endTime');
        if ($this->input->post('endTime') == '')
            $info['end_time'] = null;
        $info['name'] = $this->input->post('name');
        if ($this->input->post('logo_cover') != '')
            $info['avatar'] = $this->input->post('logo_cover');
        if ($this->input->post('image_cover') != '')
            $info['pic'] = $this->input->post('image_cover');
        $error = 0;

        $id = $this->input->post('id');
        if ($id == '') {
            $good = $this->db->query("select count(id) as amount from goods where name='" . $info['name'] . "'")->result();
            if ($good[0]->amount > 0) {
                $this->global['error_name'] = "商品名称重复";
                $error++;
            }
        }
        if ($info['name'] == '') {
            $this->global['error_name'] = "请填写商品名称";
            $error++;
        }
        if ($info['cost'] == '') {
            $this->global['error_amount'] = "请填写消耗蜂蜜";
            $error++;
        }
        if ($info['comment'] == '') {
            $this->global['error_comment'] = "请填写商品详情";
            $error++;
        }
        $cost = $info['cost'];
        if ($cost != floor($info['cost']) || $cost < 0) {
            $this->global['error_amount'] = "消耗蜂蜜必须是整数";
            $error++;
        }
        if ($error == 0) {
            $option = $this->input->post("image1");
            if ($id == '')
                $result = $this->goods_model->addNewGoods($info);
            else
                $result = $this->goods_model->editGoods($id, $info);
            if ($result != null) {
                redirect("goodsmanage");
            } else {
                redirect("usermanage");
            }
        } else {
            $this->global['good_name'] = $info['name'];
            $this->global['amount'] = $info['cost'];
            $this->global['end_time'] = $this->input->post('endTime');
            $this->global['comment'] = $info['comment'];
            $this->goodAdd();
        }
    }

    /*
    * this function is used to upload multiple image
    */
    public function multiple_image_upload($option)
    {

        $this->load->library('upload');

        $files = $_FILES;
        if ($option == 0) {
            $count = count($_FILES['file']['name']);
            for ($i = 0; $i < $count; $i++) {
                $_FILES['file']['name'] = $files['file']['name'][$i];
                $_FILES['file']['type'] = $files['file']['type'][$i];
                $_FILES['file']['tmp_name'] = $files['file']['tmp_name'][$i];
                $_FILES['file']['error'] = $files['file']['error'][$i];
                $_FILES['file']['size'] = $files['file']['size'][$i];
                $this->upload->initialize($this->set_upload_options());
                // $this->upload->do_upload('files[]');
                if (!$this->upload->do_upload('file')) {
                    $error['error'] = $this->upload->display_errors();
                    echo $error['error'];
                    exit;
                } else {
                    $data[$i] = $this->upload->data();
                }
            }
        } else {
            $i = $option - 1;
            $_FILES['file']['name'] = $files['file']['name'][$i];
            $_FILES['file']['type'] = $files['file']['type'][$i];
            $_FILES['file']['tmp_name'] = $files['file']['tmp_name'][$i];
            $_FILES['file']['error'] = $files['file']['error'][$i];
            $_FILES['file']['size'] = $files['file']['size'][$i];
            $this->upload->initialize($this->set_upload_options());
            // $this->upload->do_upload('files[]');
            if (!$this->upload->do_upload('file')) {
                $error['error'] = $this->upload->display_errors();
                echo $error['error'];
                exit;
            } else {
                $data = $this->upload->data();
            }
        }
        return $data;
    }

    public function set_upload_options()
    {
        $config['upload_path'] = './uploads/';
        $config['allowed_types'] = 'gif|jpg|jpeg|png';
        $config['remove_spaces'] = true;
        $config['max_size'] = 10000;
        $config['max_width'] = 1024;
        $config['max_height'] = 768;
        $config['encrypt_name'] = true;
        return $config;
    }

    /**
     * This function is used to add good or edit good
     */
    function goodAdd()
    {
        $this->global['pageTitle'] = '新增商品';
        $this->loadViews("goodsadd", $this->global, NULL, NULL);
    }

    /**
     * This function is used to add good or edit good
     */
    function goodsDetail($id)
    {
        $this->global['pageTitle'] = '商品详情';
        $data['goods'] = $this->goods_model->getGoodDetail($id);
        $this->loadViews("goodsdetail", $this->global, $data, NULL);
    }

    /**
     * This function is used to add good or edit good
     */
    function goodsEdit($id)
    {
        $this->global['pageTitle'] = '编辑商品';
        $data['goods'] = $this->goods_model->getGoodDetail($id);
        $this->loadViews("goodsedit", $this->global, $data, NULL);
    }

    function pageNotFound()
    {
        $this->global['pageTitle'] = '蜂体 : 404 - Page Not Found';

        $this->loadViews("404", $this->global, NULL, NULL);
    }
}

/* End of file goods.php */
/* Location: .application/controllers/goods.php */


?>
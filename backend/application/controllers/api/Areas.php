<?php defined('BASEPATH') OR exit('No direct script access allowed');
header('Access-Control-Allow-Origin: *');

require_once('./application/libraries/REST_Controller.php');

/**
 * Tourist Area API controller
 *
 * Validation is missign
 */
class Areas extends REST_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('area_model');
        $this->load->model('order_model');
        $this->load->model('auth_model');
        $this->load->model('user_model');
        $this->load->model('shop_model');
        $this->load->model('lang_model');
    }

    public function test_post()
    {
        $variable = $this->post();
        $variable = $variable['pos'];
        $this->response(array('status' => true, 'id' => $variable), 200);
        //$this->response($this->area_model->findAreas());
    }

    public function index_get()
    {
        $this->response($this->area_model->get_all());
        //$this->response($this->area_model->findAreas());
    }

    // Rest API - post
    // input: $key - the name of area
    // output: area data records with name like $key
    public function find_post($key = '')
    {
        $request = $this->post();
        $key = $request['key'];
        $this->response($this->area_model->findAreas($key));
    }

    public function edit_post($id = NULL)
    {
        if (!$id) {
            $this->response(array('status' => false, 'error_message' => 'No ID was provided.'), 400);
        }

        $this->response($this->area_model->getAreaById($id));
    }

    public function save_post($id = NULL)
    {
        if (!$id) {
            $new_id = $this->area_model->addNewArea($this->post());
            $this->response(array('status' => true, 'id' => $new_id, 'message' => sprintf('Area #%d has been created.', $new_id)), 200);
        } else {
            $this->area_model->update($this->post(), $id);
            $this->response(array('status' => true, 'message' => sprintf('Area #%d has been updated.', $id)), 200);
        }
    }

    public function changeStatus_post($id = NULL)
    {
        if (!$id) {
            $new_id = $this->area_model->addNewArea($this->post());
            $this->response(array('status' => true, 'id' => $new_id, 'message' => sprintf('Area #%d has been created.', $new_id)), 200);
        } else {
            $area = $this->post();
            if ($area['status'] == 1) {
                $this->area_model->update($this->post(), $id);
                $this->response(array('status' => true, 'message' => sprintf('Area #%d has been updated.', $id)), 200);
            } else if (!$this->area_model->getParentCourseByAreaId($id, '1')) {
                $this->area_model->update($this->post(), $id);
                $this->response(array('status' => true, 'message' => sprintf('Area #%d has been updated.', $id)), 200);
            } else {
                $this->response(array('status' => false, 'message' => '该景区正在使用，无法下架。'), 200);
            }

        }
    }

    public function changeCourseStatus_post($id = NULL)
    {
        if (!$id) {
            $new_id = $this->area_model->addNewArea($this->post());
            $this->response(array('status' => true, 'id' => $new_id, 'message' => sprintf('Course #%d has been created.', $new_id)), 200);
        } else {
            $area = $this->post();
            if ($area['status'] != 1) { // undeploying

                $this->area_model->update($this->post(), $id);
                $this->response(array('status' => true, 'message' => sprintf('Course #%d has been updated.', $id)), 200);
            } else if ($this->area_model->getAreaStatusByCourseId($id, '0')) { // deploying

                $courseData = $this->area_model->getAreaById($area['id']);
                $areaDatas = json_decode($courseData->point_list);
                $price = 0;
                foreach ($areaDatas as $areaitem){
                    $item = $this->area_model->getAreaById($areaitem->id);
                    $areaitem->price = $item->price;
                    $price += floatval($item->price);
                }

                $area['point_list'] = json_encode($areaDatas);
                $area['price']=$price;

                $this->area_model->update($area, $id);
                $this->response(array('status' => true, 'message' => sprintf('Course #%d has been updated.', $id)), 200);
            } else {
                $this->response(array('status' => false, 'message' => '请上架线路的所有景区'), 200);
            }

        }
    }

    public function remove_post($id = NULL)
    {
        if ($this->area_model->getParentCourseByAreaId($id)) {
            $this->response(array('status' => false, 'message' => sprintf('Area #%d is using now.', $id)), 200);
        } else {
            if ($this->area_model->delete($id)) {
                $this->response(array('status' => true, 'message' => sprintf('Area #%d has been deleted.', $id)), 200);
            } else {

                $this->response(array('status' => false, 'message' => 'This Area does not exist!'), 404);
            }
        }
    }

    public function upload_post($id = NULL)
    {
        $ret = array(
            'data' => '',
            'status' => 'fail'
        );
        $upload_path = 'uploads';
        $tt = time();
        $ext = explode(".", $_FILES[0]['name']);
        $len = count($ext);
        $nn = rand(1000, 9999);
        $filename = 'ayoubc' . $nn . $tt . '.' . $ext[$len - 1];
        if (strtolower($ext[$len - 1]) == 'wav' || strtolower($ext[$len - 1]) == 'mp3') {
            $files = array();
            $error = false;
            foreach ($_FILES as $file) {
                if (move_uploaded_file($file['tmp_name'], $upload_path . '/' . $filename)) {
                    $files[] = $file['name'];
                } else {
                    $error = true;
                }
                break;
            }
            if (!$error) {
                $this->response(array('status' => true, 'file' => $filename, 'originfile' => $files[0]), 200);
            } else {
                $this->response(array('status' => false, 'message' => 'There was an error uploading your files!'), 404);
            }
        } else {


            $config['upload_path'] = './' . $upload_path;
            $config['allowed_types'] = 'jpg|png|gif|bmp';
            $config['file_name'] = $filename;
            $image_data = array();
            $is_file_error = FALSE;
            if (!$_FILES) {
                $is_file_error = TRUE;
            }
            if (!$is_file_error) {

                $this->load->library('upload', $config);
                if (!$this->upload->do_upload(0)) {
                } else {
                    //store the file info
                    $image_data = $this->upload->data();
                    $config['image_library'] = 'gd2';
                    $config['source_image'] = $image_data['full_path']; //get original image
                    $config['maintain_ratio'] = FALSE;
                    $config['width'] = 650;
                    $config['height'] = 850;
                    $this->load->library('image_lib', $config);
                    $this->image_lib->resize();

                    $ret['data'] = $image_data['file_name'];
                    $ret['status'] = 'success';
                }
            }
            //echo json_encode($ret);

            if ($ret['status'] == 'success') {
//            $this->response(array('status' => true, 'file' => $files[0]), 200);
                $this->response(array('status' => true, 'file' => $filename, 'originfile' => $ret['data']), 200);
            } else {
                $this->response(array('status' => false, 'message' => 'There was an error uploading your files!'), 200);
            }
        }
    }

    public function imgupload_post()////Image resize
    {
        $ret = array(
            'data' => '',
            'status' => 'fail'
        );
        $upload_path = 'uploads';
        $tt = time();
        $ext = explode(".", $_FILES[0]['name']);
        $len = count($ext);
        $nn = rand(1000, 9999);
        $filename = 'ayoubc' . $nn . $tt . '.' . $ext[$len - 1];
        $config['upload_path'] = './' . $upload_path;
        $config['allowed_types'] = 'jpg|png|gif|bmp';
        $config['file_name'] = $filename;
        $image_data = array();
        $is_file_error = FALSE;
        if (!$_FILES) {
            $is_file_error = TRUE;
        }
        if (!$is_file_error) {

            $this->load->library('upload', $config);
            if (!$this->upload->do_upload(0)) {
            } else {
                //store the file info
                $image_data = $this->upload->data();
                $config['image_library'] = 'gd2';
                $config['source_image'] = $image_data['full_path']; //get original image
                $config['maintain_ratio'] = FALSE;
                $config['width'] = 150;
                $config['height'] = 150;
                $this->load->library('image_lib', $config);
                $this->image_lib->resize();

                $ret['data'] = $image_data['file_name'];
                $ret['status'] = 'success';
            }
        }
        //echo json_encode($ret);

        if ($ret['status'] == 'success') {
//            $this->response(array('status' => true, 'file' => $files[0]), 200);
            $this->response(array('status' => true, 'file' => $filename, 'originfile' => $ret['data']), 200);
        } else {
            $this->response(array('status' => false, 'message' => 'There was an error uploading your files!'), 200);
        }
    }

///////////////////////////////////////////////////////////
////////////////    External APIs
///////////////////////////////////////////////////////////

    // Rest API - post
    // input: the absolute position of person
    // output: area name
    public function getAreaIdByPosition_post()
    {
        $request = $this->post();
        $lng = $request['pos'][0];
        $lat = $request['pos'][1];
        $all_areas = $this->area_model->getAreas('', 'all', 1); // 1-available, 2-disable
        $id = -1;
        if (count($all_areas) > 0) {
            foreach ($all_areas as $item) {
                $pos = json_decode($item->info);
                $pos = $pos->position;
                $lng1 = $pos[0][0];
                $lng2 = $pos[1][0];
                $lat1 = $pos[0][1];
                $lat2 = $pos[1][1];
                if ($lng < $lng1) continue;
                if ($lng > $lng2) continue;
                if ($lat < $lat1) continue;
                if ($lat > $lat2) continue;
                $id = $item->id;
                $name = $item->name;
                break;
            }
        }
        if ($id == -1) $this->response(array('status' => false, 'id' => $id), 200);
        else $this->response(array('status' => true, 'id' => $id, 'name' => $name), 200);
    }

    public function getAllCourseInfos_post()
    {
        $request = $this->post();
        $phone = $request['phone'];
        $all_courses = $this->area_model->getCourses('all', 1); // 1-available, 2-disable
        if (count($all_courses) == 0) {
            $this->response(array('status' => false, 'Courses' => '-1'), 200);
        } else {
            $i = 0;
            $course_list = array();
            foreach ($all_courses as $item) {
                if ($item->status == 0) continue;
                $all_areas = json_decode($item->point_list);
                $courseInfo = json_decode($item->info);
                $j = 0;
                $name = '';
                $areas = array();
                if (count($all_areas) > 0) {
                    foreach ($all_areas as $areaItem) {
                        $areaData = $this->area_model->getAreaById($areaItem->id);
                        $j++;
                        if ($j == 1) $name = $areaData->name;
                        else $name = $name . ' - ' . $areaData->name;
                        $areaInfo = json_decode($areaData->info);
                        array_push(
                            $areas,
                            array(
                                'id' => $areaData->id,
                                'name' => $areaData->name,
                                'image' => base_url() . 'uploads/' . $areaInfo->thumbnail,
                                'overlay' => base_url() . 'uploads/' . $areaInfo->overay,
                                'cost' => round((floatval($areaData->price) -
                                            floatval($this->order_model->calculateMyPrice($phone, $areaData->id))) *
                                        100) / 100,
                                'discount_rate' => $areaData->discount_rate,
                                'origin_price' => $areaData->price,
                                'attractionCnt' => count(json_decode($areaData->point_list)),
                                'map_type' => (intval($areaData->isforeign) - 1)
                            )
                        );
                    }
                }
                $i++;
                array_push(
                    $course_list,
                    array(
                        'id' => $item->id,
                        'title' => $item->name,    //  $item->name || $name
                        'name' => $name,    //  $item->name || $name
                        'image' => base_url() . 'uploads/' . $courseInfo->overay,
                        'phone' => (isset($courseInfo->phone)?($courseInfo->phone):''),
                        'cost' => round((floatval($item->price) -
                                    floatval($this->order_model->calculateMyPrice($phone, $item->id))) *
                                floatval($item->discount_rate) * 100) / 100,
                        'origin_price' => $item->price,
                        'discount_rate' => $item->discount_rate,
                        'scenic_areas' => $areas
                    )
                );

            }
            //var_dump($course_list);
            $this->response(array('status' => true, 'Courses' => $course_list), 200);
        }
    }

    public function getCourseInfoById_post()
    {
        $request = $this->post();
        $phone = $request['phone'];
        $courseId = $request['id'];
        $all_courses = $this->area_model->getAreaById($courseId); // 1-available, 2-disable
        if (count($all_courses) == 0) {
            $this->response(array('status' => false, 'result' => '-1'), 200);
        } else {
            $i = 0;
            $course_list = array();
            $item = $all_courses;
//            if ($item->status == 0)
//                $this->response(array('status' => false, 'result' => '-1'), 200);
            $all_areas = json_decode($item->point_list);
            $courseInfo = json_decode($item->info);
            $j = 0;
            $name = '';
            $areas = array();
            if (count($all_areas) > 0) {
                foreach ($all_areas as $areaItem) {
                    $areaData = $this->area_model->getAreaById($areaItem->id);
                    $j++;
                    if ($j == 1) $name = $areaData->name;
                    else $name = $name . ' - ' . $areaData->name;
                    $areaInfo = json_decode($areaData->info);
                    $thumb = base_url() . 'uploads/' . $areaInfo->thumbnail;
                    if ($areaInfo->thumbnail == '')
                        $thumb = '';
                    array_push(
                        $areas,
                        array(
                            'id' => $areaData->id,
                            'name' => $areaData->name,
                            'image' => $thumb,
                            'overlay' => base_url() . 'uploads/' . $areaInfo->overay,
//                            'cost' => round(floatval($this->order_model->calculateMyPrice($phone, $areaData->id)) *
//                                    100) / 100,
                            'cost' => round((floatval($areaData->price) -
                                        floatval($this->order_model->calculateMyPrice($phone, $areaData->id))) *
                                    100) / 100,
                            'discount_rate' => $areaData->discount_rate,
                            'origin_price' => $areaData->price,
                            'attractionCnt' => count(json_decode($areaData->point_list)),
                            'map_type' => (intval($areaData->isforeign) - 1)
                        )
                    );
                }
            }
            $i++;
            $course_list = array(
                'id' => $item->id,
                'title' => $item->name,    //  $item->name || $name
                'name' => $name,    //  $item->name || $name
                'image' => base_url() . 'uploads/' . $courseInfo->overay,
                'phone' => (isset($courseInfo->phone)?($courseInfo->phone):''),
//                'cost' => round(floatval($this->order_model->calculateMyPrice($phone, $item->id)) *
//                        floatval($item->discount_rate) * 100) / 100,
                'cost' => round((floatval($item->price) -
                            floatval($this->order_model->calculateMyPrice($phone, $item->id))) *
                        floatval($item->discount_rate) * 100) / 100,
                'origin_price' => $item->price,
                'discount_rate' => $item->discount_rate,
                'scenic_areas' => $areas
            );

            //var_dump($course_list);
            $this->response(array('status' => true, 'result' => $course_list), 200);
        }
    }

    function getAllMenuInfos()
    {
        //       $request = $this->post();
//        $searchText = isset($request['search_text'])?$request['search_text']:'';
        $searchText = '';
        // 1-txt(cont,country,name), 2-(1-available,2-disable), 3-(1-inside,2-foreign)
        $all_menu = $this->area_model->getMenuList($searchText, 1, 0);
        if (count($all_menu) == 0) {
            //$this->response(array('status' => false, 'data' => '-1'), 200);
            return array();
        }
        $ret_menu = array();
        $menu1 = array();
        $menu2 = array();
        $menu3 = array();
        $menu4 = array();
        $olditem = $all_menu[0];
        foreach ($all_menu as $item) {
            if ($item->address_1 != $olditem->address_1) {
                array_push($menu3, array('parent' => $olditem->address_1, 'child' => $menu4));
                $menu4 = array();
            }
            if ($item->isforeign != $olditem->isforeign) {
                array_push($menu2, array('parent' => '国内', 'child' => $menu3));
                $menu3 = array();
                $menu4 = array();
            }
            array_push($menu4, $item->name);
            $olditem = $item;
        }
        array_push($menu3, array('parent' => $olditem->address_1, 'child' => $menu4));
        if ($olditem->isforeign == 1)
            array_push($menu2, array('parent' => '国内', 'child' => $menu3));
        else
            array_push($menu2, array('parent' => '国外', 'child' => $menu3));
        array_push($ret_menu, $menu2[0]['child']);

        $menu1 = array();
        $menu2 = array();
        $menu3 = array();
        $menu4 = array();
        $olditem = $all_menu[0];
        foreach ($all_menu as $item) {
            if ($item->address_1 != $olditem->address_1) {
                array_push($menu3, array('parent' => $olditem->address_1, 'child' => $menu4));
                $menu4 = array();
            }
            if ($item->address != $olditem->address) {
                array_push($menu2, array('parent' => $olditem->address, 'child' => $menu3));
                $menu3 = array();
                $menu4 = array();
            }
            if ($item->isforeign != $olditem->isforeign) {
                array_push($menu1, array('parent' => $olditem->address, 'child' => $menu2));
                $menu2 = array();
                $menu3 = array();
                $menu4 = array();
            }
            array_push($menu4, $item->name);
            $olditem = $item;
        }
        array_push($menu3, array('parent' => $olditem->address_1, 'child' => $menu4));
        array_push($menu2, array('parent' => $olditem->address, 'child' => $menu3));
        if ($olditem->isforeign == 1)
            array_push($ret_menu, array());
        else
            array_push($ret_menu, $menu2);

        return $ret_menu;
        //$this->response(array('status' => true, 'data' => $ret_menu), 200);
    }

    public function getFirstDatas_post()
    {
        $return_data = array();
        array_push($return_data, $this->getAllMenuInfos());

        $ret_data = array();
        $hot_datas = $this->area_model->getHotObjectList(0, '');
        $hotCourses = $this->area_model->getHotObjectList(1, '');
        $hotAreas = $this->area_model->getHotObjectList(2, '');
        $hotAreaCourses = $this->area_model->getHotObjectList(3, '');
        array_push($ret_data, $hot_datas);
        array_push($ret_data, $hotCourses);
        array_push($ret_data, $hotAreas);
        array_push($ret_data, $hotAreaCourses);

        array_push($return_data, $ret_data);

        $this->response(array('status' => true, 'data' => $return_data), 200);
    }

    public function getHotObjectInfos_post()
    {
        $request = $this->post();
        $searchText = (isset($request['search_text'])) ? $request['search_text'] : '';
        $searchType = (isset($request['search_type'])) ? $request['search_type'] : '';

        $ret_data = array();
        $hotAreas = $this->area_model->getHotObjectList($searchType, $searchText);
        array_push($ret_data, $hotAreas);

        $this->response(array('status' => true, 'data' => $ret_data), 200);
    }

    public function getAreaCoursesByText_post()
    {
        $request = $this->post();
        $searchText = (isset($request['search_text'])) ? $request['search_text'] : '';
        $searchType = (isset($request['search_type'])) ? $request['search_type'] : '';

        $hotAreas = $this->area_model->getObjectsByText($searchType, $searchText);
        $ret_data = $hotAreas;

        $this->response(array('status' => true, 'data' => $ret_data), 200);
    }

    public function getAllAreaInfos_post()
    {
        $request = $this->post();
        //$mobile = $request['phone'];

        $all_areas = $this->area_model->getAreas('', 'all', 1); // 1-available, 2-disable
        if (count($all_areas) == 0) {
            $this->response(array('status' => false, 'Areas' => '-1'), 200);
        } else {
            $i = 0;
            $areas = array();
            foreach ($all_areas as $item) {
                $i++;
                $areainfo = json_decode($item->info);
                array_push(
                    $areas,
                    array(
                        'id' => $item->id,
                        'name' => $item->name,
                        'image' => base_url() . 'uploads/' . json_decode($item->info)->thumbnail,
                        'overlay' => base_url() . 'uploads/' . json_decode($item->info)->overay,
                        'cost' => $item->price,
                        'discount_rate' => $item->discount_rate,
                        'audio' => base_url() . 'uploads/' . $areainfo->audio,
                        'map_type' => (intval($item->isforeign) - 1)
                    )
                );
            }
            $this->response(array('status' => true, 'Areas' => $areas), 200);
        }
    }

    public function getMyOrderInfos_post()
    {
        $request = $this->post();
        //$this->response(array('status' => true, 'Orders' => '1'), 200);
        $mobile = $request['phone'];
        $orders = $this->order_model->getMyOrderInfos($mobile);
        if ($orders == '-1') {
            $this->response(array('status' => false, 'Orders' => $orders), 200);
        } else {
            $this->response(array('status' => true, 'Orders' => $orders['Auths']), 200);
        }
    }

    public function getMyAreaInfos_post()
    {
        $request = $this->post();
        $mobile = $request['phone'];
        $areaItems = $this->area_model->getAreas('', 'all', 0);
        $courseItems = $this->area_model->getCourses('', 0);
        if (count($areaItems) == 0) {
            $this->response(array('status' => false, 'MyAreas' => '-1'), 200);
        } else {
            $i = 0;
            $Auths = array();
            foreach ($areaItems as $item) {
                $i++;
                // get last order item as same as areaItem or courseItem
                $Ids = array();
                array_push($Ids, $item->id);
                if (count($courseItems) > 0) {
                    foreach ($courseItems as $csitem) {
                        $arInfos = json_decode($csitem->point_list);
                        if (sizeof($arInfos) == 0) continue;

                        foreach ($arInfos as $aritem) {
                            if ($item->id == $aritem->id) {
                                array_push($Ids, $csitem->id);
                                break;
                            }
                        }
                    }
                }

                $lastOrder = $this->order_model->getOrderByAreaIds($Ids, $mobile);
                if (count($lastOrder) == 0) continue;

                if ($lastOrder->status != '1') {
                    if ($lastOrder->status == 3 || $lastOrder->status == 2) continue;
                    if ($lastOrder->ordertype == '2' || $lastOrder->ordertype == '4') {
                        $status_ret = $this->order_model->getBuyStatusById($lastOrder->areaid, 1, $mobile, $lastOrder->id); // 0-attr, 1-area, 2- course
                    } else if ($lastOrder->ordertype == '3') {
                        $status_ret = $this->order_model->getBuyStatusById($lastOrder->attractionid, 0, $mobile, $lastOrder->id); // 0-attr, 1-area, 2- course
                    } else if ($lastOrder->ordertype == '1') {
                        $status_ret = $this->order_model->getBuyStatusById($lastOrder->areaid, 2, $mobile, $lastOrder->id); // 0-attr, 1-area, 2- course
                    }
                    //$status_ret = $lastOrder->status;
                    if ($status_ret == '4') { // 1-using, 2-unpaid, 3-canceled, 4-expired
                        $status_ret = 2; // 2-expired
                    } else if ($status_ret == '1') {
                        $status_ret = 1; // 1-using
                    } else {
                        continue;
                    }
                } else {
                    $status_ret = 1;
                }

                $area_info = json_decode($item->info);
                array_push(
                    $Auths,
                    array(
                        'areaid' => $item->id,
                        'id' => $lastOrder->id,
                        'name' => $item->name,
                        'image' => base_url() . 'uploads/' . $area_info->thumbnail,
                        'overlay' => base_url() . 'uploads/' . $area_info->overay,
                        'cost' => round((floatval($item->price) -
                                    floatval($this->order_model->calculateMyPrice($mobile, $item->id))) *
                                floatval($item->discount_rate) * 100) / 100,
                        'paid_price' => $item->price,
                        'discount_rate' => $item->discount_rate,
                        'order_time' => $lastOrder->ordered_time,
                        'state' => $status_ret,
                        'type' => $item->type,
                        'map_type' => (intval($item->isforeign) - 1)
                    )
                );
            }
            $this->response(array('status' => true, 'MyAreas' => $Auths), 200);
        }
    }

    public function getAreaInfoById_post()
    {
        $request = $this->post();
        $id = $request['id'];
        $phone = $request['phone'];
        $item = $this->area_model->getAreaById($id);
        if (count($item) == 0) {
            $this->response(array('status' => false, 'CurArea' => '-1'), 200);
        } else if ($item->type == 1) {
            $this->response(array('status' => false, 'CurArea' => '-1'), 200);
        } else {
            $curDate = date_create(date("Y-m-d"));
            date_modify($curDate, "-15 days");
            $itemInfo = json_decode($item->info);
            $attractions = json_decode($item->point_list);
            $i = 0;
            $attractionList = array();
            if (count($attractions) > 0) {
                foreach ($attractions as $atts) {
                    $i++;
                    if ($atts->trial == '1') {
                        $buy_state = 1;//trial
                    } else if ($phone == '') {
                        $buy_state = 3;//unpaid
                    } else {
                        $buy_state = $this->order_model->getStatusByAttractionId($atts->id, $phone);
                    }
                    array_push(
                        $attractionList,
                        array(
                            'id' => $atts->id,
                            'name' => $atts->name,
                            'description' => $atts->description,
                            'position' => json_decode($atts->position),
                            'cost' => $atts->price,
                            'discount_rate' => $atts->discount_rate,
                            'buy_state' => $buy_state,// 1-trial, 2-paid, 3-unpaid
                            'audio_files' => [
                                base_url() . 'uploads/' . $atts->audio_1,
                                base_url() . 'uploads/' . $atts->audio_2,
                                base_url() . 'uploads/' . $atts->audio_3,
                            ],
                            'image' => base_url() . 'uploads/' . $atts->image
                        )
                    );
                }
            }
            $scenic_area = [
                'id' => $item->id,
                'name' => $item->name,
                'position' => [($itemInfo->position[0][0] + $itemInfo->position[1][0]) / 2,
                    ($itemInfo->position[0][1] + $itemInfo->position[1][1]) / 2],
                'top_right' => ($itemInfo->position[1]),
                'bottom_left' => ($itemInfo->position[0]),
                'overlay' => base_url() . 'uploads/' . $itemInfo->overay,
                'image' => base_url() . 'uploads/' . $itemInfo->thumbnail,
                'audio' => base_url() . 'uploads/' . $itemInfo->audio,
                'cost' => $item->price,
                'discount_rate' => $item->discount_rate,
                'attractionCnt' => count($attractionList),
                'attractions' => $attractionList,
                'zoom' => ($itemInfo->zoom),
                'map_type' => (intval($item->isforeign) - 1)
            ];
            $this->response(array('status' => true, 'CurArea' => $scenic_area), 200);
        }
    }

    public function getLangData_post(){
        $request = $this->post();
        //$mobile = $request['phone'];
        $ret['lang'] = $this->lang_model->getLangList();
        $ret['history'] = $this->lang_model->getLangHistory();
        if(count($ret)==0) {
            $this->response(array('status' => false, 'data' => array()), 200);
        }else{
            $this->response(array('status' => true, 'data' => $ret), 200);
        }
    }

    public function setLangDara_post(){
        $request = $this->post();
        $mobile = $request['phone'];
        $info = $request['historyInfo'];
        $ret = $this->lang_model->setLangHistory($mobile, $info);
        if(!$ret) {
            $this->response(array('status' => false, 'data' => array()), 200);
        }else{
            $this->response(array('status' => true, 'data' => $mobile), 200);
        }
    }

    public function setAreaBuyOrder_post()
    {
        $request = $this->post();
        $areaid = $request['id'];
        $phone = $request['phone'];
        $cost = $request['cost'];
        $type = $request['type'];
        $shopid = $request['shop'];
        if ($shopid == 'null' || $shopid == '' || $shopid == 'undefined' || $shopid == null) $shopid = 0;
        $init['num'] = $this->auth_model->getCount() + 1;
        $date = new DateTime();
        if ($phone == '' || $type == '') {
            $this->response(array('status' => false, 'result' => '-1'), 200);
        } else {
            $user = $this->user_model->getOrderUserByPhone($phone);
            if (count($user) == 0) {
                $userInfo = [
                    'mobile' => $phone
                ];
                $this->user_model->addNewOrderUser($userInfo);
            }
            if ($type == '1' || $type == '2') { // 1-course, 2-area
                $areaItem = $this->area_model->getAreaById($areaid);
                $shopItem = $this->shop_model->getShopById($shopid);
                if (count($areaItem) == 0) {
                    $this->response(array('status' => false, 'result' => 'The area is not exist.'), 200);
                    return;
                }
                if ($areaItem->type != $type) {
                    $this->response(array('status' => false, 'result' => 'The course or area type is mismatch.'), 200);
                    return;
                }
                if (count($shopItem) == 0) {
                    $this->response(array('status' => false, 'result' => 'The shop is not exist.'), 200);
                    return;
                }
                $authOrderItem = [
                    "value" => sprintf("%'.07d%'.04d", time() % 1e7, rand(1000, 9999)),
                    "code" => round($cost * 100) / 100,
                    "userphone" => $phone,
                    "ordertype" => $type, // 1,2 - course or area
                    "status" => '2',// 2- ordered but unpaid
                    "areaid" => $areaid,
                    "attractionid" => 0,
                    "authid" => $shopid,
                    "ordered_time" => $date->format('Y-m-d H:i:s'),
                ];
                $this->order_model->addBuyOrder($authOrderItem);
            } else if ($type == '3') {  // 3-attraction
                $area = explode('_', $areaid);
                $areaItem = $this->area_model->getAreaById($area[0]);
                if (count($areaItem) == 0) {
                    $this->response(array('status' => false, 'result' => '-1'), 200);
                    return;
                }
                $authOrderItem = [
                    "value" => sprintf("%'.07d%'.04d", time() % 1e7, rand(1000, 9999)),
                    "code" => round($cost * 100) / 100,
                    "userphone" => $phone,
                    "ordertype" => $type, // 3- attraction
                    "status" => '2', // 2-ordered but unpaid
                    "areaid" => $area[0],
                    "authid" => $shopid,
                    "attractionid" => $areaid,
                    "ordered_time" => $date->format('Y-m-d H:i:s'),
                ];
                $this->order_model->addBuyOrder($authOrderItem);
            } else { // 4-authorization code
                if ($shopid != '') {
                    $areaItem = $this->area_model->getAreaById($areaid);
                    $authOrderItem = [
                        "code" => $areaid,
                        "userphone" => $phone,
                        "ordertype" => $type, // 4-authorization
                        "status" => '1', // ordered and paid
                        "authid" => $shopid,
                        "paid_time" => $date->format('Y-m-d H:i:s')
                    ];
                    $result = $this->order_model->addAuthOrder($authOrderItem);
                    if ($result == 0) {
                        $this->response(array('status' => false, 'result' => '-1'), 200);
                    } else {
                        $this->response(array('status' => true, 'result' => $authOrderItem['code']), 200);
                    }
                }
                return;
            }
            $this->response(array('status' => true, 'result' => $authOrderItem['value']), 200);
        }
    }

    public function setPayOrder_post()
    {
        $request = $this->post();
        $value = $request['id'];// areaid  or courseid or attractionid
        //$value = explode("_", $value);
        //$value = $value[0];
        $phone = $request['phone'];
        $shopid = $request['shop'];
        $qr_areaid = $request['qr_areaid'];
        $cost = $request['cost'];

//        $result[0]['state'] = 1;   // 1- paid
        $result = $this->order_model->addPayOrder($value, $phone, $shopid, $qr_areaid, $cost);
        if ($result == NULL) {
            $this->response(array('status' => false, 'result' => '-1'), 200);
        } else {
            $this->response(array('status' => true, 'result' => $result[0]), 200);
        }
    }

    public function setCancelOrder_post()
    {
        $request = $this->post();
        $valueid = $request['id'];
        $phone = $request['phone'];

        $result = $this->order_model->cancelBuyOrder($valueid, $phone);
        if ($phone == '' || $valueid == '') {
            $this->response(array('status' => false, 'result' => '-1'), 200);
        } else if (count($result) == 0) {
            $this->response(array('status' => false, 'result' => '-1'), 200);
        } else {
            $this->response(array('status' => true, 'result' => $result), 200);
        }
    }

    public function testingAjax_post()
    {
        $request = $this->post();
        $data = $request['data'];
        for ($i = 0; $i < 1; $i++) {
            $result = $this->shop_model->add($data);
            if ($result == 0) break;
        }
        if ($result == 0) {
            $this->response(array('status' => false, 'result' => '-1'), 200);
        } else {
            $this->response(array('status' => true, 'result' => $result), 200);
        }
    }
}

/* End of file Areas.php */
/* Location: ./application/controllers/api/Areas.php */
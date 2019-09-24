<?php defined('BASEPATH') OR exit('No direct script access allowed');
header('Access-Control-Allow-Origin: *');


/**
 * User_Manage API controller
 *
 */
class datamanage extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('user_model');
        $this->load->model('booking_model');
        $this->load->model('event_model');
        $this->load->model('rating_model');
        $this->load->model('member_state_model');
        $this->load->model('rule_model');
        $this->load->model('boss_model');
        $this->load->model('accept_address_model');
        $this->load->model('honey_model');
        $this->load->model('favourite_event_model');
        $this->load->model('goods_model');
        $this->load->model('exchange_model');
        $this->load->model('roombooking_model');
        $this->load->model('binding_model');
    }

    /*
    * this function is used to add new user who entered into the fengti, 
        but only nickname and avatar
    */
    public function addNewUser()
    {
        $user['avatar'] = $this->image_upload();
        $data = json_decode(file_get_contents("php://input"));
        $user['nickname'] = $data->{"nickname"};
        //$user['nickname'] = $this->input->post('nickname');
        $user['reg_time'] = date("Y-m-d H:i:s");
        $result = $this->user_model->addNewUser($user);
        if (count($result)>0) {
            echo json_encode(array('status' => true, 'result' => $result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get all of the information of the user by using nickname
    */
    public function getState()
    {
        $data = json_decode(file_get_contents("php://input"));
        $nickname = $data->{'nickname'};
        $result = $this->user_model->getState($nickname);
        if(count($result)>0){
            $member = $this->member_state_model->getStateById($result[0]->no);
            echo json_encode(array('status' => true, 'result' => $result, 'member' => $member), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
        exit;
    }

    /*
    * this function is used to get detail information of the user by using user_id
    */
    public function getUserDetail()
    {
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->{'user_id'};
        $result = $this->user_model->getUserDetailById($user_id);
        if(count($result)>0){
            echo json_encode(array('status' => true, 'result' => $result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
        exit;
    }

    /*
    * this function is used to get all of the booking information 
    which the user want to see by the nickname of the user and the state of booking
    */
    public function getMyBooking()
    {
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->{"user_id"};
        $result = $this->booking_model->getBookingByUser($user_id);
        if(count($result)>0){
            echo json_encode(array('status' => true, 'result' => $result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get detail of the booking information 
    which the user want to see by id of booking
    */
    public function getBookingDetail()
    {
        $data = json_decode(file_get_contents("php://input"));
        $bookingId = $data->{'booking_id'};
        $userId = $data->{'user_id'};
        $result = $this->booking_model->getBookingById($bookingId);
        $register_num = $this->booking_model->getRegisterNum($bookingId, "booking");
        $rating = $this->rating_model->getRatingByBooking($bookingId, $userId);
        if(count($result)>0){
            echo json_encode(array('status' => true, 'result' => $result, 'rating' => $rating, 'register_num' => $register_num), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to check the state of all events 
        with the comparation of end_time and now 
        then change the state and also change the state of booking
        which is associated with those events
    */
    function checkEventState()
    {
        $endedEvents = $this->event_model->checkStateByTime();
        $this->booking_model->changeStateByEvent($endedEvents);
        $this->honey_model->checkHoney();
    }

    /*
    * this function is used to cancel the booking of the user
    */
    public function cancelBooking()
    {
        $data = json_decode(file_get_contents("php://input"));
        $booking_id = $data->{"booking_id"}; 
        $state['state'] = 2;
        $result = $this->booking_model->updateStateByBookingId($booking_id, $state);
        if($result){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to add the rating to the site which its' event that the user entered is finished.
    */
    public function addRating()
    {
        $data = json_decode(file_get_contents("php://input"));
        $info['point'] = $data->{"point"};
        $info['comment'] = $data->{"comment"};
        $booking_id= $data->{'booking_id'};
        $result = $this->db->query("select user_id, event_id from booking  where id=".$booking_id)->result();
        $info['user_id'] = $result[0]->user_id;
        $info['event_id'] = $result[0]->event_id;
        $info['submit_time'] = date("Y-m-d H:i:s");
        $result = $this->rating_model->addRating($info);
        if($result>0){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get information of all events that user created
    */
    public function getEventByUser()
    {
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->{"user_id"};
        $result = $this->event_model->getEventByUser($user_id, 3);
        if(count($result)>0){
            echo json_encode(array('status' => true, 'result' => $result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get information of all events which have been placing in the province the user locate
    */
    public function getEventByProvince()
    {
        $data = json_decode(file_get_contents("php://input"));
        $province = $data->{'province'};
        $user_id = $data->{"user_id"};
        $result = $this->event_model->getEventByProvince($province, $user_id);
        if(count($result)>0){
            echo json_encode(array('status' => true, 'result' => $result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get detail information of events that user selected
    */
    public function getEventDetail()
    {
        $data = json_decode(file_get_contents("php://input"));
        $event_id = $data->{"event_id"};
        $user_id = $data->{'user_id'};
        $result = $this->event_model->getEventDetailById($event_id, $user_id);
        $booking = $this->booking_model->getBookingDetailByEvent($event_id);
        $rating = $this->favourite_event_model->getFavouriteDetailByUser($user_id, $event_id);
        $rating_detail = $this->rating_model->getRatingByEvent($event_id);
        $register_num = $this->booking_model->getRegisterNum($event_id);
        $is_rating = $this->favourite_event_model->is_rating($user_id);
        if(count($result)>0){
            echo json_encode(array('status' => true, 'result' => $result, 'booking' => $booking, 'rating' => $rating, 'rating_detail' => $rating_detail, 'register_num' => $register_num), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to set favourite state of event
    */
    public function setFavouriteEvent()
    {
        $data = json_decode(file_get_contents("php://input"));
        $event_id = $data->{"event_id"};
        $user_id = $data->{"user_id"};
        $result = $this->favourite_event_model->setFavouriteEvent($user_id, $event_id);
        if($result){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to add booking information of user for a event
    */
    public function addBooking()
    {
        $data = json_decode(file_get_contents("php://input"));
        $info['event_id'] = $data->{"event_id"};
        $info['user_id'] = $data->{"user_id"};
        $info['reg_num'] = $data->{"reg_num"};
        $info['pay_type'] = $data->{"pay_type"};
        $info['submit_time'] = date("Y-m-d H:i:s");
        $result = $this->booking_model->addBooking($info);
        if($result){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get detail information of booking to this event
    */
    public function getBookingDetailByEvent()
    {
        $data = json_decode(file_get_contents("php://input"));
        $event_id = $data->{"event_id"};
        $booking = $this->booking_model->getBookingDetailByEvent($event_id);
        if(count($booking)>0){
            echo json_encode(array('status' => true, 'booking' => $booking), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to cancel the event which user created
    */
    public function cancelEvent()
    {
        $data = json_decode(file_get_contents("php://input"));
        $event_id = $data->{"event_id"}; 
        $state['state'] = 3;
        $result = $this->event_model->updateStateById($event_id, $state);
        if($result){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get the member status
    */
    public function getMemberState()
    {
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->{"user_id"};
        $result = $this->member_state_model->getMemberState($user_id);
        if($result != null){
            echo json_encode(array('status' => true, 'result' => $result), 200);
        } else {
            echo json_encode(array('status' => false, 'result' => 0), 200);
        }
    }

    /*
    * this function is used to set the member state or continue member state
    */
    public function setMember()
    {
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->{"user_id"};
        $cost = $data->{"cost"};
        $member_cost = $this->rule_model->getMemberCost();
        $result = $this->member_state_model->setMemberState($user_id, $cost, $member_cost[0]->value);
        if(count($result)>0){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false, 'cost' => $cost, 'member' => $member_cost), 200);
        }
    }

    /*
    * this function is used to get the information of favourite site
    */
    public function getFavouriteSite()
    {
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->{'user_id'};
        $result = $this->user_model->getFavouriteSite($user_id);
        if($result !=null){
            echo json_encode(array('status' => true, 'result' => $result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to delete site which had been favourite
    */
    public function cancelFavouriteSite()
    {
        $data = json_decode(file_get_contents("php://input"));
        $boss_id = $data->{'boss_id'};
        $user_id = $data->{'user_id'};
        $result = $this->user_model->cancelFavouriteSite($user_id, $boss_id);
        if($result){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get the information of the site
    */
    public function getSiteDetail()
    {
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->{'user_id'};
        $boss_id = $data->{'boss_id'};
        $site = $this->boss_model->getSiteDetail($boss_id, $user_id);
        $picture = $this->boss_model->getSitePictures($boss_id);
        $isFavourite = $this->boss_model->isFavourite($user_id, $boss_id);
        $event = $this->event_model->getEventByUser($boss_id, 0);
        if($site !=null){
            echo json_encode(array('status' => true, 'site' => $site, 'picture' => $picture, 'isFavourite' => $isFavourite, 'event' => $event), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get rating of the site
    */
    public function getRatingCountBySite()
    {
        $data = json_decode(file_get_contents("php://input"));
        $boss_id = $data->{'boss_id'};
        $result = $this->rating_model->getRatingCountByBoss($boss_id);
        if($result !=null){
            echo json_encode(array('status' => true, 'result' => $result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get rating of the site
    */
    public function getRatingByEvent()
    {
        $data = json_decode(file_get_contents("php://input"));
        $event_id = $data->{'event_id'};
        $result = $this->rating_model->getRatingByEvent($event_id);
        if($result !=null){
            echo json_encode(array('status' => true, 'result' => $result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get rating of the site
    */
    public function getRatingBySite()
    {
        $data = json_decode(file_get_contents("php://input"));
        $boss_id = $data->{'boss_id'};
        $result = $this->rating_model->getRatingByBoss($boss_id);
        if($result !=null){
            echo json_encode(array('status' => true, 'result' => $result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to register individual user
    */
    public function registerUser()
    {
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->{'user_id'};
        $info['role'] = $data->{'role'};
        $info['name'] = $data->{'name'};
        $info['phone'] = $data->{'phone'};
        $info['reg_time'] = date("Y-m-d H:i:s");
        $info['state'] = 1;
        $result = $this->user_model->registerUser($user_id, $info);
        if(count($result)>0){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to register boss
    */
    public function registerBoss()
    {
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->{'user_id'};
        $boss['boss_id'] = $user_id;
        $info['role'] = $data->{'role'};
        $info['name'] = $data->{'name'};
        $info['phone'] = $data->{'phone'};
        $info['state'] = 1;
        $info['reg_time'] = date("Y-m-d H:i:s");
        $boss['site_name'] = $data->{'site_name'};
        $boss['province'] = $data->{'province'};
        $boss['city'] = $data->{'city'};
        $boss['area'] = $data->{'area'};
        $boss['detail_address'] = $data->{'detail_address'};
        $boss['id_no'] = $data->{'id_no'};
        $boss['longitude'] = $data->{'longitude'};
        $boss['latitude'] = $data->{'latitude'};
        $result = $this->user_model->registerUser($user_id, $info);
        $result = $this->boss_model->addNewBoss($boss);
        if(count($result)>0){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to add license image of user
    */
    public function addAllowPic()
    {
        $user_id = $this->input->post('user_id');
        $info['allow_pic'] = $this->image_upload();
        $result = $this->user_model->addAllowPic($user_id, $info);
        if(count($result)>0){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

     /*
    * this function is used to add license image of user
    */
    public function addIDPic1()
    {
        $user_id = $this->input->post('user_id');
        $info['id_pic1'] = $this->image_upload();
        $result = $this->user_model->addIDPic($user_id, $info);
        if(count($result)>0){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

     /*
    * this function is used to add license image of user
    */
    public function addIDPic2()
    {
        $user_id = $this->input->post('user_id');
        $info['id_pic2'] = $this->image_upload();
        $result = $this->user_model->addIDPic($user_id, $info);
        if(count($result)>0){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get the address where current user can accept the goods
    */
    public function addAcceptAddress()
    {
        $data = json_decode(file_get_contents("php://input"));
        $result = $this->accept_address_model->addAddressByUser($data);
        if($result){
            echo json_encode(array('status' => true, 'result' => $result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get the address where current user can accept the goods
    */
    public function getAcceptAddress()
    {
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->{'user_id'};
        $result = $this->accept_address_model->getAddressByUser($user_id);
        if(count($result)>0){
            echo json_encode(array('status' => true, 'result' => $result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to change the address where current user can accept the goods
    */
    public function changeAcceptAddress()
    {
        $data = json_decode(file_get_contents("php://input"));
        $address_id = $data->{'address_id'};
        $info['user_id'] = $data->{'user_id'};
        $info['name'] = $data->{'name'};
        $info['province'] = $data->{'province'};
        $info['city'] = $data->{'city'};
        $info['area'] = $data->{'area'};
        $info['detail_address'] = $data->{'detail_address'};
        $info['phone'] = $data->{'phone'};
        $info['email'] = $data->{'email'};
        $result = $this->accept_address_model->changeAddressById($address_id, $info);
        if($result){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to mark the address as the actual address where current user can accept the goods
    */
    public function checkAcceptAddress()
    {
        $data = json_decode(file_get_contents("php://input"));
        $address_id = $data->{'address_id'};
        $user_id = $data->{'user_id'};
        $result = $this->accept_address_model->checkAddressById($address_id, $user_id);
        if($result>0){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to delete address where current user can accept the goods
    */
    public function deleteAcceptAddress()
    {
        $data = json_decode(file_get_contents("php://input"));
        $address_id = $data->{'address_id'};
        $user_id = $data->{'user_id'};
        $result = $this->accept_address_model->deleteAddressById($address_id, $user_id);
        if(count($result)>0){
            echo json_encode(array('status' => true, 'result' => $result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get the status of site whether or not user input information
    */
    public function getSiteStatus()
    {
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->{'user_id'};
        $result = $this->boss_model->getSiteStatus($user_id);
        $picture = $this->boss_model->getSitePictures($user_id);
        if($result){
            echo json_encode(array('status' => true, 'result'=> $result, 'picture' => $picture), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to add the information of site which tells other users introduction and the service of the site
    */
    public function addSiteInfo()
    {
        $user_id = $this->input->post('user_id');
        $info['site_icon'] =  $this->image_upload();
        $info['site_introduction'] = $this->input->post('introduction');
        $info['site_service'] = $this->input->post('service');
        $result = $this->boss_model->addSiteInfo($user_id, $info);
        if($result == true){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to add the information of site which tells other users introduction and the service of the site
    */
    public function addSitePicture()
    {
        $user_id = $this->input->post('user_id');
        $imageUrl = $this->image_upload();
        $result = $this->boss_model->addSitePicture($user_id, $imageUrl);
        if($result == true){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to add the information of site which tells other users introduction and the service of the site
    */
    public function addSitePictureURL()
    {
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->{'user_id'};
        $imageUrl = $data->{'image'};
        $result = $this->db->query("insert site_picture(picture, boss_id) value('".$imageUrl."',".$user_id.")");
        if($result!=null){
            echo json_encode(array('status' => true, 'user_id' => $user_id, 'imageUrl' => $imageUrl), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to edit the information of site which tells other users introduction and the service of the site
    */
    public function editSiteInfo()
    {
        $user_id = $this->input->post('user_id');
        $info['site_icon'] =  $this->image_upload();
        $info['site_introduction'] = $this->input->post('introduction');
        $info['site_service'] = $this->input->post('service');
        $result = $this->boss_model->editSiteInfo($user_id, $info);
        if($result == true){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    public function editSiteInfo1()
    {
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->{'user_id'};
        $info['site_icon'] = $data->{'site_icon'};
        $info['site_introduction'] = $data->{'introduction'};
        $info['site_service'] = $data->{'service'};
        $result = $this->boss_model->editSiteInfo($user_id, $info);
        if($result == true){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to create the event
    */
    public function addEvent()
    {
        $event['organizer_id'] = $this->input->post('user_id');
        $user_role = $this->input->post('role');
        $event['name'] = $this->input->post('event_name');
        $event['type'] = $this->input->post('event_type');
        $event['start_time'] = $this->input->post('start_time');
        $event['end_time'] = $this->input->post('end_time');
        $event['province'] = $this->input->post('province');
        $event['area'] = $this->input->post('area');
        $event['city'] = $this->input->post('city');
        $event['detail_address'] = $this->input->post('detail_address');
        $event['longitude'] = $this->input->post('longitude');
        $event['latitude'] = $this->input->post('latitude');
        $event['limit'] = $this->input->post('limit');
        $event['cost'] = $this->input->post('cost');
        $event['comment'] = $this->input->post('comment');
        $event['publicity'] = $this->input->post('publicity');
        $event['pic'] =$this->image_upload();
        if($user_role==2)
        {
            $event['additional'] = $this->input->post('additional');
        }
        $result = $this->event_model->addEvent($user_role, $event);
        if($result){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used for payment
    */
    public function pay()
    {
        include 'WxPay.php';
        $data = json_decode(file_get_contents("php://input"));  
        $appid='wxea381fb0ca7c2a24';  
        $openid= $data->{'id'};  
        $mch_id='1500220062';  
        $key='fengtiWeixin17642518820android12';  
        $out_trade_no = $mch_id. time();  
        $total_fee = $data->{'fee'};  
        if(empty($total_fee)) //押金  
        {  
            $body = "充值押金";  
            $total_fee = floatval(99*100);  
        }  
         else {  
             $body = "充值余额";  
             $total_fee = floatval($total_fee*100);  
         }  
        $weixinpay = new WeixinPay($appid,$openid,$mch_id,$key,$out_trade_no,$body,$total_fee);  
        $return=$weixinpay->pay();  
          
        echo json_encode($return); 
    }

    /*
    * this function is used for refund
    */
    public function refund()
    {
        include 'WinXinPay.php';
        $data = json_decode(file_get_contents("php://input"));  
        $appid='wxea381fb0ca7c2a24';  
        $openid= $data->{'id'};  
        $mch_id='1500220062';  
        $key='fengtiWeixin17642518820android12';  
        $out_trade_no = $mch_id. time();  
        $total_fee = $data->{'fee'};  
        if(empty($total_fee)) //押金  
        {  
            $body = "退款押金";  
            $total_fee = floatval(99*100);  
        }  
         else {  
             $body = "退款余额";  
             $total_fee = floatval($total_fee*100);  
         }  //$openid,$outTradeNo,$totalFee,$outRefundNo,$refundFee
        $weixinpay = new WeixinPay($appid,$openid,$mch_id,$key,$out_trade_no,$body,$total_fee);  
        $return=$weixinpay->pay();  
          
        echo json_encode($return); 
    }

    public function notify()
    {
        $post = post_data();    //接受POST数据XML个数

        function post_data(){
            $receipt = $_REQUEST;
            if($receipt==null){
                $receipt = file_get_contents("php://input");
                if($receipt == null){
                    $receipt = $GLOBALS['HTTP_RAW_POST_DATA'];
                }
            }
            return $receipt;
        }

        $post_data = $this->xml_to_array($post);   //微信支付成功，返回回调地址url的数据：XML转数组Array
        $postSign = $post_data['sign'];
        unset($post_data['sign']);
        
        /* 微信官方提醒：
         *  商户系统对于支付结果通知的内容一定要做【签名验证】,
         *  并校验返回的【订单金额是否与商户侧的订单金额】一致，
         *  防止数据泄漏导致出现“假通知”，造成资金损失。
         */
        ksort($post_data);// 对数据进行排序
        $str = $this->ToUrlParams($post_data);//对数组数据拼接成key=value字符串
        $user_sign = strtoupper(md5($post_data));   //再次生成签名，与$postSign比较
        
        $where['crsNo'] = $post_data['out_trade_no'];
        $order_status = M('home_order','xxf_witkey_')->where($where)->find();
        
        if($post_data['return_code']=='SUCCESS'&&$postSign){
            /*
            * 首先判断，订单是否已经更新为ok，因为微信会总共发送8次回调确认
            * 其次，订单已经为ok的，直接返回SUCCESS
            * 最后，订单没有为ok的，更新状态为ok，返回SUCCESS
            */
            if($order_status['order_status']=='ok'){
                $this->return_success();
            }else{
                $updata['order_status'] = 'ok';
                if(M('home_order','xxf_witkey_')->where($where)->save($updata)){
                    $this->return_success();
                }
            }
        }else{
            echo '微信支付失败';
        }
    }
    
    /*
     * 给微信发送确认订单金额和签名正确，SUCCESS信息 -xzz0521
     */
    private function return_success(){
        $return['return_code'] = 'SUCCESS';
        $return['return_msg'] = 'OK';
        $xml_post = '<xml>
                <return_code>'.$return['return_code'].'</return_code>
                <return_msg>'.$return['return_msg'].'</return_msg>
                </xml>';
        echo $xml_post;
        exit;
    }

    /*
    * this function is used to get provinces
    */
    public function getProvinces()
    {
        $query = $this->db->query("select id, province from provinces");
        $result = $query->result();
        if(count($result)>0){
            echo json_encode(array('status' => true, 'result'=>$result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get cities
    */
    public function getCities()
    {
        $data = json_decode(file_get_contents("php://input"));
        $province = $data->{'province'};
        $query = $this->db->query("select cities.id, cities.city from cities, provinces where provinces.provinceid=cities.provinceid and provinces.province='".$province."'");
        $result = $query->result();
        if(count($result)>0){
            echo json_encode(array('status' => true, 'result'=>$result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get area
    */
    public function getAreas()
    {
        $data = json_decode(file_get_contents("php://input"));
        $city = $data->{'city'};
        $query = $this->db->query("select areas.id, areas.area from cities, areas where cities.cityid=areas.cityid and cities.city='".$city."'");
        $result = $query->result();
        if(count($result)>0){
            echo json_encode(array('status' => true, 'result'=>$result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get area
    */
    public function getItemsOnMap()
    {
        $data = json_decode(file_get_contents("php://input"));
        $longitude = $data->{'longitude'};
        $latitude = $data->{'latitude'};
        $site = $this->boss_model->getSiteByDistance($longitude, $latitude);
        $event = $this->event_model->getEventByDistance($longitude, $latitude);
        $honey = $this->honey_model->getHoneyByDistance($longitude, $latitude);
        if(count($site)>0 || count($event)>0){
            echo json_encode(array('status' => true, 'site' => $site, 'event' => $event, 'honey' => $honey), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to subtract honey with the amount of user catch
    */
    public function catchHoney()
    {
        $data = json_decode(file_get_contents("php://input"));
        $no = $data->{'no'};
        $amount = $data->{'amount'};
        $user_id = $data->{'user_id'};
        $this->user_model->catchHoney($amount, $user_id);
        $result = $this->honey_model->catchHoney($no, $amount);
        if($result){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get list of goods
    */
    public function getGoodsList()
    {
        $result = $this->goods_model->getGoodsList();
        if(count($result)>0){
            echo json_encode(array('status' => true,'result' => $result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get information of good user selected
    */
    public function getGoodDetail()
    {
        $data = json_decode(file_get_contents("php://input"));
        $id = $data->{'id'};
        $result = $this->goods_model->getGoodDetail($id);
        if(count($result)>0){
            echo json_encode(array('status' => true,'result' => $result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get information of good and receiver address for exchange
    */
    public function orderExchange()
    {
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->{'user_id'};
        $good_id = $data->{'good_id'};
        $good = $this->goods_model->getGoodDetail($good_id);
        $address = $this->accept_address_model->getMainAddress($user_id);
        if(count($address)>0){
            echo json_encode(array('status' => true,'good' => $good, 'address' => $address), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to save information of exchange
    */
    public function setExchange()
    {
        $data = json_decode(file_get_contents("php://input"));
        $info['user_id'] = $data->{'user_id'};
        $info['good_id'] = $data->{'good_id'};
        $info['comment'] = $data->{'comment'};
        $info['submit_time'] = date("Y-m-d H:i:s");
        $result = $this->exchange_model->addExchange($info);
        if($result>0){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get all information of exchange
    */
    public function getExchange()
    {
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->{'user_id'};
        $result = $this->exchange_model->getExchange($user_id);
        if(count($result)>0){
            echo json_encode(array('status' => true, 'result' => $result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get information of an exchange by id
    */
    public function getExchangeDetail()
    {
        $data = json_decode(file_get_contents("php://input"));
        $exchange_id = $data->{'exchange_id'};
        $user_id = $data->{'user_id'};
        $result = $this->exchange_model->getExchangeDetail($exchange_id, $user_id);
        if(count($result)>0){
            echo json_encode(array('status' => true, 'result' => $result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get binding information of user
    */
    public function getBinding()
    {
        $data = json_decode(file_get_contents("php://input"));
        $user_id = $data->{'user_id'};
        $result = $this->binding_model->getBinding($user_id);
        if(count($result) > 0){
            echo json_encode(array('status' => true, 'result' =>$result), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to add binding information of user
    */
    public function addBinding()
    {
        $data = json_decode(file_get_contents("php://input"));
        $info['user_id'] = $data->{'user_id'};
        $info['receiver'] = $data->{'receiver'};
        $info['credit_no'] = $data->{'credit_no'};
        $info['id_no'] = $data->{'id_no'};
        $info['bank_phone'] = $data->{'bank_phone'};
        $info['bank'] = $data->{'bank'};
        $result = $this->binding_model->addBinding($info);
        if($result> 0){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to add binding history of user
    */
    public function addBindingHistory()
    {
        $data = json_decode(file_get_contents("php://input"));
        $userId = $data->{'user_id'};
        $info = $data->{'amount'};
        $result = $this->binding_model->addBindingHistory($userId,$info);
        if($result> 0){
            echo json_encode(array('status' => true), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get binding history of user
    */
    public function getPaymentHistory()
    {
        $data = json_decode(file_get_contents("php://input"));
        $userId = $data->{'user_id'};
        $payment = $this->binding_model->getPaymentHistory($userId);
        if(count($payment)> 0){
            echo json_encode(array('status' => true,'payment' => $payment), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }

    /*
    * this function is used to get all information of rule
    */
    public function getrules()
    {
        $rule = $this->rule_model->getRule();
        if(count($rule)> 0){
            echo json_encode(array('status' => true,'rule' => $rule), 200);
        } else {
            echo json_encode(array('status' => false), 200);
        }
    }


    /*
    * this function is used to get distance between two points
    */
    function distance($lat1, $lon1, $lat2, $lon2) {
        $theta = $lon1 - $lon2;
        $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
        $dist = acos($dist);
        $dist = rad2deg($dist);
        $miles = $dist * 60 * 1.1515;
        return ($miles * 1.609344);
    }

    /*
    * this function is used to upload image
    */
    public function image_upload()
    {
        if(isset($_FILES['file']['name']))
        {
            $config['upload_path'] = './uploads/';
            $config['allowed_types'] = 'jpg|jpeg|png|gif';
            $this->load->library('upload', $config);
            if(!$this->upload->do_upload('file'))
            {
                return $this->upload->display_errors();
            }
            else
            {
                $data = $this->upload->data();
                return $data["file_name"];
            }
        }
    }

    /*
    * this function is used to upload multiple image
    */
    public function multiple_image_upload()
    {

        $this->load->library('upload');

        $files = $_FILES;
        $count = count($_FILES['files']['name']);
        for($i=0; $i<$count; $i++)
        {           
            $_FILES['files']['name']= $files['files']['name'][$i];
            $_FILES['files']['type']= $files['files']['type'][$i];
            $_FILES['files']['tmp_name']= $files['files']['tmp_name'][$i];
            $_FILES['files']['error']= $files['files']['error'][$i];
            $_FILES['files']['size']= $files['files']['size'][$i];    

            $this->upload->initialize($this->set_upload_options());
            // $this->upload->do_upload('files[]');
            if (!$this->upload->do_upload('files[]'))
            {  
                $error =['error' => $this->upload->display_errors()];
            }
            else{
                $data = $this->upload->data();
                return $data["file_name"];
            }
        }
    }
    public function set_upload_options()
    {
        $config['upload_path'] = getcwd().'/uploads/';
        $config['allowed_types'] = 'gif|jpg|jpeg|png';
        $config['remove_spaces'] = true;
        return $config;
    }
}

/* End of file User_Manage.php */
/* Location: ./application/controllers/api/User_Manage.php */
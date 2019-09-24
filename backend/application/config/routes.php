<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	http://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There area two reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router what URI segments to use if those provided
| in the URL cannot be matched to a valid route.
|
*/

$route['default_controller'] = "login";
$route['404_override'] = 'error';
$route['dashboard'] = 'systemmanage/dashboard';

/*********** USER DEFINED ROUTES *******************/

$route['loginme'] = 'login/loginMe';

$route['Wxpay'] = 'Wxpay';
$route['Wxpay/confirm/(:any)'] = 'Wxpay/confirm/$1';
$route['Wxpay/pay_callback'] = 'Wxpay/pay_callback';

$route['logout'] = 'systemmanage/logout';
$route['roleListing'] = 'systemmanage/roleListing';
$route['userListing'] = 'systemmanage/userListing';
$route['userListing/(:num)'] = "systemmanage/userListing/$1";
$route['addNewUser'] = "systemmanage/addNewUser";
$route['addNew'] = "systemmanage/addNew";


$route['usermanage'] = 'usermanage';
$route['usermanage/(:num)'] = 'usermanage';
$route['userCoListing/(:num)/(:any)/(:any)/(:any)/(:any)'] = 'usermanage/userCollectListing/$1/$2/$3/$4/$5';
$route['userListingByFilter'] = 'usermanage/userListingByFilter';
$route['changeForbidden/(:num)'] = 'usermanage/changeForbidden/$1';
$route['userDetail/(:num)'] = 'usermanage/showUserDetail/$1';

$route['event'] = 'eventmanage';
$route['eventmanage/(:num)'] = 'eventmanage'; 
$route['eventListingByFilter'] = 'eventmanage/eventListingByFilter';
$route['eventListingByFilter/(:num)'] = 'eventmanage/eventListingByFilter';
$route['eventDetail/(:num)'] = 'eventmanage/showEventDetail/$1';

$route['newsevent'] = 'eventmanage/0';
$route['newseventmanage'] = 'eventmanage/index/0';
$route['newseventmanage/(:num)'] = 'eventmanage/index/0';
$route['newseventmanage/add'] = 'eventmanage/addItem';
$route['newseventDetail/(:num)'] = 'eventmanage/showNewsEventDetail/$1';
$route['newseventListingByFilter'] = 'eventmanage/eventListingByFilter/0';

$route['booking'] = 'bookingmange';
$route['bookingmanage/(:num)'] = 'bookingmanage';
$route['bookingListingByFilter'] = 'bookingmanage/bookingListingByFilter';
$route['bookingDetail/(:num)'] = 'bookingmanage/showBookingDetail/$1';

$route['roombookingmanage/(:num)'] = 'roombookingmanage';
$route['roombookingListingByFilter'] = 'roombookingmanage/bookingListingByFilter';
$route['roombookingDetail/(:num)'] = 'roombookingmanage/showBookingDetail/$1';

$route['member'] = 'membermanage';
$route['member/(:num)'] = 'membermanage';
$route['memberListingByFilter'] = 'membermanage/memberListingByFilter';

$route['message'] = 'message';
$route['message/(:num)'] = 'message';
$route['messageListingByFilter'] = 'message/itemListingByFilter';

$route['exchange'] = 'exchange';
$route['exchange/(:num)'] = 'exchange';
$route['exchangeListingByFilter'] = 'exchange/exchangeListingByFilter';
$route['exchangeDetail/(:num)'] = 'exchange/showExchangeDetail/$1';
$route['exchangeSend/(:num)'] = 'exchange/sendGood/$1';

$route['goods'] = 'goodsmanage';
$route['goods/(:num)'] = 'goodsmanage';
$route['goodsListingByFilter'] = 'goodsmanage/goodsListingByFilter';
$route['goodAdd'] = 'goodsmanage/goodAdd';
$route['goodsDetail/(:num)'] = "goodsmanage/goodsDetail/$1";
$route['goodsEdit/(:num)'] = "goodsmanage/goodsEdit/$1";

$route['binding'] = 'binding';
$route['binding/(:num)'] = 'binding';
$route['bindingListingByFilter'] = 'binding/bindingListingByFilter';
$route['bindingDetail/(:num)'] = 'binding/showBindingDetail/$1';
$route['bindingConfirm/(:num)'] = 'binding/bindingShowConfirm/$1';
$route['bindingConfirmed'] = 'binding/bindingConfirmed';

$route['rating'] = "rating";
$route['rating/(:num)'] = 'rating';
$route['ratingListingByFilter'] = 'rating/ratingListingByFilter';
$route['rulemanage'] = "rule";
$route['saveRule'] = "rule/saveRule";
$route['template/(:num)'] = "template/index/$1";
$route['saveTemplate'] = "template/saveItem";

$route['alarm'] = "alarm";
$route['alarm/(:num)'] = "alarm";

$route['editOld'] = "systemmanage/editOld";
$route['editOld/(:num)'] = "systemmanage/editOld/$1";
$route['editUser'] = "systemmanage/editUser";
$route['deleteUser/(:num)'] = "systemmanage/deleteUser/$1";
$route['deleteRole/(:num)'] = "systemmanage/deleteRole/$1";
$route['loadChangePass'] = "systemmanage/loadChangePass";
$route['changePassword'] = "systemmanage/changePassword";
$route['updateUserPassword'] = "systemmanage/updateUserPassword";
$route['pageNotFound'] = "systemmanage/pageNotFound";
$route['checkEmailExists'] = "systemmanage/checkEmailExists";

$route['forgotPassword'] = "login/forgotPassword";
$route['resetPasswordUser'] = "login/resetPasswordUser";
$route['resetPasswordConfirmUser'] = "login/resetPasswordConfirmUser";
$route['resetPasswordConfirmUser/(:any)'] = "login/resetPasswordConfirmUser/$1";
$route['resetPasswordConfirmUser/(:any)/(:any)'] = "login/resetPasswordConfirmUser/$1/$2";
$route['createPasswordUser'] = "login/createPasswordUser";
/*-----------------------API-------------------------*/
$route['api/addNewUser'] = "api/datamanage/addNewUser";
$route['api/getUserState'] = "api/datamanage/getState";
$route['api/getUserStateByOpenId'] = "api/datamanage/getUserStateByOpenId";
$route['api/getUserDetail'] = "api/datamanage/getUserDetail";
$route['api/setTodayFirst'] = "api/datamanage/setTodayFirst";


$route['api/getMyBooking'] = "api/datamanage/getMyBooking";
$route['api/getBookingDetail'] = "api/datamanage/getBookingDetail";
$route['api/cancelBooking'] = "api/datamanage/cancelBooking";
$route['api/setBookData'] = "api/datamanage/setBookData";
$route['api/addRating'] = "api/datamanage/addRating";
$route['api/getAllEvents'] = "api/datamanage/getEventByUser";
$route['api/getEventDetail'] = "api/datamanage/getEventDetail";
$route['api/addFeedback'] = "api/datamanage/addFeedback";
$route['api/getBookingDetailByEvent'] = "api/datamanage/getBookingDetailByEvent";
$route['api/cancelEvent'] = "api/datamanage/cancelEvent";
$route['api/getEventsByProvince'] = "api/datamanage/getEventByProvince";
$route['api/setFavouriteEvent'] = "api/datamanage/setFavouriteEvent";

$route['api/getMemberState'] = "api/datamanage/getMemberState";
$route['api/setMember'] = "api/datamanage/setMember";

$route['api/getFavouriteSite'] = "api/datamanage/getFavouriteSite";
$route['api/getSiteDetail'] = "api/datamanage/getSiteDetail";
$route['api/cancelFavouriteSite'] = "api/datamanage/cancelFavouriteSite";

$route['api/getRatingCountBySite'] = "api/datamanage/getRatingCountBySite";
$route['api/getRatingBySite'] = "api/datamanage/getRatingBySite";
$route['api/getRatingByEvent'] = "api/datamanage/getRatingByEvent";

$route['api/registerUser'] = "api/datamanage/registerUser";
$route['api/registerBoss'] = "api/datamanage/registerBoss";
$route['api/addAllowPic'] = "api/datamanage/addAllowPic";
$route['api/addIDPic1'] = "api/datamanage/addIDPic1";
$route['api/addIDPic2'] = "api/datamanage/addIDPic2";

$route['api/addAcceptAddress'] = "api/datamanage/addAcceptAddress";
$route['api/getAcceptAddress'] = "api/datamanage/getAcceptAddress";
$route['api/changeAcceptAddress'] = "api/datamanage/changeAcceptAddress";
$route['api/checkAcceptAddress'] = "api/datamanage/checkAcceptAddress";
$route['api/deleteAcceptAddress'] = "api/datamanage/deleteAcceptAddress";

$route['api/getSiteStatus'] = "api/datamanage/getSiteStatus";
$route['api/addSiteInfo'] = "api/datamanage/addSiteInfo";
$route['api/addSitePicture'] = "api/datamanage/addSitePicture";
$route['api/imageUpload'] = "api/datamanage/imageUpload";
$route['api/getTemplates'] = "api/datamanage/getTemplates";


$route['api/editSiteInfo'] = "api/datamanage/editSiteInfo";
$route['api/editSiteInfo1'] = "api/datamanage/editSiteInfo1";
$route['api/addSitePictureURL'] = "api/datamanage/addSitePictureURL";

$route['api/getBindingInfo'] = "api/datamanage/getBinding";
$route['api/addBindingInfo'] = "api/datamanage/addBinding";
$route['api/getPaymentHistory'] = "api/datamanage/getPaymentHistory";
$route['api/addBindingHistory'] = "api/datamanage/addBindingHistory";

$route['api/pay'] = "api/datamanage/pay";
$route['api/refund'] = "api/datamanage/refund";
$route['api/notify'] = "api/datamanage/notify";
$route['api/addBooking'] = "api/datamanage/addBooking";

$route['api/getProvinces'] = "api/datamanage/getProvinces";
$route['api/getCities'] = "api/datamanage/getCities";
$route['api/getAreas'] = "api/datamanage/getAreas";

$route['api/getGoodsList'] = "api/datamanage/getGoodsList";
$route['api/getGoodDetail'] = "api/datamanage/getGoodDetail";
$route['api/orderExchange'] = "api/datamanage/orderExchange";
$route['api/setExchange'] = "api/datamanage/setExchange";
$route['api/getExchange'] = "api/datamanage/getExchange";
$route['api/getExchangeDetail'] = "api/datamanage/getExchangeDetail";
$route['api/endExchange'] = "api/datamanage/endExchange";
$route['api/haveStadium'] = "api/datamanage/haveStadium";
$route['api/getItemsOnMap'] = "api/datamanage/getItemsOnMap";
$route['api/catchHoney'] = "api/datamanage/catchHoney";

$route['api/createEvent'] = "api/datamanage/addEvent";
$route['api/getRules'] = "api/datamanage/getRules";
$route['api/getopenid'] = "api/datamanage/getOpenid";

$route['api/getNewBookingAlarm'] = "api/datamanage/getNewBookingAlarm";
$route['api/getNewAlarm'] = "api/datamanage/getNewAlarm";
$route['api/getAlarm'] = "api/datamanage/getAlarm";
$route['api/getAllBoss'] = "api/datamanage/getAllBoss";
$route['api/getBackyard'] = "api/datamanage/getBackyard";

$route['api/getHoneyFriend'] = "api/datamanage/getHoneyFriend";

$route['api/test'] = "api/datamanage/test";
/* End of file routes.php */
/* Location: ./application/config/routes.php */
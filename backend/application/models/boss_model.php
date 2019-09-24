<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class boss_model extends CI_Model
{

    function addNewBoss($bossInfo, $user_id = -1)
    {
        $result = $this->db->query("select no from boss where boss_id=" . $user_id)->result();
        if (count($result) > 0) {
            $this->db->where("boss_id", $user_id);
            $this->db->update("boss", $bossInfo);
        } else {
            if ($user_id != -1) $bossInfo['boss_id'] = $user_id;
            $this->db->insert("boss", $bossInfo);
        }
        return true;
    }


    /**
     * This function is used to update the boss information
     * @param array $bossInfo : This is bosss updated information
     * @param number $bossId : This is boss id
     */
    function editboss($bossInfo, $bossId)
    {
        $this->db->where('bossId', $bossId);
        $this->db->update('boss', $bossInfo);

        return TRUE;
    }

    /**
     * This function is used to update the boss information
     * @param array $bossInfo : This is bosss updated information
     * @param number $bossId : This is boss id
     */
    function rewriteBoss($bossInfo, $bossNo)
    {
        $this->db->where('no', $bossNo);
        $this->db->update('boss', $bossInfo);

        return TRUE;
    }

    /**
     * This function is used to update the boss information
     * @param array $bossInfo : This is bosss updated information
     * @param number $bossId : This is boss id
     */
    function updateboss($bossInfo, $bossnickname)
    {
        $this->db->where('nickname', $bossnickname);
        $this->db->update('boss', $bossInfo);

        return TRUE;
    }

    /**
     * This function is used to delete the boss information
     * @param number $bossId : This is boss id
     * @return boolean $result : TRUE / FALSE
     */
    function deleteboss($bossId, $bossInfo)
    {
        $this->db->where('bossId', $bossId);
        $this->db->update('boss', $bossInfo);

        return $this->db->affected_rows();
    }

    /**
     * This function is used to get the detailed information of site
     * @param number $bossId : This is boss id
     * @return array $result :  information of the site
     */
    function getSiteDetail($bossId, $userId = 0, $bossNo = 0)
    {
        $this->db->select("boss.*,user.phone");
        $this->db->select("provinces.province, cities.city, areas.area");
        $this->db->select("boss.province as province_id, boss.city as city_id, boss.area as area_id ");
        $this->db->from("boss");
        $this->db->join("provinces", "provinces.id = boss.province");
        $this->db->join("cities", "cities.id = boss.city");
        $this->db->join("areas", "areas.id = boss.area");
        $this->db->join("user", "user.no = boss.boss_id");
        $this->db->join("event", 'event.organizer_id = boss.boss_id and event.organizer_id != 0', 'left');
        if ($bossId != '0')
            $this->db->where("boss.boss_id", $bossId);
        else
            $this->db->where("boss.no", $bossNo);
        $query = $this->db->get();

        $bossItem = $query->row();
        $rating_result = $this->rating_model->getRatingByBoss($bossId);
        $rating_amount = count($rating_result);
        $point = 0.0;
        if ($rating_amount > 0) {
            $sum = 0;
            foreach ($rating_result as $key => $value) {
                if (isset($value->point))
                    $sum += $value->point;
            }
            $point = $sum / $rating_amount;
        }
        $bossItem->rating_amount = $rating_amount;
        $bossItem->point = $point;
        $bossItem->favourite_count = $this->getFavouriteCount($bossItem->boss_id, $bossItem->no);
        $sportType = $bossItem->site_type_detail;
        $sportType = explode(',', $sportType);

        $eventTypes = $this->event_model->getEventType();
        $str = '';
        $i = 0;
        foreach ($sportType as $item) {
            $i++;
            if ($i > 1) $str .= ' ';
            $str .= $eventTypes[intval($item)];
        }
        $bossItem->site_type_detail = $str;

        return array($bossItem);

    }


    /**
     * This function is used to get the detailed information of site
     * @param number $bossId : This is boss id
     * @return array $result :  information of the site
     */
    function getSiteRoomDataForUpdate($bossId)
    {
        if ($bossId == 0) return array();
        $this->db->select("*");
        $this->db->from('room');
        $this->db->where('boss_id', $bossId);
        $this->db->order_by('submit_time', 'desc');
        $query = $this->db->get();
        $result = $query->row();

        $this->db->select("*");
        $this->db->from('room');
        $this->db->where('boss_id', $bossId);
        if (count($result) > 0)
            $this->db->where('submit_time', $result->submit_time);

        $query = $this->db->get();

        return $query->result();
    }

    /**
     * This function is used to get the detailed information of site
     * @param number $bossId : This is boss id
     * @return array $result :  information of the site
     */
    function getSiteRoomData($bossId, $type = '')
    {
        if ($bossId == 0) return array();
        $this->db->select("*");
        $this->db->from('room');
        $this->db->where('boss_id', $bossId);
        $this->db->where('submit_time < ', date("Y-m-d H:i:s"));
        $this->db->order_by('submit_time', 'desc');
        $query = $this->db->get();
        $result = $query->row();
        if (count($result) <= 0 || $type == 'admin') {
            $this->db->select("*");
            $this->db->from('room');
            $this->db->where('boss_id', $bossId);
            $this->db->order_by('submit_time', 'desc');
            $query = $this->db->get();
            $result = $query->row();
        }
        $this->db->select("*");
        $this->db->from('room');
        $this->db->where('boss_id', $bossId);
        if (count($result) > 0)
            $this->db->where('submit_time', $result->submit_time);

        $query = $this->db->get();

        return $query->result();
    }

    /**
     * This function is used to get the detailed information of site
     * @param number $bossId : This is boss id
     * @return array $result :  information of the site
     */
    function getBossRoomData($bossId, $end_date = '')
    {
        if ($bossId == 0) return array();
        $this->db->select("*");
        $this->db->from('room_updated');
        $this->db->where('boss_id', $bossId);
        $this->db->where('active_date >= ', date("Y-m-d"));
        if ($end_date != '')
            $this->db->where('active_date <= ', date("Y-m-d H:i:s", strtotime('+7 days')));
        $this->db->order_by('active_date', 'asc');
        $query = $this->db->get();

        return $query->result();
    }

    function getBossBackendRoomData($bossId)
    {
        if ($bossId == 0) return array();
        $this->db->select("*");
        $this->db->from('room_updated');
        $this->db->where('boss_id', $bossId);
//        $this->db->where('active_date >= ', date("Y-m-d"));
        $this->db->order_by('active_date', 'asc');
        $query = $this->db->get();

        return $query->result();
    }

    /**
     * This function is used to get the detailed information of site
     * @param number $bossId : This is boss id
     * @return array $result :  information of the site
     */
    function updateBossRoomData($item, $isClear = false)
    {
        $bossId = $item->boss_id;
        $reqRoomInfo = json_decode($item->room_info);
        if ($bossId == 0) return array();
        $this->db->select("*");
        $this->db->from('room_updated');
        $this->db->where('boss_id', $bossId);
        $this->db->where('info_type', $item->info_type);
        $this->db->where('active_date', $item->active_date);
        $result = $this->db->get()->row();
        if (count($result) == 0) {
            if (!$isClear && count($reqRoomInfo) > 0) {
                $this->db->insert('room_updated', $item);
                $result = $this->db->insert_id();
            }
        } else {
            if ($isClear) {
                $dbRoomInfo = json_decode($result->room_info);
                $targetRoomInfo = array();
                foreach ($dbRoomInfo as $dbRoom) {
                    $isExist = false;
                    if (count($reqRoomInfo) > 0) {
                        foreach ($reqRoomInfo as $reqRoom) {
                            if ($dbRoom->room_id != $reqRoom->room_id) continue;
                            if ($dbRoom->start_time != $reqRoom->start_time) continue;
                            if ($dbRoom->end_time != $reqRoom->end_time) continue;
                            $isExist = true;
                            break;
                        }
                    }
                    if ($isExist) continue;
                    array_push($targetRoomInfo, $dbRoom);
                }
            } else {
                $dbRoomInfo = json_decode($result->room_info);
                if (count($reqRoomInfo) > 0) {
                    foreach ($reqRoomInfo as $reqRoom) {
                        array_push($dbRoomInfo, $reqRoom);
                    }
                }
                $targetRoomInfo = $dbRoomInfo;
            }
            if (count($targetRoomInfo) > 0) {
                $item->room_info = json_encode($targetRoomInfo);
                $this->db->set($item);
                $this->db->where('boss_id', $item->boss_id);
                $this->db->where('info_type', $item->info_type);
                $this->db->where('active_date', $item->active_date);
                $this->db->update('room_updated');
            } else {
                $this->db->where('boss_id', $item->boss_id);
                $this->db->where('info_type', $item->info_type);
                $this->db->where('active_date', $item->active_date);
                $this->db->delete('room_updated');
            }
            $result = $result->id;
        }

        return $result;
    }

    /**
     * This function is used to get the detailed information of site
     * @param number $bossId : This is boss id
     * @return array $result :  information of the site
     */
    function getSiteBookData($bossId, $user_id = 0)
    {
        if ($bossId == 0) return array();
        $this->db->select("*");
        $this->db->from("room_booking");
        $this->db->where("boss_id", $bossId);
        $this->db->where("state !=", 2);
        $query = $this->db->get();
        $result = $query->result();
        return $result;
    }

    /*this function is for get place detail from event id*/
    function getSiteDetailFromEventId($eventId)
    {
        $this->db->select("boss.*, user.no, user.sport_type, user.name, user.role");
        $this->db->from("event");
        $this->db->join("boss", 'event.organizer_id = boss.boss_id', 'left');
        $this->db->join("user", 'event.organizer_id = user.no', 'left');
        $this->db->where("event.id", $eventId);
        $query = $this->db->get();
        $result = array();
        $result = $query->result();
        $boss_info = $result[0];
        if ($boss_info->role == '2') {
            $boss_info->boss_id = $boss_info->no;
            $boss_info->site_name = $boss_info->name;
            $boss_info->site_type_detail = $boss_info->sport_type;

        }
        $point = number_format((float)$this->getSiteRatingPoint($boss_info->boss_id), 1, '.', '');
        $response_data = array('boss_id' => $boss_info->boss_id, 'site_name' => $boss_info->site_name,
            'site_type_detail' => $boss_info->site_type_detail,
            'point' => $point);
        return $response_data;
    }

    /*this function is for get place detail from event id*/
    function getSiteDetailFromRoomId($bookId)
    {
        $this->db->select("boss.*");
        $this->db->from("boss");
        $this->db->join("room_booking", 'room_booking.boss_id = boss.boss_id');
        $this->db->where("room_booking.id", $bookId);
        $query = $this->db->get();
        $result = array();
        $result = $query->result();
        $boss_info = $result[0];
        $point = number_format((float)$this->getSiteRatingPoint($boss_info->boss_id), 1, '.', '');
        $response_data = array('boss_id' => $boss_info->boss_id, 'site_name' => $boss_info->site_name,
            'site_type_detail' => $boss_info->site_type_detail,
            'point' => $point);
        return $response_data;
    }

    function getSiteRatingPoint($bossId)
    {
        $result = $this->rating_model->getRatingByBoss($bossId);
        if (count($result) > 0) {
            $sum = 0;
            foreach ($result as $key => $value) {
                if (isset($value->point))
                    $sum += $value->point;
            }
            return $sum / count($result);
        } else {
            return 0;
        }

    }

    /**
     *This function is used to get the state of which the site is in the list of favourite sites of the current user
     * @param number $userId : This is the id of current user
     * @param number $bossId : This is the id of boss of the wanted site
     * @return boolean $result : state of the site
     */
    function isFavourite($userId, $bossId, $bossNo = 0)
    {
        $this->db->select("no");
        $this->db->from("favourite");
        $this->db->where("user_id", $userId);
        if ($bossNo != 0)
            $this->db->where("boss_no", $bossNo);
        else
            $this->db->where("boss_id", $bossId);
        $query = $this->db->get();
        $result = $query->result();
        return (count($result) > 0) ? true : false;
    }

    function isFavouriteState($userId, $bossId, $bossNo = 0)
    {
        $this->db->select("no");
        $this->db->from("favourite");
        $this->db->where("user_id", $userId);
        if ($bossNo != 0)
            $this->db->where("boss_no", $bossNo);
        else
            $this->db->where("boss_id", $bossId);
        $query = $this->db->get();
        $result = $query->result();
        return (count($result) > 0) ? 1 : 0;
    }

    /**
     *This function is used to get count of favourite about site
     * @param number $bossId : This is the id of boss of the wanted site
     * @return number $result : count of the favourite
     */
    function getFavouriteCount($bossId, $bossNo = 0)
    {
//        if ($bossId == 0) return 0;
        $this->db->select("no");
        $this->db->from("favourite");
        if ($bossNo != 0)
            $this->db->where("boss_no", $bossNo);
        else
            $this->db->where("boss_id", $bossId);
        $query = $this->db->get();
        $result = $query->result();
        return count($result);
    }

    /**
     * This function is used to get the pictures of the site
     * @param number $bossId : This is boss id
     * @return array $result : picture URL of the site
     */
    function getSitePictures($bossId)
    {
        $this->db->select('order');
        $this->db->select('concat_ws("?p=",picture, second(now())) as picture');
//        $this->db->select('picture');
        $this->db->from("site_picture");
        $this->db->where("boss_id", $bossId);
        $this->db->order_by('order');
        $query = $this->db->get();
        return $query->result();
    }

    function getAreaName($areaId)
    {
        $this->db->select("AREA");
        $this->db->from("areas");
        $this->db->where("id", $areaId);
        $query = $this->db->get();
        $result = array();
        $result = $query->result();
        return $result[0]->AREA;
    }

    /**
     * This function is used to get status of the site
     * @param number $bossId : This is boss id
     * @return boolean $result : status of inputing information
     */
    function getSiteStatus($bossId)
    {
        if ($bossId == 0) return array();
        $this->db->select("*");
        $this->db->from("boss");
        $this->db->where("boss_id", $bossId);
        $query = $this->db->get();
        $result = $query->result();
        return $result;
    }

    /**
     * This function is used to add information of the site
     * @param number $bossId : This is boss id
     * @param array $info : This is the array of information
     * @return boolean $result : status of inputing information
     */
    function addSiteInfo($bossId, $info)
    {
        $this->db->where("boss_id", $bossId);
        $this->db->update("boss", $info);
        $result = $this->db->affected_rows();
        return (count($result) > 0) ? true : false;
    }

    /**
     * This function is used to edit information of the site
     * @param number $bossId : This is boss id
     * @param array $info : This is the array of information
     * @return boolean $result : status of inputing information
     */
    function editSiteInfo($bossId, $info)
    {
        $this->db->trans_start();
        $this->db->where("boss_id", $bossId);
        $this->db->update("boss", $info);
        $result = $this->deleteSitePicture($bossId);
        $this->db->trans_complete();
        //$result = $this->db->affected_rows();
        return (count($result) > 0) ? true : false;
    }

    /**
     * This function is used to delete all pictures of site
     * @param number $bossId : This is boss id
     * @return boolean $result : status of delete
     */
    function deleteSitePicture($bossId)
    {
        $this->db->where("boss_id", $bossId);
        $result = $this->db->delete("site_picture");
        return $result;
    }

    /**
     * This function is used to edit information of the site
     * @param number $bossId : This is boss id
     * @param string $picture : This is the filename of picture
     * @return boolean $result : status of inputing information
     */
    function addSitePicture($bossId, $picture, $id = 0)
    {
        $info['boss_id'] = $bossId;
        $info['picture'] = $picture;
        $info['order'] = $id;
        $this->db->insert('site_picture', $info);
        $result = $this->db->affected_rows();
        return ($result > 0) ? true : false;
    }

    function replaceSitePicture($bossId, $picture, $id = 0)
    {
        $this->db->where('boss_id', $bossId);
        $this->db->where('order', $id);
        $this->db->from('site_picture');
        $query = $this->db->get();
        if (count($query->result()) == 0) {
            $this->addSitePicture($bossId, $picture, $id);
        } else {
            $info['picture'] = $picture;
            $this->db->where('boss_id', $bossId);
            $this->db->where('order', $id);
            if ($picture != '')
                $this->db->update('site_picture', $info);
            else
                $this->db->delete('site_picture');

            $result = $this->db->affected_rows();
        }
        $this->db->where('boss_id', $bossId);
        $this->db->from('site_picture');
        $query = $this->db->get();
        $pictures = $query->result();
        $j = 0;
        if (count($pictures) > 0) {
            foreach ($pictures as $item) {
                if ($item->picture == '') {
                    $this->db->where('no', $item->no);
                    $this->db->delete('site_picture');
                } else {
//                    $this->db->where('no', $item->no);
//                    $this->db->update('site_picture', array('order' => $j));
                }
                $j++;
            }
        }

        return ($result > 0) ? true : false;
    }

    function getActivityByBoss($boss_id)
    {
        if ($boss_id == 0) return null;
        $this->db->select("event.id, event.pic, event.name, event.type, event.start_time, event.end_time");
        $this->db->select("event.state, event.cost,provinces.province, cities.city, areas.area, event.detail_address");
        $this->db->select("user.role, user.avatar, sum(booking.reg_num) as register_num");
        $this->db->from("event");
        $this->db->join("provinces", "provinces.id=event.province");
        $this->db->join("cities", "cities.id=event.city");
        $this->db->join("areas", "areas.id=event.area");
        $this->db->join("user", "user.no = event.organizer_id");
        $this->db->join("booking", "event.id = booking.event_id and booking.state = event.state", "left");
        $this->db->where("event.organizer_id", $boss_id);
        $this->db->where('event.state', 0);
        $this->db->group_by("event.id");
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get the sites in 5km from current user
     * @param float $longitude : This is longitude of current user
     * @param float $latitude : This is latitude of the current user
     * @return array $result : information of sites found
     */

    function getSiteByDistanceApi($longitude, $latitude, $userId, $city_id = 0)
    {
        $query = $this->db->query('select no, boss_id, site_name, longitude, latitude, site_type, area 
            from boss 
            where site_type > -1 and (( 6371 * acos( cos( radians(' . $latitude . ') ) * cos( radians( latitude) )
                    * cos( radians(longitude) - radians(' . $longitude . ')) + sin(radians(' . $latitude . '))
                    * sin( radians(latitude))))<=5 or city = ' . $city_id . ') ');

        $response_array = array();
        foreach ($query->result() as $item) {
            $site_icon = "map_icon.png";
            $picture_array = array();
            $picture_array = $this->getSitePictures($item->boss_id);
            if (count($picture_array) > 0) {
                $site_icon = $picture_array[0]->picture;
            }

            $area_name = $this->getAreaName($item->area);
            $isFavourite = 0;
            $event_state = 0;
            $point = 0;
            $favouriteCount = 0;
            $room_state = 0;
            $bossgroup_state = 0;
            $isFavourite = $this->isFavouriteState($userId, $item->boss_id, $item->no);
            $favouriteCount = $this->getFavouriteCount($item->boss_id, $item->no);
            if ($item->boss_id != 0) {
                $event_array = $this->db->query("select id from event where state = 0 and organizer_id = " . $item->boss_id)->row();
                if (count($event_array) > 0) {
                    $event_state = 1;
                }
                $point = number_format((float)$this->getSiteRatingPoint($item->boss_id), 1, '.', '');

                $room_array = $this->db->query("select id from room where boss_id = " . $item->boss_id)->row();
                if (count($room_array) > 0) {
                    $room_state = 1;
                }
                $bossgroup_array = $this->db->query("select no from bossgroup where boss_id = " . $item->boss_id)->row();
                if (count($bossgroup_array) > 0) {
                    $bossgroup_state = 1;
                }
            }
            $distance = $this->distance($latitude, $longitude, $item->latitude, $item->longitude, "K");
            $show_distance_str = "0km";
            if ($distance > 1) {
                $show_distance_str = number_format((float)$distance, 1, '.', '') . "km";
            } else {
                $show_distance_str = intval($distance * 1000) . "m";
            }
            $picture = $this->getSitePictures($item->boss_id);
            $response_data = array('boss_no' => $item->no, 'boss_id' => $item->boss_id, 'site_name' => $item->site_name,
                'longitude' => $item->longitude, 'latitude' => $item->latitude, 'site_type' => $item->site_type,
                'site_icon' => $site_icon, 'point' => $point, 'event_state' => $event_state,
                'room_state' => $room_state, 'bossgroup_state' => $bossgroup_state,
                'areaId' => $item->area, 'areaName' => $area_name, 'isfavourite' => $isFavourite,
                'favourite_count' => $favouriteCount, 'show_distance_str' => $show_distance_str, 'picture' => $picture,
                'distance' => number_format((float)$distance, 1, '.', ''));
            array_push($response_array, $response_data);
        }
        return $response_array;
    }

    function distance($lat1, $lon1, $lat2, $lon2, $unit)
    {
        if ($lon1 == $lon2 && $lat1 == $lat2) return 0;
        $theta = $lon1 - $lon2;
        $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
        $dist = acos($dist);
        $dist = rad2deg($dist);
        $miles = $dist * 60 * 1.1515;
        $unit = strtoupper($unit);

        if ($unit == "K") {
            return ($miles * 1.609344);
        } else if ($unit == "N") {
            return ($miles * 0.8684);
        } else {
            return $miles;
        }
    }

    function getSiteByDistance($longitude, $latitude)
    {
        $this->db->select("boss_id, longitude, latitude, site_type, map_icon as site_icon");
        $this->db->from("boss");
        $this->db->where("( 6371 * acos( cos( radians($latitude) ) * cos( radians( latitude) ) 
   * cos( radians(longitude) - radians($longitude)) + sin(radians($latitude)) 
   * sin( radians(latitude))))<=5");
        $query = $this->db->get();
        return $query->result();

    }
}

/* End of file boss_model.php */
/* Location: .application/models/boss_model.php */

//added new funtions


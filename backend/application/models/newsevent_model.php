<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class newsevent_model extends CI_Model
{
    /**
     * This function is used to get the event listing count
     * @param string $searchText : This is optional search text
     * @return number $count : This is row count
     */
    function eventListingCount($searchStatus = null , $searchText = '', $searchType, $searchRole, $searchState)
    {
        $query = "select count(*) as total_count 
                    from newsevent as event, `user` 
                    where event.organizer_id = user.no";
        if($searchRole != 10){
            $query = $query." and user.role = " . $searchRole ;
        }
        if($searchState != 10){
            $query = $query." and event.state = " . $searchState ;
        }
        if($searchType != 100){
            $query = $query." and event.type = " . $searchType;
        }
        if (!empty($searchText)) {
            if(isset($searchStatus)){
                if ($searchStatus == '0') {
                    $query = $query." and (event.name LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '1') {
                    $query = $query." and (event.agent_name LIKE '%" . $searchText . "%')";
                } else {
                    $query = $query." and (user.phone LIKE '%" . $searchText . "%')";
                }
            }
        }
        $result = $this->db->query($query);

        return $result->row()->total_count;
    }

    /**
     * This function is used to get the event listing count
     * @param string $searchText : This is optional search text
     * @param number $page : This is pagination offset
     * @param number $segment : This is pagination limit
     * @return array $result : This is result
     */
    function eventListing($searchStatus = null, $searchText = '', $searchType, $searchRole, $searchState, $page, $segment)
    {
        $query = "select event.id, event.name, event.type, event.state, event.reg_count, 
                    event.reg_time, event.start_time, event.end_time, event.cost, 
                    user.nickname, user.phone
                    from newsevent as event, `user` 
                    where event.organizer_id = user.no";
        if($searchRole != 10){
            $query = $query." and user.role = " . $searchRole ;
        }
        if($searchState != 10){
            $query = $query." and event.state = " . $searchState ;
        }
        if($searchType != 100){
            $query = $query." and event.type = " . $searchType;
        }
        if (!empty($searchText)) {
            if(isset($searchStatus)){
                if ($searchStatus == '0') {
                    $query = $query." and (event.name LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '1') {
                    $query = $query." and (event.agent_name LIKE '%" . $searchText . "%')";
                } else {
                    $query = $query." and (user.phone LIKE '%" . $searchText . "%')";
                }
            }
        }
        $query=$query." order by event.reg_time desc";
        if($segment!=""){
            $query = $query." limit ".$segment.", ".$page;
        }
        else{
            $query = $query." limit 0, ".$page;
        }
        $result = $this->db->query($query);

        return $result->result();        
    }

    function getEventType()
    {
        $this->db->select('*');
        $this->db->from('event_type');
        $query = $this->db->get();

        return $query->result();
    }

/**
     * This function is used to get event detail with bookingId
     * @param {number} $bookingId : This is booking id
     * @return {mixed} $result : This is searched result
     */
    function getEventDetailByBookingId($bookingId)
    {
        $this->db->select("event.name,event.cost, user.name as username, user.role,event.id");
        $this->db->from("event");
        $this->db->join("booking", "booking.event_id = event.id");
        $this->db->join("`user`", "user.no = event.organizer_id");
        $this->db->where("booking.id", $bookingId);
        $query = $this->db->get();
        return $query->result();
    }
/**
     * This function is used to get event detail with eventId
     * @param {number} $eventId : This is event id
     * @param {number} $userId : This is user id
     * @return array $result : This is searched result
     */
    function getEventDetailById($eventId, $userId = 0)
    {
        $event_state = $this->db->query("select state from event where id=".$eventId)->result();
        if($userId!=0){
            $this->db->select("user.role");
            $this->db->from("user, event");
            $this->db->where("event.id", $eventId);
            $this->db->where("user.no = event.organizer_id");
            $query = $this->db->get();
            $result = $query->result();
            if($result[0]->role == 1)
            {
                $query = $this->db->query("SELECT event.id, event.pic, event.type,event.name AS eventName, event.limit, event.cost, event.start_time, event.agent_name, event.agent_phone,
                    event.end_time,event.comment,  provinces.province, cities.city,areas.area, event.detail_address, event.state, event.id,
                    boss.boss_id,boss.site_name, user.name, user.phone, user.role, count(favourite_event.`user_id`)>0 AS favor_state, sum(booking.reg_num) as current_member
                FROM  `user`, boss, newsevent as event
                LEFT JOIN booking ON  booking.event_id = event.id and booking.state=".$event_state[0]->state."
                LEFT JOIN favourite_event ON favourite_event.`event_id`=event.id AND favourite_event.`user_id` = ".$userId."
                WHERE event.id = ".$eventId." AND user.no = event.organizer_id AND boss.boss_id = user.no GROUP BY event.id");
            }
            else
            {
                $query = $this->db->query("SELECT event.id, event.pic, event.type,event.name AS eventName, event.limit, event.cost, event.start_time, event.agent_name, event.agent_phone,
                    event.end_time,event.comment,  provinces.province, cities.city,areas.area, event.detail_address, event.state, event.id,
                    user.name, user.phone, user.role, count(favourite_event.`user_id`)>0 AS favor_state, sum(booking.reg_num) as current_member
                FROM  `user`, `event`
                LEFT JOIN cities ON cities.id=event.city
                LEFT JOIN areas ON areas.id=event.area
                LEFT JOIN provinces ON provinces.id=event.province
                LEFT JOIN favourite_event ON favourite_event.`event_id`=event.id AND favourite_event.`user_id` = ".$userId."
                LEFT JOIN booking ON  booking.event_id = event.id  and booking.state=".$event_state[0]->state."
                WHERE event.id = ".$eventId." AND user.no = event.organizer_id GROUP BY event.id");
            }
        }
        else{
            $this->db->select("user.role");
            $this->db->from("user, event");
            $this->db->where("event.id", $eventId);
            $this->db->where("user.no = event.organizer_id");
            $query = $this->db->get();
            $result = $query->result();
            if($result[0]->role == 1)
            {
                $query = $this->db->query("SELECT event.id, event.pic, event.type,event.name AS eventName, event.limit, event.cost, event.start_time, event.agent_phone,
                    event.end_time,event.comment,  provinces.province, cities.city,areas.area, event.detail_address, event.state, event.id,
                    boss.boss_id,boss.site_name, user.name, user.phone, user.role, sum(booking.reg_num) as current_member
                FROM  `user`, boss, `event`
                LEFT JOIN cities ON cities.id=event.city
                LEFT JOIN areas ON areas.id=event.area
                LEFT JOIN provinces ON provinces.id=event.province
                LEFT JOIN booking ON  booking.event_id = event.id  and booking.state=".$event_state[0]->state."
                WHERE event.id = ".$eventId." AND user.no = event.organizer_id AND boss.boss_id = user.no GROUP BY event.id");
            }
            else
            {
                $query = $this->db->query("SELECT event.id, event.pic, event.type,event.name AS eventName, event.limit, event.cost, event.start_time, event.agent_phone,
                    event.end_time,event.comment,event.additional,  provinces.province, cities.city,areas.area, event.detail_address, event.state, event.id,
                    user.name, user.phone, user.role, sum(booking.reg_num) as current_member
                FROM  `user`, `event`
                LEFT JOIN cities ON cities.id=event.city
                LEFT JOIN areas ON areas.id=event.area
                LEFT JOIN provinces ON provinces.id=event.province
                LEFT JOIN booking ON  booking.event_id = event.id  and booking.state=".$event_state[0]->state."
                WHERE event.id = ".$eventId." AND user.no = event.organizer_id GROUP BY event.id");
            }
        }
        return $query->result();
    }
    
    /**
     * This function used to get event's forbidden information by id
     * @param number $Id : This is event id
     * @return array $result : This is event information
     */
    function getOrganizerId($id)
    {
        $this->db->select('organizer_id');
        $this->db->from('event');
        $this->db->where('id', $id);
        $query = $this->db->get();
        return $query->result();
    }

    function getEventById($eventId)
    {
        $this->db->select("event.id,event.name,event.cost,user.name as username,user.role");
        $this->db->from("user, event");
        $this->db->where("user.no = event.organizer_id");
        $this->db->where("event.id", $eventId);
        $query = $this->db->get();

        return $query->result();
    }

    /**
     * This function is used to delete the event information
     * @param number $eventId : This is event id
     * @return boolean $result : TRUE / FALSE
     */
    function deleteEvent($eventId)
    {
        $this->db->where('id', $eventId);
        $this->db->delete('event');
        return true;
    }

    /**
     * This function is used to change event state
     * @param number $eventId : This is event id
     * @param number $state : This is event state
     */
    function updateStateById($eventId, $state)
    {
        $this->db->where('id', $eventId);
        $this->db->update('event', $state);
        return $this->db->affected_rows();
    }

    function getRegisterNum($events)
    {
        $index = 0;
        $result = array();
        foreach($events as $event){
            $query = $this->db->query("select sum(booking.reg_num) as reg_num from booking, event where booking.event_id=event.id and booking.state = event.state and event.id=".$event->event_id)->result();
            $result[$index] = $query[0]->reg_num;
            $index++;
        }
        return $result;
    }

    /**
     * This function is used to change event state with now()
     * @return array $event : This is event changed state
     */
    function checkStateByTime()
    {
        $this->db->select("id, organizer_id as user_id, name");
        $this->db->from("event");
        $this->db->where("TIME_TO_SEC(TIMEDIFF(event.end_time, now()))<0");
        $this->db->where("state", 0);
        $query = $this->db->get();
        $result = $query->result();
        $state['state'] = 1;
        foreach($result as $eventId)
        {
            $this->updateStateById($eventId->id, $state);
        }

        return $result;
    }

    /**
     * This function is used to change event state with now()
     * @return array $event : This is event changed state
     */
    function checkStateByAlarm()
    {
        $result = $this->db->query("SELECT booking.user_id, event.name, event.id
             FROM event, booking
              WHERE event.state=0
               AND booking.`event_id` = event.id 
               AND booking.state=0 and TIME_TO_SEC(TIMEDIFF(event.start_time, booking.submit_time))>18000
               AND TIME_TO_SEC(TIMEDIFF(event.start_time, NOW()))<18000 and event.is_checked=0;")->result();
        $alarm['submit_time'] = date("Y-m-d H:i:s");
        $alarm['type'] = 9;
        foreach($result as $event)
        {
            $this->load->model("alarm_user_model");
            $alarm['user_id'] = $event->user_id;
            $alarm['event_type'] = $event->name;
            $this->alarm_user_model->addAlarm($alarm);
            $this->db->query("update event set is_checked=1 where id=".$event->id);
        }
        return true;
    }

    /**
     * This function is used to get event with user id
     * @return array $event : This is event changed state
     */
    function getEventByUser($user_id, $state)
    {
        $this->db->select("event.id, event.pic, event.name, event.type, event.start_time, event.end_time, event.state, event.cost,provinces.province, cities.city, areas.area, event.detail_address, user.role, user.avatar, sum(booking.reg_num) as register_num");
        $this->db->from("event");
        $this->db->join("provinces", "provinces.id=event.province");
        $this->db->join("cities", "cities.id=event.city");
        $this->db->join("areas", "areas.id=event.area");
        $this->db->join("user", "user.no = event.organizer_id");
        $this->db->join("booking", "event.id = booking.event_id and booking.state = event.state","left");
        $this->db->where("event.organizer_id", $user_id);
        if($state!=3){
            $this->db->where('event.state', $state);
        }
        $this->db->group_by("event.id");
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to create event
     * @return array $event : This is event changed state
     */
    function addEvent($user_role, $event, $member_state)
    {
        if($user_role == 2 && $event['publicity']==1)
        {
            if($event['additional'] == 1 && $member_state==0){
                $this->db->select("honey");
                $this->db->from("user");
                $this->db->where("no", $event['organizer_id']);
                $query = $this->db->get();
                $honey = $query->result();
                $rule = $this->db->query("select value from rule where no = 9")->result();
                $remain['honey'] = $honey[0]->honey - $rule[0]->value;
                $this->db->where("no", $event['organizer_id']);
                $this->db->update("user", $remain);
            }
        }
        $this->db->insert("event", $event);
        return true;
    }

    /**
     * This function is used to get the events in 5km from current user
     * @param float $longitude : This is longitude of current user
     * @param float $latitude: This is latitude of the current user알
     * @return array $result : information of events found
     */
    function getEventByDistance($longitude, $latitude)
    {
        $this->db->select("event.id, event.longitude, event.latitude, event.type, event.state, user.avatar, user.role, user.no, sum(booking.reg_num) as register_num, event.additional");
        $this->db->from("event");
        $this->db->join("user", "user.no = event.organizer_id");
        $this->db->join("booking", "booking.event_id=event.id and booking.state = event.state");
        $this->db->where("( 6371 * acos( cos( radians(".$latitude.") ) * cos( radians( event.latitude) ) 
   * cos( radians(event.longitude) - radians($longitude)) + sin(radians($latitude)) 
   * sin( radians(event.latitude))))<=10");
        $this->db->where("event.publicity", 1);
        $this->db->where("event.state", 0);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get the events in 5km from current user
     * @param float $longitude : This is longitude of current user
     * @param float $latitude: This is latitude of the current user
     * @return array $result : information of events found
     */
    function getEventByProvince($province, $city, $userId)
    {
        $this->db->select("event.id, event.type, event.cost, event.start_time, event.end_time, sum(booking.reg_num) as current_member, 
            provinces.province, cities.city, areas.area, event.detail_address, event.name, user.avatar, user.role,count(favourite.no) as is_favor ");
        $this->db->from("event");
        $this->db->join("cities", "cities.id=event.city");
        $this->db->join("areas", "areas.id=event.area");
        $this->db->join("provinces", "provinces.id = event.province");
        $this->db->join("booking", "booking.event_id = event.id and event.state=booking.state", "left");
        $this->db->join("favourite", "favourite.boss_id = event.organizer_id and favourite.user_id=".$userId, "left");
        $this->db->join("user", "user.no = event.organizer_id", "left");
        if($province == '北京市' || $province=='上海市' || $province==' 天津市' || $province=='重庆市')
        {
            $this->db->where('provinces.province', $province);
        }
        else{
            $this->db->where("cities.city", $city);
        }
        $this->db->where("event.publicity", 1);
        $this->db->where("event.state", 0);
        $this->db->order_by("event.reg_time", "desc");
        $this->db->group_by("event.id");
        $query = $this->db->get();
        $result =  $query->result();
        return $result;
    }
}

/* End of file event_model.php */
/* Location: .application/models/event_model.php */

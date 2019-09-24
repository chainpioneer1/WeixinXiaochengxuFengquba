<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class roombooking_model extends CI_Model
{
    /**
     * This function is used to change event state with now()
     * @return array $event : This is event changed state
     */
    function checkStateByTime()
    {

        //update state from 0 to 1  (paid -> active)
        $this->db->select("id");
        $this->db->from("room_booking");
        $this->db->where("TIME_TO_SEC(TIMEDIFF(room_booking.start_time, now()))<0");
        $this->db->where("state", 0);
        $query = $this->db->get();
        $result = $query->result();
        $state['state'] = 1;
        foreach ($result as $eventId) {
            $this->updateStateById($eventId->id, $state);
        }

        //update state from 1 to 2 (active -> finished)
        $this->db->select("id, boss_id, pay_cost, book_type");
        $this->db->from("room_booking");
        $this->db->where("TIME_TO_SEC(TIMEDIFF(room_booking.end_time, now()))<0");
        $this->db->where("state", 1);
        $query = $this->db->get();
        $result = $query->result();
        $state['state'] = 2;
        $this->load->model("binding_model");
        foreach ($result as $eventId) {
            $this->updateStateById($eventId->id, $state);
            if ($eventId->book_type == '0')
                $this->binding_model->addWithdrawPrice($eventId->boss_id, $eventId->pay_cost);
        }

        // remove expired room price datas.
        $this->db->where("DATEDIFF(active_date,now()) < 0");
        $this->db->delete('room_updated');


        //update state from 4 to 3 (ordered -> cancelled)
        $this->db->select("id");
        $this->db->from("room_booking");
        $this->db->where("TIME_TO_SEC(TIMEDIFF(now(), room_booking.submit_time))>600");
        $this->db->where("state", 4);
        $query = $this->db->get();
        $result = $query->result();
        $state['state'] = 3;
        foreach ($result as $eventId) {
            $this->updateStateById($eventId->id, $state);
        }
    }

    /**
     * This function is used to change event state
     * @param number $eventId : This is event id
     * @param number $state : This is event state
     */
    function updateStateById($id, $state)
    {
        $this->db->where('id', $id);
        $this->db->update('room_booking', $state);
        return $this->db->affected_rows();
    }

    /**
     * This function is used to get some information of booking
     * @param number $bookingId : This is id of booking
     * @return number $count : This is information of booking found
     */
    function getItemsByBossId($bossId = 0)
    {
        $this->db->select("room_booking.*, user.name, user.phone, bossgroup.group_package, bossgroup.group_price");
        $this->db->from("room_booking");
        $this->db->join("user", "room_booking.user_id = user.no", "left");
        $this->db->join("bossgroup", "room_booking.bossgroup_id = bossgroup.no", "left");
        if ($bossId != 0) {
            $this->db->where('room_booking.boss_id', $bossId);
            $this->db->where('room_booking.state != 3');
        }
        $query = $this->db->get();
        return $query->result();
    }


    /**
     * This function is used to get detailed information of booking
     * @param number $bookingId : This is id of booking
     * @return number $count : This is information of booking found
     */
    function getBookingDetailById($bookingId)
    {
        $this->db->select("booking.*, boss.site_name, 
                    bossgroup.group_package, bossgroup.group_price, bossgroup.condition, bossgroup.group_inprice,
                    booking.start_time, booking.end_time, avg(rating.point) as point, rating.comment,
                    user.name as name, user.phone as phone, boss.site_type as type");
        $this->db->from("room_booking as booking");
        $this->db->join("boss", "booking.boss_id = boss.boss_id", 'left');
        $this->db->join("user", "booking.user_id = user.no", 'left');
        $this->db->join("rating", "rating.room_booking_id = booking.id", 'left');
        $this->db->join("bossgroup", "bossgroup.no = booking.bossgroup_id", 'left');
        $this->db->group_by('booking.id');
        $this->db->where("booking.id", $bookingId);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get total amount of registered person to event of the booking
     * @param number $bookingId : This is id of method may be booking or event
     * @param strign $method : this is method of find total
     * @return number $count : This is information of booking found
     */
    function getRegisterNum($id, $method = "event")
    {
        if ($method == "roombooking") {
            $this->db->select('event_id');
            $this->db->from('room_booking');
            $this->db->where('id', $id);
            $result = $this->db->get()->result();
            $this->db->select("sum(reg_num) as register_num");
            $this->db->from("room_booking");
            $this->db->where("room_booking.id", $result[0]->id);
        } else {
            $this->db->select("sum(room_booking.reg_num) as register_num");
            $this->db->from("room_booking, event");
            $this->db->where("room_booking.event_id", $id);
            $this->db->where("room_booking.state", "event.state");
        }
        $query = $this->db->get();
        return $query->result();
    }

    /**
     *This function is user to get UserId
     * @param number $bookingId : this is id of booking
     * @return number $count: This is UserId of booking
     */
    function getUserId($bookingId)
    {
        $this->db->select("user_id");
        $this->db->from("room_booking");
        $this->db->where("id", $bookingId);
        $query = $this->db->get();
        return $query->row();
    }

    /**
     * This function is used to get the amount of booking information
     * @param number $searchName : This is id of member or phone
     * @return number $count : This is information of booking found
     */
    function bookingListingCount($searchStatus = null, $searchName = '', $searchType = 100, $searchState = 10, $searchPay = 10, $searchStart = '', $searchEnd = '', $searchBookType = 100)
    {
        $query = "select booking.id
                    from room_booking as booking
                    left join bossgroup on booking.bossgroup_id = bossgroup.no
                    left join boss on booking.boss_id = boss.boss_id
                    left join `user` on booking.user_id = `user`.no
                    where booking.user_id = `user`.no ";
        if ($searchState != 10) {
            $query = $query . " and booking.state = " . $searchState;
        }
        if ($searchType != 100) {
            $query = $query . " and boss.site_type = " . $searchType;
        }
        if ($searchBookType != 100) {
            $query = $query . " and booking.book_type = " . $searchBookType;
        }
        if (!empty($searchText)) {
            if (isset($searchStatus)) {
                if ($searchStatus == '0') {
                    for ($index = 0; $index < strlen($searchText); $index++) {
                        if ($searchText[$index] == '0') {
                            $searchText = ltrim($searchText, '0');
                        }
                    }
                    $query = $query . " and (booking.id LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '1') {
                    $query = $query . " and (user.name LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '2') {
                    $query = $query . " and (user.phone LIKE '%" . $searchText . "%')";
                } else {
                    $query = $query . " and (boss.site_name LIKE '%" . $searchText . "%')";
                }
            }
        }
        $result = $this->db->query($query);
        return count($result->result());
    }

    /**
     * This function is used to get the amount of booking information
     * @param number $searchName : This is id of member or phone
     * @return number $count : This is information of booking found
     */
    function bookingListing($searchStatus = null, $searchText = '', $searchType = 100, $searchState = 10, $searchPay = 10, $searchStart = '', $searchEnd = '', $searchBookType = 100,$page, $segment)
    {
        $query = "select booking.*, boss.site_name, bossgroup.condition,
                    booking.start_time, booking.end_time,user.open_id,
                    user.name as name, user.phone as phone, boss.site_type as type
                    from room_booking as booking
                    left join bossgroup on booking.bossgroup_id = bossgroup.no
                    left join boss on booking.boss_id = boss.boss_id
                    left join `user` on booking.user_id = `user`.no
                    where booking.user_id = `user`.no ";
        if ($searchState != 10) {
            $query = $query . " and booking.state = " . $searchState;
        }
        if ($searchType != 100) {
            $query = $query . " and boss.site_type = " . $searchType;
        }
        if ($searchBookType != 100) {
            $query = $query . " and booking.book_type = " . $searchBookType;
        }
        if (!empty($searchText)) {
            if (isset($searchStatus)) {
                if ($searchStatus == '0') {
                    for ($index = 0; $index < strlen($searchText); $index++) {
                        if ($searchText[$index] == '0') {
                            $searchText = ltrim($searchText, '0');
                        }
                    }
                    $query = $query . " and (booking.id LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '1') {
                    $query = $query . " and (user.name LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '2') {
                    $query = $query . " and (user.phone LIKE '%" . $searchText . "%')";
                } else {
                    $query = $query . " and (boss.site_name LIKE '%" . $searchText . "%')";
                }
            }
        }
        if ($searchStart != '') {
            $query = $query . " and date(booking.start_time) >= date('" . $searchStart . "')";
        }
        if ($searchEnd != '') {
            $query = $query . " and date(booking.start_time) <= date('" . $searchEnd . "')";
        }
        $query = $query . " order by booking.submit_time desc";
        if ($segment != "") {
            $query = $query . " limit " . $segment . ", " . $page;
        } else {
            $query = $query . " limit 0, " . $page;
        }
        $result = $this->db->query($query);
        return $result->result();
    }

    function getCreationName($searchStatus = null, $searchText = '', $searchType = 100, $searchState = 10, $searchPay = 10, $searchStart = '', $searchEnd = '', $searchBookType = 100,$page, $segment)
    {
        return array();
        $query = "select user.nickname as creation_name, count(booking.id)
                    from room_booking as booking, user, event
                    where booking.event_id = event.id and event.organizer_id = user.no";
        if ($searchPay != 10) {
            $query = $query . " and booking.pay_type = " . $searchPay;
        }
        if ($searchState != 10) {
            $query = $query . " and booking.state = " . $searchState;
        }
        if ($searchType != 100) {
            $query = $query . " and event.type = " . $searchType;
        }
        if ($searchBookType != 100) {
            $query = $query . " and booking.book_type = " . $searchBookType;
        }
        if (!empty($searchText)) {
            if (isset($searchStatus)) {
                if ($searchStatus == '0') {
                    for ($index = 0; $index < strlen($searchText); $index++) {
                        if ($searchText[$index] == '0') {
                            $searchText = ltrim($searchText, '0');
                        }
                    }
                    $query = $query . " and (booking.id LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '1') {
                    $query = $query . " and (user.name LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '2') {
                    $query = $query . " and (user.phone LIKE '%" . $searchText . "%')";
                } else {
                    $query = $query . " and (event.name LIKE '%" . $searchText . "%')";
                }
            }
        }
        $query = $query . " group by booking.id";
        if ($segment != "") {
            $query = $query . " limit " . $segment . ", " . $page;
        } else {
            $query = $query . " limit 0, " . $page;
        }
        $result = $this->db->query($query);
        return $result->result();
    }

    /**
     * This function is used to get the information of room booking by nickname and state
     * @param number $user_id : This is id of member
     * @return array $result : This is information of booking found
     */

    function getRoomBookingByUser($user_id)
    {
        $this->db->select("room_booking.*");
        $this->db->select("boss.site_name, boss.detail_address");
        $this->db->select("provinces.province,cities.city,areas.area");
        $this->db->select("sum(rating.id)>0 as is_rating");
        $this->db->from("boss,  provinces, cities, areas, room_booking");
        $this->db->join("rating", "room_booking.user_id = rating.user_id and room_booking.id = rating.room_booking_id", "left");
        $this->db->where("room_booking.user_id", $user_id);
        $this->db->where("boss.boss_id = room_booking.boss_id");
        $this->db->where("boss.province = provinces.id");
        $this->db->where("boss.city = cities.id");
        $this->db->where("boss.area = areas.id");
        $this->db->group_by("room_booking.id");
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get the information of room booking by nickname and state
     * @param number $user_id : This is id of member
     * @return array $result : This is information of booking found
     */

    function getRoomBookingByBossID($boss_id)
    {
        $this->db->select("room_booking.*");
        $this->db->select("boss.site_name, boss.detail_address");
        $this->db->select("provinces.province,cities.city,areas.area");
        $this->db->select("sum(rating.id)>0 as is_rating");
        $this->db->from("boss,  provinces, cities, areas, room_booking");
        $this->db->join("rating", "room_booking.user_id = rating.user_id and room_booking.id = rating.room_booking_id", "left");
        $this->db->where("room_booking.boss_id", $boss_id);
        $this->db->where("room_booking.boss_id = boss.boss_id");
        $this->db->where("boss.province = provinces.id");
        $this->db->where("boss.city = cities.id");
        $this->db->where("boss.area = areas.id");
        $this->db->group_by("room_booking.id");
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get some information of room booking
     * @param number $bookingId : This is id of booking
     * @return number $count : This is information of booking found
     */
    function getRoomBookingById($bookingId)
    {
        $this->db->select("room_booking.*");
        $this->db->select("boss.latitude, boss.longitude");
        $this->db->select("boss.site_name, boss.detail_address, boss.cancel_time, boss.site_type");
        $this->db->select("provinces.province,cities.city,areas.area");
        $this->db->select("rating.point, rating.comment as rating_comment");
        $this->db->select("user.nickname,user.phone as user_phone");
        $this->db->from("boss,  provinces, cities, areas, room_booking");
        $this->db->join("user", "room_booking.user_id = user.no");
        $this->db->join("rating", "room_booking.user_id = rating.user_id and room_booking.id = rating.room_booking_id", "left");
        $this->db->where("room_booking.id", $bookingId);
        $this->db->where("boss.boss_id = room_booking.boss_id");
        $this->db->where("boss.province = provinces.id");
        $this->db->where("boss.city = cities.id");
        $this->db->where("boss.area = areas.id");
        $this->db->group_by("room_booking.id");
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to change the state of booking by booking_Id
     * @param array $event : This is event_id of booking
     * @return boolean $result : This is boolean value of change the state of booking
     */
    function updateStateByBookingId($bookingId, $state)
    {
        $this->db->where("id", $bookingId);
        $this->db->update("room_booking", $state);
        return true;
    }

    /**
     * This function is used to add the booking information of user for a event
     * @param array $booking : This is information array of booking
     * @return boolean $result : This is boolean value of add booking
     */
    function addBooking($booking)
    {
        $this->db->insert("room_booking", $booking);
        $id = $this->db->insert_id();
        return $id;
    }

    function updateBookInfo($arr, $id)
    {
        if ($id == '') {
            $this->addBooking($arr);
        } else {
            $this->updateStateByBookingId($id, $arr);
        }
    }


}

/* End of file booking_model.php */
/* Location: .application/models/booking_model.php */

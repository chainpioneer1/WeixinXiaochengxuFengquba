<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class binding_model extends CI_Model
{
    /**
     * This function is used to get the binding
     * @param number $userId : This is id of binding
     * @return number $count : This is row count
     */
    function getBindingDetailById($userId)
    {
        $query = "select binding_history.*, 
                    binding.amount as wallet, binding.amount_withdraw as withdraw,
                    user.name, user.phone
                    from binding_history
                    left join `user` on binding_history.user_id = user.no
                    left join binding on binding_history.user_id = binding.user_id
                    where binding_history.user_id=" . $userId .
            ' order by binding_history.submit_time desc';
        $result = $this->db->query($query);
        return $result->result();
    }

    /**
     * This function is used to get the binding
     * @param number $userId : This is id of binding
     * @return number $count : This is row count
     */
    function getWithdrawInfoById($userId)
    {
        $query = "select binding.amount as wallet, binding.amount_withdraw as withdraw,                    
                    user.name, user.phone,
                    sum(if(date(binding_history.submit_time) <= CURRENT_DATE, binding_history.amount,0)) as total_withdraw 
                    from binding
                    left join `user` on binding.user_id = user.no
                    left join binding_history on binding_history.user_id = binding.user_id
                    where binding.user_id=" . $userId .
            ' order by binding_history.submit_time desc';
        $result = $this->db->query($query);
        return $result->result();
    }

    /**
     * This function is used to get the binding listing count
     * @param string $searchText : This is optional search text
     * @return number $count : This is row count
     */
    function bindingListingCount($searchStatus = null, $searchText = '', $searchState)
    {
        $query = "select count(binding_history.no) as total_cnt
                    from `user`, binding_history, binding
                    where user.no = binding_history.user_id and user.no = binding.user_id ";
        if ($searchState != 10) {
            $query = $query . " and binding_history.state like '%" . $searchState . "%'";
        }
        if (!empty($searchText)) {
            if (isset($searchStatus)) {
                if ($searchStatus == '0') {
                    $query = $query . " and (user.phone LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '1') {
                    $query = $query . " and (user.name LIKE '%" . $searchText . "%')";
                } else {
                    $query = $query . " and (binding.receiver LIKE '%" . $searchText . "%')";
                }
            }
        }

        $result = $this->db->query($query);

        return count($result->result());
    }

    /**
     * This function is used to get the binding listing count
     * @param string $searchText : This is optional search text
     * @return number $count : This is row count
     */
    function bindingListing($searchStatus = null, $searchText = '', $searchState, $page, $segment)
    {
        $query = "select binding_history.*, sum(binding_history.amount) as amount, binding.amount as wallet, 
                    user.name, user.phone, 
                    sum(if(date(binding_history.submit_time) = CURRENT_DATE,1,0)) as today_cnt, 
                    count(binding_history.no) as total_cnt
                    from `user`, binding_history, binding
                    where user.no = binding_history.user_id and user.no = binding.user_id ";
        if ($searchState != 10) {
            $query .= " and binding_history.state like '%" . $searchState . "%'";
        }
        if (!empty($searchText)) {
            if (isset($searchStatus)) {
                if ($searchStatus == '0') {
                    $query .= " and (user.phone LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '1') {
                    $query .= " and (user.name LIKE '%" . $searchText . "%')";
                } else {
                    $query .= " and (binding.receiver LIKE '%" . $searchText . "%')";
                }
            }
        }
        $query .= " order by binding_history.submit_time desc";
        if ($segment != "") {
            $query = $query . " limit " . $segment . ", " . $page;
        } else {
            $query = $query . " limit 0, " . $page;
        }
        $result = $this->db->query($query);

        return $result->result();
    }

    /**
     * This function is used to update the binding information
     * @param string $bindingId : This is id of binding
     * @param array $info : This is information of binding
     * @return number $count : This is row count
     */
    function updateStateById($bindingId, $info)
    {
        $binding = $this->db->query("select binding_no, amount from binding_history where state=0 and no=" . $bindingId)->result();
        if ($info['state'] == 2) {
            if (count($binding) > 0) {
                $this->db->query("update binding set amount =  amount+" . $binding[0]->amount . " where no=" . $binding[0]->binding_no);
            }
        }
        if (count($binding) > 0) {
            $user_id = $this->db->query("select binding.user_id, binding_history.amount from binding, binding_history where binding_history.binding_no = binding.no and binding_history.no=" . $bindingId)->result();
            $pay['user_id'] = $user_id[0]->user_id;
            $pay['paid_user'] = $user_id[0]->user_id;
            $pay['type'] = $info['state'];
            $pay['amount'] = $user_id[0]->amount;
            $pay['submit_time'] = date("Y-m-d H:i:s");
            $this->db->insert("payment_history", $pay);
            $alarm['user_id'] = $user_id[0]->user_id;
            $alarm['type'] = ($info['state'] == 1) ? 1 : 2;
            $alarm['submit_time'] = date("Y-m-d H:i:s");
            $this->load->model('alarm_user_model');
            $this->alarm_user_model->addAlarm($alarm);
            $this->db->where("no", $bindingId);
            $this->db->update("binding_history", $info);
        }
        return true;
    }

    /**
     * This function is used to get the binding information of current user
     * @param string $userId : This is id of user
     * @return array $result : This is information found
     */
    function getBinding($userId)
    {
        $this->db->select("*");
        $this->db->where("user_id", $userId);
        $this->db->from("binding");
        $result = $this->db->get();
        return $result->result();
    }

    /**
     * This function is used to get the binding information of current user
     * @param string $userId : This is id of user
     * @return array $result : This is information found
     */
    function getCntToday($userId)
    {
        $this->db->select("count(*) as cnt");
        $this->db->where("user_id", $userId);
        $this->db->where("date(binding_time) = CURRENT_DATE");
        $this->db->from("binding_history");
        $result = $this->db->get();
        return $result->row()->cnt;
    }

    function addNewBinding($open_id)
    {
        $user_id = $this->db->query("select no from user where open_id='" . $open_id . "'")->result();
        $result = $this->db->query("select * from binding where user_id=" . $user_id[0]->no)->result();
        if (count($result) == 0) {
            $info['user_id'] = $user_id[0]->no;
            $this->db->insert("binding", $info);
        } else {
            $this->db->set(array(
                'update_time' => date('Y-m-d H:i:s'),
                'user_ip' => $this->get_client_ip()
            ));
            $this->db->where("no", $result[0]->no);
            $this->db->update("binding");
        }
        return;
    }

    /**
     * This function is used to add the binding information of current user
     * @param array $info : This is array of binding information
     * @return number $result : This is number of rows inserted into table
     */
    function addBinding($user_id, $info)
    {
        $result = $this->db->query("select * from binding where user_id=" . $user_id)->result();
        if (count($result) == 0) {
            $info['user_id'] = $user_id;
            $this->db->insert("binding", $info);
        } else {
            $this->db->where("user_id", $user_id);
            $this->db->update("binding", $info);
        }
        $result = $this->db->affected_rows();
        return $result;
    }

    /**
     * This function is used to add the binding information of current user
     * @param array $info : This is array of binding information
     * @return number $result : This is number of rows inserted into table
     */
    function checkBalance()
    {
        $this->db->query("update binding set amount_withdraw = 0 where amount <= 0");
        $result = $this->db->affected_rows();
        return $result;
    }

    /**
     * This function is used to add the binding information of current user
     * @param array $info : This is array of binding information
     * @return number $result : This is number of rows inserted into table
     */
    function addNewUser($nickname)
    {
        $user_id = $this->db->query("select no from user where nickname = '" . $nickname . "'")->result();
        if (count($user_id) == 0) return array();
        $bind_info = $this->db->query("select no from binding where user_id = '" . $user_id[0]->no . "'")->result();
        if (count($bind_info) > 0) return $bind_info;
        $info['amount'] = 0;
        $info['user_id'] = $user_id[0]->no;
        $this->db->insert("binding", $info);
        $result = $this->db->affected_rows();
        return $result;
    }

    /**
     * This function is used to add the binding history of current user
     * @param array $userId : This is id of user
     * @param array $info : This is array of binding information
     * @return number $result : This is number of rows inserted into table
     */
    function addBindingHistory($userId, $info)
    {
        $this->db->query("insert payment_history(user_id, type, amount, submit_time) values(" .
            $userId . ", 0 ," . $info['amount'] . ",'" . date("Y-m-d H:i:s") . "')");

        $this->db->query('update binding set amount = amount - ' . $info['amount'] .
            ', amount_withdraw = amount_withdraw - ' . $info['amount'] . ' where user_id = ' . $userId);

        $this->db->insert("binding_history", $info);

        return true;
    }

    /**
     * This function is used to get the binding history of current user
     * @param array $userId : This is id of user
     * @return number $result : This is number of rows inserted into table
     */
    function getBindingHistory($userId)
    {
        $this->db->select("*");
        $this->db->from("binding_history");
        $this->db->where("user_id", $userId);
        $this->db->order_by("submit_time", 'desc');
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get the payment history of current user
     * @param number $userId : This is id of user
     * @return array $result : This is information array of payment of user
     */
    function getPaymentHistory($userId)
    {
        $this->db->select("payment_history.type, payment_history.amount, room_booking.book_info, 
                payment_history.submit_time, event.name, boss.site_name, user.nickname, user.name as paid_user");
        $this->db->from("payment_history");
        $this->db->join("event", "event.id = payment_history.event_id", "left");
        $this->db->join("room_booking", "room_booking.id = payment_history.room_booking_id", "left");
        $this->db->join("boss", "room_booking.boss_id = boss.boss_id", "left");
        $this->db->join("user", "payment_history.paid_user = user.no", "left");
        $this->db->where("payment_history.user_id", $userId);
        $this->db->order_by("payment_history.submit_time", "desc");
        $query = $this->db->get();
        return $query->result();
    }

    function addWithdrawPrice($user_id, $amount)
    {
        $result = $this->db->query("update binding set amount_withdraw = amount_withdraw + " . $amount . " where user_id=" . $user_id);
        return true;
    }

    /**
     * This function is used to add the booking money to current user
     * @param number $userId : This is id of user
     * @return array $result : This is information array of payment of user
     */
    function addBooking($event_id, $reg_num, $user_id, $amount = 0)
    {
        // get event cost and event owner
        $cost = $this->db->query("select cost, organizer_id from event where id=" . $event_id)->result();

        // get owner's wallet
        $result = $this->db->query("select * from binding where user_id=" . $cost[0]->organizer_id)->result();
        if (count($result) == 0) {
            $info = array('user_id' => $cost[0]->organizer_id, 'amount' => '0');
            $this->db->insert("binding", $info);
        }
        // remove online paid price from sender's wallet
        $old_wallet = $this->db->query("select amount_withdraw from binding where user_id=" . $user_id)->row();
        $paid_wallet = $old_wallet->amount_withdraw - $amount;
        $this->db->query("update binding set amount = amount - " . $paid_wallet . ", amount_withdraw = amount_withdraw - " . $paid_wallet . " where user_id = " . $user_id);

        $total = $cost[0]->cost * $reg_num; // total price
        // add total price to event owner's wallet
        $binding_no = $this->db->query("select no from binding where user_id = " . $cost[0]->organizer_id)->result();
        $this->db->query("update binding set amount = amount + " . $total . " where no = " . $binding_no[0]->no);


        // add payment history item
        $now = date("Y-m-d H:i:s");
        if ($cost[0]->organizer_id == 0) {
            $this->db->query("insert into payment_history(user_id, amount, submit_time, type, event_id) values(" .
                $cost[0]->organizer_id . "," . $total . ",'" . $now . "', 13" . "," . $event_id . ")");
            if ($paid_wallet > 0)
                $this->db->query("insert into payment_history(user_id, amount, submit_time, type, event_id) values(" .
                    $user_id . "," . $paid_wallet . ",'" . $now . "', 12" . "," . $event_id . ")");
        } else {
            $this->db->query("insert into payment_history(user_id, amount, submit_time, type, event_id) values(" .
                $cost[0]->organizer_id . "," . $total . ",'" . $now . "', 3" . "," . $event_id . ")");
            if ($paid_wallet > 0)
                $this->db->query("insert into payment_history(user_id, amount, submit_time, type, event_id) values(" .
                    $user_id . "," . $paid_wallet . ",'" . $now . "', 1" . "," . $event_id . ")");
        }
        return true;
    }

    /**
     * This function is used to cancel the booking money from organizer
     * @param number $userId : This is id of user
     * @return array $result : This is information array of payment of user
     */
    function cancelBooking($booking_id)
    {
        $event = $this->db->query("select event.organizer_id as boss_id, booking.user_id, event.id, event.cost, booking.reg_num,
                booking.pay_online, booking.pay_cost, booking.pay_honey
                from event, booking where booking.event_id=event.id and booking.id=" . $booking_id)->result();
        $boss_id = $event[0]->boss_id;
        $user_id = $event[0]->user_id;
        $info = array();
        $info['amount'] = $event[0]->pay_cost;
        $this->db->query("update binding set amount = amount - " . $event[0]->pay_cost . " where user_id=" . $boss_id);

        $info['event_id'] = $event[0]->id;
        $info['submit_time'] = date("Y-m-d H:i:s");
        $info['type'] = 4;
        $info['user_id'] = $event[0]->boss_id;
        $this->db->insert("payment_history", $info);

        $wallet_paid = $event[0]->pay_cost - $event[0]->pay_online - $event[0]->pay_honey;
        if ($wallet_paid > 0) {
            $this->db->query("update binding set amount = amount + " . $wallet_paid . ", amount_withdraw = amount_withdraw + " . $wallet_paid . " where user_id=" . $user_id);
            $info['amount'] = $wallet_paid;
            $info['event_id'] = $event[0]->id;
            $info['submit_time'] = date("Y-m-d H:i:s");
            $info['type'] = 6;
            $info['user_id'] = $event[0]->user_id;
            $this->db->insert("payment_history", $info);
        }
        return true;
    }

    /**
     * This function is used to add the booking money to current user
     * @param number $userId : This is id of user
     * @return array $result : This is information array of payment of user
     */
    function addRoomBooking($boss_id, $price, $user_id, $paid_wallet = 0, $book_id)
    {

        // get owner's wallet
        $result = $this->db->query("select * from binding where user_id=" . $boss_id)->result();
        if (count($result) == 0) {
            $info = array('user_id' => $boss_id, 'amount' => '0');
            $this->db->insert("binding", $info);
        }

        // remove online paid price from sender's wallet
        if ($paid_wallet >= 0) {
//            $old_wallet = $this->db->query("select amount_withdraw from binding where user_id=" . $user_id)->row();
//            $paid_wallet = $old_wallet->amount_withdraw - $amount;
            $this->db->query("update binding set amount = amount - " . $paid_wallet .
                ", amount_withdraw = amount_withdraw - " . $paid_wallet . " where user_id = " . $user_id);
        }

        $total = $price; // total price
        // add total price to event owner's wallet
        if ($total >= 0) {
            $binding_no = $this->db->query("select no from binding where user_id = " . $boss_id)->result();
            $this->db->query("update binding set amount = amount + " . $total . " where no = " . $binding_no[0]->no);
        }

        // add payment history item
        $now = date("Y-m-d H:i:s");
        $this->db->query("insert into payment_history(user_id, paid_user, amount, submit_time, type, room_booking_id) " .
            "values(" . $boss_id . "," . $user_id . ","
            . $total . ",'" . $now . "', 10" . "," . $book_id . ")");
        $this->db->query("insert into payment_history(user_id, paid_user, amount, submit_time, type, room_booking_id) " .
            "values(" . $user_id . "," . $user_id . ","
            . $paid_wallet . ",'" . $now . "', 9" . "," . $book_id . ")");
        return true;
    }

    function removeRoomBooking($boss_id, $price, $wallet_pay, $user_id, $roombooking_id)
    {
        // set owner's wallet

        $this->db->query("update binding set amount = amount - " . $price . " where user_id=" . $boss_id);
        // set user's wallet
        $this->db->query("update binding set amount = amount + " . $wallet_pay . ", amount_withdraw = amount_withdraw + " . $wallet_pay . " where user_id=" . $user_id);
        $now = date("Y-m-d H:i:s");
        $this->db->query("insert into payment_history(user_id, paid_user, amount, submit_time, type, room_booking_id) values(" . $boss_id . "," . $user_id . ","
            . $price . ",'" . $now . "', 11" . "," . $roombooking_id . ")");
        $this->db->query("insert into payment_history(user_id, paid_user, amount, submit_time, type, room_booking_id) values(" . $user_id . "," . $user_id . ","
            . $wallet_pay . ",'" . $now . "', 14" . "," . $roombooking_id . ")");
        return true;
    }

    /**
     * This function is used to add the booking money to current user
     * @param number $userId : This is id of user
     * @return array $result : This is information array of payment of user
     */
    function addGroupBooking($boss_id, $price, $user_id, $paid_wallet = 0, $book_id)
    {

        // get owner's wallet
        $result = $this->db->query("select * from binding where user_id=" . $boss_id)->result();
        if (count($result) == 0) {
            $info = array('user_id' => $boss_id, 'amount' => '0');
            $this->db->insert("binding", $info);
        }

        // remove online paid price from sender's wallet
        if ($paid_wallet > 0) {
            $this->db->query("update binding set amount = amount - " . $paid_wallet .
                ", amount_withdraw = amount_withdraw - " . $paid_wallet . " where user_id = " . $user_id);
        }

        $total = $price; // total price
        // add total price to event owner's wallet
        if ($total >= 0) {
            $binding_no = $this->db->query("select no from binding where user_id = " . $boss_id)->result();
            $this->db->query("update binding set amount = amount + " . $total . " where no = " . $binding_no[0]->no);
        }

        // add payment history item
        $now = date("Y-m-d H:i:s");
        $this->db->query("insert into payment_history(user_id, paid_user, amount, submit_time, type, room_booking_id)" .
            " values( $boss_id, $user_id, $total, '$now', 16, $book_id )");
        $this->db->query("insert into payment_history(user_id, paid_user, amount, submit_time, type, room_booking_id) values(" .
            $user_id . "," . $user_id . ","
            . $paid_wallet . ",'" . $now . "', 15" . "," . $book_id . ")");
        return true;
    }

    function removeGroupBooking($boss_id, $price, $wallet_pay, $user_id, $roombooking_id)
    {
        // set owner's wallet

        $this->db->query("update binding set amount = amount - " . $price . " where user_id=" . $boss_id);
        // set user's wallet
        $this->db->query("update binding set amount = amount + " . $wallet_pay . ", amount_withdraw = amount_withdraw + " . $wallet_pay . " where user_id=" . $user_id);
        $now = date("Y-m-d H:i:s");
        $this->db->query("insert into payment_history(user_id, paid_user, amount, submit_time, type, room_booking_id) values(" . $boss_id . "," . $user_id . ","
            . $price . ",'" . $now . "', 18" . "," . $roombooking_id . ")");
        $this->db->query("insert into payment_history(user_id, paid_user, amount, submit_time, type, room_booking_id) values(" . $user_id . "," . $user_id . ","
            . $wallet_pay . ",'" . $now . "', 17" . "," . $roombooking_id . ")");
        return true;
    }

    /**
     * This function is used to cancel the event money from organizer
     * @param number $event_id : This is id of event
     * @return array $result : This is state of operation
     */
    function cancelEvent($event_id)
    {
        $this->db->select("event.organizer_id,event.name, event.cost, user.role, sum(booking.reg_num) as num");
        $this->db->from("event");
        $this->db->join("booking", "event.id = booking.event_id and booking.state = 0 and booking.pay_type=1", "left");
        $this->db->join("user", "event.organizer_id=user.no");
        $this->db->where("event.id", $event_id);
        $event = $this->db->get()->result();
        $user_id = $event[0]->organizer_id;
        $reg_num = ($event[0]->num == null) ? 0 : $event[0]->num;
        if ($reg_num == null)
            $reg_num = 0;
        $cost = $event[0]->cost;
        $info['type'] = 5;
        $info['submit_time'] = date("Y-m-d H:i:s");
        $info['user_id'] = $user_id;
        $info['paid_user'] = $user_id;
        $sum = 0;
        if ($reg_num != 0) {
            $bookings = $this->db->query("select booking.user_id, booking.reg_num, booking.pay_type from booking where booking.state=0 and booking.event_id=" . $event_id)->result();
            $this->load->model('alarm_user_model');
            foreach ($bookings as $booking) {
                if ($booking->pay_type == 1) {
                    $info['amount'] = floatval($booking->reg_num * $cost);
                    $sum += floatval($info['amount']);
                    $amount = $this->db->query("select amount from binding where user_id=" . $user_id)->result();

                    $amount1 = floatval($amount[0]->amount) - floatval($info['amount']);
                    $this->db->query("update binding set amount = amount - " . $info['amount'] . ", amount_withdraw = amount_withdraw - " . $info['amount'] . " where user_id=" . $user_id);
                    $alarm['submit_time'] = $info['submit_time'];
                    $alarm['user_id'] = $booking->user_id;
                    $alarm['type'] = 11;
                    $alarm['event_type'] = $event[0]->name;
                    $alarm['alarm_org_id'] = $user_id;
                    $alarm['event_id'] = $amount[0]->amount . ',' . $info['amount'];

                    $this->alarm_user_model->addAlarm($alarm);
                } else {
                    $alarm['submit_time'] = $info['submit_time'];
                    $alarm['user_id'] = $booking->user_id;
                    $alarm['type'] = 10;
                    $alarm['event_type'] = $event[0]->name;
                    $alarm['alarm_org_id'] = $user_id;
                    $this->alarm_user_model->addAlarm($alarm);
                }
            }
            $info['amount'] = $sum;
            $this->db->insert("payment_history", $info);
        }
        return true;
    }

    public function get_client_ip()
    {
        $ipaddress = '';
        if (getenv('HTTP_CLIENT_IP'))
            $ipaddress = getenv('HTTP_CLIENT_IP');
        else if (getenv('HTTP_X_FORWARDED_FOR'))
            $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
        else if (getenv('HTTP_X_FORWARDED'))
            $ipaddress = getenv('HTTP_X_FORWARDED');
        else if (getenv('HTTP_FORWARDED_FOR'))
            $ipaddress = getenv('HTTP_FORWARDED_FOR');
        else if (getenv('HTTP_FORWARDED'))
            $ipaddress = getenv('HTTP_FORWARDED');
        else if (getenv('REMOTE_ADDR'))
            $ipaddress = getenv('REMOTE_ADDR');
        else
            $ipaddress = 'UNKNOWN';
        return $ipaddress;
    }
}

/* End of file binding_model.php */
/* Location: .application/models/binding_model.php */

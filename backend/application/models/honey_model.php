<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class honey_model extends CI_Model
{
    /**
     * This function is used to get the honey in 5km from current user
     * @param float $longitude : This is longitude of current user
     * @param float $latitude : This is latitude of the current user
     * @return array $result : information of honey found
     */
    function getHoneyByDistance($longitude, $latitude, $userid = 0)
    {
        if ($userid != 0) {
            $this->db->select("honey.no, honey.longitude, honey.latitude, honey.amount, honey.pick_choice, boss.boss_id");
            $this->db->select("count(favourite.no) as favor_state");
            $this->db->join("boss", "boss.no=honey.position", "left");
            $this->db->join("favourite", "favourite.boss_id = boss.boss_id and favourite.user_id = $userid", "left");
            $this->db->from("honey");
            $this->db->where("( 6371 * acos( cos( radians($latitude) ) * cos( radians( honey.latitude) ) 
   * cos( radians(honey.longitude) - radians($longitude)) + sin(radians($latitude)) 
   * sin( radians(honey.latitude))))<=10");
            $this->db->group_by("honey.no");
            $query = $this->db->get();

            return $query->result();
        } else {
            $this->db->select("no, longitude, latitude, amount, pick_choice");
            $this->db->from("honey");
            $this->db->where("( 6371 * acos( cos( radians($latitude) ) * cos( radians( latitude) ) 
   * cos( radians(longitude) - radians($longitude)) + sin(radians($latitude)) 
   * sin( radians(latitude))))<=10");
            $query = $this->db->get();
            return $query->result();
        }
    }

    /**
     * This function is used to subtract the honey with amount current user catch
     * @param number $amount : This is amount of user cathced
     * @param number $no : This is no of honey user catched
     * @return boolean $result : state of subtract
     */
    function catchHoney($no, $amount, $user_id = 0)
    {
        $this->db->select("amount");
        $this->db->from("honey");
        $this->db->where("no", $no);
        $result = $this->db->get()->result();
        if ($result[0]->amount == $amount) {
            $this->db->where("no", $no);
            $this->db->delete("honey");
        } else {
            $this->db->query("update honey set amount=(amount-" . (1 * $amount) . "), pick_choice=pick_choice+1 where no=$no");
        }
        return true;
    }

    /**
     * This function is used to subtract the honey with amount current user catch
     * @param number $amount : This is amount of user cathced
     * @param number $no : This is no of honey user catched
     * @return boolean $result : state of subtract
     */
    function catchBackyardHoney($no, $amount, $user_id = 0)
    {
        $this->db->select("amount");
        $this->db->from("honey_backyard");
        $this->db->where("no", $no);
        $result = $this->db->get()->result();
        if ($result[0]->amount == 1 * $amount) {
            $this->db->where("no", $no);
            $this->db->delete("honey_backyard");
        } else {
            if ($result[0]->user_id == $user_id) $user_id = 0;
            $this->db->query("update honey_backyard set amount=(amount-" . (1 * $amount) . "), receiver_id = " . $user_id . " where no=$no");
        }
        return true;
    }

    /**
     * This function is used to check the honey which are available from time limit
     * @return boolean $result : state of subtract
     */
    function checkHoney()
    {
        $now = date("Y-m-d H:i:s");
        $this->db->query("delete from honey where TIME_TO_SEC(TIMEDIFF(now(), create_time))>172800 OR amount = 0 or amount = NULL");
        $this->db->query("delete from honey_backyard where TIME_TO_SEC(TIMEDIFF(now(), create_time))>172800 or amount = 0 or amount = NULL");
        return true;
    }

    /**
     * This function is used to add honey when booking happen
     * @return boolean $result : state of adding
     */
    function addHoney($events)
    {
        foreach ($events as $event_id) {
            $reg_num = $this->db->query("select sum(booking.reg_num) as amount from event, booking
                where booking.state = event.state and event.id = booking.event_id and event.id=" . $event_id->id)->result();
            $user = $this->db->query("select user.role from user, event where event.organizer_id = user.no and event.id = " . $event_id->id)->result();
            if($user[0]->no == 0) continue;
            if ($user[0]->role == 2) {
                $additional = $this->db->query("select additional from event where event.id=" . $event_id->id)->result();
                if ($additional[0]->additional == 1) {
                    $position = $this->db->query("select longitude, latitude from event where event.id = " . $event_id->id)->result();
                    $honey_total = $this->db->query("select value from rule where no=2")->result();
                }
            } else {
                $position = $this->db->query("select boss.longitude, boss.latitude, boss.no from boss, event where event.organizer_id = boss.boss_id and event.id = " . $event_id->id)->result();
                $honey_total = $this->db->query("select value from rule where no=1")->result();
            }
            $honey_portion = $this->db->query("select value from rule where no=5")->result();
            $honey['amount'] = $honey_total[0]->value / (1.0 + $honey_portion[0]->value) * $honey_portion[0]->value * $reg_num[0]->amount;
            $honey['create_time'] = date("Y-m-d H:i:s");
            $honey['longitude'] = $position[0]->longitude;
            $honey['latitude'] = $position[0]->latitude;
            if ($user[0]->role == 1 && $honey['amount'] != 0) {
                $honey['position'] = $position[0]->no;
                $state = $this->db->query("select no from honey where position=" . $position[0]->no)->result();
                if ($state != null) {
                    $this->db->query("update honey set amount= amount+" . (1 * $honey['amount']) . ", create_time = '" . $honey['create_time'] . "'  where no=" . $state[0]->no);
                } else {
                    $this->db->insert("honey", $honey);
                }
            } else if ($honey['amount'] != 0) {
                $this->db->insert("honey", $honey);
            }
            //------------------------------make honey to backyard of registered member
            $honey1['create_time'] = date("Y-m-d H:i:s");
            $bookings = $this->db->query("select user_id, reg_num from booking where booking.event_id=" . $event_id->id)->result();
            foreach ($bookings as $booking) {
                $honey1['amount'] = $honey_total[0]->value / (1.0 + $honey_portion[0]->value) * $booking->reg_num;
                $this->addBackyard($booking->user_id, $honey1['amount']);
            }
        }
        return true;
    }

    function addBackyard($user_id, $amount)
    {
        $honey['user_id'] = $user_id;
        $honey['create_time'] = date("Y-m-d H:i:s");
        $honey['amount'] = $amount;
        $temp = $this->db->query("select * from honey_backyard where user_id=" . $user_id)->result();
        $limit = $this->db->query("select value from rule where no=7;")->result();
        $tempx = 0;
        $tempy = 0;
        if (count($temp) > 0) {
            $sum = 0;
            $iter = 0;
            if (1 * $honey['amount'] >= 1 * $limit[0]->value) {
                $this->db->where("user_id", $user_id);
                $this->db->delete("honey_backyard");
                $honey['amount'] = $limit[0]->value;
            } else {
                for ($index = 0; $index < count($temp); $index++) {
                    if ($limit[0]->value <= $sum + $honey['amount'] + $temp[$index]->amount) {
                        $iter = $index;
                        $rest = $limit[0]->value - $sum - $honey['amount'];
                        if (1 * $rest > 0) {
                            $this->db->query("update honey_backyard set amount=$rest where no=" . $temp[$index]->no);
                        } else {
                            $this->db->query("delete from honey_backyard where no=" . $temp[$index]->no);
                        }
                        break;
                    }
                    $sum += $temp[$index]->amount;
                }
                if ($iter < count($temp) - 1) {
                    for ($index = $iter + 1; $index < count($temp); $index++) {
                        $this->db->where("no", $temp[$index]->no);
                        $this->db->delete("honey_backyard");
                    }
                }
            }
            while (1) {
                $tempx = floor(Mt_rand() % 9);
                $tempy = floor(Mt_rand() % 3);
                $buf = "";
                foreach ($temp as $buf) {
                    if ($tempx == $buf->x && $tempy == $buf->y) {
                        break;
                    }
                }
                if ($buf == $temp[count($temp) - 1]) {
                    break;
                }
            }
        } else {
            if (1 * $honey['amount'] >= 1 * $limit[0]->value) {
                $honey['amount'] = $limit[0]->value;
            }
            $tempx = floor(Mt_rand() % 9);
            $tempy = floor(Mt_rand() % 3);
        }
        $honey['x'] = $tempx;
        $honey['y'] = $tempy;
        $this->db->insert("honey_backyard", $honey);
        return;
    }
}

/* End of file honey_model.php */
/* Location: .application/models/honey_model.php */

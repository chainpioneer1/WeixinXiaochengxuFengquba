<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class honey_friend_model extends CI_Model
{
    /**
     * This function is used to get the honey in 5km from current user
     * @param float $longitude : This is longitude of current user
     * @param float $latitude : This is latitude of the current user
     * @return array $result : information of honey found
     */

    function getItems($type = 'old', $user_id = 0)
    {
        $this->db->select("honey_friend.*, user.no as main_id, (case user.name when '' then user.nickname else user.name end) as name, user.sport_type, user.avatar, boss.site_type_detail,  
                user.role, user.honey, count(honey_backyard.no) as honey_cnt");
        if($user_id==0) {
            $this->db->from("user");
            if ($type == 'old')
                $this->db->join("honey_friend", "honey_friend.user_id = user.no", "left");
            else
                $this->db->join("honey_friend", "honey_friend.friend_id = user.no", "left");
        }else{
            $this->db->from("honey_friend");
            if ($type == 'old')
                $this->db->join("user", "honey_friend.user_id = user.no", "left");
            else
                $this->db->join("user", "honey_friend.friend_id = user.no", "left");
        }
        $this->db->join("boss", "user.no = boss.boss_id", "left");
        $this->db->join("honey_backyard", "user.no = honey_backyard.user_id", "left");

        $this->db->where("user.no != ", '0');
        if ($user_id == 0)
            $this->db->group_by('user.no');
        else {
            $this->db->group_by('honey_friend.no');
        }
        $this->db->order_by('user.honey', 'desc');
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to check the honey which are available from time limit
     * @return boolean $result : state of subtract
     */
    function checkHoney()
    {
        $now = date("Y-m-d H:i:s");
        $this->db->query("delete from honey where TIME_TO_SEC(TIMEDIFF(now(), create_time))>172800");
        $this->db->query("delete from honey_backyard where TIME_TO_SEC(TIMEDIFF(now(), create_time))>172800");
        return true;
    }

    function get_where($arr)
    {
        $this->db->where($arr);
        $this->db->from('honey_friend');
        $query = $this->db->get();

        return $query->result();
    }

    function addItem($arr)
    {
        $item = $this->get_where($arr);
        if (count($item) == 0)
            $this->db->insert('honey_friend', $arr);
        else {
            $this->updateItem(array('status' => 0), $arr);
        }
        return true;
    }

    function removeItem($arr)
    {
        $this->db->where($arr);
        $this->db->delete('honey_friend');
        return true;
    }

    function updateItem($arr, $cond)
    {
        $this->db->set($arr);
        $this->db->where($cond);
        $this->db->update('honey_friend');
        return true;
    }
}

/* End of file honey_model.php */
/* Location: .application/models/honey_model.php */

<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class favourite_goods_model extends CI_Model
{

    /**
     * This function is used to get some information of favourite_event
     * @param number $userId : This is id of current user
     * @return boolean $result: state of like
     */
    function is_rating($user_id)
    {
        $this->db->select("no");
        $this->db->from('favourite_goods');
        $this->db->where('user_id', $user_id);
        $query = $this->db->get();
        return (count($query->result()) > 0) ? true : false;
    }

    /**
     * This function is used to get some information of favourite_event
     * @param number $userId : This is id of current user
     * @return boolean $result: state of like
     */
    function getItems($user_id)
    {
        $this->db->select("*");
        $this->db->from('favourite_goods');
        $this->db->where('user_id', $user_id);
        $query = $this->db->get();
        return $query->result();
    }


    /**
     *This function is used to get Favourite of user for a specific event
     * @param number event_id : id of event to find Favourite
     * @return boolean $result: state of insert
     **/
    function getFavouriteDetail($userId, $goodId = 0)
    {
        $this->db->select("*");
        $this->db->from("favourite_goods");
        $this->db->where("user_id", $userId);
        if ($goodId != 0)
            $this->db->where("goods_id", $goodId);
        $result = $this->db->get()->result();
        return (count($result) > 0) ? 1 : 0;
    }

    /**
     * This function is used to set the state of favourite for event
     * @param number $userId : This is id of current user
     * @return boolean $result: state of like
     */
    function setFavouriteGoods($user_id, $goods_id)
    {
        $this->db->select("no");
        $this->db->from('favourite_goods');
        $this->db->where('user_id', $user_id);
        $this->db->where("goods_id", $goods_id);
        $query = $this->db->get()->result();
        if (count($query) > 0) {
            $this->db->where('user_id', $user_id);
            $this->db->where("goods_id", $goods_id);
            $this->db->delete("favourite_goods");
            return 0;
        }
        $info['user_id'] = $user_id;
        $info['goods_id'] = $goods_id;
        $this->db->insert("favourite_goods", $info);
        return 1;
    }
}

/* End of file favourite_event_model.php */
/* Location: .application/models/favourite_event_model.php */

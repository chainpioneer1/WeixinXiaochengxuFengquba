<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class room_model extends CI_Model
{

    /**
     * This function is used to get some information of rating
     * @param number $userId : This is id of member
     * @param number $eventId : This is id of event
     * @return number $count : This is information of rating found
     */
    function updateRoom($boss_id, $roomInfo, $submit_time = '')
    {
        $this->db->trans_start();
//        $this->deleteRoom($boss_id);
        if ($submit_time == '')
            $submit_time = date("Y-m-d H:i:s", strtotime('+7 days'));
        foreach ($roomInfo as $info) {
            $this->addRoom($boss_id, $info, $submit_time);
        }
        $this->db->trans_complete();
        //$result = $this->db->affected_rows();
        return true;
    }


    function deleteRoom($boss_id)
    {
        $this->db->where("boss_id", $boss_id);
        $result = $this->db->delete("room");
        return $result;
    }

    function getRoomsByBossId($boss_id = 0)
    {
        $this->db->select('*');
        $this->db->from('room');
        if ($boss_id != 0)
            $this->db->where('boss_id', $boss_id);
        $query = $this->db->order_by('submit_time', 'desc');
        $result = $query->get()->result();
        return $result;
    }

    /**
     *This function is used to add new room
     * @param array info : all data to insert
     * @return boolean $result: state of insert
     **/
    function addRoom($boss_id, $info, $submit_time = '')
    {
        if ($submit_time == '') $submit_time = date("Y-m-d H:i:s");
        $complete_info = array(
            'boss_id' => $boss_id,
            'room_name' => $info->{'name'},
            'cost' => $info->{'cost'},
            'submit_time' => $submit_time
        );
        $result = $this->db->insert("room", $complete_info);
        return $this->db->affected_rows();
    }

    /**
     *This function is used to get rooms for event
     * @param number boss_id : id of event to find rating
     * @return boolean $result: state of insert
     **/
    function getRoomDetailByBoss($boss_id)
    {
        $this->db->select("*");
        $this->db->from('room');
        $this->db->where('boss_id', $boss_id);
//        $this->db->where('submit_time < ', date("Y-m-d H:i:s"));
        $this->db->order_by('submit_time', 'desc');
        $query = $this->db->get();
        $result = $query->row();

        $this->db->select("*");
        $this->db->from('room');
        $this->db->where('boss_id', $boss_id);
        if (count($result) > 0)
            $this->db->where('submit_time', $result->submit_time);

        $query = $this->db->get();


        return $query->result();
    }

    function getRoomChangeStateByBoss($boss_id)
    {
        $this->db->select("count(boss_id) as edit_state");
        $this->db->from("room_booking");
        $this->db->where('state', '!= 2');
        $this->db->where('end_time > ', date('Y-m-d H:i:s'));
        $this->db->where('boss_id', $boss_id);
        $query = $this->db->get();
        return $query->result();
    }

}

/* End of file rating_model.php */
/* Location: .application/models/rating_model.php */

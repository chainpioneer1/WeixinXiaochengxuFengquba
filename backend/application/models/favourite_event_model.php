<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class favourite_event_model extends CI_Model
{
    
    /**
     * This function is used to get some information of favourite_event
     * @param number $userId : This is id of current user
     * @return boolean $result: state of like
     */
    function is_rating($user_id)
    {
        $this->db->select("no");
        $this->db->from('favourite_event');
        $this->db->where('user_id', $user_id);
        $query = $this->db->get();
        return (count($query->result())>0)?true:false;
    }


    /**
    *This function is used to get Favourite of user for a specific event
    *@param number event_id : id of event to find Favourite
    *@return boolean $result: state of insert
    **/
    function getFavouriteDetailByUser($userId, $eventId)
    {
        $this->db->select("*");
        $this->db->from("favourite_event");
        $this->db->where("user_id", $userId);
        $this->db->where("event_id", $eventId);
        $result = $this->db->get()->result();
        return (count($result)>0)?1:0;
    }

    /**
    *This function is used to get Favourite for a specific event
    *@param number event_id : id of event to find Favourite
    *@return boolean $result: state of insert
    **/
    function getFavouriteAmountByEvent($eventId)
    {
        $this->db->select("*");
        $this->db->from("favourite_event");
        $this->db->where("event_id", $eventId);
        $result = $this->db->get()->result();
        return count($result);
    }

    /**
     * This function is used to set the state of favourite for event
     * @param number $userId : This is id of current user
     * @return boolean $result: state of like
     */
    function setFavouriteEvent($user_id, $event_id)
    {
        $this->db->select("no");
        $this->db->from('favourite_event');
        $this->db->where('user_id', $user_id);
        $this->db->where("event_id", $event_id);
        $query = $this->db->get()->result();
        if(count($query)>0)
        {
            $this->db->where('user_id', $user_id);
            $this->db->where("event_id", $event_id);
            $this->db->delete("favourite_event");
        }
        else
        {
            $info['user_id'] = $user_id;
            $info['event_id'] = $event_id;
            $this->db->insert("favourite_event", $info);
        }
        return true;
    }
}

/* End of file favourite_event_model.php */
/* Location: .application/models/favourite_event_model.php */

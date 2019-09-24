<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class alarm_user_model extends CI_Model
{
    /**
     * This function is used to get information of alarm_user
     * @param number $user_id: this is id of user who want to see alarm
     * @return array $result : This is information of alarm_user found
     */
    function getAlarm($user_id)
    {
        $this->db->select("alarm_user.*, user.name");
        $this->db->from('alarm_user');
        $this->db->join("user", "user.no = alarm_user.alarm_org_id", "left");
        $this->db->where("user_id", $user_id);
        $this->db->order_by("alarm_user.submit_time", "DESC");
        $query = $this->db->get();

        $state['is_read'] = 1;
        $this->db->where("user_id", $user_id);
        $this->db->update("alarm_user", $state);
        return $query->result();
    }

    /**
     * This function is used to get count of new alarms
     * @param number $user_id: this is id of user who want to see alarm
     * @return array $result : This is information of alarm_user found
     */
    function getNewAlarm($user_id)
    {
        $this->db->select("count(no) as amount");
        $this->db->from('alarm_user');
        $this->db->where("user_id", $user_id);
        $this->db->where("is_read", 0);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get count of new booking alarms
     * @param number $user_id: this is id of user who want to see alarm
     * @return array $result : This is information of alarm_user found
     */
    function getNewBookingAlarm($user_id)
    {
        $this->db->select("sum(booking.reg_num), event.additional");
        $this->db->from('alarm_user, event, booking');
        $this->db->where("alarm_user.user_id", $user_id);
        $this->db->where("alarm_user.event_type=event.name");
        $this->db->where("alarm_user.user_id = event.organizer_id");
        $this->db->where("event.id = booking.event_id");
        $this->db->where("event.state = booking.state");
        $this->db->where("event.state", 1);
        $this->db->where("alarm_user.is_sent", 0);
        $this->db->where("alarm_user.type", 5);
        $this->db->group_by("event.id")
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get count of new booking alarms
     * @param number $user_id: this is id of user who want to see alarm
     * @return array $result : This is information of alarm_user found
     */
    function getNewBookingTime($user_id)
    {
        $this->db->select("no, submit_time");
        $this->db->from('alarm_user');
        $this->db->where("user_id", $user_id);
        $this->db->where("is_sent", 0);
        $this->db->where("type", 3);
        $query = $this->db->get();
        $alarms = $query->result();
        foreach($alarms as $alarm){
            $info['is_sent'] = 1;
            $this->db->where("no", $alarm->no);
            $this->db->update("alarm_user", $info);
        }
        return $query->result();
    }
    /**
     * This function is used to update the state of alarm to be read
     * @param number $user_id : This is index of alarm_user
     * @return boolean $result : updating state
     */
    function updateState($user_id)
    {
        $info['is_read'] = 1;
        $this->db->where("user_id", $user_id);
        $this->db->update("alarm_user", $info);
        $query = $this->db->affected_rows();
        return (count($query)>0)?true:false;
    }

    /**
    *This function is used to delete alarm_user by id
    *@param number id : id to delete
    *@return boolean $result: state of delete
    **/
    function deleteAlarm($id)
    {
        $this->db->where("no", $id);
        $this->db->delete("alarm_user");
        return true;
    }

    /**
    *This function is used to add new alarm_user
    *@param array info : all data to insert
    *@return boolean $result: state of insert
    **/
    function addAlarm($info)
    {
        $this->db->insert("alarm_user", $info);
        return true;
    }
}

/* End of file alarm_user_model.php */
/* Location: .application/models/alarm_user_model.php */

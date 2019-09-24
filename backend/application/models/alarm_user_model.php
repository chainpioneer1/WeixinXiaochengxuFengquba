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
        if($user_id =='0') return array();
        $this->db->select("alarm_user.*, user.name, user.nickname");
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
        if($user_id=='0') return array();
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
        $query = $this->db->query("select booking.reg_num as amount,user.role, event.additional, event.end_time 
            from alarm_user, event, booking, user
            where alarm_user.event_id = event.id and alarm_user.user_id = booking.user_id and alarm_user.type=5 and alarm_user.is_sent=0 and event.state=1 and event.organizer_id = user.no and
            event.id=booking.event_id and event.state=booking.state and alarm_user.user_id=".$user_id." 
            ORDER BY booking.id DESC
            LIMIT 1");
        $result = $query->result();
        if(count($result)>0){
            if($result[0]->amount!=null){
                $this->db->query("update alarm_user set is_sent=1 where user_id=".$user_id);
            }
        }
        return $result;
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

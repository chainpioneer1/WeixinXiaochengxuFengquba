<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class alarm_model extends CI_Model
{
    /**
     * This function is used to get information of alarm
     * @param number $page : This is pge index
     * @param number $segment : This is segment of url
     * @return array $result : This is information of alarm found
     */
    function getAlarm($page, $segment)
    {
        $this->db->select("alarm.*, user.name");
        $this->db->from('alarm');
        $this->db->join("user", "user.no = alarm.user_id");
        $this->db->limit($page, $segment);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to update the state of alarm
     * @param number $id : This is index of alarm
     * @return boolean $result : updating state
     */
    function updateState($id)
    {
        $info['state'] = 1;
        $this->db->where("no", $id);
        $this->db->update("alarm", $info);
        $query = $this->db->affected_rows();
        return (count($query)>0)?true:false;
    }

    /**
     * This function is used to get count of alarm
     * @return number $count : This is information of alarm found
     */
    function getAlarmCount()
    {
        $this->db->select("*");
        $this->db->from('alarm');
        $query = $this->db->get();
        return count($query->result());
    }

    /**
    *This function is used to delete alarm by id
    *@param number id : id to delete
    *@return boolean $result: state of delete
    **/
    function deletealarm($id)
    {
        $this->db->where("id", $id);
        $this->db->delete("alarm");
        return true;
    }

    /**
    *This function is used to add new alarm
    *@param array info : all data to insert
    *@return boolean $result: state of insert
    **/
    function addalarm($info)
    {
        $this->db->insert("alarm", $info);
        return true;
    }
}

/* End of file alarm_model.php */
/* Location: .application/models/alarm_model.php */

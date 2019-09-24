<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class alarm_admin_model extends CI_Model
{
    /**
     * This function is used to get information of alarm_admin
     * @param number $page : This is pge index
     * @param number $segment : This is segment of url
     * @return array $result : This is information of alarm_admin found
     */
    function getAlarm($page, $segment)
    {
        $this->db->select("alarm_admin.*, user.nickname, goods.name as good_name");
        $this->db->from('alarm_admin');
        $this->db->join("user", "user.no = alarm_admin.user_id", "left");
        $this->db->join("goods", "goods.id = alarm_admin.good_id", "left");
        $this->db->limit($page, $segment);
        $this->db->order_by("alarm_admin.submit_time", "DESC");
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to update the state of alarm_admin
     * @param number $id : This is index of alarm_admin
     * @return boolean $result : updating state
     */
    function updateState($id)
    {
        $info['is_read'] = 1;
        $this->db->where("no", $id);
        $this->db->update("alarm_admin", $info);
        $query = $this->db->affected_rows();
        return (count($query)>0)?true:false;
    }

/**
     * This function is used to get count of alarm_admin
     * @return number $count : This is information of alarm_admin found
     */
    function getAlarmCount()
    {
        $this->db->select("*");
        $this->db->from('alarm_admin');
        $query = $this->db->get();
        return count($query->result());
    }

    /**
     * This function is used to get count of alarm_admin
     * @return number $count : This is information of alarm_admin found
     */
    function getNewAlarmCount()
    {
        $this->db->select("*");
        $this->db->from('alarm_admin');
        $this->db->where("is_read", 0);
        $query = $this->db->get();
        return count($query->result());
    }

    /**
    *This function is used to delete alarm_admin by id
    *@param number id : id to delete
    *@return boolean $result: state of delete
    **/
    function deleteAlarm($id)
    {
        $this->db->where_in("no", $id);
        $this->db->delete("alarm_admin");
        return true;
    }

    /**
    *This function is used to add new alarm_admin
    *@param array info : all data to insert
    *@return boolean $result: state of insert
    **/
    function addAlarm($info)
    {
        $this->db->insert("alarm_admin", $info);
        return true;
    }
}

/* End of file alarm_admin_model.php */
/* Location: .application/models/alarm_admin_model.php */

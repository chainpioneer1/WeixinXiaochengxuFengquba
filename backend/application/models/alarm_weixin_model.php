<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class alarm_weixin_model extends CI_Model
{
    /**
     * This function is used to get information of alarm_admin
     * @param number $page : This is pge index
     * @param number $segment : This is segment of url
     * @return array $result : This is information of alarm_admin found
     */
    function getItems()
    {
        $this->db->select("*");
        $this->db->from('alarm_weixin');
        $this->db->where("TIME_TO_SEC(TIMEDIFF(submit_time, now()))<0");
        $this->db->where('is_read',0);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to update the state of alarm_admin
     * @param number $id : This is index of alarm_admin
     * @return boolean $result : updating state
     */
    function updateItem($id, $info)
    {
        $this->db->where("no", $id);
        $this->db->update("alarm_weixin", $info);
        $query = $this->db->affected_rows();
        return (count($query)>0)?true:false;
    }

    /**
    *This function is used to delete alarm_admin by id
    *@param number id : id to delete
    *@return boolean $result: state of delete
    **/
    function deleteItem($cond)
    {
        $this->db->where($cond);
        $this->db->delete("alarm_weixin");
        return true;
    }

    /**
    *This function is used to add new alarm_admin
    *@param array info : all data to insert
    *@return boolean $result: state of insert
    **/
    function addItem($info)
    {
        $this->db->insert("alarm_weixin", $info);
        return true;
    }
}

/* End of file alarm_admin_model.php */
/* Location: .application/models/alarm_admin_model.php */

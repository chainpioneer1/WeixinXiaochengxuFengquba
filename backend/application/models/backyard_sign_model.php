<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class backyard_sign_model extends CI_Model
{

    /**
     * This function is used to check the honey which are available from time limit
     * @return boolean $result : state of subtract
     */

    function get_where($arr)
    {
        $this->db->where($arr);
        $this->db->from('backyard_sign');
        $query = $this->db->get();

        return $query->result();
    }

    function addItem($arr)
    {
        $this->db->insert('backyard_sign', $arr);
        return $this->db->insert_id();
    }

    function removeItem($arr)
    {
        $this->db->where($arr);
        $this->db->delete('backyard_sign');
        return true;
    }

    function updateItem($arr, $cond)
    {
        $this->db->set($arr);
        $this->db->where($cond);
        $this->db->update('backyard_sign');
        return true;
    }
}

/* End of file honey_model.php */
/* Location: .application/models/honey_model.php */

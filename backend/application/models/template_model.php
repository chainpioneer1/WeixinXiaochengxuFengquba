<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class template_model extends CI_Model
{
	
    /**
     *This is function to get all information of template
     */
	function getTemplate()
    {
        $this->db->select("*");
        $this->db->from("template");
        $query = $this->db->get();
        return $query->result();
    }
    /**
     *This is function to get all information of rule
     */
    function getItem($type = '0')
    {
        $this->db->select("*");
        $this->db->from("template");
        $this->db->join("event_type", "event_type.no = template.event_type_id");
        $this->db->where("template.template_type", $type);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     *This is function to update information of rule
     */
    function updateItem($index, $type, $arr)
    {
        $this->db->where("template_type", $type);
        $this->db->where("event_type_id", $index);
        $this->db->update("template", $arr);
        return true;
    }

}

/* End of file rule_model.php */
/* Location: .application/models/rule_model.php */

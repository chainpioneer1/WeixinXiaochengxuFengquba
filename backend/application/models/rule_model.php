<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class rule_model extends CI_Model
{
    /**
    *This is function to get the cost per month
    */
    function getMemberCost()
    {
        $this->db->select("value");
        $this->db->from("rule");
        $this->db->where("no", 7);
        $query = $this->db->get();
        return $query->result();
    }

    /**
    *This is function to get all information of rule
    */
    function getRule()
    {
        $this->db->select("*");
        $this->db->from("rule");
        $query = $this->db->get();
        return $query->result();
    }

    /**
    *This is function to update information of rule
    */
    function updateRule($index, $value)
    {
        $this->db->where("no", $index);
        $this->db->update("rule", $value);
        return true;
    }

}

/* End of file rule_model.php */
/* Location: .application/models/rule_model.php */

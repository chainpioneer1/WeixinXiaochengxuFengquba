<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class bossgroup_model extends CI_Model
{

    function addNewItem($info, $no = 0)
    {
        $info->update_time = date("Y-m-d H:i:s");
        $result = $this->getItems(array('no' => $no));
        unset($info->no);
        unset($info->sell_cnt);
        unset($info->editting);
        unset($info->editable);
        if (count($result) > 0) {
            $this->db->where("no", $no);
            $this->db->update("bossgroup", $info);
            $id = $no;
        } else {
            $this->db->insert("bossgroup", $info);
            $id = $this->db->insert_id();
        }
        return $id;
    }

    function addGroupPicture($no, $subid, $img)
    {
        $item = $this->getItems(array('no' => $no));
        if (count($item) == 0) return false;
        $info = $item[0];
        $group_desc = json_decode($info->group_desc);
        $group_desc[$subid]->img = $img;
        $info->group_desc = json_encode($group_desc);
        unset($info->sell_cnt);
        $this->db->where("no", $no);
        $this->db->update("bossgroup", $info);

        return true;
    }

    function updateItems($cond, $info)
    {
        $this->db->where($cond);
        $info['update_time'] = date("Y-m-d H:i:s");
        $this->db->update("bossgroup", $info);
    }

    function getAllItems($info = ''){
        $this->db->select('*');
        $this->db->from('bossgroup');
        if ($info != '')
            $this->db->where($info);
        $query = $this->db->get();

        return $query->result();
    }
    function getItems($info = '')
    {
        $this->db->select('*');
        $this->db->from('bossgroup');
        if ($info != '')
            $this->db->where($info);
        $this->db->where('status !=',3);
        $query = $this->db->get();

        $result = $query->result();
        if (count($result) > 0) {
            $bossId = $result[0]->boss_id;
            $this->db->select("*");
            $this->db->from("room_booking");
            $this->db->where("boss_id", $bossId);
            $this->db->where("book_type", 1);
            $this->db->where("state != ", 3);
            $this->db->where("state != ", 4);
            $this->db->where("state != ", 5);
            $query = $this->db->get();
            $bossBooks = $query->result();
            foreach ($result as $item) {
                $item->sell_cnt = 0;
                foreach ($bossBooks as $book) {
                    $bookInfo = json_decode($book->book_info);
                    foreach ($bookInfo as $group) {
                        if ($group->is_used == 1) $item->sell_cnt++;
                    }
                }
            }
        }

        return $result;
    }
}

/* End of file rating_model.php */
/* Location: .application/models/rating_model.php */

<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class goods_model extends CI_Model
{
    
    function addNewgoods($goodsInfo)
    {
        $this->db->trans_start();
        $this->db->insert('goods', $goodsInfo);
        $insert_id = $this->db->insert_id();
        $this->db->trans_complete();
        return $insert_id;
    }

    /**
     * This function is used to get the goods information
     * @param array $goodId : This is goodId
     * @param number $goodsId : This is goods id
     */
    function getPictureById($goodsId)
    {
        $this->db->select("pic");
        $this->db->from("goods_pic");
        $this->db->where("goods_id", $goodsId);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get the goods information
     * @param number $goodsId : This is goods id
     */
    function getGoodsList()
    {
        $this->db->select("avatar, name, cost, id, end_time");
        $this->db->from("goods");
        $this->db->where("state", 1);
        $this->db->where("isDeleted", 0);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get the good information
     * @param number $goodsId : This is goods id
     */
    function getGoodDetail($goodId)
    {
        $this->db->select("avatar, name,pic, cost, id, end_time, amount, comment");
        $this->db->from("goods");
        $this->db->where("isDeleted", 0);
        $this->db->where("id", $goodId);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get the amount of goods
     * @param array $goodId : This is goodId
     * @param number $goodsId : This is goods id
     */
    function goodsListingCount($searchText, $searchState)
    {
        $this->db->select("*");
        $this->db->from("goods");
        if(!empty($searchText)){
            $this->db->like("name", $searchText);
        }
        if($searchState != 10){
            $this->db->like('state', $searchState);
        }
        $this->db->where("isDeleted", 0);
        $query = $this->db->get();
        return count($query->result());
    }

    /**
     * This function is used to get all of the goods information
     * @param array $goodId : This is goodId
     * @param number $goodsId : This is goods id
     */
    function goodsListing($searchText, $searchState, $page, $segment)
    {
        $this->db->select("*");
        $this->db->from("goods");
        if(isset($searchText)){
            $this->db->like("name", $searchText);
        }
        if($searchState != 10){
            $this->db->like('state', $searchState);
        }
        $this->db->where("isDeleted", 0);
        $this->db->order_by("goods.add_time", "desc");
        $this->db->limit($page, $segment);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to update the goods information
     * @param array $goodsInfo : This is goodss updated information
     * @param number $goodsId : This is goods id
     */
    function editgoods($goodsId, $goodsInfo)
    {
        $this->db->where('id', $goodsId);
        $this->db->update('goods', $goodsInfo);

        return TRUE;
    }

    function getStateById($goodId)
    {
        $this->db->select("state");
        $this->db->from("goods");
        $this->db->where("id", $goodId);
        $query = $this->db->get();
        return $query->result();
    }

    function getInfoById($id, $field)
    {
        $this->db->select($field);
        $this->db->from("goods");
        $this->db->where("id", $id);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to update the goods information
     * @param array $goodsInfo : This is goodss updated information
     * @param number $goodsId : This is goods id
     */
    function updateGoods($id, $info)
    {
        $this->db->where('id', $id);
        $this->db->update('goods', $info);

        return TRUE;
    }


    /**
     * This function is used to delete the goods information
     * @param number $goodsId : This is goods id
     * @return boolean $result : TRUE / FALSE
     */
    function deleteGood($goodId)
    {
        $this->db->query("update goods set isDeleted=1 where id='".$goodId."';");

        return true;
    }
}

/* End of file goods_model.php */
/* Location: .application/models/goods_model.php */

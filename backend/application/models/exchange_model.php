<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class exchange_model extends CI_Model
{
    /**
     * This function is used to get the exchange 
     * @param number $userId : This is id of exchange
     * @return number $count : This is row count
     */
    function getStateById($userId)
    {
        $this->db->select("date(expire_time)>=now() as state");
        $this->db->from('exchange');
        $this->db->where('user_id', $userId);
        $this->db->order_by('date(expire_time)','DESC');
        $this->db->limit(1);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get the exchange 
     * @param number $userId : This is id of exchange
     * @return number $count : This is row count
     */
    function getExchangeDetailById($exchangeId)
    {
        $this->db->select("goods.name as good_name,goods.cost, goods.pic");
        $this->db->select("accept_address.name, accept_address.phone, accept_address.detail_address, accept_address.email, accept_address.state as address_state");
        $this->db->select("exchange.*");
        $this->db->select("provinces.province, cities.city, areas.area");
        $this->db->from('provinces, cities, areas, exchange');
        $this->db->join('goods','goods.id = exchange.good_id');
        $this->db->join('accept_address','exchange.address_no = accept_address.no');
        $this->db->where('exchange.no', $exchangeId);
        $this->db->where("provinces.id = accept_address.province");
        $this->db->where("cities.id = accept_address.city");
        $this->db->where("areas.id = accept_address.area");
        $query = $this->db->get();
        return $query->result();
    }

    /*
    This function is used to end exchange automatically
    */
    function setAutoEndExchange()
    {
        $info['state'] = 2;
        $info['accept_time'] = date("Y-m-d H:i:s");
        $this->db->where("send_time <> ''");
        $this->db->where("TIME_TO_SEC(TIMEDIFF(NOW(), send_time))>126000");
        $this->db->update('exchange', $info);
    }

    function getExchangeInfo($userId)
    {
        $this->db->select("*");
        $this->db->select("date(expire_time)>=now() as state");
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get the exchange listing count
     * @param string $searchText : This is optional search text
     * @return number $count : This is row count
     */
    function exchangeListingCount($searchStatus = null , $searchText = '', $searchState)
    {
        $query = "select exchange.no, exchange.state, exchange.submit_time,
                    user.name, user.phone,
                    goods.name as good_name, goods.cost
                    from exchange, `user`, goods 
                    where exchange.user_id = user.no and exchange.good_id = goods.id";
        if($searchState != 10){
            $query = $query . " and exchange.state like '%" . $searchState ."%'";
        }
        if (!empty($searchText)) {
            if(isset($searchStatus)){
                if ($searchStatus == '0') {
                    for($index = 0; $index< strlen($searchText); $index++){
                        if($searchText[$index] == '0'){
                            $searchText = ltrim($searchText, '0');
                        }
                    }
                    $query = $query." and (exchange.no LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '1') {
                    $query = $query." and (user.name LIKE '%" . $searchText . "%')";
                } else {
                    $query = $query." and (user.phone LIKE '%" . $searchText . "%')";
                }
            }
        }
        $query=$query." group by exchange.no";
        $query=$query." order by exchange.submit_time desc";
        $result = $this->db->query($query);

        return count($result->result());
    }

    /**
     * This function is used to get the exchange listing count
     * @param string $searchText : This is optional search text
     * @return number $count : This is row count
     */
    function exchangeListing($searchStatus = null , $searchText = '', $searchState, $page, $segment)
    {
        $query = "select exchange.no, exchange.state, exchange.submit_time,
                    user.name, user.phone,
                    goods.name as good_name, goods.cost
                    from exchange, `user`, goods 
                    where exchange.user_id = user.no and exchange.good_id = goods.id";
        if($searchState != 10){
            $query = $query . " and exchange.state like '%" . $searchState ."%'";
        }
        if (!empty($searchText)) {
            if(isset($searchStatus)){
                if ($searchStatus == '0') {
                    for($index = 0; $index< strlen($searchText); $index++){
                        if($searchText[$index] == '0'){
                            $searchText = ltrim($searchText, '0');
                        }
                    }
                    $query = $query." and (exchange.no LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '1') {
                    $query = $query." and (user.name LIKE '%" . $searchText . "%')";
                } else {
                    $query = $query." and (user.phone LIKE '%" . $searchText . "%')";
                }
            }
        }
        $query=$query." group by exchange.no";
        $query=$query." order by exchange.submit_time desc";
        if($segment!=""){
            $query = $query." limit ".$segment.", ".$page;
        }
        else{
            $query = $query." limit 0, ".$page;
        }
        $result = $this->db->query($query);

        return $result->result();
    }

    /**
     * This function is used to update the exchange state
     * @param string $exchangeId : This is id of exchange
     *@param array $info: this is the information of exchange
     * @return number $count : This is row count
     */
    function updateStateById($exchangeId , $info)
    {
        $this->db->where("no", $exchangeId);
        $this->db->update("exchange", $info);
        $result = $this->db->affected_rows();
        return $result;
    }

    /**
     * This function is used to add exchange
     *@param array $info: this is the information of exchange
     * @return number $count : This is row count
     */
    function addExchange($info)
    {
        $this->db->query("update goods set amount=amount-1 where id=". $info['good_id']);
        $this->db->insert("exchange", $info);
        $result = $this->db->affected_rows();
        return $result;
    }

    /**
     * This function is used to get all information of exchange
     *@param number $userId: this is the id of current user
     * @return array $result : This is information array of exchange found
     */
    function getExchange($userId)
    {
        $this->db->select("exchange.no, exchange.state");
        $this->db->select("goods.avatar, goods.cost, goods.name");
        $this->db->from("exchange, goods");
        $this->db->where("exchange.user_id", $userId);
        $this->db->where("goods.id = exchange.good_id");
        $this->db->order_by("exchange.no", "desc");
        $result = $this->db->get()->result();
        return $result;
    }

    /**
     * This function is used to set information of exchange ends
     *@param number $no: this is the no of exchange
     * @return boolean $result : This is state of update information
     */
    function endExchange($no)
    {
        $info['accept_time'] = date("Y-m-d H:i:s");
        $info['state'] = 2;
        $this->db->where("no", $no);
        $this->db->update("exchange", $info);
        return true;
    }

    /**
     * This function is used to get detail information of exchange
     *@param array $exchangeId: this is the id of exchange
     * @return array $result : This is information of exchange
     */
    function getExchangeDetail($exchangeId, $userId)
    {
        $this->db->select("exchange.*");
        $this->db->select("goods.avatar, goods.cost, goods.name");
        $this->db->select("accept_address.name as address_name, accept_address.phone, accept_address.detail_address");
        $this->db->select("provinces.province, cities.city, areas.area");
        $this->db->from("exchange, goods, accept_address");
        $this->db->join("provinces","provinces.id = accept_address.province");
        $this->db->join("cities","cities.id = accept_address.city");
        $this->db->join("areas","areas.id = accept_address.area");
        $this->db->where("exchange.no", $exchangeId);
        $this->db->where("goods.id = exchange.good_id");
        $this->db->where("accept_address.user_id", $userId);
        $this->db->where("accept_address.no = exchange.address_no");
        $result = $this->db->get()->result();
        return $result;
    }
}

/* End of file exchange_model.php */
/* Location: .application/models/exchange_model.php */

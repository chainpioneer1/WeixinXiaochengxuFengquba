<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class user_model extends CI_Model
{
    /**
     * This function is used to get the user listing count
     * @param string $searchText : This is optional search text
     * @return number $count : This is row count
     */
    function userListingCount($searchStatus = null, $searchText = '', $searchRole, $searchState, $searchForbidden, $fromTime, $toTime)
    {
        $this->db->select('*');
        $this->db->from('user');
        if (!empty($searchText)) {
            if (isset($searchStatus)) {
                if ($searchStatus == '0') {
                    $likeCriteria = "(nickname  LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '1') {
                    $likeCriteria = "(name  LIKE '%" . $searchText . "%')";
                } else {
                    $likeCriteria = "(phone  LIKE '%" . $searchText . "%')";
                }
                $this->db->like($likeCriteria);
            }
        }
        if ($searchRole != 10) {
            $this->db->like('role', $searchRole);
        }
        if ($searchState != 10) {
            $this->db->like('state', $searchState);
        }
        if ($searchForbidden != 10) {
            $this->db->like('forbidden', $searchForbidden);
        }
        if ($fromTime != '') {
            $this->db->where("date(reg_time) >= date('" . $fromTime . "')");
        }
        if ($toTime != '') {
            $this->db->where("date(reg_time) <= date('" . $toTime . "')");
        }
        $query = $this->db->get();

        return count($query->result());
    }

    /**
     * This function is used to get the user listing count
     * @param string $searchText : This is optional search text
     * @param number $page : This is pagination offset
     * @param number $segment : This is pagination limit
     * @return array $result : This is result
     */
    function userListing($searchStatus = null, $searchText = '', $searchRole, $searchState, $searchForbidden, $fromTime, $toTime, $page, $segment)
    {
        $this->db->select('*');
        $this->db->from('user');
        if (!empty($searchText)) {
            if (isset($searchStatus)) {
                if ($searchStatus == '0') {
                    $likeCriteria = "(nickname  LIKE '%" . $searchText . "%')";
                } else if ($searchStatus == '1') {
                    $likeCriteria = "(name  LIKE '%" . $searchText . "%')";
                } else {
                    $likeCriteria = "(phone  LIKE '%" . $searchText . "%')";
                }
                $this->db->where($likeCriteria);
            }
        }
        if ($searchRole != 10) {
            $this->db->where('role', $searchRole);
        }
        if ($searchState != 10) {
            $this->db->where('state', $searchState);
        }
        if ($searchForbidden != 10) {
            $this->db->where('forbidden', $searchForbidden);
        }
        if ($fromTime != '') {
            $this->db->where("date(reg_time) >= date('" . $fromTime . "')");
        }
        if ($toTime != '') {
            $this->db->where("date(reg_time) <= date('" . $toTime . "')");
        }
        $this->db->order_by('reg_time', 'desc');
        $this->db->limit($page, $segment);
        $query = $this->db->get();

        $result = $query->result();
        return $result;
    }

    /**
     * This function is used to get user detail with userId
     * @param {number} $userId : This is user id
     * @return {mixed} $result : This is searched result
     */
    function getUserDetailById($userId)
    {
        $this->db->select("*");
        $this->db->from("user");
        $this->db->where("no", $userId);
        $query = $this->db->get();
        $result = $query->result();
        if ($result[0]->role == 1) {
            $query = $this->db->query("select user.*, boss.longitude, boss.latitude,                    
                    boss.allow_pic, boss.id_pic1, boss.id_pic2, boss.id_no, boss.site_name, provinces.province,
                    cities.city,areas.area,boss.detail_address, boss.province as province_id, 
                    boss.city as city_id, boss.area as area_id
                    from user, boss, provinces, cities, areas 
                    where boss.province=provinces.id and boss.city=cities.id 
                       and areas.id=boss.area and user.no = boss.boss_id and 
                       user.no = " . $userId . ";");
        } else if ($result[0]->role == 0) {
            $query = $this->db->query("select *
                  from user where user.no = " . $userId . ";");
        } else {
            $query = $this->db->query("select *
                  from user where user.no = " . $userId . ";");
        }
        $result = $query->result();
        return $result;
    }

    function getUserDetailById1($userId)
    {
        $this->db->select("*");
        $this->db->from("user");
        $this->db->where("no", $userId);
        $query = $this->db->get();
        $result = $query->result();
        return $result;
    }

    function getTypeListById($userId)
    {
        $this->db->select("event.type as type, count(booking.id) AS count");
        $this->db->from("booking");
        $this->db->join("event", "event.id=booking.event_id");
        $this->db->where('booking.user_id', $userId);
        $this->db->where('booking.state', '1');
        $this->db->group_by("event.type");
        $query = $this->db->get();
        $result = $query->result();
        return $result;
    }


    /**
     * This function is used to get honey waste detail by exchange
     * @param {number} $userId : This is user id
     * @return {mixed} $result : This is searched result
     */
    function getExchangeHoneyWasteById($userId)
    {
        $this->db->select("*");
        $this->db->from("user");
        $this->db->where("no", $userId);
        $query = $this->db->get();
        $result = $query->result();
        $query = $this->db->query("select goods.cost, exchange.submit_time , exchange.no
            from exchange, goods 
            where exchange.user_id=" . $userId . " and exchange.good_id=goods.id;");
        $result = $query->result();
        return $result;
    }

    /**
     * This function is used to get honey waste detail by event
     * @param {number} $userId : This is user id
     * @return {mixed} $result : This is searched result
     */
    function getEventHoneyWasteById($userId)
    {
        $this->db->select("*");
        $this->db->from("user");
        $this->db->where("no", $userId);
        $query = $this->db->get();
        $result = $query->result();
        $query = $this->db->query("select rule.value, event.reg_time, event.id as no
            from event, rule
            where event.organizer_id=" . $userId . " and event.additional=1 and rule.no=9;");
        $result = $query->result();
        return $result;
    }

    /**
     * This function used to get user information by id
     * @param number $userId : This is user id
     * @return array $result : This is user information
     */
    function getForbiddenById($id)
    {
        $this->db->select('forbidden');
        $this->db->from('user');
        $this->db->where('no', $id);
        $query = $this->db->get();

        return $query->result();
    }

    /**
     * This function used to get user's forbidden information by id
     * @param number $Id : This is user id
     * @return array $result : This is user information
     */
    function getRoleById($id)
    {
        $this->db->select('role');
        $this->db->from('user');
        $this->db->where('no', $id);
        $query = $this->db->get();

        return $query->row();
    }

    /**
     * This function is used to update the user'forbidden information
     * @param number $forbidden : This is users updated forbidden information
     * @param number $userId : This is user id
     */
    function updateForbiddenById($userId, $forbidden)
    {
        $this->db->query("update user set forbidden=" . $forbidden . " where no=" . $userId);

        return $this->db->affected_rows();
    }

    /**
     * This function is used to delete the user information
     * @param number $userId : This is user id
     * @return boolean $result : TRUE / FALSE
     */
    function deleteRole($roleId)
    {
        if ($roleId == '1') return false;
        $this->db->where('roleId', $roleId);
        $this->db->delete('role');
        return true;
    }


    /**
     * This function is used to change user state
     * @param number $userId : This is user id
     * @param number $state : This is user state
     */
    function updateStateById($userId, $state)
    {
        $this->db->where('no', $userId);
        $this->db->update('user', $state);
        return $this->db->affected_rows();
    }

    /**
     * This function is used to update the user information
     * @param array $userInfo : This is users updated information
     * @param number $userId : This is user id
     */
    function editUser($userInfo, $userId)
    {
        $this->db->where('userId', $userId);
        $this->db->update('user', $userInfo);

        return TRUE;
    }

    /**
     * This function is used to update the user information
     * @param array $userInfo : This is users updated information
     * @param number $userId : This is user id
     */
    function updateUser($userInfo, $usernickname)
    {
        $this->db->where('nickname', $usernickname);
        $this->db->update('user', $userInfo);

        return TRUE;
    }

    /**
     * This function is used to update the user information
     * @param array $userInfo : This is users updated information
     * @param number $userId : This is user id
     */
    function updateUserById($userInfo, $user_id)
    {
        $this->db->where('no', $user_id);
        $this->db->update('user', $userInfo);

        return TRUE;
    }

    /**
     * This function is used to delete the user information
     * @param number $userId : This is user id
     * @return boolean $result : TRUE / FALSE
     */
    function deleteUser($userId, $userInfo)
    {
        $this->db->where('userId', $userId);
        $this->db->update('user', $userInfo);

        return $this->db->affected_rows();
    }

    /**
     * This function is used to add unsigned new user
     * @param array $userInfo : This is user info including nickname and avatarURL
     */
    function addNewUser($userInfo)
    {
        $this->db->select('*');
        $this->db->from('user');
        $this->db->where('open_id', $userInfo['open_id']);
        $query = $this->db->get();
        $result = $query->result();
        if (count($result) > 0) {
            $this->db->where('open_id', $userInfo['open_id']);
            $this->db->update('user', $userInfo);
        } else {
            $this->db->insert("user", $userInfo);
            $result = null;
        }
        return $result;
    }

    /**
     * This function is used to get information of user
     * @param string $nickname : This is nickname of user
     * @return array $result: this is the array of information
     */
    function getState($nickname)
    {
        $this->db->select("*");
        $this->db->from("user");
        $this->db->where("nickname", $nickname);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get information of user
     * @param string $open_id : This is open_id of user
     * @return array $result: this is the array of information
     */
    function getStateByOpenId($open_id)
    {
        $this->db->select("user.*, binding.amount, binding.amount_withdraw");
        $this->db->from("user");
        $this->db->join("binding", "user.no = binding.user_id", 'left');
        $this->db->where("user.open_id", $open_id);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     * This function is used to get information of user
     * @param string $nickname : This is nickname of user
     * @return array $result: this is the array of information
     */
    function getFavouriteSite($userId)
    {
        $this->db->select("boss.site_name, boss.detail_address, boss.boss_id, boss.no as boss_no");
        $this->db->select("user.phone, user.avatar");
        $this->db->select("provinces.province, cities.city, areas.area");
        $this->db->from("favourite");
        $this->db->join("boss", "boss.no = favourite.boss_no",'left');
        $this->db->join("user", "boss.boss_id = user.no",'left');
        $this->db->join("provinces", "provinces.id = boss.province",'left');
        $this->db->join("cities", "cities.id = boss.city",'left');
        $this->db->join("areas", "areas.id = boss.area",'left');
        $this->db->where("favourite.user_id", $userId);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     *This function is user to delete site from user's favourite
     * @param number $user_id : this is id of user
     * @param number $boss_id : this is id of site
     */
    function cancelFavouriteSite($userId, $bossId, $bossNo = 0)
    {
        $this->db->select("no");
        $this->db->from("favourite");
        $this->db->where("user_id", $userId);
        if ($bossNo != 0)
            $this->db->where("boss_no", $bossNo);
        else
            $this->db->where("boss_id", $bossId);
        $result = $this->db->get()->result();
        if (count($result) > 0) {
            $this->db->where('no', $result[0]->no);
            $this->db->delete('favourite');
        } else {
            $info['user_id'] = $userId;
            $info['boss_id'] = $bossId;
            $info['boss_no'] = $bossNo;
            $this->db->insert('favourite', $info);
        }
        return true;
    }


    /**
     * This function is used to register user
     * @param string $nickname : This is nickname of user
     * @return array $result: this is the array of information
     */
    function addAllowPic($user_id, $userInfo, $boss_no)
    {
        $result = null;
        if ($boss_no > 0)
            $result = $this->db->query("select no from boss where no=" . $boss_no)->result();
        else
            $result = $this->db->query("select no from boss where boss_id=" . $user_id)->result();
        if (count($result) > 0) {
            $this->db->where("no", $result[0]->no);
            $this->db->update("boss", $userInfo);
        } else {
            $userInfo['boss_id'] = $user_id;
            $this->db->insert('boss', $userInfo);
        }
        $query = $this->db->affected_rows();
        return $query;
    }

    /**
     * This function is used to add license image of boss
     * @param string $nickname : This is nickname of user
     * @return array $result: this is the array of information
     */
    function addIDPic($user_id, $userInfo, $boss_no)
    {
        if ($boss_no > 0)
            $result = $this->db->query("select no from boss where no=" . $boss_no)->result();
        else
            $result = $this->db->query("select no from boss where boss_id=" . $user_id)->result();
        if (count($result) > 0) {
            $this->db->where("no", $result[0]->no);
            $this->db->update("boss", $userInfo);
        } else {
            $userInfo['boss_id'] = $user_id;
            $this->db->insert('boss', $userInfo);
        }
        $query = $this->db->affected_rows();
        return $query;
    }

    /**
     * This function is used to add back image of id
     * @param string $nickname : This is nickname of user
     * @return array $result: this is the array of information
     */
    function registerUser($user_id, $userInfo)
    {
        $this->db->where("no", $user_id);
        $this->db->update("user", $userInfo);
        $query = $this->db->affected_rows();
        return $query;
    }

    /**
     * This function is used to add honey
     * @param int $amount : This is amount of honey
     * @return boolean $result: this is status of adding
     */
    function addHoney($amount, $user_id)
    {
        $this->db->query("update user set honey = honey + " . (1 * $amount) . " where no = " . $user_id);
        return true;
    }

    /**
     * This function is used to add honey
     * @param int $amount : This is amount of honey
     * @return boolean $result: this is status of adding
     */
    function catchHoney($amount, $user_id, $daily_honey)
    {
        $this->db->query("update user set honey=" . (1 * $amount) . ", daily_honey='" . $daily_honey . "' where no=" . $user_id);
        return true;
    }

    /**
     * This function is used to sub honey
     * @param int $user_id : This is amount of honey
     * @param int $good_id : this is id of good which user exchange
     * @return boolean $result: this is status of adding
     */
    function subHoney($user_id, $good_id)
    {
        $amount = $this->db->query("select cost from goods where id=" . $good_id)->result();
        $result = $this->db->query("update user set honey=honey-" . (1 * $amount[0]->cost) . " where no=" . $user_id);
        return $result;
    }

    /**
     * This function is used to sub honey
     * @param int $user_id : This is amount of honey
     * @param int $good_id : this is id of good which user exchange
     * @return boolean $result: this is status of adding
     */
    function removeHoney($user_id, $honey)
    {
        $rules = $this->db->query("select * from rule ")->result();
        $userInfo = $this->db->query("select * from user where no = " . $user_id)->row();
        $result = $this->member_state_model->getMemberState($user_id);
        $honey_unit = $rules[8]->value;
        $honey_price_unit = $rules[9]->value;
        if ($result != null) {
            $honey_unit = $rules[10]->value;
            $honey_price_unit = $rules[11]->value;
        }

        $result = $this->db->query("update user set honey = honey - " . (1 * $honey / $honey_price_unit * $honey_unit) . " where no = " . $user_id);
        return $result;
    }

    /**
     * This function used to get user's forbidden information by id
     * @param number $Id : This is user id
     * @return array $result : This is user information
     */
    function getUsernameById($id)
    {
        $this->db->select('name, nickname');
        $this->db->from('user');
        $this->db->where('no', $id);
        $query = $this->db->get();

        return $query->row();
    }

    /**
     * This function is used to get basic data for member state especially
     * @param int $user_id : This is id of user
     * @param int $role : this is role of user
     * @return boolean $result: this is status of adding
     */
    function getBasicData($user_id, $role)
    {

        if ($role == 1) {
            $this->db->select("user.avatar, boss.site_name as name");
        } else if ($role == 2) {
            $this->db->select("user.avatar, user.name");
        } else {
            $this->db->select("user.avatar, user.nickname as name");
        }
        $this->db->from("user");
        if ($role == 1) {
            $this->db->join("boss", "boss.boss_id = user.no");
        }
        $this->db->where("user.no", $user_id);
        $query = $this->db->get();
        return $query->result();
    }
}

/* End of file user_model.php */
/* Location: .application/models/user_model.php */

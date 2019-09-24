<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class feedback_model extends CI_Model
{

    /**
     *This is function to get feedbacks of event
     */
    function getFeedbacks($event_id, $userId = 0)
    {

        $this->db->select("user.avatar, user.nickname, feedback.*");
        $this->db->from("feedback, user");
        $this->db->where("feedback.user_id = user.no");
        $this->db->where("feedback.event_id", $event_id);
        $this->db->where("feedback.type", '0');
        $this->db->group_by("feedback.no");
//        $this->db->order_by("feedback.submit_time", "desc");
        $query = $this->db->get();
        $response_array = array();
        foreach ($query->result() as $item) {
            $this->db->select("user.nickname, feedback.*");
            $this->db->from("feedback, user");
            $this->db->where("feedback.user_id = user.no");
            $this->db->where("feedback.type", '1');
            $this->db->where("feedback.parent_no", $item->no);
            $this->db->group_by("feedback.no");
//            $this->db->order_by("feedback.submit_time", "desc");
            $query_item = $this->db->get();
            $child_array = array();

            //get child array
            if (count($query_item->result()) > 0) {
                $child_array = $query_item->result();
            }
            foreach ($child_array as $record){
                $parent = $this->user_model->getUsernameById($record->parent_user);
                if(count($parent)>0) $parent = $parent->nickname;
                $record->parent_user_name = $parent;
            }

            $item->child_array = $child_array;
            //get favorite count
            $this->db->select("*");
            $this->db->from("favourite_feedback");
            $this->db->where("feedback_id", $item->no);
            $query_fav = $this->db->get();
            $item->fav_count = count($query_fav->result());

            //get favorite state
            $this->db->select("*");
            $this->db->from("favourite_feedback");
            $this->db->where("feedback_id", $item->no);
            $this->db->where("user_id", $userId);
            $query_fav_state = $this->db->get();
            $item->fav_state = (count($query_fav_state->result()) > 0) ? 1 : 0;

            array_push($response_array, $item);
        }

        return $response_array;

    }

    /**
     * This function is used to set the state of favourite for feedback
     * @param number $userId : This is id of current user
     * @return boolean $result: state of like
     */
    function setFavouriteFeedback($user_id, $feedback_id)
    {
        $this->db->select("*");
        $this->db->from('favourite_feedback');
        $this->db->where('user_id', $user_id);
        $this->db->where("feedback_id", $feedback_id);
        $query = $this->db->get()->result();
        if (count($query) > 0) {
            $this->db->where('user_id', $user_id);
            $this->db->where("feedback_id", $feedback_id);
            $this->db->delete("favourite_feedback");
        } else {
            $info['user_id'] = $user_id;
            $info['feedback_id'] = $feedback_id;
            $this->db->insert("favourite_feedback", $info);
        }
        return true;
    }

    /**
     * This function is used to get the amount of rating information
     * @param number $searchName : This is id of member or phone
     * @return number $count : This is information of rating found
     */
    function itemListingCount($searchStatus = null, $searchName = '')
    {
        $query = "select count(feedback.no) as total_cnt 
            from feedback
            left join user on feedback.user_id = user.no
            left join event on  feedback.event_id = event.id
            where  feedback.event_id = event.id  ";
        if (!empty($searchText)) {
            if (isset($searchStatus)) {
                if ($searchStatus == '0') {
                    $query = $query . " and (user.nickname LIKE '%" . $searchText . "%')";
                } else {
                    $query = $query . " and (event.name LIKE '%" . $searchText . "%')";
                }
            }
        }
        $result = $this->db->query($query);
        return $result->row()->total_cnt;
    }

    /**
     * This function is used to get the amount of rating information
     * @param number $searchName : This is id of member or phone
     * @return number $count : This is information of rating found
     */
    function itemListing($searchStatus = null, $searchText = '', $page, $segment)
    {
        $query = "select feedback.no, user.nickname, event.name, feedback.comment, feedback.submit_time 
            from feedback
            left join user on feedback.user_id = user.no
            left join event on  feedback.event_id = event.id
            where  feedback.event_id = event.id  ";
        if (!empty($searchText)) {
            if (isset($searchStatus)) {
                if ($searchStatus == '0') {
                    $query = $query . " and (user.nickname LIKE '%" . $searchText . "%')";
                } else {
                    $query = $query . " and (event.name LIKE '%" . $searchText . "%')";
                }
            }
        }
        $query = $query . " order by feedback.submit_time desc";
        if ($segment != "") {
            $query = $query . " limit " . $segment . ", " . $page;
        } else {
            $query = $query . " limit 0, " . $page;
        }
        $result = $this->db->query($query);
        return $result->result();
    }

    /**
     *This function is used to delete rating by id
     * @param number id : id to delete
     * @return boolean $result: state of delete
     **/
    function deleteItem($id)
    {
        $this->db->where("no", $id);
        $this->db->delete("feedback");
        return true;
    }

    /**
     *This function is used to delete rating by id
     * @param number id : id to delete
     * @return boolean $result: state of delete
     **/
    function getItems($cond)
    {
        $this->db->select("*");
        $this->db->from("feedback");
        $this->db->where($cond);
        $query = $this->db->get();
        return $query->result();
    }

    /**
     *This function is used to delete rating by id
     * @param number id : id to delete
     * @return boolean $result: state of delete
     **/
    function deleteItems($cond)
    {
        $this->db->where($cond);
        $this->db->delete("feedback");
        return true;
    }

    /**
     *This is function to add feedback to event
     */
    function addFeedback($info)
    {
        $this->db->insert('feedback', $info);
        return true;
    }

}

/* End of file feedback_model.php */
/* Location: .application/models/feedback_model.php */

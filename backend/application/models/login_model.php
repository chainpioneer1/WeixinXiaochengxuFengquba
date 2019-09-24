<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class login_model extends CI_Model
{

    /**
     * This function used to check the login credentials of the user
     * @param string $email : This is email of the user
     * @param string $password : This is encrypted password of the user
     */
    function loginMe($email, $password)
    {
        $this->db->select('BaseTbl.userId, BaseTbl.password, BaseTbl.name, BaseTbl.roleId, Roles.role');
        $this->db->from('admin as BaseTbl');
        $this->db->join('role as Roles', 'Roles.roleId = BaseTbl.roleId');
        $this->db->where('BaseTbl.name', $email);
        $this->db->where('BaseTbl.isDeleted', 0);
        $query = $this->db->get();

        $user = $query->result();

        if (!empty($user)) {
            if (md5($password) == $user[0]->password) {
                return $user;
            } else {
                return NULL;
            }
        } else {
            return NULL;
        }
    }

    function loginBoss($account, $password)
    {
        $this->db->select('BaseTbl.no, BaseTbl.password, BaseTbl.account, BaseTbl.role, boss.site_name');
        $this->db->from('user as BaseTbl');
        $this->db->join('boss', 'boss.boss_id = BaseTbl.no');
        $this->db->where('BaseTbl.account', $account);
        $this->db->where('BaseTbl.forbidden', 0);
        $this->db->where('BaseTbl.role', 1);
        $query = $this->db->get();

        $user = $query->result();

        if (!empty($user)) {
            if (md5($password) == $user[0]->password) {
                return $user;
            } else {
                return NULL;
            }
        } else {
            return NULL;
        }
    }

    /**
     * This function used to check email exists or not
     * @param {string} $email : This is users email id
     * @return {boolean} $result : TRUE/FALSE
     */
    function checkEmailExist($email)
    {
        $this->db->select('userId');
        $this->db->where('email', $email);
        $this->db->where('isDeleted', 0);
        $query = $this->db->get('user');

        if ($query->num_rows() > 0) {
            return true;
        } else {
            return false;
        }
    }


    /**
     * This function used to insert reset password data
     * @param {array} $data : This is reset password data
     * @return {boolean} $result : TRUE/FALSE
     */
    function resetPasswordUser($data)
    {
        $result = $this->db->insert('tbl_reset_password', $data);

        if ($result) {
            return TRUE;
        } else {
            return FALSE;
        }
    }

    /**
     * This function is used to get customer information by email-id for forget password email
     * @param string $email : Email id of customer
     * @return object $result : Information of customer
     */
    function getCustomerInfoByEmail($email)
    {
        $this->db->select('userId, email, name');
        $this->db->from('user');
        $this->db->where('isDeleted', 0);
        $this->db->where('email', $email);
        $query = $this->db->get();

        return $query->result();
    }

    /**
     * This function used to check correct activation deatails for forget password.
     * @param string $email : Email id of user
     * @param string $activation_id : This is activation string
     */
    function checkActivationDetails($email, $activation_id)
    {
        $this->db->select('id');
        $this->db->from('tbl_reset_password');
        $this->db->where('email', $email);
        $this->db->where('activation_id', $activation_id);
        $query = $this->db->get();
        return $query->num_rows;
    }

    // This function used to create new password by reset link
    function createPasswordUser($email, $password)
    {
        $this->db->where('email', $email);
        $this->db->where('isDeleted', 0);
        $this->db->update('user', array('password' => md5($password)));
        $this->db->delete('tbl_reset_password', array('email' => $email));
    }

    // This function used to create new password by reset link
    function changeBossPassword($info, $user_id)
    {
        $this->db->where('no', $user_id);
        $this->db->update('user', $info);
    }
}

/* End of file login_model.php */
/* Location: .application/models/login_model.php */


?>
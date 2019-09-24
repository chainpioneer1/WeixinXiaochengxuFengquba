<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Class : Login (LoginController)
 * Login class to control to authenticate user credentials and starts user's session.
 * @author : The jin hu
 * @version : 1.0
 * @since : 8 August 2017
 */
class login extends CI_Controller
{
    /**
     * This is default constructor of the class
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('login_model');
        $this->load->model('admin_model');
    }

    /**
     * Index Page for this controller.
     */
    public function index()
    {
        $this->isBossLoggedIn();
    }

    /**
     * This function used to check the user is logged in or not
     */
    function isLoggedIn()
    {
        $isLoggedIn = $this->session->userdata('isLoggedIn');
        $roleId = $this->session->userdata('role');
        if (!isset($isLoggedIn) || $isLoggedIn != TRUE) {
            $this->load->view('login');
        } else {
            $this->session->userdata('role');
            if ($roleId == '1')
                redirect('/usermanage');
            else
                redirect('/usermanage');
        }
        return $isLoggedIn;
    }

    /**
     * This function used to check the user is logged in or not
     */
    function isBossLoggedIn()
    {
        $isLoggedIn = $this->session->userdata('isBossLoggedIn');
        $roleId = $this->session->userdata('role');
        if (!isset($isLoggedIn) || $isLoggedIn != TRUE) {
            return $this->isLoggedIn();
        } else {
            if ($roleId == '1')
                redirect('/bossmanage');
            else
                redirect('/bossmanage');
        }
        return $isLoggedIn;
    }

    /**
     * This function used to logged in user
     */
    public function loginMe()
    {
        $this->load->library('form_validation');

        $this->form_validation->set_rules('account', '账号', 'required|max_length[20]|xss_clean|trim');
        $this->form_validation->set_rules('password', '密码', 'required|max_length[20]|');

        if ($this->form_validation->run() == FALSE) {
            $this->index();
        } else {
            $account = $this->input->post('account');
            $password = $this->input->post('password');
            $result = $this->login_model->loginBoss($account, $password);
            if (count($result) > 0) {
                $sessionArray = array(
                    'boss_id' => $result[0]->no,
                    'role' => $result[0]->role,
                    'site_name' => $result[0]->site_name,
                    'isBossLoggedIn' => TRUE
                );

                $this->session->set_userdata($sessionArray);
                redirect('/bossmanage');
                return;
            }
            $result = $this->login_model->loginMe($account, $password);

            if (count($result) > 0) {
                foreach ($result as $res) {
                    $permission = $this->admin_model->getRoleById($res->roleId);
                    $sessionArray = array(
                        'userId' => $res->userId,
                        'role' => $res->roleId,
                        'roleText' => $res->role,
                        'name' => $res->name,
                        'shopnumber' => $account,
                        'permission' => $permission[0]->permission,
                        'isLoggedIn' => TRUE
                    );

                    $this->session->set_userdata($sessionArray);
                    $this->session->set_userdata('search_infos', array());
                    if ($res->roleId == '1')
                        redirect('/usermanage');
                    else
                        redirect('/usermanage');
                }
            } else {
                $this->session->set_flashdata('error', '帐户或密码不匹配。');

                redirect('/Login');
            }
        }
    }

    /**
     * This function used to load forgot password view
     */
    public function forgotPassword()
    {
        $this->load->view('forgotPassword');
    }

    /**
     * This function used to generate reset password request link
     */
    function resetPasswordUser()
    {
        $status = '';

        $this->load->library('form_validation');

        $this->form_validation->set_rules('login_email', 'Email', 'trim|required|valid_email|xss_clean');

        if ($this->form_validation->run() == FALSE) {
            $this->forgotPassword();
        } else {
            $email = $this->input->post('login_email');

            if ($this->login_model->checkEmailExist($email)) {
                $encoded_email = urlencode($email);

                $this->load->helper('string');
                $data['email'] = $email;
                $data['activation_id'] = random_string('alnum', 15);
                $data['createdDtm'] = date('Y-m-d H:i:s');
                $data['agent'] = getBrowserAgent();
                $data['client_ip'] = $this->input->ip_address();

                $save = $this->login_model->resetPasswordUser($data);

                if ($save) {
                    $data1['reset_link'] = base_url() . "resetPasswordConfirmUser/" . $data['activation_id'] . "/" . $encoded_email;
                    $userInfo = $this->login_model->getCustomerInfoByEmail($email);

                    if (!empty($userInfo)) {
                        $data1["name"] = $userInfo[0]->name;
                        $data1["email"] = $userInfo[0]->email;
                        $data1["message"] = "Reset Your Password";
                    }

                    $sendStatus = resetPasswordEmail($data1);

                    if ($sendStatus) {
                        $status = "send";
                        setFlashData($status, "Reset password link sent successfully, please check mails.");
                    } else {
                        $status = "notsend";
                        setFlashData($status, "Email has been failed, try again.");
                    }
                } else {
                    $status = 'unable';
                    setFlashData($status, "It seems an error while sending your details, try again.");
                }
            } else {
                $status = 'invalid';
                setFlashData($status, "This email is not registered with us.");
            }
            redirect('/forgotPassword');
        }
    }

    // This function used to reset the password 
    function resetPasswordConfirmUser($activation_id, $email)
    {
        // Get email and activation code from URL values at index 3-4
        $email = urldecode($email);

        // Check activation id in database
        $is_correct = $this->login_model->checkActivationDetails($email, $activation_id);

        $data['email'] = $email;
        $data['activation_code'] = $activation_id;

        if ($is_correct == 1) {
            $this->load->view('newPassword', $data);
        } else {
            redirect('/loginMe');
        }
    }

    // This function used to create new password
    function createPasswordUser()
    {
        $status = '';
        $message = '';
        $email = $this->input->post("email");
        $activation_id = $this->input->post("activation_code");

        $this->load->library('form_validation');

        $this->form_validation->set_rules('password', 'Password', 'required|max_length[20]');
        $this->form_validation->set_rules('cpassword', 'Confirm Password', 'trim|required|matches[password]|max_length[20]');

        if ($this->form_validation->run() == FALSE) {
            $this->resetPasswordConfirmUser($activation_id, urlencode($email));
        } else {
            $password = $this->input->post('password');
            $cpassword = $this->input->post('cpassword');

            // Check activation id in database
            $is_correct = $this->login_model->checkActivationDetails($email, $activation_id);

            if ($is_correct == 1) {
                $this->login_model->createPasswordUser($email, $password);

                $status = 'success';
                $message = 'Password changed successfully';
            } else {
                $status = 'error';
                $message = 'Password changed failed';
            }

            setFlashData($status, $message);

            redirect("/loginMe");
        }
    }

    // This function used to create new password
    function changeBossPassword()
    {
        $ret = array(
            'data' => '操作失败',
            'status' => false
        );
        $user_id = $this->input->post("user_id");
        $account = $this->input->post("account");
        $password = $this->input->post("password");
        $cpassword = $this->input->post("cpassword");

        if (strlen($account.'') != 11) {
            $ret['data'] = '电话号码无效!';
        } else if ($password == '' || $password != $cpassword) {

            $ret['data'] = '密码无效!';
        } else {
            $info = array();
            $info['account'] = $account;
            $info['password'] = md5($password);
            $this->login_model->changeBossPassword($info, $user_id);
            $ret['data'] = '保存成功';
            $ret['status'] = true;
        }
        echo json_encode($ret);
    }
}

/* End of file login.php */
/* Location: .application/controllers/login.php */


?>
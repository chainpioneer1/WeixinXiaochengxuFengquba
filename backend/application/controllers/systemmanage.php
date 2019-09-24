<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/basecontroller.php';

/**
 * Class : User (UserController)
 * User Class to control all user related operations.
 * @author : The jin hu
 * @version : 1.0
 * @since : 8 August 2017
 */
class systemmanage extends basecontroller
{
    /**
     * This is default constructor of the class
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('admin_model');
        $this->isLoggedIn();
    }

    /**
     * This function used to load the first screen of the user
     */
    public function index()
    {
        $this->global['pageTitle'] = '系统管理';

        $this->userListing();
    }

    /**
     *This function is user to load the dashboard page for normal users
     */
    function dashboard()
    {
        $this->global['Title'] = "欢迎光临";
        $this->loadViews('dashboard', $this->global, NULL, NULL);
    }


    /**
     * This function is used to load the admin list
     */
    function userListing()
    {
        $name = '';
        $address = '';
        $status = '';
        if ($this->isAdmin() == TRUE) {
            $this->loadThis();
        } else {
            $searchText = $this->input->post('searchText');
            $searchStatus = $this->input->post('searchStatus');
            $this->load->library('pagination');

            $count = $this->admin_model->userListingCount($searchStatus, $searchText);

            $returns = $this->paginationCompress("userListing/", $count, 10);

            $data['userRecords'] = $this->admin_model
                ->userListing($searchText, $searchStatus, $returns["page"], $returns["segment"]);

            $this->global['pageTitle'] = '人员管理';
            $this->global['pageType'] = 'admin';
            $data['searchText'] = $searchText;
            $data['searchStatus'] = $searchStatus;

            $this->loadViews("systemusermanage", $this->global, $data, NULL);
        }
    }

    /**
     * This function is used to load the user list
     */
    function roleListing()
    {
        if ($this->isAdmin() == TRUE) {
            $this->loadThis();
        } else {

            $data['userRecords'] = $this->admin_model->roleListing();
            $data['permission'] = $this->admin_model->getPermission();
            $this->global['pageTitle'] = '角色管理';
            $this->global['pageType'] = 'user';

            $this->loadViews("systemrolemanage", $this->global, $data, NULL);
        }
    }

    /**
     * This function is used to load the add new form
     */
    function addNew()
    {
        if ($this->isAdmin() == TRUE) {
            $this->loadThis();
        } else {
            $data['roles'] = $this->admin_model->getUserRoles();

            $this->global['pageTitle'] = '添加人员';

            $this->loadViews("addNew", $this->global, $data, NULL);
        }
    }

    /**
     * This function is used to check whether email already exist or not
     */
    function checkEmailExists()
    {
        $userId = $this->input->post("userId");
        $email = $this->input->post("email");

        if (empty($userId)) {
            $result = $this->admin_model->checkEmailExists($email);
        } else {
            $result = $this->admin_model->checkEmailExists($email, $userId);
        }

        if (empty($result)) {
            echo("true");
        } else {
            echo("false");
        }
    }

    /**
     * This function is used to add new user to the system
     */
    function addNewUser()
    {
            $this->load->library('form_validation');

            $this->form_validation->set_rules('fname', '账号', 'trim|required|max_length[20]|xss_clean');
            $this->form_validation->set_rules('email', '姓名', 'trim|required|max_length[20]|xss_clean');
            $this->form_validation->set_rules('password', '密码', 'required|matches[cpassword]|min_length[6]|max_length[20]');
            $this->form_validation->set_rules('cpassword', '确认密码', 'required|min_length[6]|max_length[20]');
            $this->form_validation->set_rules('role', '用户角色', 'trim|required|numeric|is_natural_no_zero');
//            $this->form_validation->set_rules('mobile','Mobile Number','required|min_length[10]|xss_clean');
            $name = $this->input->post('fname');
            $email = $this->input->post('email');
            $password = $this->input->post('password');
            $cpassword = $this->input->post('cpassword');
            $roleId = $this->input->post('role');
           
            if ($this->form_validation->run() == FALSE) {
                $this->global['fname'] = $name;
                $this->global['email'] = $email;
                $this->global['password'] = $password;
                $this->global['cpassword'] = $cpassword;
                $this->global['roleId'] = $roleId;
                $this->addNew();
            } else {
                $userInfo = array('email' => $email, 'password' => md5($password), 'roleId' => $roleId, 'name' => $name,
                    'createdBy' => $this->vendorId, 'createdDtm' => date('Y-m-d H:i:s'));

                $result = $this->admin_model->addNewUser($userInfo);

                if ($result > 0) {
                    $this->session->set_flashdata('success', '添加人员成功.');
                    redirect('userListing');
                } else {
                    $this->session->set_flashdata('error', '添加人员失败. 此帐户已存在!');
                    redirect('addNew');
                }
            }
    }

    /**
     * This function is used to add new user to the system
     */
    function addRole()
    {
        if ($this->isAdmin() == TRUE) {
            $this->loadThis();
        } else {
            $roleName = $this->input->post('roleName');
            $result = $this->admin_model->findRole($roleName);
            if (count($result) > 0) {
                $this->session->set_flashdata('error', '添加角色失败.此角色已存在!');
                echo(json_encode(array('status' => FALSE)));
                return;
            }

            $result = $this->admin_model->addNewRole($roleName);
            if ($result > 0) {
                $this->session->set_flashdata('success', '添加角色成功.');
                echo(json_encode(array('status' => TRUE)));
            } else {
                $this->session->set_flashdata('error', '添加角色失败!');
                echo(json_encode(array('status' => FALSE)));
            }
        }
    }

    /**
     * This function is used to edit the user information
     */
    function updateRole()
    {
        if ($this->isAdmin() == TRUE) {
            $this->loadThis();
        } else {
            $roleId = $this->input->post('id');
            $permission = $this->input->post('permission');
            $result = $this->admin_model->updateRole($permission, $roleId);

            if ($result == true) {
                $this->session->set_flashdata('success', '修改角色成功.');
                echo(json_encode(array('status' => TRUE)));
            } else {
                $this->session->set_flashdata('error', '修改角色失败.');
                echo(json_encode(array('status' => FALSE)));
            }
        }
    }

    /**
     * This function is used load user edit information
     * @param number $userId : Optional : This is user id
     */
    function editOld($userId = NULL)
    {
        if ($this->isAdmin() == TRUE) {
            $this->loadThis();
        } else {
            if ($userId == null) {
                redirect('userListing');
            }

            $data['roles'] = $this->admin_model->getUserRoles();
            $data['userInfo'] = $this->admin_model->getUserInfo($userId);

            $this->global['pageTitle'] = '编辑人员';

            $this->loadViews("editOld", $this->global, $data, NULL);
        }
    }

    /**
     * This function is used to edit the user information
     */
    function editUser()
    {
        if ($this->isAdmin() == TRUE) {
            $this->loadThis();
        } else {
            $this->load->library('form_validation');

            $userId = $this->input->post('userId');

            $this->form_validation->set_rules('fname', '账号', 'trim|required|max_length[20]|xss_clean');
            $this->form_validation->set_rules('email', '姓名', 'trim|required|xss_clean|max_length[20]');
            $this->form_validation->set_rules('role', '用户角色', 'trim|required|numeric|is_natural_no_zero');
//            $this->form_validation->set_rules('mobile','Mobile Number','required|min_length[10]|xss_clean');

            $name = ucwords(strtolower($this->input->post('fname')));
            $name = ucwords(strtolower($this->input->post('fname')));
            $email = $this->input->post('email');
            $roleId = $this->input->post('role');
             if ($this->form_validation->run() == FALSE) {
                $this->global['fname'] = $name;
                $this->global['email'] = $email;
                $this->global['roleId'] = $roleId;
                $this->editOld($userId);
            } else {
                $userInfo = array();

                    $userInfo = array('email' => $email,  'roleId' => $roleId,
                        'name' => ucwords($name), 'updatedBy' => $this->vendorId,
                        'updatedDtm' => date('Y-m-d H:i:s'));

                $result = $this->admin_model->editUser($userInfo, $userId);

                if ($result == true) {
                    $this->session->set_flashdata('success', '修改账号成功.');
                    echo(json_encode(array('status' => TRUE)));
                } else {
                    $this->session->set_flashdata('error', '修改账号失败.');
                    echo(json_encode(array('status' => FALSE)));
                }

                redirect('userListing');
            }
        }
    }

    /**
     * This function is used to delete the user using userId
     * @return boolean $result : TRUE / FALSE
     */
    function deleteUser($id)
    {
        $userId = $id;
        $userInfo = array(
            'email' => '',
            'isDeleted' => 1,
            'roleId' => 0,
            'updatedBy' => $this->vendorId,
            'updatedDtm' => date('Y-m-d H:i:s')
        );
        $result = $this->admin_model->deleteUser($userId, $userInfo);
        redirect('systemmanage');
    }

    /**
     * This function is used to delete the user using userId
     * @return boolean $result : TRUE / FALSE
     */
    function deleteRole($id)
    {
        if ($this->isAdmin() == TRUE) {
            echo(json_encode(array('status' => 'access')));
        } else {
            $roleId = $id;
            $result = $this->admin_model->deleteRole($roleId);

            if ($result > 0) {
                echo(json_encode(array('status' => TRUE)));
            } else {
                echo(json_encode(array('status' => FALSE)));
            }
            redirect('roleListing');

        }
    }

    /**
     * This function is used to delete the user using userId
     * @return boolean $result : TRUE / FALSE
     */
    function roleInfos()
    {
        $id = $this->input->post('id');
        $result = $this->db->query("select permission from role where roleId=".$id)->result();
        echo(json_encode(array('status' => true, 'result' => $result)));
    }

    /**
     * This function is used to load the change password screen
     */
    function loadChangePass()
    {
        $this->global['pageTitle'] = '修改密码';

        $this->loadViews("changePassword", $this->global, NULL, NULL);
    }

    /**
     * This function is used to change the password of the user
     */
    function changePassword()
    {
        $this->load->library('form_validation');

        $this->form_validation->set_rules('oldPassword', '旧密码', 'required|min_length[6]|max_length[20]');
        $this->form_validation->set_rules('newPassword', '新密码', 'required|matches[cNewPassword]|min_length[6]|max_length[20]');
        $this->form_validation->set_rules('cNewPassword', '确认密码', 'required|matches[newPassword]|min_length[6]|max_length[20]');

        if ($this->form_validation->run() == FALSE) {
            $this->loadChangePass();
        } else {
            $oldPassword = $this->input->post('oldPassword');
            $newPassword = $this->input->post('newPassword');
            $cnewPassword = $this->input->post('cNewPassword');

            $this->global['oldpwd'] = $oldPassword;
            $this->global['newpwd'] = $newPassword;
            $this->global['cnewpwd'] = $cnewPassword;

            $resultPas = $this->admin_model->matchOldPassword($this->vendorId, $oldPassword);

            if (empty($resultPas)) {
                $this->session->set_flashdata('nomatch', '您的旧密码不正确.');
                redirect('loadChangePass');
            } else {
                $usersData = array('password' => md5($newPassword), 'updatedBy' => $this->vendorId,
                    'updatedDtm' => date('Y-m-d H:i:s'));

                $result = $this->admin_model->changePassword($this->vendorId, $usersData);

                if ($result > 0) {
                    $this->session->set_flashdata('success', '修改密码成功.');
                    echo(json_encode(array('status' => TRUE)));
                    redirect('logout');
                } else {
                    $this->session->set_flashdata('error', '修改密码失败.');
                    echo(json_encode(array('status' => FALSE)));
                }

                redirect('loadChangePass');
            }
        }
    }

    /**
     * This function is used to change the password of the user
     */
    function updateUserPassword()
    {
        $id = $this->input->post('id');
        $password = $this->input->post('password');

        //$resultPas = $this->admin_model->matchOldPassword($id, $password);

        $usersData = array('password' => md5($password), 'updatedBy' => $this->vendorId,
            'updatedDtm' => date('Y-m-d H:i:s'));

        $result = $this->admin_model->changePassword($id, $usersData);

        if ($result > 0) {
            $this->session->set_flashdata('success', '修改密码成功.');
            echo(json_encode(array('status' => TRUE)));
        } else {
            $this->session->set_flashdata('error', '修改密码失败.');
            echo(json_encode(array('status' => FALSE)));
        }

        //redirect('userListing');
    }

    function pageNotFound()
    {
        $this->global['pageTitle'] = '网页没发现';

        $this->loadViews("404", $this->global, NULL, NULL);
    }
}

/* End of file systemmanage.php */
/* Location: .application/controllers/systemmanage.php */


?>
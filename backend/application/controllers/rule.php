<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/basecontroller.php';


class rule extends basecontroller
{
    /**
     * This is default constructor of the class
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('rule_model');
        $this->isLoggedIn();
    }

    /**
     * This function used to load the first screen of the rule
     */
    public function index()
    {
        $this->global['pageTitle'] = '规则管理';
        $data['rule'] = $this->rule_model->getRule();
        $this->loadViews("rule", $this->global, $data, NULL);
    }

    /**
     * This function used to save rule information
     */
    public function saveRule()
    {
        for($index=1; $index<19; $index++)
        {
            $info['value'] = $this->input->post("rule".($index-1));
            $this->rule_model->updateRule($index, $info);
        }
        $this->global['pageTitle'] = '规则管理';
        $data['rule'] = $this->rule_model->getRule();
        $this->loadViews("rule", $this->global, $data, NULL);
    }


}

/* End of file rule.php */
/* Location: .application/controllers/rule.php */


?>
<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/basecontroller.php';


class template extends basecontroller
{
    /**
     * This is default constructor of the class
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('template_model');
        $this->isLoggedIn();
    }

    /**
     * This function used to load the first screen of the rule
     */
    public function index($type)
    {
        $titleStr = ['商家介绍模板', '服务介绍模板', '发布活动模板'];
        $this->global['pageTitle'] = $titleStr[$type];
        $data['templates'] = $this->template_model->getItem($type);
        $data['type'] = $type;
        $this->loadViews("template", $this->global, $data, NULL);
    }

    /**
     * This function used to save rule information
     */
    public function saveItem()
    {
        $type = $this->input->post('template_type');
        for ($index = 1; $index < 33; $index++) {
            $info['content'] = $this->input->post("template" . $type . ($index - 1));
            $this->template_model->updateItem($index, $type, $info);
        }
        $this->global['pageTitle'] = '商家管理';
        var_dump($type);
        redirect(base_url('template/' . $type));
//        $data['rule'] = $this->rule_model->getRule();
//        $this->loadViews("rule", $this->global, $data, NULL);
    }


}

/* End of file rule.php */
/* Location: .application/controllers/rule.php */


?>
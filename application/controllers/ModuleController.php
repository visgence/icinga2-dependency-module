<?php
/*
* Icinga 2 Dependency Module
*
* naming scheme explanation: In order to call functions from frontend, a capital "Action"
* must be present at the end of every function, and there can be no other capitals or underscores in the exposed function name.
* 
* Additionally, functions are automatically routed by /module-name/name-of-controller/name-of-function
* 
*
* Finally each exposed function requires a .phmtl page of the same name to be present in the /scripts/views folder in order to 
* function, unless the function is terminated with 'exit'. this also means that any additional phtml page must have a 
* corresponding 'pageAction() {}' function in the module controller in order to be displayed.
*/



namespace Icinga\Module\dependency_plugin\Controllers;
use Icinga\Web\Controller;
use Icinga\Application\Config;
use Icinga\Data\Db\DbConnection as IcingaDbConnection;
use Icinga\Web\Notification;
use Icinga\Web\Widget\Tabextension\DashboardAction;
use Icinga\Web\Navigation\Renderer\BadgeNavigationItemRenderer;
use Icinga\Data\ResourceFactory;
use Exception;


class ModuleController extends Controller{

    public function statusgridAction(){

        $this->getTabs()->add('Network', array(
            'active'    => false,
            'label'     => $this->translate('Network Map'),
            'url'       => 'dependency_plugin/module/network'
        ));

        $this->getTabs()->add('Hierarchy', array(
            'active'    => false,
            'label'     => $this->translate('Hierarchy Map'),
            'url'       => 'dependency_plugin/module/hierarchy'
        ));

        $this->getTabs()->add('Grid', array(
            'active'    => true,
            'label'     => $this->translate('Grid Map'),
            'url'       => 'dependency_plugin/module/statusGrid'
        ));

    }

    public function hierarchyAction() {

        $this->getTabs()->add('Network', array(
            'active'    => false,
            'label'     => $this->translate('Network Map'),
            'url'       => 'dependency_plugin/module/network'
        ));

        $this->getTabs()->add('Hierarchy', array(
            'active'    => true,
            'label'     => $this->translate('Hierarchy Map'),
            'url'       => 'dependency_plugin/module/hierarchy'
        ));

        $this->getTabs()->add('Grid', array(
            'active'    => false,
            'label'     => $this->translate('Grid Map'),
            'url'       => 'dependency_plugin/module/statusGrid'
        ));

    }
    
    public function networkAction() {

        $this->getTabs()->add('Network', array(
            'active'    => true,
            'label'     => $this->translate('Network Map'),
            'url'       => 'dependency_plugin/module/network'
        ));

        $this->getTabs()->add('Hierarchy', array(
            'active'    => false,
            'label'     => $this->translate('Hierarchy Map'),
            'url'       => 'dependency_plugin/module/hierarchy'
        ));

        $this->getTabs()->add('Grid', array(
            'active'    => false,
            'label'     => $this->translate('Grid Map'),
            'url'       => 'dependency_plugin/module/statusGrid'
        ));

    }

    public function kickstartAction() {

        $this->getTabs()->add('Graph Settings', array(
            'active'    => false,
            'label'     => $this->translate('Graph Settings'),
            'url'       => 'dependency_plugin/module/settings'
        ));


        $this->getTabs()->add('Module Settings', array(
            'active'    => true,
            'label'     => $this->translate('Module Settings'),
            'url'       => 'dependency_plugin/module/kickstart'
        ));


    }

    public function welcomeAction() {

        $this->getTabs()->add('Welcome', array(
            'active'    => true,
            'label'     => $this->translate('Welcome'),
            'url'       => 'dependency_plugin/module/welcome'
        ));

    }

    public function settingsAction() {

        $this->getTabs()->add('Graph Settings', array(
            'active'    => true,
            'label'     => $this->translate('Graph Settings'),
            'url'       => 'dependency_plugin/module/settings'
        ));

        $this->getTabs()->add('Module Settings', array(
            'active'    => false,
            'label'     => $this->translate('Module Settings'),
            'url'       => 'dependency_plugin/module/kickstart'
        ));

    }

    public function getresourcesAction(){
            
        $dbArr = [];

        try {
           
            $resourcesfile = fopen("/etc/icingaweb2/resources.ini", 'r'); //get icinga resources (databases)

            while($line = fgets($resourcesfile)) {

                if(strpos($line, '[') !== false){

                    // echo $line;

                    $dbname = explode('[', $line);
                    $dbname = explode(']', $dbname[1]);
                    array_push($dbArr, $dbname[0]);

                }

            }

            $resources['databases'] = $dbArr;

        } catch (Exception $e){

                header('HTTP/1.1 500 Internal Server Error');
                header('Content-Type: application/json; charset=UTF-8');
                die(json_encode(array('message' => $e->getMessage(), 'code' => '500')));
        }
        
        echo json_encode($resources); 
        fclose($resourcesfile);
        
        exit;

    }

    function getResource() {
    
    try{
           
        $resourcesfile = fopen('/etc/icingaweb2/modules/dependency_plugin/config.ini', 'r'); //get icinga resources (databases)

    }catch(Exception $e){

        if(!file_exists('/etc/icingaweb2/modules/dependency_plugin/')){//config not created, module not kickstarted
 
        header('HTTP/1.1 500 Internal Server Error');
        header('Content-Type: application/json; charset=UTF-8');

        die(json_encode(array('message' => "setup", 'code' => '500')));
 
        } else{

            header('HTTP/1.1 500 Internal Server Error');
            header('Content-Type: application/json; charset=UTF-8');
            die(json_encode(array('message' => $e->getMessage(), 'code' => '500')));
        }


    }


        $dbname = [];

        while($line = fgets($resourcesfile)) {

            if(strpos($line, 'resource') !== false){

                $dbname = explode('=', $line);
                $dbname = explode('"', $dbname[1]);

            }

        }

        fclose($resourcesfile);
        
        return $dbname[1];

    }

    public function storesettingsAction(){
        

    //  this function uses a built-in icinga web function saveIni(); which automatically saves any passed data to 
    //  /etc/icingaweb2/modules/name-of-moudle/config.ini 

        $json = $_POST["json"];

        $data = json_decode($json, true);

        // var_dump($data);

        // die;
        
        if($data != null){

            $resource = $data[0]['value'];
            $host = $data[1]['value'];
            $port = $data[2]['value'];
            $username = $data[3]['value'];
            $password = $data[4]['value'];


            try {
            $db = IcingaDbConnection::fromResourceName($resource)->getDbAdapter();

            $db->exec("TRUNCATE TABLE plugin_settings;"); //delete to only store latest settings 

            $res = $db->insert('plugin_settings', array(
                'api_user' => $username, 
                'api_password' => $password, 
                'api_endpoint' => $port,
                'api_host' => $host,
            ));

            $config = $this->config();
            $config->setSection('db', array('resource' => $resource));

            $config->saveIni();
            } catch (Exception $e) {
                header('HTTP/1.1 500 Internal Server Error');
                header('Content-Type: application/json; charset=UTF-8');

                die(json_encode(
                    array(
                    'message' => "Error Saving To Database, Make sure correct database is created and selected",
                    'code' => '500', 
                    'action'=>'setup'
                     )
                    ));

            }

        echo $res;
        }

        exit;

    }

    public function getdependencyAction() {

        try {

            $resource = $this->getResource();

            $db = IcingaDbConnection::fromResourceName($resource)->getDbAdapter();
            $query = 'SELECT * from plugin_settings';
            $vals = $db->fetchAll($query);
            if(!$vals){ //if no values
                throw new Exception('Empty Table'); //settings table empty
            }
        }
        catch(Exception $e){

                header('HTTP/1.1 500 Internal Server Error');
                header('Content-Type: application/json; charset=UTF-8');

                die(json_encode(array('message' => $e->getMessage(), 'code' => '500')));
        }

            $request_url = 'https://' . $vals[0]->api_host . ':'. $vals[0]->api_endpoint . '/v1/objects/dependencies';
            $username = $vals[0]->api_user;
            $password = $vals[0]->api_password;
            $headers = array(
                'Accept: application/json',
                'X-HTTP-Method-Override: GET'
            );

            $ch = curl_init();

            curl_setopt_array($ch, array(

                CURLOPT_URL => $request_url,
                CURLOPT_HTTPHEADER => $headers,
                CURLOPT_USERPWD => $username . ":" . $password,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
            ));

            $response = curl_exec($ch);
            $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            if($code === 401){ //echo detailed errors.
                header('HTTP/1.1 401 Unauthorized');
                header('Content-Type: application/json; charset=UTF-8');
                die(json_encode(array('message' => 'Unauthorized, Please Check Entered Credentials', 'code' => $code)));
            }else if($code != 200){
                header('HTTP/1.1 500 Internal Server Error');
                header('Content-Type: application/json; charset=UTF-8');
                die(json_encode(array('message' => curl_error($ch), 'code' => $code)));
            }

            echo $response;
            exit;

}

   public function gethostsAction(){

        try {

            $resource = $this->getResource();

            $db = IcingaDbConnection::fromResourceName($resource)->getDbAdapter();

            $query = 'SELECT * from plugin_settings';
            $vals = $db->fetchAll($query);

            if(!$vals){
                throw new Exception('Empty Table');
            
            }
        }
        catch(Exception $e){

                header('HTTP/1.1 500 Internal Server Error');
                header('Content-Type: application/json; charset=UTF-8');
                die(json_encode(array('message' => $e->getMessage(), 'code' => "500")));
        }

            $request_url = 'https://' . $vals[0]->api_host . ':'. $vals[0]->api_endpoint . '/v1/objects/hosts';
            $username = $vals[0]->api_user;
            $password = $vals[0]->api_password;
            $headers = array(
                'Accept: application/json',
                'X-HTTP-Method-Override: GET'
            );

            $ch = curl_init();

            curl_setopt_array($ch, array(

                CURLOPT_URL => $request_url,
                CURLOPT_HTTPHEADER => $headers,
                CURLOPT_USERPWD => $username . ":" . $password,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
            ));

            $response = curl_exec($ch);

            $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            if($code === 401){
                header('HTTP/1.1 401 Unauthorized');
                header('Content-Type: application/json; charset=UTF-8');
                die(json_encode(array('message' => 'Unauthorized, Please Check Entered Credentials', 'code' => $code)));
            }else if($code != 200){
                header('HTTP/1.1 500 Internal Server Error');
                header('Content-Type: application/json; charset=UTF-8');
                die(json_encode(array('message' => curl_error($ch), 'code' => $code)));
                // echo json_encode($code );
                die;
            } 
            echo $response;
            exit;

}

    public function storenodepositionsAction(){
        

        $resource = $this->getResource();

        $db = IcingaDbConnection::fromResourceName($resource)->getDbAdapter();
         
        $json = $_POST["json"];

        $data = json_decode($json, true);

        if($data == 'RESET'){
            $db->exec("TRUNCATE TABLE node_positions;");
        }

        else if($data != null){

           $result = $db->exec("TRUNCATE TABLE node_positions;");

            foreach($data as $item){

                $name = $item['id'];
                $node_x = $item['x'];
                $node_y = $item['y'];

                echo(gettype($item['y']));

                $res = $db->insert('node_positions', array(
                    'node_name'=> $name, 'node_x' => $node_x, 'node_y' => $node_y
                ));


                if(!$res){
                echo "An error occured while attempting to store nodes.\n";
                exit;
                }
            }


        }

        exit;
    }

    public function getnodesAction(){

        try {

            $resource = $this->getResource();

            $db = IcingaDbConnection::fromResourceName($resource)->getDbAdapter();

            $query = 'SELECT * from node_positions';
            $vals = $db->fetchAll($query);

            if(!$vals){
                    throw new Exception('Empty Table');
            }

        } catch(Exception $e){

            if($e-> getMessage() == 'Empty Table'){

                $json = json_encode('EMPTY!');

                echo $json;

                exit;

            } else {
                header('HTTP/1.1 500 Internal Server Error');
                header('Content-Type: application/json; charset=UTF-8');
                die(json_encode(array('message' => $e->getMessage(), 'code' => '500')));
            }
        }

            $json = json_encode($vals);

            echo $json;

            exit;
    }

    public function storegraphsettingsAction(){
    // For some reason in this function, icingas database manager 'IcingaDbConnection' will store and retrieve data 
    // based on whether the database is postgres or mysql, for example booleans for true and false are retrieved as
    // '1' and '' (empty string), due to reading the data using a php method to convert to strings on retrieval at 
    // some point, and integers are retrieved as strings for MySql, and actual ints for Postgres.

    //to get around this, every thing is cast as an integer to avoid going through php's toString function

        $json = $_POST["json"];

        $resource = $this->getResource();

        $data = json_decode($json, true);
        
        if($data != null){


            $db = IcingaDbConnection::fromResourceName($resource)->getDbAdapter();

            $db->exec("TRUNCATE TABLE graph_settings;");


            foreach($data as $name => $setting){

                $res = $db->insert('graph_settings', array( //due to Zend reading bools as strings, converts true->1 false->""
                    'setting_name' => $name, 
                    'setting_value' => $setting["value"],
                    'setting_type' =>  $setting["type"]
                )); 
            }
        }

        if(!$res){
            echo "An error occured while attempting to store settings.\n";
            exit;
        }

       exit;
    }

    public function getgraphsettingsAction() {

        try {

            $expectedNumberOfSettings = 9; //Number of settings expected out of database, change if setting added/removed

            $resource = $this->getResource();

            $db = IcingaDbConnection::fromResourceName($resource)->getDbAdapter();

            $query = 'SELECT * from graph_settings';

            $vals = $db->fetchAll($query);
            
            $vals = (array_values($vals));

            if(!$vals || count($vals) != $expectedNumberOfSettings){ //catch empty or incomplete settings table, provide default
                   
                   $db->exec("TRUNCATE TABLE graph_settings;");

                   $db->insert('graph_settings', array('setting_name' => 'default_dependency_template', 'setting_value' => '', 'setting_type' => 'string'));
                   $db->insert('graph_settings', array('setting_name' => 'display_up', 'setting_value' => 'true', 'setting_type' => 'bool'));
                   $db->insert('graph_settings', array('setting_name' => 'display_down', 'setting_value' => 'true', 'setting_type' => 'bool'));
                   $db->insert('graph_settings', array('setting_name' => 'display_unreachable', 'setting_value' => 'true', 'setting_type' => 'bool'));
                   $db->insert('graph_settings', array('setting_name' => 'display_only_dependencies', 'setting_value' => 'true', 'setting_type' => 'bool'));
                   $db->insert('graph_settings', array('setting_name' => 'scaling', 'setting_value' => 'true', 'setting_type' => 'bool'));
                   $db->insert('graph_settings', array('setting_name' => 'always_display_large_labels', 'setting_value' => 'true', 'setting_type' => 'bool'));
                   $db->insert('graph_settings', array('setting_name' => 'alias_only', 'setting_value' => 'true', 'setting_type' => 'bool'));
                   $db->insert('graph_settings', array('setting_name' => 'text_size', 'setting_value' => '25', 'setting_type' => 'int'));
                   $db->insert('graph_settings', array('setting_name' => 'fullscreen_mode', 'setting_type'=> 'string', 'setting_value' => 'network'));

               $vals = $db->fetchAll($query);


            }
        } catch(Exception $e){

                header('HTTP/1.1 500 Internal Server Error');
                header('Content-Type: application/json; charset=UTF-8');
                die(json_encode(array('message' => $e->getMessage(), 'code' => '500')));

            exit;
         }

         $parsedSettings;

         //parse settings


            for ($i = 0; $i < count($vals); $i++) {

                if ($vals[$i]-> setting_type == 'bool') {
                    $parsedSettings[$vals[$i]-> setting_name ] = ($vals[$i] -> setting_value === 'true');
                } else if ($vals[$i] -> setting_type == 'int') {

                    $parsedSettings[$vals[$i] -> setting_name] = ((int)($vals[$i] -> setting_value));

                } else {

                    $parsedSettings[$vals[$i] -> setting_name] = $vals[$i] -> setting_value;

                }
            }

        

            $json = json_encode($parsedSettings);

            echo $json;

            exit;
    }
    

}

?>

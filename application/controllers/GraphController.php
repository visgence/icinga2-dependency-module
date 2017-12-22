<?php

namespace Icinga\Module\dependency_plugin\Controllers;

use Icinga\Web\Controller;
use Icinga\Application\Config;
use Icinga\Data\Db\DbConnection as IcingaDbConnection;
use Icinga\Data\ResourceFactory;
use Exception;

class GraphController extends Controller{

    public function hierarchyAction() {}
    
    public function networkAction() {}

    public function kickstartAction() {}

    public function welcomeAction() {}

    public function getresourcesAction(){
            
        $dbArr = [];
           
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
        
        echo json_encode($resources); 
        fclose($resourcesfile);
        
        exit;

    }

    function getResource() {
    
    try{
           
        $resourcesfile = fopen('/etc/icingaweb2/modules/dependency_plugin/config.ini', 'r'); //get icinga resources (databases)
    }catch(Exception $e){

        if(!file_exists('/etc/icingaweb2/modules/dependency_plugin/')){
 
        header('HTTP/1.1 500 Internal Server Error');
        header('Content-Type: application/json; charset=UTF-8');

        die(json_encode(array('message' => "Setup", 'code' => '500')));
 
    }

        header('HTTP/1.1 500 Internal Server Error');
        header('Content-Type: application/json; charset=UTF-8');
        die(json_encode(array('message' => $e->getMessage(), 'code' => '500')));


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

        $json = $_POST["json"];

        $data = json_decode($json, true);
        
        if($data != null){

                $resource = $data[0]['value'];
                $port = $data[1]['value'];
                $username = $data[2]['value'];
                $password = $data[3]['value'];

                $db = IcingaDbConnection::fromResourceName($resource)->getDbAdapter();

                $db->exec("TRUNCATE TABLE plugin_settings;"); //truncate 

                $res = $db->insert('plugin_settings', array(
                  'api_user' => $username, 'api_password' => $password
                , 'api_endpoint' => $port
                ));

                $config = $this->config();
                $config->setSection('db', array('resource' => $resource));


                try {
                      $config->saveIni();
                    } catch (Exception $e) {


            echo $e->getMessage();
            exit;
        }

                if(!$res){
                echo "An error occured while attempting to store settings.\n";
                exit;
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

            $request_url = 'https://localhost:'. $vals[0]->api_endpoint . '/v1/objects/dependencies';
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

            $request_url = 'https://localhost:'. $vals[0]->api_endpoint . '/v1/objects/hosts';
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
            } 
            echo $response;
            exit;


}

    public function storenodesAction(){

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

                echo $res;
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
}

?>
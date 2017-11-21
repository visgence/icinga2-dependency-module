<?php

namespace Icinga\Module\dependency_plugin\Controllers;

use Icinga\Web\Controller;


class GraphController extends Controller{

    public function displayAction(){

    }

    public function getdependencyAction() {
                
        // TODO handle when file does not exist, echo error message
        $request_url = 'https://localhost:5665/v1/objects/dependencies';

       if(file_exists('/etc/icingaweb2/modules/dependency_plugin/config.json')){

            $apiLogin = file_get_contents('/etc/icingaweb2/modules/dependency_plugin/config.json');

            $apiLogin = json_decode($apiLogin);

            // echo $apiLogin->user, $apiLogin->password;

            $username = $apiLogin->user;
            $password = $apiLogin->password;
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

            if($response === false){
                print "Error:" . curl_error($ch) . "(" . $response . ")\n";
            }

            $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            echo $response;
            exit;

        }else{
            echo 404;
            exit;
        }
}

   public function gethostsAction(){

        $request_url = 'https://localhost:5665/v1/objects/hosts';

       
       if(file_exists('/etc/icingaweb2/modules/dependency_plugin/config.json')){


            $apiLogin = file_get_contents('/etc/icingaweb2/modules/dependency_plugin/config.json');

            $apiLogin = json_decode($apiLogin);

            // echo $apiLogin->user, $apiLogin->password;

            $username = $apiLogin->user;
            $password = $apiLogin->password;
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

            if($response === false){
                print "Error:" . curl_error($ch) . "(" . $response . ")\n";
            }

            $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            echo $response;
            exit;
    }else{
        echo 404;
        exit;
    }
}

    public function storenodesAction(){

    // require_once 'icingaweb2/library/vendor/Zend/Db/Adapter/Pdo/Pgsql.php';


    // $db = Zend_Db::factory('Pdo_Pgsql', array(
    //     'host'     => '127.0.0.1',
    //     'username' => 'webuser',
    //     'password' => 'xxxxxxxx',
    //     'dbname'   => 'test'
    // ));

    // $pdo = new PDO();

        $dbconn = pg_connect("host=127.0.0.1  dbname=dependencies user=dependencies password=dependencies")
    or die('Could not connect: ' . pg_last_error());

        $json = $_POST["json"];

        $data = json_decode($json, true);

        if($data != null){

            $result = pg_query($dbconn, "TRUNCATE TABLE node_positions RESTART IDENTITY;");

            if(!$result){
                echo "An error occured.\n";
                exit;
            }


            foreach($data as $item){

                $name = $item['id'];
                $node_x = $item['x'];
                $node_y = $item['y'];

                echo(gettype($item['y']));

                $arr1 = array('node_name'=> $name, 'node_x' => $node_x, 'node_y' => $node_y);

                $res = pg_insert($dbconn, "node_positions", $arr1);

                if(!$res){
                echo "An error occured.\n";
                exit;
            }

                echo $res;
            }



        }

        pg_close($dbconn);
        exit;
    }

    public function getnodesAction(){

        $dbconn = pg_connect("host=127.0.0.1  dbname=dependencies user=dependencies password=dependencies")
        or die('Could not connect: ' . pg_last_error());




        $vals = pg_fetch_all(pg_query($dbconn, "SELECT * FROM node_positions;"));
        $isEmpty = (pg_num_rows(pg_query($dbconn, "SELECT * FROM node_positions;")) == 0);

        if($isEmpty){

            echo "EMPTY!";

            exit;
        }else{

            $json = json_encode($vals);

            echo $json;

            exit;

        }
    }

   
   


}


?>


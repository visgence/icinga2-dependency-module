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

   
   


}


?>


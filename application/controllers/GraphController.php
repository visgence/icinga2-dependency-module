<?php

namespace Icinga\Module\dependency_plugin\Controllers;

use Icinga\Web\Controller;

class GraphController extends Controller{

    public function displayAction(){

    }

    public function getdependencyAction() {
                

        $request_url = 'https:/localhost:5665/v1/objects/dependencies';
        $username = 'root';
        $password = '911b092cf0530a34';
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

   }

   public function gethostsAction(){
        $request_url = 'https://localhost:5665/v1/objects/hosts';
        $username = 'root';
        $password = '911b092cf0530a34';
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
   }
   


}


?>


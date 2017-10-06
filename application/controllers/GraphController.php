<?php

namespace Icinga\Module\dependency_plugin\Controllers;

use Icinga\Web\Controller;

class GraphController extends Controller{

        public function displayAction(){

        }

        public function getdependencyAction() {
                //     $this->_helper->layout->disableLayout();
                //     $response = $this->getResponse();
                //     $response->setHeader('Content-Type', 'application/json', true);
                //     $response->sendHeaders();
                    


$request_url = 'https://f114798e5be6:5665/v1/objects/dependencies';
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
    // CURLOPT_CAINFO => "/etc/apache2/ssl/icinga2.cert",
    CURLOPT_SSL_VERIFYPEER => false,
));

$response = curl_exec($ch);

if($response === false){
    print "Error:" . curl_error($ch) . "(" . $response . ")\n";
}

$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo $response;
        }


}
?>
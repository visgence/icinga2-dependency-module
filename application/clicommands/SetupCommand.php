<?php

namespace Icinga\Module\dependency_plugin\Clicommands;

use Icinga\Cli\Command;

class SetupCommand extends Command{

    public function apiAction()
    {
        $success = false;

        //repeat entries until successful AJAX request, indicating
        //correct login information
        while($success === false){

            //get address of Icinga 2 web api
            echo "Please Enter API Address:";
            $handle = fopen('php://stdin', 'r');
            $address = fgets($handle);

            //get login information from basic input
            echo "Please Enter API Username:";
            $handle = fopen('php://stdin', 'r');
            $user = fgets($handle);

            echo "Please Enter API Password:";
            system('stty -echo');
            $password = fgets(STDIN);
            system('stty echo');
            echo("\n");

            //replace new line characters
            $user = str_replace("\n", '', $user);
            $password = str_replace("\n", '', $password);
            $address = str_replace("\n", '', $address);
            
            //make AJAX request to api to verify Login Information
            $request_url = 'https://' . $address . '/v1/objects/hosts/';

            $headers = array(
                'Accept: application/json',
                'X-HTTP-Method-Override: GET'
            );

            $ch = curl_init();

            curl_setopt_array($ch, array(

                CURLOPT_URL => $request_url,
                CURLOPT_HTTPHEADER => $headers,
                CURLOPT_USERPWD => $user . ":" . $password,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
            ));

            $response = curl_exec($ch);

            if($response === false){
                print "Error: " . curl_error($ch) . "(" . $response . ")\n";
            }

            $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            if($code === 200){
                $success = true;
                echo "Login Information Updated\n";
            }
            if($code === 401){
                echo "Error: Incorrect Login Information, Please Check Credentials\n";
            }



        }



        //create PHP object with entered login inforamtion, for later conversion to JSON
        $config = (object)['user' => $user, 'password'=>$password, 'address'=>$address];
    
        //encode to JSON    
        $config = json_encode($config);

        //directory where modules store configuration information. 
        //if dir does not exist, create it
        if(!'/etc/icingaweb2/modules/dependency_plugin'){

        mkdir('/etc/icingaweb2/modules/dependency_plugin');

        }

        //write JSON to file.
        $file = fopen('/etc/icingaweb2/modules/dependency_plugin/config.json', 'w');
        
        fwrite($file, $config);

        fclose($file);


    }

    
}
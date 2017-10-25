<?php

namespace Icinga\Module\dependency_plugin\Clicommands;

use Icinga\Cli\Command;

class SetupCommand extends Command{

    public function apiAction()
    {

        echo "Please Enter API Username:";
        $handle = fopen('php://stdin', 'r');
        $user = fgets($handle);

        echo "Please Enter API Password:";
        system('stty -echo');
        $password = fgets(STDIN);
        system('stty echo');
        echo("\n");

        echo $user, $password;

        $user = str_replace("\n", '', $user);
        $password = str_replace("\n", '', $password);

        $apiLogin = (object)['user' => $user, 'password'=>$password];
    
        
        $apiLogin = json_encode($apiLogin);

        if(!'/etc/icingaweb2/modules/dependency_plugin'){
        

        mkdir('/etc/icingaweb2/modules/dependency_plugin');

        }

       

        $file = fopen('/etc/icingaweb2/modules/dependency_plugin/config.ini', 'w');
        
        fwrite($file, $apiLogin);

        fclose($file);


    }

    
}
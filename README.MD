Visgence Inc. 2017
#Creating An Icinga Web 2 Custom Module

How to create an example Icinga Web 2 Module

## Create Module Directory
1.  Create new module directory in either "usr/share/icingaweb2-modules" or create a new directory and extend the module path in /etc/icingaweb2/config.ini file
2.  Run `mkdir -p /usr/share/icingaweb2-modules/helloworld`
3.  In the config.ini (optional):
```
[global] module_path = "/usr/local/icingaweb2/modules:/path/to/new/modules"
```

##Setup And Enable Module
1.  After creating the directory, check the detected/installed modules: `icingacli module list installed`
2.  Enable created module: `icingacli module enable helloworld`
3.  Module information is defined in a `module.info` file in the root directory of the module
    -   Create new module.info: ```touch module.info``
    -   In module.info 
    ```
    Name: Hello World
    Version: 1.0.0
    Description: Helloworld - How to Write Icinga Web 2 Modules
    ```

##Setup Icinga CLI Commands
###To define and run CLI commands, a .php file with the name of the command needs to be created in the `/module/application/clicommands/` directory
1.  Create Application Directory: `mkdir -p /helloworld/applications/clicommands/`
2.  Create PHP file: `touch SayCommand.php
```
<?php

namespace Icinga\Module\helloworld\Clicommands;

use Icinga\Cli\Command;

class SayCommand extends Command
{
    public function somethingAction()
    {
        echo "Something\n";
    }
}
?>
```
3.  To run the custom command: `icingacli <module> <command> <action>`
    -   `icingacli helloworld say something
    -   Notice that icinga only uses `Say` in `SayCommand` and `something` in `somethingAction()`


##Setup Module For Use on Icinga 2 Web
###Every action in a module controller is automatically given a route:`icingaweb2/<module>/<controller>/<action>`, file hierarchy for modules are `module/application/controllers/NewController.php`
1.  Create controller:









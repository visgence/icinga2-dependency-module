function errorHandler(error) {

    if (error['message'] === 'setup') {
        $('#notifications').append().html('<li class="error fade-out">No Configuration File Detected, Redirecting to Setup</li>');

        setTimeout(()=>{
            window.location.replace('/icingaweb2/dependency_plugin/module/kickstart')
        }, 3000)

    } else {


        switch (error['type']) {
            case 'resources':
                handleResourcesError(error);
                break;

            case 'dependencies':
                break;

            case 'hosts':
                handleHostsError(error);
                break;

            case 'positions':
                handlePositionsError(error);
                break;

            case 'settings':
                handleSettingsError(error);
                break;

            case 'templates':
                handleTemplatesError(error);
                break;

            case 'nodes':
                handleNodes(error);
                break;

            case 'graph_settings':
                handleGraphSettings(error);
                break;

            case 'configuration':
                handleConfiguration(error);
                break;
        }

    }

    function handleSettingsError(error) {
        if (error['message'] === 'setup') {
            displayError("No Configuration File Detected, Redirecting to Setup")

            setTimeout(() => {
                window.location.replace('/icingaweb2/dependency_plugin/module/kickstart')
            })

        } else {
            displayError(error['message'])
        }
    }

    function handleHostsError(error) {

        displayError(error['message'])

    }

    function handleResourcesError(error) {

        displayError(error['message'])
    }


    function handleDependenciesError(error) {

        displayError(error['message'])
    }

    function handleHostsError(error) {

        displayError(error['message'])
    }

    function handleHostsError(error) {
        displayError(error['message'])
    }

    function handleConfiguration(error) {

        displayError(error['message'])

        setTimeout(() => {
            window.location.replace('/icingaweb2/dependency_plugin/module/settings')
        }, 5000)

    }

    function displayError(message){

        $('#notifications').append().html('<li class="error fade-out">' + message + '</li>');
    }



}
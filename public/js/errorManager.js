function errorHandler(error) {

    if (error['message'] === 'setup') {
        $('#notifications').append().html('<li class="error fade-out">No Configuration File Detected, Redirecting to Setup</li>');

        setTimeout(()=>{
            window.location.replace('./kickstart')
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
                window.location.replace('./kickstart')
            })

        } else {
            displayError(error['message'])
        }
    }

    function handleHostsError(error) {


        displayError(error['message'])
    }

    function handleResourcesError(error) {

        console.log("Error Encountered While Getting Icinga Resourece: " , error);

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
            window.location.replace('./settings')
        }, 5000)

    }

    function displayError(message){

        if(message){
            $('#notifications').append().html('<li class="error fade-out">' + message + '</li>');
        } else {

            $('#notifications').append().html('<li class="error fade-out">' + 'Unexpected Error Encountered, Check Console' + '</li>');
        }
    }

}
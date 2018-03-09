function errorHandler(error) {

    // console.log(error)

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

    }

    function handleSettingsError(error) {
        // console.log(error)
        if (error['message'] === 'setup') {
            $('#notifications').append().html('<li class="error fade-out">No Configuration File Detected, Redirecting to Setup</li>');

        } else {

            $('#notifications').append().html('<li class="error fade-out">' + error['message'] + '</li>');
        }
    }

    function handleHostsError(error) {

        $('#notifications').append().html('<li class="error fade-out">' + error['message'] + '</li>');

    }

    function handleResourcesError(error) {

        $('#notifications').append().html('<li class="error fade-out">' + error['message'] + '</li>');

    }


    function handleDependenciesError(error) {

        $('#notifications').append().html('<li class="error fade-out">' + error['message'] + '</li>');

    }

    function handleHostsError(error) {

        $('#notifications').append().html('<li class="error fade-out">' + error['message'] + '</li>');

    }

    function handleHostsError(error) {

        $('#notifications').append().html('<li class="error fade-out">' + error['message'] + '</li>');

    }
}
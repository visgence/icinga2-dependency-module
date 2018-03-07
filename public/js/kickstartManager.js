function kickstartManager() {

    populateDbDropdown = (data) => {

        var resources = JSON.parse(data);

        var $dropdown = $("#resource-field");

        for (i = 0; i < resources['databases'].length; i++) {
            $dropdown.append("<option value=" + resources['databases'][i] + ">" + resources['databases'][i] + "</option>");
        }

        startFormListeners();

    }

    processError = (error) => {

        errorHandler(error); 

    }

    startFormListeners = () => {

        $('form').submit(function (data) {

            var formData = $("form.settings-form").serializeArray();

            var settingsPromise = storeSettings(formData).then(testSettings, processError)

        });

    }

    testSettings = () => {

        success = () => {

            $('#notifications').append().html('<li class="success fade-out">Settings Saved Successfully</li>');

            setTimeout(() =>{
                window.location.replace('./network')
            }, 1000)
        }

        var hostPromise = getHosts().then(success, processError)
    }

    var resourcePromise = getIcingaResourceDatabases().then(populateDbDropdown, processError)

}
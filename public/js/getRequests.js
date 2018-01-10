function getRequests(isHierarchical) {

    if (window.location.href.indexOf('Fullscreen') > -1) {
        var isFullscreen = true;
        $('.fabs').hide();
    }

    $.when(

        $.ajax({
            url: "/icingaweb2/dependency_plugin/module/getHosts", //get host states
            type: 'GET',
            success: function (hostData) {

                if ((JSON.parse(hostData).results.length) === 0) {

                    window.location.replace("./welcome");
                } else {
                    hosts = (JSON.parse(hostData));
                    console.log(hosts);
                }
            },
            error: function (data) {

                if (data.responseJSON['message'] === 'Setup') {
                    window.location.replace("./kickstart");
                    return;
                }

                alert('Cannot Load Host Information, Please Check Databases\n\nError:' + data.responseJSON['message']);
            }
        }),

        $.ajax({
            url: "/icingaweb2/dependency_plugin/module/getDependency", //get dependencies
            type: 'GET',
            success: function (dependencyData) {

                dependencies = (JSON.parse(dependencyData));

                console.log(dependencies);

            },
            error: function (data) {
                // alert('Cannot Load Dependency Information, Please Check Databases\n\nError:' + data.responseJSON['message']);
                // window.location.replace("./kickstart");
                // return;
            }

        }),

        $.ajax({
            url: "/icingaweb2/dependency_plugin/module/getNodes", //get node positions
            type: 'GET',
            success: function (response) {
                response = JSON.parse(response);
                if (response === "EMPTY!") {
                    positionData = null;
                } else {
                    positionData = response;
                }
            },
            error: function (data) {

            }

        }),

        $.ajax({
            url: "/icingaweb2/dependency_plugin/module/getgraphSettings", //get host states
            type: 'GET',
            success: function (data) {

                settings = JSON.parse(data);

                parsedSettings = {}

                for (i = 0; i < settings.length; i++) {
                    parsedSettings[settings[i]['setting_name']] = settings[i]['setting_value']
                }

            },
            error: function (data) {

                alert('Cannot Load Settings Information, Please Check Databases\n\nError:' + data.responseJSON['message']);

            }

        }),

       
        

    ).then(function () {
        formatDependencies(hosts, dependencies, isHierarchical, positionData, isFullscreen, parsedSettings);
    });
}
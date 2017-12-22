function getRequests(isHierarchical) {

    if (window.location.href.indexOf('Fullscreen') > -1) {
        var isFullscreen = true;
        $('.fabs').hide();
    }

    $.when(
        $.ajax({
            url: "/icingaweb2/dependency_plugin/graph/getHosts", //get host states
            type: 'GET',
            success: function (hostData) {

                if ((JSON.parse(hostData).results.length) === 0) {

                    window.location.replace("./welcome");
                } else {
                    hosts = (JSON.parse(hostData));
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
            url: "/icingaweb2/dependency_plugin/graph/getDependency", //get dependencies
            type: 'GET',
            success: function (dependencyData) {

                dependencies = (JSON.parse(dependencyData));

            },
            error: function (data) {
                // alert('Cannot Load Dependency Information, Please Check Databases\n\nError:' + data.responseJSON['message']);
                // window.location.replace("./kickstart");
                // return;
            }

        }),

        $.ajax({
            url: "/icingaweb2/dependency_plugin/graph/getNodes", //get node positions
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
                // alert('Cannot Load Dependency Information, Please Check Databases\n\nError:' + data.responseJSON['message']);
                // window.location.replace("./kickstart");
                // return;
            }

        }),

        $.ajax({
            url: "/icingaweb2/dependency_plugin/graph/getgraphSettings", //get host states
            type: 'GET',
            success: function (data) {

                settings = JSON.parse(data);

                if(window.location.href.indexOf('home') > -1){

                if(settings[0].default_network === '1'){
                    isHierarchical = true;
                    $('.fabs').hide();
                }else{
                    isHierarchical = false;
                }
            }

            },
            error: function (data) {

                alert('Cannot Load Settings Information, Please Check Databases\n\nError:' + data.responseJSON['message']);

            }

        })

    ).then(function () {
        formatDependencies(hosts, dependencies, isHierarchical, positionData, isFullscreen, settings);
    });
}
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
                hosts = (JSON.parse(hostData));
                console.log(hosts);
            }
        }),

        $.ajax({
            url: "/icingaweb2/dependency_plugin/graph/getDependency", //get dependencies
            type: 'GET',
            success: function (dependencyData) {
                dependencies = (JSON.parse(dependencyData));
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
            }
        })
    ).then(function () {
        if (dependencies === 404) {
            window.location.replace("./kickstart");
        } else {
            // console.log(hosts, dependencies);
            formatDependencies(hosts, dependencies, isHierarchical, positionData, isFullscreen);
        }
    });
}

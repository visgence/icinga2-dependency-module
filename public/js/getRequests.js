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
            },
            error: function (data) {
                alert('Cannot Load Host Information, Please Check Databases\n\nError:' + data.responseJSON['message']);
                window.location.replace("./kickstart");
            }
        }),

        $.ajax({
            url: "/icingaweb2/dependency_plugin/graph/getDependency", //get dependencies
            type: 'GET',
            success: function (dependencyData) {
                dependencies = (JSON.parse(dependencyData));
            },
            error: function (data) {
                alert('Cannot Load Dependency Information, Please Check Databases\n\nError:' + data.responseJSON['message']);
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
                alert('Cannot Load Dependency Information, Please Check Databases\n\nError:' + data.responseJSON['message']);
            }

        })
    ).then(function () {
            formatDependencies(hosts, dependencies, isHierarchical, positionData, isFullscreen);
    });
}
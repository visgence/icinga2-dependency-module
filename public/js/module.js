(function (Icinga) {

    var dependencies;
    var hosts;
    // Double ajax request to getHostsAction() and getDependencyAction() in module php controller file to retrieve JSONs for hosts, dependencies


    timeout();

    function timeout() {

        setTimeout(function () {

            if (window.location.href.endsWith('network')) {
                var isHierarchical = false;
                getRequests(isHierarchical);
                networkExitTimeout();
            } else if (window.location.href.endsWith('hierarchy')) {
                $('.fabs').hide();
                var isHierarchical = true;
                getRequests(isHierarchical);
                hierarchyExitTimeout();
            } else {
                timeout();
            }
        }, 50);
    }

    function hierarchyExitTimeout() {

        setTimeout(function () {
            if (!(window.location.href.endsWith('hierarchy'))) {
                timeout();
            } else {
                hierarchyExitTimeout();
            }
        }, 50);
    }

    function networkExitTimeout() {

        setTimeout(function () {

            if (!(window.location.href.endsWith('network'))) {
                timeout();
            } else {
                networkExitTimeout();
            }
        }, 50);

    }

    function getRequests(isHierarchical) {
        

        $.when(
            $.ajax({
                url: "/icingaweb2/dependency_plugin/graph/getHosts", //get host states
                type: 'GET',
                success: function (hostData) {
                    hosts = (JSON.parse(hostData));
                    // console.log(hosts);
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
                alert("API Authentication Not Found, Please run Setup API command on host machine");
            } else {
                // console.log(hosts, dependencies);
                formatDependencies(hosts, dependencies, isHierarchical, positionData);
            }
        });
    }
}(Icinga));
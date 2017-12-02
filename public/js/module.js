(function (Icinga) {

    var dependencies;
    var hosts;

    timeout();
   

    function timeout() {

        setTimeout(function () {

            if (window.location.href.indexOf('network') > -1) {
                var isFullscreen = false;
                var isHierarchical = false;
                if (window.location.href.indexOf('Fullscreen') > -1){
                    isFullscreen = true;
                    $('.fabs').hide();
                }
              
                getRequests(isHierarchical, isFullscreen);
                networkExitTimeout();
            } else if (window.location.href.indexOf('hierarchy') > -1) {
                $('.fabs').hide();
                var isHierarchical = true;
                getRequests(isHierarchical, false);
                hierarchyExitTimeout();
            } else {
                timeout();
            }
        }, 50);
    }

    function hierarchyExitTimeout() {

        setTimeout(function () {
            if (window.location.href.indexOf('hierarchy') === -1) {
                timeout();
            } else {
                hierarchyExitTimeout();
            }
        }, 50);
    }

    function networkExitTimeout() {

        setTimeout(function () {

            if ((window.location.href.indexOf('network') === -1)) {
                timeout();
            } else {
                networkExitTimeout();
            }
        }, 50);

    }

    function getRequests(isHierarchical, isFullscreen) {
        

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
                alert("API Authentication Not Found, Please run Setup API command on host machine");
            } else {
                // console.log(hosts, dependencies);
                formatDependencies(hosts, dependencies, isHierarchical, positionData, isFullscreen);
            }
        });
    }
}(Icinga));